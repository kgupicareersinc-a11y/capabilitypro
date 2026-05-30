import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Cloud, 
  Database,
  FileSpreadsheet, 
  Calendar, 
  Mail, 
  MessageSquare, 
  CheckSquare, 
  Video, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  LogOut, 
  Loader2, 
  AlertCircle,
  Sparkles,
  ExternalLink,
  PlusCircle,
  ClipboardList
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  getAccessToken, 
  auth, 
  dbSaveUserProfile, 
  dbGetUserProfile 
} from '../lib/firebase';
import { 
  driveCreateFile, 
  sheetsCreateSpreadsheet, 
  formsCreateForm, 
  calendarCreateMeetEvent, 
  chatListSpaces, 
  chatPostMessage, 
  gmailSendEmail 
} from '../lib/workspace';
import { CapabilityStatement, UserProfile } from '../types';

interface WorkspaceViewProps {
  statements: CapabilityStatement[];
  profile: UserProfile;
  addNotification: (text: string, type: 'success' | 'info') => void;
  onNavigate: (view: string) => void;
}

export default function WorkspaceView({ statements, profile, addNotification, onNavigate }: WorkspaceViewProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [gsiLoaded, setGsiLoaded] = useState<boolean>(true);

  // Active form states
  const [selectedStatementId, setSelectedStatementId] = useState<string>('');
  const [savingToDrive, setSavingToDrive] = useState<boolean>(false);
  const [driveResult, setDriveResult] = useState<{ id: string; webViewLink?: string } | null>(null);

  const [savingToSheets, setSavingToSheets] = useState<boolean>(false);
  const [sheetsResult, setSheetsResult] = useState<{ id: string; spreadsheetUrl?: string } | null>(null);

  const [creatingForm, setCreatingForm] = useState<boolean>(false);
  const [formResult, setFormResult] = useState<{ formId: string; responderUri: string } | null>(null);

  // Calendar states
  const [calSummary, setCalSummary] = useState<string>('eTender Submission Deadline - SA Govt');
  const [calDesc, setCalDesc] = useState<string>('CapabilityPro SA statement pre-evaluation check & bid portal upload.');
  const [calDate, setCalDate] = useState<string>('');
  const [calTime, setCalTime] = useState<string>('');
  const [creatingCalendar, setCreatingCalendar] = useState<boolean>(false);
  const [calendarResult, setCalendarResult] = useState<{ eventLink: string; meetLink?: string } | null>(null);

  // Chat states
  const [chatSpaces, setChatSpaces] = useState<{ name: string; displayName: string }[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [chatMessage, setChatMessage] = useState<string>('📣 Capability Statement formulated & CSD registration confirmed live!');
  const [sendingChat, setSendingChat] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<boolean>(false);

  // Gmail states
  const [emailTo, setEmailTo] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('Verified Capability Statement Dossier: ' + profile.companyName);
  const [emailBody, setEmailBody] = useState<string>('');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [emailStatus, setEmailStatus] = useState<any>(null);

  // Init and fetch token
  useEffect(() => {
    const checkUser = auth.onAuthStateChanged(async (usr) => {
      if (usr) {
        setCurrentUser(usr);
        const tok = await getAccessToken();
        setAccessToken(tok);
        if (tok) {
          loadChatSpaces(tok);
        }
      } else {
        setCurrentUser(null);
        setAccessToken(null);
      }
    });

    // Populate active date times
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setCalDate(d.toISOString().split('T')[0]);
    setCalTime('10:00');

    if (statements.length > 0) {
      setSelectedStatementId(statements[0].id);
      setEmailBody(`Hi Procurement Officer,\n\nPlease find our company capability profile for ${statements[0].companyName} attached in summary form below:\n\n- Company: ${statements[0].companyName}\n- Registration Number: ${statements[0].registrationNumber}\n- CSD MAAA Number: ${statements[0].csdNumber}\n- B-BBEE Level: ${statements[0].bbbeeLevel}\n- Construction Industry Rating: ${statements[0].cidbGrade}\n\nKey Competencies:\n${statements[0].services.map(s => ` - ${s}`).join('\n') || ' - General engineering, supply, and civil support works.'}\n\nPlease let us know if additional verified documents or past performance trackers are required.`);
    } else {
      setEmailBody(`Hi Procurement Officer,\n\nPlease find our company capability profile for ${profile.companyName} attached in summary form below:\n\n- Company: ${profile.companyName}\n- Registration Number: ${profile.registrationNumber}\n- CSD MAAA Number: ${profile.csdNumber}\n- B-BBEE Level: ${profile.bbbeeLevel}\n- Construction Industry Rating: ${profile.cidbGrade}\n\nPlease let us know if additional verified documents or past performance trackers are required.`);
    }

    return () => checkUser();
  }, [statements, profile]);

  const loadChatSpaces = async (token: string) => {
    try {
      const spaces = await chatListSpaces(token);
      setChatSpaces(spaces);
      if (spaces.length > 0) {
        setSelectedSpace(spaces[0].name);
      }
    } catch (e) {
      console.warn("Could not retrieve standard chat spaces automatically: ", e);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setAccessToken(res.accessToken);
        setCurrentUser(res.user);
        addNotification(`Logged in successfully as ${res.user.email}! Firebase and Workspace channels linked.`, 'success');
        
        // Save user profile state back-up in Firestore automatically!
        await dbSaveUserProfile(res.user.uid, profile);
        addNotification("Backed up company profile details to Firestore Secure Cloud storage.", "success");
        
        loadChatSpaces(res.accessToken);
      }
    } catch (e: any) {
      addNotification(`Authentication failed: ${e.message}`, 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAccessToken(null);
    setCurrentUser(null);
    setDriveResult(null);
    setSheetsResult(null);
    setFormResult(null);
    setCalendarResult(null);
    addNotification("Logged out successfully. In-memory OAuth tokens cleared.", "info");
  };

  // Google Drive Action
  const handleSaveToDrive = async () => {
    if (!accessToken) return;
    const stmt = statements.find(s => s.id === selectedStatementId);
    if (!stmt) {
      alert("Please select a valid capability statement statement.");
      return;
    }

    const confirmSave = window.confirm(`Copy "${stmt.title}" detail format to Google Drive as an HTML Dossier?`);
    if (!confirmSave) return;

    setSavingToDrive(true);
    setDriveResult(null);

    const docContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${stmt.companyName} - Capability Statement</title>
  <style>
    body { font-family: sans-serif; background: #fafafa; padding: 40px; color: #1e293b; }
    .card { background: white; max-width: 800px; margin: 0 auto; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    h1 { color: #000e27; margin-bottom: 5px; font-size: 32px; }
    h2 { color: #0453cd; margin-top: 30px; font-size: 20px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
    .meta { font-size: 14px; color: #64748b; margin-bottom: 20px; }
    .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-top: 20px; }
    .metric { background: #f8fafc; padding: 15px; border-radius: 12px; }
    .metric-title { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #94a3b8; }
    .metric-value { font-size: 15px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    ul { padding-left: 20px; line-height: 1.6; }
    li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${stmt.companyName}</h1>
    <div class="meta">Capability Statement Dossier • ${stmt.title}</div>
    <p>${stmt.overview}</p>

    <div class="grid">
      <div class="metric">
        <div class="metric-title">Enterprise Registration Number</div>
        <div class="metric-value">${stmt.registrationNumber}</div>
      </div>
      <div class="metric">
        <div class="metric-title">B-BBEE Level Rating</div>
        <div class="metric-value">Level ${stmt.bbbeeLevel} Contributor</div>
      </div>
      <div class="metric">
        <div class="metric-title">CSD MAAA Registration</div>
        <div class="metric-value">${stmt.csdNumber || 'Pending'}</div>
      </div>
      <div class="metric">
        <div class="metric-title">CIDB Construction Rating</div>
        <div class="metric-value">${stmt.cidbGrade || 'Not Applicable'}</div>
      </div>
    </div>

    <h2>Core Competencies</h2>
    <ul>
      ${stmt.services.map(s => `<li>${s}</li>`).join('') || '<li>General supply of professional and works components.</li>'}
    </ul>

    <h2>Key Differentiators</h2>
    <ul>
      ${stmt.differentiators.map(d => `<li>${d}</li>`).join('')}
    </ul>

    <h2>Contact Information</h2>
    <p>
      <strong>Email:</strong> ${stmt.contactEmail}<br>
      <strong>Phone:</strong> ${stmt.contactPhone}<br>
      <strong>Office:</strong> ${stmt.physicalAddress}
    </p>
  </div>
</body>
</html>
    `.trim();

    try {
      const fileMeta = await driveCreateFile(
        accessToken, 
        `${stmt.companyName.replace(/\s+/g, '_')}_Capability_Statement.html`, 
        "text/html", 
        docContent
      );
      setDriveResult(fileMeta);
      addNotification("Saved file to Google Drive space successfully!", "success");
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setSavingToDrive(false);
    }
  };

  // Google Sheets Action
  const handleExportToSheets = async () => {
    if (!accessToken) return;
    const confirmSave = window.confirm("Create a spreadsheet containing trackers for all current Capability statements?");
    if (!confirmSave) return;

    setSavingToSheets(true);
    setSheetsResult(null);

    const headers = [
      "Statement ID", 
      "Title", 
      "Company Name", 
      "CSD MAAA Reg ID", 
      "Registration Code", 
      "B-BBEE Level", 
      "CIDB Construction Rating", 
      "Contact Phone", 
      "Contact Email", 
      "Primary Overview"
    ];
    
    const rows = statements.map(s => [
      s.id,
      s.title,
      s.companyName,
      s.csdNumber,
      s.registrationNumber,
      `Level ${s.bbbeeLevel}`,
      s.cidbGrade,
      s.contactPhone,
      s.contactEmail,
      s.overview
    ]);

    try {
      const sheet = await sheetsCreateSpreadsheet(
        accessToken, 
        `CapabilityPro_SA_Trackers_${Date.now()}`, 
        headers, 
        rows
      );
      setSheetsResult(sheet);
      addNotification("Spreadsheet generated and populated successfully!", "success");
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setSavingToSheets(false);
    }
  };

  // Google Forms Action
  const handleCreateForm = async () => {
    if (!accessToken) return;
    const confirmSave = window.confirm("Provision a Google Form on your account to gather subcontractor capability data?");
    if (!confirmSave) return;

    setCreatingForm(true);
    setFormResult(null);

    try {
      const f = await formsCreateForm(
        accessToken, 
        "Subcontractor Capability Intake - CapabilityPro SA",
        "Formulate your verified profiles, B-BBEE, and CSD MAAA numbers for joint venture evaluation."
      );
      setFormResult(f);
      addNotification("Google Intake Form provisioned on drive!", "success");
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setCreatingForm(false);
    }
  };

  // Google Calendar Event Action
  const handleCreateCalendarEvent = async () => {
    if (!accessToken) return;
    if (!calDate || !calTime) {
      alert("Please choose date and time.");
      return;
    }

    const confirmSave = window.confirm("Create Google Calendar event with a Google Meet conference link included?");
    if (!confirmSave) return;

    setCreatingCalendar(true);
    setCalendarResult(null);

    const startIso = `${calDate}T${calTime}:00`;
    // Add 1 hour
    const [h, m] = calTime.split(':');
    const nextHour = String(Number(h) + 1).padStart(2, '0');
    const endIso = `${calDate}T${nextHour}:${m}:00`;

    try {
      const e = await calendarCreateMeetEvent(accessToken, calSummary, calDesc, startIso, endIso);
      setCalendarResult(e);
      addNotification("Calendar event scheduled with a direct Google Meet conference link!", "success");
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setCreatingCalendar(false);
    }
  };

  // Google Chat Action
  const handlePostChatMessage = async () => {
    if (!accessToken) return;
    if (!selectedSpace) {
      alert("No Google Chat rooms/spaces found. Ensure your account is connected to space hubs.");
      return;
    }

    setSendingChat(true);
    setChatStatus(false);

    try {
      await chatPostMessage(accessToken, selectedSpace, chatMessage);
      setChatStatus(true);
      addNotification("Post succeeded on the Google Chat space channel!", "success");
    } catch (e: any) {
      console.error(e);
      alert(e.message);
    } finally {
      setSendingChat(false);
    }
  };

  // Gmail Send Action
  const handleSendEmail = async () => {
    if (!accessToken) return;
    if (!emailTo) {
      alert("Recipient is required.");
      return;
    }

    const confirmSend = window.confirm(`Transmit formatted body statement via Gmail API to ${emailTo}?`);
    if (!confirmSend) return;

    setSendingEmail(true);
    setEmailStatus(null);

    try {
      await gmailSendEmail(accessToken, emailTo, emailSubject, emailBody);
      setEmailStatus({ success: true, text: "Sent Successfully" });
      addNotification("Capability dossier mailed safely!", "success");
    } catch (e: any) {
      console.error(e);
      setEmailStatus({ success: false, text: e.message });
      alert(e.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-10 space-y-12">
      {/* Banner */}
      <section className="bg-gradient-to-br from-[#000e27] via-[#001c48] to-[#044bc8] hover:shadow-lg transition-all text-white p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(245,158,11,0.1),transparent)] pointer-events-none" />
        <div className="space-y-4 max-w-2xl text-left">
          <div className="inline-flex gap-2 items-center bg-amber-500/10 text-amber-400 font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            <Cloud className="h-4 w-4" />
            Cloud Enterprise Channel
          </div>
          <h1 className="font-sans font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
            Google Workspace &amp; Firebase Core Sync
          </h1>
          <p className="font-sans text-slate-200 text-sm md:text-base leading-relaxed">
            Link your registered South African business with real-time cloud connections. Authenticating via Secure Google login connects Firebase firestore databases and your full suite of Google Workspace endpoints instantly.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 md:w-80 shrink-0 text-left">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} 
                  alt="Avatar" 
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-amber-500 shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="text-white text-xs font-bold leading-none truncate">{currentUser.displayName}</h4>
                  <span className="text-[10px] text-slate-300 font-mono block mt-1 truncate">{currentUser.email}</span>
                  <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1.5">
                    <ShieldCheck className="h-3 w-3" /> Live Channel Active
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl text-[10px]">
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td className="text-slate-400 font-mono py-0.5">Firebase store</td>
                      <td className="text-white font-mono py-0.5 text-right font-semibold">Active</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400 font-mono py-0.5">OAuth scope count</td>
                      <td className="text-amber-400 font-mono py-0.5 text-right font-semibold">9 APIs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold active:scale-95 transition-all"
                id="signout-google-btn"
              >
                <LogOut className="h-4 w-4" /> Sign Out Channel
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-200 font-sans">
                🔐 Sign in to activate direct database backup and eTender proposal document deployments.
              </div>
              <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-slate-100 text-[#000e27] font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 active:scale-95 transition-all shadow-md group disabled:opacity-50"
                id="signin-google-btn"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 text-[#000e27] animate-spin" />
                ) : (
                  <>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {!currentUser && (
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
          <div className="flex gap-3">
            <div className="p-2.5 bg-amber-550 bg-amber-500/10 text-amber-600 rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-[#000e27]">Channel Offline Status</h4>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                The Google channels are currently running in local-only fallback sandbox mode. Click the <strong>Sign in with Google</strong> login button above to authenticate, which will unlock database saves to Firestore and all Google Workspace pipelines.
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogin}
            className="px-4 py-2 bg-[#000e27] text-white hover:bg-slate-800 rounded-xl text-xs font-bold font-sans tracking-wide shrink-0 active:scale-95 transition-all"
          >
            Authenticate Now
          </button>
        </div>
      )}

      {/* Grid of integrations */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${!currentUser ? 'opacity-50 pointer-events-none select-none' : ''}`}>

        {/* Google Drive Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-drive">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Cloud className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Google Drive Document Sync</h3>
                <span className="text-[10px] text-slate-400 font-medium">Backup dossier HTML files inside user space</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Export and compile a selected eTender Statement into a beautifully formatted, stand-alone HTML file, then upload it into your Google Drive instantly.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">SELECT STATEMENT TO BACKUP</label>
                <select 
                  value={selectedStatementId} 
                  onChange={(e) => setSelectedStatementId(e.target.value)}
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {statements.map(s => (
                    <option key={s.id} value={s.id}>{s.title} ({s.companyName})</option>
                  ))}
                  {statements.length === 0 && <option value="">No draft statements available. Create one first!</option>}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handleSaveToDrive}
              disabled={savingToDrive || statements.length === 0}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {savingToDrive ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
              Save Document to Google Drive
            </button>

            {driveResult && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-medium">
                <span>Dossier successfully saved to Drive!</span>
                {driveResult.webViewLink && (
                  <a 
                    href={driveResult.webViewLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-emerald-600 underline text-[11px]"
                  >
                    View File <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Google Sheets Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-sheets">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Google Sheets Tracker</h3>
                <span className="text-[10px] text-slate-400 font-medium font-sans">B-BBEE / CSD / eTender CRM spreadsheets Roster</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Compile and output your complete database list of South African bids and CIPC verified numbers to a unified spreadsheet. This acts as a portable dossier CRM.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-sans">
              <div className="font-bold text-slate-600">INCLUDED DATA COLUMNS:</div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["CIPC Company Name", "CSD Registration ID", "B-BBEE Rating", "CIDB Grade", "Contact Email", "Overview Details"].map(col => (
                  <span key={col} className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-medium">{col}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handleExportToSheets}
              disabled={savingToSheets || statements.length === 0}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {savingToSheets ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
              Publish Statement Tracker Spreadsheet
            </button>

            {sheetsResult && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-medium">
                <span>Roster Generated Successfully!</span>
                {sheetsResult.spreadsheetUrl && (
                  <a 
                    href={sheetsResult.spreadsheetUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-emerald-600 underline text-[11px]"
                  >
                    View Spreadsheet <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Google Forms Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-forms">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Google Forms Intake Builder</h3>
                <span className="text-[10px] text-slate-400 font-medium font-sans">Automatic eTender registration profile forms creation</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Instantly deploy a customized subcontracting qualification questionnaire profile in Google Forms. Subcontracters click it to input CSD details.
            </p>

            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-[11px] font-sans text-slate-600 space-y-1">
              <div>✅ Inserts CIPC Name Question</div>
              <div>✅ Adds CSD MAAA verification entry box</div>
              <div>✅ Provisions paragraph scope description placeholder</div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handleCreateForm}
              disabled={creatingForm}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {creatingForm ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardList className="h-4 w-4" />}
              Build Subcontractor Registration Form
            </button>

            {formResult && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 text-xs font-medium space-y-2">
                <div className="font-bold">Form Created on Drive!</div>
                <div className="flex flex-col gap-1 text-[11px]">
                  <a 
                    href={formResult.responderUri} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-indigo-600 underline"
                  >
                    🚀 Open Live Client Submission Page <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-slate-400 font-mono text-[9px] select-all">Form ID: {formResult.formId}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Google Calendar & Google Meet Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-calendar">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Calendar &amp; Meet Hub</h3>
                <span className="text-[10px] text-slate-400 font-medium">Schedule RFP milestones &amp; Consultation video conferences</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Schedule critical tender revision audits or 15-minute consultations directly in your primary Google Calendar. This automatically configures a secure <strong>Google Meet</strong> link.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">DATE</label>
                <input 
                  type="date" 
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase">TIME (HH:MM)</label>
                <input 
                  type="time" 
                  value={calTime}
                  onChange={(e) => setCalTime(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase">EVENT TITLE</label>
                <input 
                  type="text" 
                  value={calSummary}
                  onChange={(e) => setCalSummary(e.target.value)}
                  placeholder="Event summary..."
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-zinc-400 uppercase">DESCRIPTION</label>
                <textarea 
                  value={calDesc}
                  onChange={(e) => setCalDesc(e.target.value)}
                  placeholder="Detail briefing..."
                  rows={2}
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handleCreateCalendarEvent}
              disabled={creatingCalendar}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {creatingCalendar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
              Publish Event &amp; Meet Room URL
            </button>

            {calendarResult && (
              <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 text-xs font-medium space-y-2 text-left">
                <div className="font-bold">📅 Calendar Milestone Added!</div>
                <div className="flex flex-col gap-1.5 text-[11px] pt-1 mt-1">
                  <a 
                    href={calendarResult.eventLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1 text-slate-700 hover:underline"
                  >
                    🌐 Open Calendar Entry <ExternalLink className="h-3 w-3" />
                  </a>
                  {calendarResult.meetLink ? (
                    <a 
                      href={calendarResult.meetLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-1 px-2 py-1.5 bg-[#000e27] text-white rounded-lg w-max font-bold border border-amber-500/25 animate-pulse mt-1 hover:scale-105 transition-transform"
                    >
                      <Video className="h-3.5 w-3.5 text-amber-500" /> Join Google Meet Virtual Room
                    </a>
                  ) : (
                    <span className="text-amber-600 text-[10px]">Google Meet API processing...</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Google Chat Spaces Notification Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-chat">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Google Chat Channel Alerts</h3>
                <span className="text-[10px] text-slate-400 font-medium">Push wins and diagnostic alerts to procurement rooms</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Instantly report compliance diagnostic tests, central supplier directory validations, or tender completion updates directly into corporate Chat rooms.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">CHOOSE GOOGLE CHAT SPACE</label>
                {chatSpaces.length > 0 ? (
                  <select 
                    value={selectedSpace} 
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  >
                    {chatSpaces.map(sp => (
                      <option key={sp.name} value={sp.name}>{sp.displayName} ({sp.name})</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-rose-600 mt-1">
                    No active Google Chat space channels identified on this account.
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">MESSAGE BODY</label>
                <textarea 
                  value={chatMessage} 
                  onChange={(e) => setChatMessage(e.target.value)}
                  rows={2}
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Enter message text..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handlePostChatMessage}
              disabled={sendingChat || chatSpaces.length === 0}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {sendingChat ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
              Dispatch Google Chat Alert
            </button>

            {chatStatus && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 text-[11px] font-medium text-center">
                🚀 Message transmitted to your Chat space successfully!
              </div>
            )}
          </div>
        </div>

        {/* Gmail Dispatcher Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col justify-between text-left relative overflow-hidden" id="workspace-gmail">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-sans font-bold text-lg text-[#000e27]">Gmail Dispatcher</h3>
                <span className="text-[10px] text-slate-400 font-medium">Transmitting statements to evaluators directly</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Quickly draft and format a compliance dossier summary, and execute direct mail transactions using your verified Google email inbox address.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">RECIPIENT EMAIL</label>
                <input 
                  type="email" 
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="hello@capabilityprosa.co.za or client@company.com"
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">SUBJECT</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">BODY OUTLINE</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={4}
                  className="mt-1 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-700 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 space-y-4">
            <button 
              onClick={handleSendEmail}
              disabled={sendingEmail || !emailTo}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {sendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              Transmit Dossier Email via Gmail
            </button>

            {emailStatus && (
              <div className={`p-3 rounded-xl border text-[11px] font-medium text-center ${emailStatus.success ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-rose-800 border-red-100'}`}>
                {emailStatus.success ? "⭐ Transaction complete - Email Dispatched!" : `Error: ${emailStatus.text}`}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
