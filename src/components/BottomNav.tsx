import { Home, Sparkles, FolderKanban, ShieldCheck, Cloud } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onAddNewProject: () => void;
}

export default function BottomNav({ currentView, onNavigate, onAddNewProject }: BottomNavProps) {
  return (
    <>
      <nav className="fixed bottom-0 w-full md:hidden z-50 bg-white border-t border-slate-200 h-20 pb-safe shadow-lg flex justify-around items-center">
        <button 
          onClick={() => onNavigate('landing')}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            currentView === 'landing' ? 'text-[#0453cd]' : 'text-slate-500'
          }`}
          id="mobile-nav-home"
        >
          <Home className="h-5.5 w-5.5" />
          <span className="font-sans text-xs font-semibold mt-1">Home</span>
        </button>

        <button 
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            currentView === 'dashboard' ? 'text-[#0453cd]' : 'text-slate-500'
          }`}
          id="mobile-nav-dashboard"
        >
          <FolderKanban className="h-5.5 w-5.5" />
          <span className="font-sans text-xs font-semibold mt-1">Dashboard</span>
        </button>

        <button 
          onClick={() => onNavigate('workspace')}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            currentView === 'workspace' ? 'text-[#0453cd]' : 'text-slate-500'
          }`}
          id="mobile-nav-workspace"
        >
          <Cloud className="h-5.5 w-5.5" />
          <span className="font-sans text-xs font-semibold mt-1">Sync</span>
        </button>

        <button 
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            currentView === 'profile' ? 'text-[#0453cd]' : 'text-slate-500'
          }`}
          id="mobile-nav-profile"
        >
          <ShieldCheck className="h-5.5 w-5.5" />
          <span className="font-sans text-xs font-semibold mt-1">Profile</span>
        </button>
      </nav>

      {/* Floating Action Button for prompt mobile creations */}
      <button 
        onClick={onAddNewProject}
        className="fixed bottom-24 right-5 md:hidden bg-[#000e27] hover:bg-slate-800 text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center border border-amber-500/20 active:scale-90 z-40 transition-transform group"
        title="Create New Capability Statement"
        id="mobile-fab-add"
      >
        <span className="text-xl font-bold font-sans">+</span>
      </button>
    </>
  );
}
