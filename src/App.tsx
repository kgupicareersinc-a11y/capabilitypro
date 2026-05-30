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
import AdminView from './components/AdminView';
import PaymentModal from './components/PaymentModal';

import { CapabilityStatement, UserProfile, ProjectPerformance } from './types';
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
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [selectedPlanToPay, setSelectedPlanToPay] = useState<string>('SME Lite');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

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
        setCurrentUserEmail(user.email || 'kgupicareersinc@gmail.com');
        addNotification(`Protected session established for ${user.email || 'operator'}. Restoring files from Firestore...`, 'success');
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
        setCurrentUserEmail('');
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

  const handlePaymentSuccess = async (plan: string) => {
    const updatedProfile: UserProfile = {
      ...profile,
      companyName: profile.companyName || 'SME Enterprise Ltd',
    };
    await handleSaveProfile(updatedProfile);
    setIsPaymentModalOpen(false);
    addNotification(`👑 ${plan} package status verified and unlocked via PayShap direct channel!`, 'success');
    setCurrentView('dashboard');
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
    // Sector-specific preloaded content to make templates work properly
    let overview = '';
    let services: string[] = [];
    let differentiators: string[] = [];
    let certifications: string[] = [];
    let pastPerformance: ProjectPerformance[] = [];

    if (templateId === 'corporate') {
      overview = `Our company provides premier corporate supply chain coordination, heavy logistics fleet management, and multi-depot administrative oversight. Fully verified on the Central Supplier Database (CSD) and CIPC registered, we partner with blue-chip South African companies and public corporations to optimize high-volume distribution paths under rigorous safety controls.`;
      services = [
        "Turnkey Fleet Procurement & Distribution Logistics",
        "Multi-Modal Regional Supply Chain Management",
        "Real-time Satellite Cargo Tracking & Route Optimization",
        "Enterprise Risk Management & Warehousing Auditing"
      ];
      differentiators = [
        `Verified Level ${profile.bbbeeLevel || '1'} B-BBEE status with 135% procurement recognition`,
        "Fully audited National Treasury compliant logistics chain",
        "Advanced tracking telemetry with 24/7 recovery operations"
      ];
      certifications = [
        "SABS ISO 9001:2015 Quality Management Approved",
        "Road Freight Association (RFA) Registered Member"
      ];
      pastPerformance = [
        {
          id: `perf-${Date.now()}-1`,
          projectName: "Spoornet Terminal Bulk Logistics Support",
          client: "Transnet National Ports Authority (TNPA)",
          value: 8400000,
          year: 2024,
          status: "completed",
          description: "Synchronized bulk delivery of raw components with zero safety incidents over twelve months."
        }
      ];
    } else if (templateId === 'tender') {
      overview = `A specialized government tender technical unit fully aligned with PPPFA regulations and eTender framework specifications. Backed by solid administrative records on the Central Supplier Database (CSD), we deliver public sector projects, municipal infrastructure enhancements, and community upliftment initiatives strictly on schedule.`;
      services = [
        "Municipal Infrastructure Civil Works",
        "Community-Led Human Settlements Construction",
        "Public Sector Sanitary Sourcing & Delivery",
        "Local Youth and Subcontractor Skills Training Schemes"
      ];
      differentiators = [
        `Level ${profile.bbbeeLevel || '1'} B-BBEE contributor registered on Central Supplier Database`,
        "80% localized labor guarantee in target municipal wards",
        "Fully itemized pricing index satisfying Treasury maximum cost metrics"
      ];
      certifications = [
        "CSD Active Registration (MAAA compliance verified)",
        "National Home Builders Registration Council (NHBRC) compliance"
      ];
      pastPerformance = [
        {
          id: `perf-${Date.now()}-1`,
          projectName: "Community Classroom Upliftment Bid",
          client: "Gauteng Department of Infrastructure Development (GDID)",
          value: 11300000,
          year: 2023,
          status: "completed",
          description: "Built 6 new modular classroom facilities including concrete paving with 90% local youth employment."
        }
      ];
    } else if (templateId === 'infrabuild') {
      overview = `A robust engineering contractor ready for high-density public infrastructure and heavy physical delivery. Holding specialized CIDB ratings, we manage complex civil project footprints, storm-water upgrades, bulk reticulation pipelines, and heavy earthmoving machines across South Africa's transport corridors.`;
      services = [
        "Bulk Water Reticulation & Trench Sump Sourcing",
        "Road Rehabilitation & Asphalt Pavement Sealing",
        "Concrete Structural Overpasses & Retaining Foundations",
        "Civil Engineering Plant Sourcing & Leasing"
      ];
      differentiators = [
        `Active CIDB grade ${profile.cidbGrade || "6CE"} rating for general civil engineering projects`,
        "Dedicated SABS concrete strength quality certification guards",
        "Comprehensive COIDA work-cover licensing with zero incident record"
      ];
      certifications = [
        `CIDB Grade ${profile.cidbGrade || "6CE"} active rating certificate`,
        "SABS Concrete Standard Approval Certificate",
        "Federation of South African Civil Engineering Contractors Member"
      ];
      pastPerformance = [
        {
          id: `perf-${Date.now()}-1`,
          projectName: "Stormwater Drainage Pipeline Rehabilitation",
          client: "City of Johannesburg Council",
          value: 15200000,
          year: 2024,
          status: "completed",
          description: "Excavated, graded, and reinforced 2.4km stormwater channels to prevent flooding in high-density informal zones."
        }
      ];
    } else if (templateId === 'digital') {
      overview = `A dynamic software advisory and digital translation company built for modern South African channels. We design cloud applications, e-Government utility portals, and local-language support bots that optimize citizen service delivery in full compliance with the Protection of Personal Information Act (POPIA).`;
      services = [
        "Cloud-Native Software Architecture & USSD Payment Portals",
        "Municipal Citizen Query Resolution Systems",
        "Secure Database Management & Migration to AWS/Azure Clusters",
        "POPIA & Cybersecurity Compliance Penetration Scans"
      ];
      differentiators = [
        "Pristine software optimization tailored for low-bandwidth mobile devices",
        "Full encryption and local hosting meeting POPIA data sovereignty bounds",
        "Agile development models guaranteeing first release within 45 days"
      ];
      certifications = [
        "SITA (State Information Technology Agency) Software Supplier Registry",
        "SABS ISO 27001 Information Security Management Standard",
        "Information Regulator Registered POPIA Compliance Dossier"
      ];
      pastPerformance = [
        {
          id: `perf-${Date.now()}-1`,
          projectName: "Municipal Smart Utility Portal Setup",
          client: "City of Cape Town",
          value: 6700000,
          year: 2024,
          status: "completed",
          description: "Deployed responsive cloud portal and native SMS billing interface to manage service issues for 120,000 residents."
        }
      ];
    } else { // boutique
      overview = `A highly refined advisory firm specialized in corporate tax structures, SANAS-compliant B-BBEE scorecard maximization schemes, and Central Supplier Database compliance diagnostics. We empower South African businesses, agencies, and state enterprises to clean administrative errors and formulate winning technical submissions.`;
      services = [
        "B-BBEE Ownership & Joint Venture Strategic Structuring",
        "CSD Compliance Audit & Dispute Remediation Packages",
        "Government Bid Formulation Mentorship Courses",
        "Corporate Governance & King IV Code Assessment Models"
      ];
      differentiators = [
        "Led by former municipal finance heads with deep treasury audit experience",
        "100% successful track record of resolving CSD verification hurdles",
        "Personalized partner-led advisory with rapid turnarounds"
      ];
      certifications = [
        "SAICA (South African Institute of Chartered Accountants) Registered Practice",
        "SANAS Accredited BEE Verification Professional Certificate"
      ];
      pastPerformance = [
        {
          id: `perf-${Date.now()}-1`,
          projectName: "Enterprise BEE Scorecard Advisory Programme",
          client: "Rand Water Subcontractors Alliance",
          value: 1200000,
          year: 2023,
          status: "completed",
          description: "Structured 14 sub-contracting firms' scorecards to elevate them to Level 1 B-BBEE rating inside short bidding schedules."
        }
      ];
    }

    const templateStatement: CapabilityStatement = {
      id: '',
      title: `eTender Bid Formulation [${templateId.toUpperCase()}]`,
      templateId: templateId as any,
      companyName: profile.companyName,
      registrationNumber: profile.registrationNumber,
      bbbeeLevel: profile.bbbeeLevel,
      overview,
      csdNumber: profile.csdNumber,
      cidbGrade: profile.cidbGrade,
      contactEmail: profile.contactEmail,
      contactPhone: profile.contactPhone,
      physicalAddress: profile.physicalAddress,
      services,
      differentiators,
      certifications,
      pastPerformance,
      lastEdited: new Date().toISOString().split('T')[0]
    };

    setEditingStatement(templateStatement);
    setCurrentView('generator');
    addNotification(`Loaded premium '${templateId}' sector preset successfully. Ready under eTender registers!`, 'success');
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
        showAdminLink={true} 
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
              setSelectedPlanToPay(plan);
              setIsPaymentModalOpen(true);
              addNotification(`Sourcing secure checkout via ABSA/PayShap bank channels for ${plan}...`, 'info');
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

        {currentView === 'admin' && (
          <AdminView 
            statements={statements}
            profile={profile}
            addNotification={addNotification}
            onUpdateStatements={saveStatementsState}
            onUpdateProfile={setProfile}
            onNavigate={(v) => setCurrentView(v)}
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

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedPlan={selectedPlanToPay}
        onPaymentSuccess={handlePaymentSuccess}
        addNotification={addNotification}
      />

      {/* Shared responsive footer on appropriate pages */}
      {(currentView === 'landing' || currentView === 'profile' || currentView === 'gallery' || currentView === 'about' || currentView === 'workspace' || currentView === 'admin') && (
        <Footer onNavigate={(v) => setCurrentView(v)} />
      )}

    </div>
  );
}
