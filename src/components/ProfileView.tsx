import React, { useState } from 'react';
import { ShieldCheck, Award, Save, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
}

export default function ProfileView({ profile, onSaveProfile }: ProfileViewProps) {
  const [form, setForm] = useState<UserProfile>({ ...profile });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSaveProfile(form);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  const fetchTenderStrategyTips = async () => {
    setLoadingTips(true);
    try {
      const response = await fetch('/api/gemini/review-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          bbbeeLevel: form.bbbeeLevel,
          cidbGrade: form.cidbGrade,
          industry: form.industry
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiTips(data.review);
      } else {
        setAiTips("Could not retrieve AI tips. Ensure server is active and try again.");
      }
    } catch {
      setAiTips("Error connecting to server. Local fallback suggestions: Prioritize highlighting Level 1 procurement weighting prominently.");
    } finally {
      setLoadingTips(false);
    }
  };

  return (
    <div className="w-full bg-[#f6faff] min-h-screen pt-10 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto" id="profile-root">
      
      {/* Profile Header */}
      <section className="mb-10 text-left">
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27] mb-2">
          Operator & Company Profile
        </h1>
        <p className="text-slate-600 font-sans text-sm md:text-base leading-relaxed">
          Configure central verification numbers (CSD & CIPC). These metrics automatically populate into any newly generated capability statement draft.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile edit form */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-[#000e27]/5 border-b border-slate-200 p-6 flex items-center gap-2">
            <ShieldCheck className="h-5.5 w-5.5 text-[#0453cd]" />
            <h3 className="font-sans font-bold text-base text-[#000e27]">
              Company Registry Credentials & Compliance Info
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  COMPANY LEGAL NAME <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="e.g. Acme Civil Works Pty Ltd"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>

              {/* Registration Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  CIPC REGISTRATION NUMBER
                </label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="e.g. 2018/104928/07"
                  value={form.registrationNumber}
                  onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
                />
              </div>

              {/* CSD MAAA Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  CENTRAL SUPPLIER DATABASE (CSD) MAAA No.
                </label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="e.g. MAAA0593821"
                  value={form.csdNumber}
                  onChange={(e) => setForm({ ...form, csdNumber: e.target.value })}
                />
              </div>

              {/* B-BBEE Level selection */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  B-BBEE RATING STATUS LEVEL
                </label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  value={form.bbbeeLevel}
                  onChange={(e) => setForm({ ...form, bbbeeLevel: e.target.value })}
                >
                  <option value="1">Level 1 Contributor (135% Recognition)</option>
                  <option value="2">Level 2 Contributor (125% Recognition)</option>
                  <option value="3">Level 3 Contributor (110% Recognition)</option>
                  <option value="4">Level 4 Contributor (100% Recognition)</option>
                  <option value="non">Non-Compliant Contributor</option>
                </select>
              </div>

              {/* CIDB Grade */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  CIDB GRADE (e.g., Engineering/Builders)
                </label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="e.g. 6CE, 7GB, Not Applicable"
                  value={form.cidbGrade}
                  onChange={(e) => setForm({ ...form, cidbGrade: e.target.value })}
                />
              </div>

              {/* Industry / Sector */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  CORE SECTOR / INDUSTRY FOCUS
                </label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="e.g. General Civil Sourcing & Construction"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </div>

              {/* Contact Email */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  CONTACT EMAIL ADDRESS
                </label>
                <input 
                  type="email"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="tender@ltmcivil.co.za"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                />
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                  TELEPHONE NUMBER
                </label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="+27 (0) 11 402 3921"
                  value={form.contactPhone}
                  onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                />
              </div>

            </div>

            {/* Physical Address */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold font-sans text-slate-500 tracking-wider block uppercase">
                HEAD OFFICE PHYSICAL ADDRESS
              </label>
              <textarea 
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm resize-none transition-all"
                placeholder="Building 4, Sandton Corporate Gate, Sandton, 2096"
                value={form.physicalAddress}
                onChange={(e) => setForm({ ...form, physicalAddress: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button 
                type="submit"
                disabled={loading}
                className="bg-[#000e27] hover:bg-slate-800 text-white font-sans font-bold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                {loading ? <RefreshCw className="animate-spin h-4 w-4" /> : <Save className="h-4.5 w-4.5" />}
                {loading ? 'Saving Profile...' : 'Save Profile Details'}
              </button>
            </div>
            {success && (
              <p className="text-sm font-semibold text-emerald-600 mt-2 text-right">
                Profile updated successfully. Future statements will load these attributes as factory defaults.
              </p>
            )}
          </form>
        </div>

        {/* AI Actionable sidebar */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-gradient-to-br from-[#000e27] to-[#0453cd] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-6 w-6 text-amber-300" />
                <h4 className="font-sans font-bold text-lg text-white">Tender Compliance Audit</h4>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                South African evaluators are bound by regulatory frameworks. Use our customized intelligence engine to analyze your current profile credentials and generate target recommendations to maximize scoring.
              </p>
              <button 
                onClick={fetchTenderStrategyTips}
                disabled={loadingTips}
                className="w-full bg-[#ffdea5] hover:bg-white text-[#000e27] py-2.5 rounded-lg font-sans font-bold text-xs tracking-wide shadow-md transition-colors flex items-center justify-center gap-2"
                id="profile-ai-audit-btn"
              >
                {loadingTips ? <RefreshCw className="animate-spin h-4 w-4" /> : 'Run Rapid Tender Strategy Audit'}
              </button>
            </div>
          </div>

          {aiTips && (
            <div className="bg-[#dae2ff] border border-blue-200 p-6 rounded-2xl shadow-sm text-left animate-fade-in">
              <h4 className="font-sans font-bold text-sm text-[#001848] mb-3 uppercase tracking-wider">
                Auditor Recommendations
              </h4>
              <div className="font-sans text-xs text-[#001848] space-y-2 leading-relaxed whitespace-pre-wrap">
                {aiTips}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
