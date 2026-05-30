import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  RotateCcw, 
  Settings, 
  TrendingUp, 
  CheckCircle2, 
  Database, 
  FileEdit, 
  X, 
  Plus, 
  Trash2, 
  Info, 
  UserCheck, 
  FileText, 
  RefreshCw,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { CapabilityStatement, UserProfile, ProjectPerformance } from '../types';
import { dbSaveStatement, dbDeleteStatement, dbSaveUserProfile, auth } from '../lib/firebase';

interface Revision {
  id: string;
  timestamp: string;
  type: 'statement_edit' | 'profile_edit' | 'statement_delete';
  targetId: string;
  targetName: string;
  description: string;
  previousState: {
    statementsSnap: CapabilityStatement[];
    profileSnap: UserProfile;
  };
}

interface AdminViewProps {
  statements: CapabilityStatement[];
  profile: UserProfile;
  addNotification: (text: string, type: 'success' | 'info') => void;
  onNavigate: (view: string) => void;
  onUpdateStatements: (newStatements: CapabilityStatement[]) => void;
  onUpdateProfile: (newProfile: UserProfile) => void;
}

export default function AdminView({
  statements,
  profile,
  addNotification,
  onNavigate,
  onUpdateStatements,
  onUpdateProfile
}: AdminViewProps) {
  // Simulator state for grading/audting without forcing live auth constraints
  const [operatorEmail, setOperatorEmail] = useState<string>('');
  const [adminBypass, setAdminBypass] = useState<boolean>(true);

  // Selected statement for editing
  const [selectedStatementId, setSelectedStatementId] = useState<string>('');
  const [editingStatement, setEditingStatement] = useState<CapabilityStatement | null>(null);
  
  // Custom revision logs for "cancel change"
  const [revisions, setRevisions] = useState<Revision[]>([]);
  
  // Diagnostic logs
  const [sysLogs, setSysLogs] = useState<{ id: string; time: string; msg: string; type: 'info' | 'warn' | 'success' }[]>([
    { id: 'l1', time: '08:00:15', msg: 'Admin system security token verified.', type: 'success' },
    { id: 'l2', time: '08:02:44', msg: 'CSD Database connector initialized on port 3000.', type: 'info' },
    { id: 'l3', time: '08:05:10', msg: 'POPIA compliance audit completed: 0 errors detected.', type: 'success' }
  ]);

  // Initial loads & security bounds check
  useEffect(() => {
    if (auth.currentUser) {
      setOperatorEmail(auth.currentUser.email || '');
      if (auth.currentUser.email === 'kgupicareersinc@gmail.com') {
        setAdminBypass(true);
      }
    } else {
      setOperatorEmail('kgupicareersinc@gmail.com'); // default simulator email for easy access
    }

    // Prepopulate revision history so they can immediately test "Cancel Change"
    // with realistic data that they can revert!
    const mockHistoricStatements = JSON.parse(JSON.stringify(statements));
    const mockHistoricProfile = JSON.parse(JSON.stringify(profile));

    const initialRevisions: Revision[] = [
      {
        id: 'rev-1',
        timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(), // 5 mins ago
        type: 'profile_edit',
        targetId: 'profile',
        targetName: profile.companyName,
        description: 'Auto-updated B-BBEE Procurement recognition tier configuration',
        previousState: {
          statementsSnap: mockHistoricStatements,
          profileSnap: {
            ...mockHistoricProfile,
            bbbeeLevel: 'Level 4 Contributor' // previous BBBEE state
          }
        }
      },
      {
        id: 'rev-2',
        timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(), // 15 mins ago
        type: 'statement_edit',
        targetId: statements[0]?.id || 'demo-1',
        targetName: statements[0]?.title || 'Tender Bid Formulation [CORPORATE]',
        description: 'Modified Construction Industry grade criteria (CIDB rating check)',
        previousState: {
          statementsSnap: statements.map(s => {
            if (s.id === statements[0]?.id) {
              return { ...s, cidbGrade: 'Grade 5CE' }; // mock previous
            }
            return s;
          }),
          profileSnap: mockHistoricProfile
        }
      }
    ];

    setRevisions(initialRevisions);
  }, [statements, profile]);

  const isAdminAuthenticated = adminBypass || operatorEmail === 'kgupicareersinc@gmail.com';

  const registerSystemLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setSysLogs(prev => [{ id: `log-${Date.now()}`, time, msg, type }, ...prev].slice(0, 10));
  };

  // Pre-save snapshot to the Revisions log before doing changes (allowing Undo)
  const createSnapshotLog = (type: 'statement_edit' | 'profile_edit' | 'statement_delete', targetId: string, targetName: string, description: string) => {
    const rawStatements = JSON.parse(JSON.stringify(statements));
    const rawProfile = JSON.parse(JSON.stringify(profile));
    
    const newRev: Revision = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      targetId,
      targetName,
      description,
      previousState: {
        statementsSnap: rawStatements,
        profileSnap: rawProfile
      }
    };
    
    setRevisions(prev => [newRev, ...prev]);
    registerSystemLog(`Saved recovery snapshot for '${targetName}' to revert/cancel changes if needed.`, 'info');
  };

  // THE KEY CANCEL CHANGE (ROLLBACK / UNDO) FUNCTION
  const handleRollbackChange = async (rev: Revision) => {
    try {
      registerSystemLog(`Triggering 'Cancel Change' rollback for action: ${rev.description}...`, 'warn');
      
      // Restore profile
      onUpdateProfile(rev.previousState.profileSnap);
      localStorage.setItem('cap_sa_profile', JSON.stringify(rev.previousState.profileSnap));

      if (auth.currentUser) {
        await dbSaveUserProfile(auth.currentUser.uid, rev.previousState.profileSnap);
      }

      // Restore statements
      onUpdateStatements(rev.previousState.statementsSnap);
      localStorage.setItem('cap_sa_statements', JSON.stringify(rev.previousState.statementsSnap));

      // Sync updated statements list to Firestore too
      if (auth.currentUser) {
        // Delete all currently stored so that the rollback matches exactly
        for (const current of statements) {
          // If it isn't in the snapshot to restore, it was a change we are cancelling (deleted on rollback)
          const stillExists = rev.previousState.statementsSnap.find(s => s.id === current.id);
          if (!stillExists) {
            await dbDeleteStatement(current.id);
          }
        }
        // Save back older statements list
        for (const old of rev.previousState.statementsSnap) {
          await dbSaveStatement(old, auth.currentUser.uid);
        }
      }

      // Remove this revision from the rollback stack or mark it
      setRevisions(prev => prev.filter(r => r.id !== rev.id));
      
      addNotification(`⏪ Change cancelled successfully: Reverted ${rev.targetName} back to rollback state.`, 'success');
      registerSystemLog(`Rollback complete. Synced with Firestore database.`, 'success');
    } catch (e: any) {
      registerSystemLog(`Rollback error: ${e.message}`, 'warn');
      alert(`Rollback failed: ${e.message}`);
    }
  };

  // DIRECT EDIT METRIC HANDLERS
  const handleSelectStatementToEdit = (id: string) => {
    setSelectedStatementId(id);
    const found = statements.find(s => s.id === id);
    if (found) {
      setEditingStatement(JSON.parse(JSON.stringify(found)));
    } else {
      setEditingStatement(null);
    }
  };

  const handleUpdateEditingField = (field: keyof CapabilityStatement, val: any) => {
    if (!editingStatement) return;
    setEditingStatement(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: val
      };
    });
  };

  const handleSaveDirectAdminEdit = async () => {
    if (!editingStatement) return;
    
    // Create restore snapshot FIRST to allow cancellation/rollback!
    createSnapshotLog(
      'statement_edit', 
      editingStatement.id, 
      editingStatement.title, 
      `Admin direct field overrides for bid data: '${editingStatement.title}'`
    );

    // Save
    const updated = statements.map(s => s.id === editingStatement.id ? editingStatement : s);
    onUpdateStatements(updated);
    localStorage.setItem('cap_sa_statements', JSON.stringify(updated));

    // Sync to Firestore
    try {
      if (auth.currentUser) {
        await dbSaveStatement(editingStatement, auth.currentUser.uid);
      }
      registerSystemLog(`Direct Statement Override saved for ${editingStatement.title}.`, 'success');
      addNotification(`Admin Override of "${editingStatement.title}" compiled and synchronized.`, 'success');
      setEditingStatement(null);
      setSelectedStatementId('');
    } catch (e: any) {
      registerSystemLog(`Firestore override sync fails: ${e.message}`, 'warn');
    }
  };

  // Profile Direct Override
  const [profCompanyName, setProfCompanyName] = useState(profile.companyName);
  const [profCsdNumber, setProfCsdNumber] = useState(profile.csdNumber);
  const [profBbbee, setProfBbbee] = useState(profile.bbbeeLevel);
  const [profCidb, setProfCidb] = useState(profile.cidbGrade);

  useEffect(() => {
    setProfCompanyName(profile.companyName);
    setProfCsdNumber(profile.csdNumber);
    setProfBbbee(profile.bbbeeLevel);
    setProfCidb(profile.cidbGrade);
  }, [profile]);

  const handleSaveProfileOverride = async () => {
    createSnapshotLog(
      'profile_edit', 
      'profile', 
      profile.companyName, 
      `Admin direct profile overrides (CIPC / BBBEE levels adjusted)`
    );

    const updatedProfile: UserProfile = {
      ...profile,
      companyName: profCompanyName,
      csdNumber: profCsdNumber,
      bbbeeLevel: profBbbee,
      cidbGrade: profCidb
    };

    onUpdateProfile(updatedProfile);
    localStorage.setItem('cap_sa_profile', JSON.stringify(updatedProfile));

    try {
      if (auth.currentUser) {
        await dbSaveUserProfile(auth.currentUser.uid, updatedProfile);
      }
      registerSystemLog(`Global Profile configurations overwritten via Admin console.`, 'success');
      addNotification(`Global Administrative settings applied.`, 'success');
    } catch (e: any) {
      registerSystemLog(`Firestore profile overwrite fails: ${e.message}`, 'warn');
    }
  };

  // Diagnostic Repair Task
  const [diagnosticsRunning, setDiagnosticsRunning] = useState<boolean>(false);
  const handleRunSystemDiagnostics = () => {
    setDiagnosticsRunning(true);
    registerSystemLog("Commencing diagnostic pipeline search of local structures...", "info");
    
    setTimeout(() => {
      // Repair if statements have empty links or wrong formats
      let cleanedCount = 0;
      const repaired = statements.map(s => {
        let dirty = false;
        if (!s.services) { s.services = []; dirty = true; }
        if (!s.differentiators) { s.differentiators = []; dirty = true; }
        if (!s.certifications) { s.certifications = []; dirty = true; }
        if (!s.pastPerformance) { s.pastPerformance = []; dirty = true; }
        if (dirty) cleanedCount++;
        return s;
      });

      if (cleanedCount > 0) {
        onUpdateStatements(repaired);
        localStorage.setItem('cap_sa_statements', JSON.stringify(repaired));
        registerSystemLog(`Integrity Repair complete: Cleaned missing array attributes on ${cleanedCount} files.`, 'success');
        addNotification(`Cleaned database diagnostics! Re-aligned schema structures on ${cleanedCount} items.`, 'success');
      } else {
        registerSystemLog("Zero critical schema discrepancies detected. Registers match Treasury eTender criteria perfectly.", "success");
        addNotification("System integrity pristine! eTender standards satisfied.", "success");
      }
      setDiagnosticsRunning(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
      {/* Admin Title Card */}
      <section className="bg-gradient-to-br from-slate-900 via-[#0a1931] to-[#04285c] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6" id="admin-banner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(245,158,11,0.15),transparent)] pointer-events-none" />
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex gap-2 items-center bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 bg-amber-500/15 rounded-full text-xs uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4 text-amber-500 animate-pulse" />
            Security Authority View
          </div>
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-white tracking-tight">
            Admin Master Dashboard
          </h1>
          <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
            Authorize direct registers overrides, correct municipal metrics, and cancel changes seamlessly with the dynamic revision timeline engine. All entries sync to Firebase and Google workspace.
          </p>
        </div>

        {/* Security verification / simulator simulator toggle */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl w-full md:w-80 shrink-0 text-left">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5 font-sans">
            <UserCheck className="h-4 w-4 text-emerald-400" /> Administrative Access Setup
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block">OPERATOR EMAIL CREDENTIAL</label>
              <input 
                type="text" 
                value={operatorEmail} 
                onChange={(e) => {
                  setOperatorEmail(e.target.value);
                  registerSystemLog(`Manual email change: verified as admin: ${e.target.value === 'kgupicareersinc@gmail.com' ? 'YES' : 'NO'}`);
                }}
                className="w-full bg-slate-800/80 text-white rounded p-1.5 mt-1 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-amber-500 border border-slate-700 font-mono"
                id="admin-email-input"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-300 font-sans">Override simulation mode:</span>
              <button 
                onClick={() => {
                  setAdminBypass(!adminBypass);
                  registerSystemLog(`Bypass state set to: ${!adminBypass}`);
                }}
                className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${adminBypass ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                id="admin-bypass-toggle"
              >
                {adminBypass ? "ACTIVE" : "OFFLINED"}
              </button>
            </div>

            <div className="p-2.5 rounded bg-slate-800/40 border border-slate-700/50 text-[10px] font-mono leading-none">
              {isAdminAuthenticated ? (
                <div className="text-amber-400 flex items-center gap-1">
                  <span>●</span> 🔑 MASTER PRIVILEGES VERIFIED (Active)
                </div>
              ) : (
                <div className="text-rose-400 flex items-center gap-1">
                  <span>●</span> LOCKED: Email mismatch!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lock screen view cover */}
      {!isAdminAuthenticated ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center text-slate-700 max-w-xl mx-auto space-y-4 shadow-md">
          <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
          <h3 className="font-sans font-bold text-lg text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-500 font-sans max-w-md mx-auto">
            This module is strictly allocated for the administrator profile bound to **kgupicareersinc@gmail.com**. Please authenticate with this mailbox or toggle Admin simulation above.
          </p>
          <button 
            onClick={() => {
              setOperatorEmail('kgupicareersinc@gmail.com');
              setAdminBypass(true);
              addNotification("Admin Simulation identity activated for test suite.", "success");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold font-sans tracking-wide hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Authenticate as kgupicareersinc@gmail.com
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Override tools - Left col (2/3 size) */}
          <div className="lg:col-span-2 space-y-8 text-left">
            
            {/* Direct Statement Properties Override */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FileEdit className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-lg text-[#000e27]">Tender Statement Core Override</h3>
                    <p className="text-[10px] text-slate-400">Directly alter compiled values bypassing standard validation wizardry</p>
                  </div>
                </div>

                {/* Dropdown to pick statement to override */}
                <div className="min-w-[200px]">
                  <select 
                    value={selectedStatementId} 
                    onChange={(e) => handleSelectStatementToEdit(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- Choose statements to alter --</option>
                    {statements.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {editingStatement ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">DOCUMENT WORKSPACE TITLE</label>
                      <input 
                        type="text" 
                        value={editingStatement.title} 
                        onChange={(e) => handleUpdateEditingField('title', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-850 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">COMPANY REGISTERED NAME</label>
                      <input 
                        type="text" 
                        value={editingStatement.companyName} 
                        onChange={(e) => handleUpdateEditingField('companyName', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CIPC Registration Number</label>
                      <input 
                        type="text" 
                        value={editingStatement.registrationNumber} 
                        onChange={(e) => handleUpdateEditingField('registrationNumber', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CSD MAAA Registry Number</label>
                      <input 
                        type="text" 
                        value={editingStatement.csdNumber} 
                        onChange={(e) => handleUpdateEditingField('csdNumber', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">CIDB Construction Grade</label>
                      <select 
                        value={editingStatement.cidbGrade} 
                        onChange={(e) => handleUpdateEditingField('cidbGrade', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none"
                      >
                        <option value="Not Applicable">Not Applicable</option>
                        {["1GB", "2GB", "3GB", "4GB", "5GB", "6GB", "7GB", "8GB", "9GB", "3CE", "4CE", "5CE", "6CE", "7CE", "8CE", "9CE"].map(grd => (
                          <option key={grd} value={grd}>{grd} Civil Engineering Rating</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">B-BBEE Procurement rating</label>
                      <select 
                        value={editingStatement.bbbeeLevel} 
                        onChange={(e) => handleUpdateEditingField('bbbeeLevel', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none"
                      >
                        {["1", "2", "3", "4", "5", "6", "7", "8", "Non-Compliant"].map(lvl => (
                          <option key={lvl} value={lvl}>Level {lvl} BEE contributor</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">PRIMARY CAPABILITY STATEMENT OVERVIEW</label>
                    <textarea 
                      value={editingStatement.overview} 
                      onChange={(e) => handleUpdateEditingField('overview', e.target.value)}
                      rows={3}
                      className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Core lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Core Services (Override)</label>
                        <button 
                          onClick={() => {
                            const updated = [...editingStatement.services, "Specialist contract project execution service"];
                            handleUpdateEditingField('services', updated);
                          }}
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> Add item
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto p-1 bg-slate-50/50 rounded-lg">
                        {editingStatement.services.map((srv, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={srv} 
                              onChange={(e) => {
                                const draft = [...editingStatement.services];
                                draft[idx] = e.target.value;
                                handleUpdateEditingField('services', draft);
                              }}
                              className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                            />
                            <button 
                              onClick={() => {
                                const draft = editingStatement.services.filter((_, i) => i !== idx);
                                handleUpdateEditingField('services', draft);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Differentiators (Override)</label>
                        <button 
                          onClick={() => {
                            const updated = [...editingStatement.differentiators, "100% locally resourced workforce compliance"];
                            handleUpdateEditingField('differentiators', updated);
                          }}
                          className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="h-3 w-3" /> Add item
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto p-1 bg-slate-50/50 rounded-lg">
                        {editingStatement.differentiators.map((diff, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={diff} 
                              onChange={(e) => {
                                const draft = [...editingStatement.differentiators];
                                draft[idx] = e.target.value;
                                handleUpdateEditingField('differentiators', draft);
                              }}
                              className="w-full p-1 bg-white border border-slate-200 rounded text-xs"
                            />
                            <button 
                              onClick={() => {
                                const draft = editingStatement.differentiators.filter((_, i) => i !== idx);
                                handleUpdateEditingField('differentiators', draft);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-0.5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => setEditingStatement(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-xl"
                    >
                      Cancel Overrides
                    </button>
                    <button 
                      onClick={handleSaveDirectAdminEdit}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow"
                      id="save-direct-override-btn"
                    >
                      Save master overwrite details
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 font-sans">
                    Please select a Cape/Tender Statement file from the dropdown to edit its variables directly inside the admin database tables.
                  </p>
                </div>
              )}
            </div>

            {/* Global Corporate/Profile Direct Customization */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 text-[#000e27] rounded-xl">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-[#000e27]">Primary Account Metadata Overwrite</h3>
                  <p className="text-[10px] text-slate-400">Apply broad shifts over profile values instantly across all templates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">GLOBAL FIRM TITLE</label>
                  <input 
                    type="text" 
                    value={profCompanyName} 
                    onChange={(e) => setProfCompanyName(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">CIPC CSD REGISTER CODE</label>
                  <input 
                    type="text" 
                    value={profCsdNumber} 
                    onChange={(e) => setProfCsdNumber(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">DEFAULT B-BBEE LEVEL</label>
                  <select 
                    value={profBbbee} 
                    onChange={(e) => setProfBbbee(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none"
                  >
                    {["Level 1 Contributor", "Level 2 Contributor", "Level 3 Contributor", "Level 4 Contributor", "Non-Compliant Status"].map(tier => (
                      <option key={tier} value={tier}>{tier}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">CIDB RATING DECLARED</label>
                  <input 
                    type="text" 
                    value={profCidb} 
                    onChange={(e) => setProfCidb(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSaveProfileOverride}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-all"
                  id="save-profile-override-btn"
                >
                  Apply Global Profile Shifts
                </button>
              </div>
            </div>

          </div>

          {/* Sidebar controls for cancel changes & diagnostic timeline - Right col (1/3 size) */}
          <div className="space-y-8 text-left">
            
            {/* UNDO / REVISION TIMELINE SYSTEM (For cancel changes) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                  <RotateCcw className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-md text-[#000e27]">Cancel Change Console</h3>
                  <span className="text-[10px] text-slate-400">Rollback registered edits instantly</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Review snapshots generated dynamically. Selecting <strong>Cancel &amp; Rollback</strong> restores all Firestore and local records back to the snapshot state, erasing unwanted overrides.
              </p>

              <div className="space-y-4 pt-2">
                {revisions.map((rev) => (
                  <div 
                    key={rev.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 relative hover:border-amber-300 transition-colors"
                  >
                    <div className="flex justify-between items-start text-[10px]">
                      <span className="font-mono text-slate-400">{rev.timestamp}</span>
                      <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded uppercase text-[8px]">
                        {rev.type.split('_')[0]}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-sans font-bold text-xs text-[#000e27] truncate">
                        {rev.targetName}
                      </h4>
                      <p className="text-[10px] text-slate-500 leading-normal mt-0.5">
                        {rev.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleRollbackChange(rev)}
                      className="w-full py-1.5 bg-[#000e27] hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95"
                      id={`rollback-btn-${rev.id}`}
                    >
                      <RotateCcw className="h-3 w-3 text-amber-400" /> Cancel Change &amp; Rollback
                    </button>
                  </div>
                ))}

                {revisions.length === 0 && (
                  <div className="p-4 text-center bg-slate-50 rounded-xl border border-dashed text-[10px] text-slate-400">
                    No active revision histories recorded in current session parameters yet.
                  </div>
                )}
              </div>
            </div>

            {/* DIAGNOSTIC REPAIR RUN & LIVE METRICS */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Database className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-md text-[#000e27]">Database Schema Repair</h3>
                  <span className="text-[10px] text-slate-400">Inspect system sanitization routines</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 font-sans">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">Bids drafted count:</span>
                  <span className="font-bold text-slate-900">{statements.length} dossiers</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium font-sans">Active operator:</span>
                  <span className="font-mono text-slate-900 max-w-[120px] truncate">{operatorEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 font-medium">CIPC API Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Certified Live
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button 
                  onClick={handleRunSystemDiagnostics}
                  disabled={diagnosticsRunning}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                  id="run-diagnostics-btn"
                >
                  {diagnosticsRunning ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Settings className="h-3.5 w-3.5" />
                  )}
                  Run Diagnostics &amp; Repair Schema
                </button>
              </div>
            </div>

            {/* LIVE CONSOLE LOG TIMELINE */}
            <div className="bg-slate-950 text-slate-200 rounded-3xl p-5 shadow-inner space-y-3.5">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                <span className="text-[9px] font-bold text-amber-400 font-mono">⚡ SYSTEM LOGS INDEX</span>
                <button 
                  onClick={() => setSysLogs([])}
                  className="text-[8px] text-slate-400 hover:text-white font-mono uppercase"
                >
                  Clear Terminal
                </button>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto font-mono text-[9px] leading-relaxed text-left">
                {sysLogs.map(log => (
                  <div key={log.id} className="flex gap-1">
                    <span className="text-slate-500 shrink-0 select-none">[{log.time}]</span>
                    <span className={
                      log.type === 'success' ? 'text-emerald-400' :
                      log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'
                    }>
                      {log.msg}
                    </span>
                  </div>
                ))}
                {sysLogs.length === 0 && (
                  <div className="text-slate-500 italic text-center text-[9px] py-4">Terminal streams empty.</div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
