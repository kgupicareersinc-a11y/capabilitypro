import { PlusCircle, LayoutGrid, Settings, FileText, Download, Share2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { CapabilityStatement } from '../types';

interface DashboardViewProps {
  statements: CapabilityStatement[];
  onAddNewProject: () => void;
  onNavigate: (view: string) => void;
  onEditProject: (project: CapabilityStatement) => void;
  onDownloadPdf: (project: CapabilityStatement) => void;
  onShareProject: (project: CapabilityStatement) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function DashboardView({
  statements,
  onAddNewProject,
  onNavigate,
  onEditProject,
  onDownloadPdf,
  onShareProject,
  onDeleteProject
}: DashboardViewProps) {

  const getTemplateTypeLabel = (templateId: string) => {
    switch (templateId) {
      case 'corporate': return 'Corporate Port';
      case 'tender': return 'Tender Protocol';
      case 'infrabuild': return 'Civil Infrastructure';
      case 'digital': return 'ICT System';
      case 'boutique': return 'Boutique Advisory';
      default: return 'Capability Statement';
    }
  };

  return (
    <div className="w-full bg-[#f6faff] min-h-screen pt-10 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto" id="dashboard-root">
      
      {/* Welcome header banner */}
      <section className="mb-10 text-left">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27] mb-2">
          Welcome back, Enterprise User
        </h1>
        <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed">
          Manage your South African government-ready capability statements, CSD details, and institutional board tender briefs.
        </p>
      </section>

      {/* Action cards bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: New Statement */}
        <div 
          onClick={onAddNewProject}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer text-left flex flex-col justify-between"
          id="dash-card-new"
        >
          <div>
            <div className="w-12 h-12 bg-[#dae2ff] text-[#001848] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
              <PlusCircle className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#000e27] mb-2">New Statement</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">
              Generate a brand new compliant capability statement targeting eTender requirements using our rapid AI framework.
            </p>
          </div>
          <span className="text-[#0453cd] font-sans font-bold text-xs tracking-wide flex items-center gap-1 group-hover:underline">
            GET STARTED <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Card 2: Manage Templates */}
        <div 
          onClick={() => onNavigate('gallery')}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer text-left flex flex-col justify-between"
          id="dash-card-templates"
        >
          <div>
            <div className="w-12 h-12 bg-slate-100 text-[#000e27] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#000e27] mb-2">Manage Templates</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">
              Browse, test, and adapt customized legal templates suited for treasury assessment criteria across divisions.
            </p>
          </div>
          <span className="text-[#0453cd] font-sans font-bold text-xs tracking-wide flex items-center gap-1 group-hover:underline">
            VIEW GALLERY <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Card 3: Account Profile Settings */}
        <div 
          onClick={() => onNavigate('profile')}
          className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer text-left flex flex-col justify-between"
          id="dash-card-profile"
        >
          <div>
            <div className="w-12 h-12 bg-slate-100 text-[#000e27] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
              <Settings className="h-6 w-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-[#000e27] mb-2">Account Settings</h3>
            <p className="text-xs text-slate-500 font-sans leading-relaxed mb-6">
              Manage your CSD MAAA profile, CIDB registration metrics, active offices, and corporate legal entities.
            </p>
          </div>
          <span className="text-[#0453cd] font-sans font-bold text-xs tracking-wide flex items-center gap-1 group-hover:underline">
            EDIT PROFILE <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>

      {/* Projects list container */}
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="dashboard-recent-projects">
        <div className="bg-[#000e27] px-6 py-4 flex justify-between items-center text-white">
          <h2 className="font-sans font-bold text-base md:text-lg">Recent Projects</h2>
          <span className="bg-white/10 text-white font-mono text-xs px-3 py-1 rounded-full border border-white/15 select-none">
            All Files ({statements.length})
          </span>
        </div>

        {statements.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-base font-sans font-medium mb-4">No capability statements generated yet.</p>
            <button 
              onClick={onAddNewProject}
              className="bg-[#0453cd] text-white hover:bg-[#033ea1] px-5 py-2 rounded-lg font-sans text-xs font-semibold shadow"
            >
              Start Generating Statement
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-sans text-xs font-semibold tracking-wider uppercase border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">PROJECT NAME</th>
                  <th className="px-6 py-4">TYPE</th>
                  <th className="px-6 py-4">LAST EDITED</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-sans text-slate-700">
                {statements.map(stmt => (
                  <tr key={stmt.id} className="hover:bg-slate-50/75 transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#000e27]">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-[#0453cd]" />
                        <span>{stmt.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {getTemplateTypeLabel(stmt.templateId)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {stmt.lastEdited}
                    </td>
                    <td className="px-6 py-4">
                      {/* Status indicator pill tags */}
                      {stmt.services.length > 0 && stmt.pastPerformance.length > 0 ? (
                        <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          Completed
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-amber-600" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEditProject(stmt)}
                          className="bg-slate-50 border border-slate-200 text-xs px-3 py-1.5 rounded-lg text-slate-700 font-sans font-bold hover:bg-[#0453cd] hover:text-white hover:border-transparent transition-all active:scale-95"
                          title="Edit Statement"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => onDownloadPdf(stmt)}
                          className="p-1.5 text-slate-500 hover:text-[#0453cd] hover:bg-slate-50 rounded-lg transition-all"
                          title="Download PDF / Print"
                        >
                          <Download className="h-4.5 w-4.5" />
                        </button>
                        <button 
                          onClick={() => onShareProject(stmt)}
                          className="p-1.5 text-slate-500 hover:text-[#0453cd] hover:bg-slate-50 rounded-lg transition-all"
                          title="Share Link"
                        >
                          <Share2 className="h-4.5 w-4.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${stmt.title}"? This cannot be undone.`)) {
                              onDeleteProject(stmt.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Statement"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="p-4 bg-slate-50 flex justify-center border-t border-slate-100">
          <button 
            type="button"
            className="text-xs font-bold font-sans text-[#0453cd] hover:underline"
          >
            VIEW ALL ACTIVE SCHEMES
          </button>
        </div>
      </section>

    </div>
  );
}
