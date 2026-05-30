import { Landmark, Bell, Menu, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onStartFree: () => void;
  userEmail?: string;
  onShowNotifications?: () => void;
  showAdminLink?: boolean;
}

export default function Header({ 
  currentView, 
  onNavigate, 
  onStartFree, 
  userEmail,
  onShowNotifications,
  showAdminLink
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 h-16 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-8 max-w-[1440px] mx-auto h-full">
        {/* Logo and home action */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
          onClick={() => onNavigate('landing')}
          id="header-logo"
        >
          <Landmark className="h-6 w-6 text-[#000e27]" />
          <span className="font-sans font-bold text-lg md:text-xl text-[#000e27] tracking-tight">
            CapabilityPro SA
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          <button 
            onClick={() => onNavigate('landing')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'landing' 
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-home"
          >
            Home
          </button>
          
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'dashboard'
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-dashboard"
          >
            Dashboard
          </button>

          <button 
            onClick={() => onNavigate('gallery')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'gallery'
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-templates"
          >
            Templates
          </button>

          <button 
            onClick={() => onNavigate('profile')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'profile'
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-profile"
          >
            My Company Profile
          </button>

          <button 
            onClick={() => onNavigate('workspace')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'workspace'
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-workspace"
          >
            Google Workspace Sync
          </button>

          <button 
            onClick={() => onNavigate('about')}
            className={`font-sans font-medium text-sm h-full px-2 border-b-2 transition-all ${
              currentView === 'about'
                ? 'text-[#0453cd] border-[#0453cd]' 
                : 'text-slate-600 border-transparent hover:text-[#000e27] hover:border-slate-300'
            }`}
            id="nav-about"
          >
            About Us
          </button>

          {showAdminLink && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`font-sans font-bold text-sm h-full px-2 border-b-2 transition-all flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'text-amber-500 border-amber-500' 
                  : 'text-amber-500 border-transparent hover:text-amber-600 hover:border-amber-300'
              }`}
              id="nav-admin"
            >
              🔒 Admin Panel
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onShowNotifications}
            className="p-2 text-slate-500 hover:text-[#000e27] hover:bg-slate-50 rounded-full transition-all relative overflow-hidden"
            title="Notifications"
            id="header-notif-btn"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User profile brief */}
          {userEmail && (
            <div className="hidden lg:flex flex-col text-right mr-1">
              <span className="text-xs text-slate-400 font-mono">Operator</span>
              <span className="text-xs text-[#000e27] font-medium max-w-[130px] truncate">{userEmail}</span>
            </div>
          )}

          <button 
            onClick={onStartFree}
            className="bg-[#000e27] hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-sans font-semibold text-xs md:text-sm shadow-sm hover:shadow active:scale-95 transition-all"
            id="header-action-btn"
          >
            Start Free
          </button>
        </div>
      </div>
    </header>
  );
}
