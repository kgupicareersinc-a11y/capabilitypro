import { Landmark, Send } from 'lucide-react';
import React, { useState } from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-[#000e27] text-white border-t border-[#1e293b]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-8 py-12 max-w-[1440px] mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-amber-500" />
            <span className="font-sans font-bold text-lg md:text-xl text-[#d7e4f0] tracking-tight">
              CapabilityPro SA
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            Empowering South African SMEs with world-class capability statements, eTenders compliance mapping, and AI-driven document automation tools.
          </p>
        </div>

        <div>
          <h4 className="font-sans font-semibold text-[#d7e4f0] mb-4 text-xs tracking-wider uppercase">
            GOVERNMENT LINKS
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400 font-sans">
            <li>
              <a 
                href="https://www.treasury.gov.za" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white hover:underline transition-colors block"
              >
                National Treasury
              </a>
            </li>
            <li>
              <a 
                href="https://www.etenders.gov.za" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white hover:underline transition-colors block"
              >
                eTenders Portal
              </a>
            </li>
            <li>
              <a 
                href="https://secure.csd.gov.za" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white hover:underline transition-colors block"
              >
                CSD Registration Check
              </a>
            </li>
            <li>
              <a 
                href="https://www.cidb.org.za" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-white hover:underline transition-colors block"
              >
                CIDB Contractor Register
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-semibold text-[#d7e4f0] mb-4 text-xs tracking-wider uppercase">
            LEGAL & COMPLIANCE
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-400 font-sans">
            <li>
              <button 
                onClick={() => onNavigate('about')}
                className="hover:text-amber-400 hover:underline text-left block text-amber-500 font-semibold"
                id="footer-about-link"
              >
                About Capability Pro SA
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('workspace')}
                className="hover:text-amber-400 hover:underline text-left block text-amber-500 font-semibold"
                id="footer-workspace-link"
              >
                Google Workspace Sync
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('admin')}
                className="hover:text-amber-400 hover:underline text-left block text-amber-500 font-semibold font-sans"
                id="footer-admin-link"
              >
                🔒 Admin Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => alert("POPIA Disclaimer:\n\nCapabilityPro SA is fully committed to protecting your company's information in compliance with the South African Protection of Personal Information Act (POPIA), Act 4 of 2013.\n\nAll registration numbers, B-BBEE rating details, and corporate past performances are stored safely.")}
                className="hover:text-white hover:underline text-left block"
              >
                POPI Act Compliance
              </button>
            </li>
            <li>
              <button 
                onClick={() => alert("Terms of Service:\n\nOur templates are structured in alignment with typical public procurement parameters set by South African municipal, provincial, and national departments. Document creation does not guarantee bid award.")}
                className="hover:text-white hover:underline text-left block"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button 
                onClick={() => alert("Privacy Shield policy covers local cache storage and private processing chains.")}
                className="hover:text-white hover:underline text-left block"
              >
                Privacy Policy
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans font-semibold text-[#d7e4f0] mb-4 text-xs tracking-wider uppercase">
            PROCUREMENT NEWSLETTER
          </h4>
          <p className="text-sm text-slate-400 mb-4 font-sans">
            Get instant alerts on regional tender briefs, CIDB regulation changes, and B-BBEE compliance bulletins.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-1">
            <input 
              className="bg-white/10 text-white placeholder-slate-400 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0453cd] w-full border border-slate-700 font-sans"
              placeholder="operator@company.co.za" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              className="bg-[#0453cd] hover:bg-[#033ea1] px-3.5 rounded-lg flex items-center justify-center transition-all active:scale-95 text-white"
              title="Subscribe"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-green-400 mt-2 font-sans font-medium">
              Successfully subscribed for weekly tender alerts!
            </p>
          )}
        </div>
      </div>
      
      <div className="border-t border-[#1e293b] py-6 px-4 text-center text-sm text-slate-400 font-sans">
        <p>© 2026 CapabilityPro SA. Supporting South African Enterprises with world-class documentation tools.</p>
      </div>
    </footer>
  );
}
