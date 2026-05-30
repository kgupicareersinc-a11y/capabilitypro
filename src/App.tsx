import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import LandingView from './components/LandingView';
import GalleryView from './components/GalleryView';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import GeneratorView from './components/GeneratorView';
import AboutView from './components/AboutView';
import WorkspaceView from './components/WorkspaceView';

import { CapabilityStatement, UserProfile } from './types';
import { INITIAL_PROFILE, INITIAL_STATEMENTS } from './initialData';
import { Bell, CheckCircle, Info, X, Share2, Award, Landmark } from 'lucide-react';
import { 
  initAuth, 
  dbGetUserProfile, 
  dbSaveUserProfile, 
  dbGetStatements, 
  dbSaveStatement, 
  dbDeleteStatement,
  auth
} from './lib/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [statements, setStatements] = useState<CapabilityStatement[]>(INITIAL_STATEMENTS);
  const [editingStatement, setEditingStatement] = useState<CapabilityStatement | null>(null);

  // Notifications systems
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'success' | 'info' }[]>([
    { id: 'notif-1', text: 'Welcome to CapabilityPro SA. Ensure profile CSD MAAA credentials match registers.', type: 'info' }
  ]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [sharedStatement, setSharedStatement] = useState<CapabilityStatement | null>(null);

  // Dual Sync Authentication & State restoration
  useEffect(() => {
    const unsubscribe = initAuth(
      async (user, token) => {
        addNotification(`Protected session established for ${user.email}. Restoring files from Firestore...`, 'success');
        try {
          // Fetch profile
          const dbProfile = await dbGetUserProfile(user.uid);
          if (dbProfile) {
            setProfile(dbProfile);
          } else {
            // First time backup the local state
            await dbSaveUserProfile(user.uid, profile);
          }

          // Fetch statements
          const dbStatements = await dbGetStatements(user.uid);
          if (dbStatements && dbStatements.length > 0) {
            setStatements(dbStatements);
          } else {
            // First time backup the existing statements roster
            for (const item of statements) {
              await dbSaveStatement(item, user.uid);
            }
          }
        } catch (e) {
          console.error("Firestore loading error:", e);
        }
      },
      () => {
        // Fallback local storage operations
        const savedStatements = localStorage.getItem('cap_sa_statements');
        if (savedStatements) {
          try {
            setStatements(JSON.parse(savedStatements));
          } catch (e) {
            console.error("Failed to parse statements from local storage", e);
          }
        } else {
          setStatements(INITIAL_STATEMENTS);
        }

        const savedProfile = localStorage.getItem('cap_sa_profile');
        if (savedProfile) {
          try {
            setProfile(JSON.parse(savedProfile));
          } catch (e) {
            console.error("Failed to parse profile from local storage", e);
          }
        } else {
          setProfile(INITIAL_PROFILE);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Save to local storage triggers
  const saveStatementsState = (newStatements: CapabilityStatement[]) => {
    setStatements(newStatements);
    localStorage.setItem('cap_sa_statements', JSON.stringify(newStatements));
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('cap_sa_profile', JSON.stringify(updatedProfile));
    
    // Sync with Firestore if authenticated
    try {
      if (auth.currentUser) {
        await dbSaveUserProfile(auth.currentUser.uid, updatedProfile);
      }
    } catch (e) {
      console.error("Firestore sync fail profile:", e);
    }

    // Push positive alert
    addNotification(`Company verification profile saved for ${updatedProfile.companyName}!`, 'success');
  };

  const addNotification = (text: string, type: 'success' | 'info' = 'info') => {
    const newNotif = { id: `notif-${Date.now()}`, text, type };
    setNotifications([newNotif, ...notifications].slice(0, 5));
    
    // Auto show drop on key changes
    setShowNotificationsDropdown(true);
    setTimeout(() => setShowNotificationsDropdown(false), 5000);
  };

  const handleAddNewProject = () => {
    // We instantiate a blank capability statement populated with profile values as default!
    const blankStatement: CapabilityStatement = {
      id: '',
      title: 'New Bid Statement (CIPC compliant)',
      templateId: 'corporate',
      companyName: profile.companyName,
      registrationNumber: profile.registrationNumber,
      bbbeeLevel: profile.bbbeeLevel,
      overview: 'Our enterprise is registered with CIPC and verified on the Central Supplier Database (CSD). We represent premium South African capabilities focused on high-density works.',
      csdNumber: profile.csdNumber,
      cidbGrade: profile.cidbGrade,
      contactEmail: profile.contactEmail,
      contactPhone: profile.contactPhone,
      physicalAddress: profile.physicalAddress,
      services: [],
      differentiators: [
        `Proud Level ${profile.bbbeeLevel} B-BBEE contributor registered in South Africa`,
        `CSD Registration ID: ${profile.csdNumber || 'Pending verification'}`
      ],
      certifications: profile.cidbGrade !== "Not Applicable" ? [`CIDB Grade rating: ${profile.cidbGrade}`] : [],
      pastPerformance: [],
      lastEdited: new Date().toISOString().split('T')[0]
    };

    setEditingStatement(blankStatement);
    setCurrentView('generator');
    addNotification("Began a new capability Statement draft focused on eTender specifications.", "success");
  };

  const handleSelectTemplateFromGallery = (templateId: string) => {
    // Instantiates template with custom configuration preloaded
    const templateStatement: CapabilityStatement = {
      id: '',
      title: `Tender Formulation [${templateId.toUpperCase()}]`,
      templateId: templateId as any,
      companyName: profile.companyName,
      registrationNumber: profile.registrationNumber,
      bbbeeLevel: profile.bbbeeLevel,
      overview: 'We provide top-tier physical delivery matching municipal and commercial criteria. Backed by extensive local resource placement, we maintain absolute compliance with SANS standards.',
      csdNumber: profile.csdNumber,
      cidbGrade: profile.cidbGrade,
      contactEmail: profile.contactEmail,
      contactPhone: profile.contactPhone,
      physicalAddress: profile.physicalAddress,
      services: [
        "Specialized operations in corporate logistics and development",
        "Rigorous physical project coordination on call"
      ],
      differentiators: [
        `Proud Level ${profile.bbbeeLevel} B-BBEE contributor verified on CSD`,
        "Strict regulatory and administrative safety compliance trackers"
      ],
      certifications: [],
      pastPerformance: [],
      lastEdited: new Date().toISOString().split('T')[0]
    };

    setEditingStatement(templateStatement);
    setCurrentView('generator');
    addNotification(`Loaded preset '${templateId}' styled layout. Proceed with tailoring!`, 'success');
  };

  const handleSaveCompiledStatement = async (compiled: CapabilityStatement) => {
    let index = statements.findIndex(s => s.id === compiled.id);
    let updatedStatements = [...statements];

    if (index !== -1) {
      // Edit save
      updatedStatements[index] = compiled;
      addNotification(`Updated Statement "${compiled.title}" in library!`, 'success');
    } else {
      // Create save
      compiled.id = `stmt-${Date.now()}`;
      updatedStatements = [compiled, ...statements];
      addNotification(`Successfully published "${compiled.title}" to dashboard grid location!`, 'success');
    }

    saveStatementsState(updatedStatements);

    // Sync save with Firestore
    try {
      if (auth.currentUser) {
        await dbSaveStatement(compiled, auth.currentUser.uid);
      }
    } catch (e) {
      console.error("Firestore sync fail statement:", e);
    }

    setEditingStatement(null);
    setCurrentView('dashboard');
  };

  const handleDeleteStatement = async (id: string) => {
    const updated = statements.filter(s => s.id !== id);
    saveStatementsState(updated);
    
    // Sync delete with Firestore
    try {
      if (auth.currentUser) {
        await dbDeleteStatement(id);
      }
    } catch (e) {
      console.error("Firestore sync fail delete:", e);
    }

    addNotification("Statement deleted permanently from client registers.", "info");
  };

  return (
    <div className="min-h-screen bg-[#f6faff] flex flex-col justify-between overflow-x-hidden pb-20 md:pb-0 pt-16">
      
      {/* Dynamic Header */}
      <Header 
        currentView={currentView}
        onNavigate={(v) => {
          setEditingStatement(null);
          setCurrentView(v);
        }}
        onStartFree={handleAddNewProject}
        userEmail={profile.contactEmail}
        onShowNotifications={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
      />

      {/* Notifications system popup dropdown */}
      {showNotificationsDropdown && (
        <div className="fixed top-18 right-4 md:right-8 w-[320px] bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 p-4 animate-fade-in text-left">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-sans font-bold text-xs text-[#000e27] tracking-wider uppercase">
              Notifications Banner
            </h4>
            <button 
              onClick={() => setShowNotificationsDropdown(false)}
              className="p-1 hover:bg-slate-50 text-slate-400 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3">
            {notifications.map(notif => (
              <div key={notif.id} className="flex gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-lg">
                {notif.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-5 w-5 text-[#0453cd] shrink-0 mt-0.5" />
                )}
                <p className="text-xs font-sans text-slate-700 leading-normal">{notif.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary views router workspace */}
      <main className="flex-grow w-full">
        {currentView === 'landing' && (
          <LandingView 
            onStartFree={handleAddNewProject}
            onViewSample={() => {
              setCurrentView('gallery');
              addNotification("Showing ready-to-use eTender compliant statement structures.", "info");
            }}
            onSelectPlan={(plan) => {
              addNotification(`Trial initiated for '${plan}' successfully! Starting generator...`, 'success');
              handleAddNewProject();
            }}
          />
        )}

        {currentView === 'gallery' && (
          <GalleryView 
            onSelectTemplate={handleSelectTemplateFromGallery}
            onCustomBuilder={handleAddNewProject}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView 
            statements={statements}
            onAddNewProject={handleAddNewProject}
            onNavigate={(v) => setCurrentView(v)}
            onEditProject={(stmt) => {
              setEditingStatement(stmt);
              setCurrentView('generator');
            }}
            onDownloadPdf={(stmt) => {
              setEditingStatement(stmt);
              setCurrentView('generator');
              addNotification("Opening design review workspace to compile and Print Statement...", "info");
            }}
            onShareProject={(stmt) => {
              setSharedStatement(stmt);
            }}
            onDeleteProject={handleDeleteStatement}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView 
            profile={profile}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {currentView === 'workspace' && (
          <WorkspaceView 
            statements={statements}
            profile={profile}
            addNotification={addNotification}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}

        {currentView === 'about' && (
          <AboutView 
            onStartFree={handleAddNewProject}
          />
        )}

        {currentView === 'generator' && (
          <GeneratorView 
            initialStatement={editingStatement}
            onSave={handleSaveCompiledStatement}
            onCancel={() => {
              setEditingStatement(null);
              setCurrentView('dashboard');
            }}
          />
        )}
      </main>

      {/* Share Modal Dialog */}
      {sharedStatement && (
        <div className="fixed inset-0 bg-[#000e27]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative text-left">
            <button 
              onClick={() => setSharedStatement(null)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-50 text-slate-400 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-indigo-800 mb-4 bg-indigo-50 p-2 rounded-lg">
              <Share2 className="h-5 w-5 text-indigo-700" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider">Share Tender Statement</span>
            </div>
            <h3 className="font-sans font-bold text-lg text-[#000e27] mb-2">{sharedStatement.title}</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">
              Share the live dossier link directly with procurement officers, prime contractors, or government evaluators. Recipients can view compliance scores directly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">LIVE COMPLIANT DOSSIER URL</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    readOnly
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono select-all focus:outline-none"
                    value={`${window.location.origin}/share/${sharedStatement.id}`}
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/share/${sharedStatement.id}`);
                      alert("Sharelink copied to keyboard!");
                    }}
                    className="bg-[#000e27] hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky bottom menu */}
      <BottomNav 
        currentView={currentView}
        onNavigate={(v) => {
          setEditingStatement(null);
          setCurrentView(v);
        }}
        onAddNewProject={handleAddNewProject}
      />

      {/* Shared responsive footer on appropriate pages */}
      {(currentView === 'landing' || currentView === 'profile' || currentView === 'gallery' || currentView === 'about' || currentView === 'workspace') && (
        <Footer onNavigate={(v) => setCurrentView(v)} />
      )}

    </div>
  );
}
