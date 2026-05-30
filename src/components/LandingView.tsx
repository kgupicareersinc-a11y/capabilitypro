import { motion } from 'motion/react';
import { Gavel, Brain, Bolt, FileDown, Sparkles, Award, Quote, Check, ArrowRight } from 'lucide-react';

interface LandingViewProps {
  onStartFree: () => void;
  onViewSample: () => void;
  onSelectPlan: (plan: string) => void;
}

export default function LandingView({ onStartFree, onViewSample, onSelectPlan }: LandingViewProps) {
  return (
    <div className="w-full bg-[#f6faff] text-[#111d25]" id="landing-view-root">
      
      {/* Hero Section */}
      <section className="relative min-h-[680px] flex items-center overflow-hidden bg-gradient-to-br from-[#eaf5ff] to-[#ddeaf5] pt-12">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7oznba-PEwaa1Auw3OevAIfk3cOkW0pSoaQz0hC-vDbxwQ2CZvwtsdCXR6LwsnKX7liGZEkJIDb4Gkwin0zup9ZkTzlW_JKlvshUWBmqadEZT2H5ZUzzoI_ZsMpwHQ9WQ8HOhA8c4UV5R9mY2M56EnGO-u878twf7Ot5tznYmeyeLg294JpckqH31fXt9UmgJb6QkLfIn4ed2fBTPL0uncOyJFHsjGTHzNh3rt3RZI-Wjd97IdA2UgcVCCyM7wOMIC17--HOmcw"
            alt="Sandton high-rise modern building representing sovereign trust and South African corporate excellence"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Hero container */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          <div className="space-y-6 text-left">
            <span className="inline-block px-4 py-1 bg-[#356ee7] text-white text-xs font-bold tracking-widest rounded-full uppercase">
              GOVERNMENT-READY DOCUMENTS
            </span>
            <h1 className="font-sans font-extrabold text-4xl lg:text-5xl text-[#000e27] leading-tight tracking-tight">
              Create Professional Capability Statements in Minutes
            </h1>
            <p className="font-sans text-base md:text-lg text-slate-700 max-w-xl leading-relaxed">
              Win more state and corporate tenders with AI-powered, compliant capability statements tailored for South African SMEs and strict government requirements.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onStartFree}
                className="bg-[#000e27] text-white hover:bg-slate-800 px-8 py-4 rounded-xl font-sans font-bold text-base md:text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 border-b-[3px] border-[#a88642]"
                id="hero-start-free-btn"
              >
                Start Free
              </button>
              <button 
                onClick={onViewSample}
                className="bg-white border border-slate-300 px-8 py-4 rounded-xl font-sans font-bold text-[#000e27] text-base md:text-lg hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                id="hero-view-sample-btn"
              >
                View Sample
              </button>
            </div>
          </div>

          {/* Golden Badge compliance graphic */}
          <div className="hidden md:block">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden max-w-md mx-auto">
              <div className="h-4 w-full bg-[#000e27] mb-6 rounded-lg pointer-events-none"></div>
              <div className="space-y-4">
                <div className="h-6 w-1/3 bg-slate-100 rounded-md"></div>
                <div className="h-4 w-full bg-slate-50 rounded-md"></div>
                <div className="h-4 w-5/6 bg-slate-50 rounded-md"></div>
                
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="h-20 bg-emerald-50 rounded-xl flex flex-col items-center justify-center border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 font-sans">CSD</span>
                    <span className="text-[10px] text-emerald-600 font-mono mt-1">VERIFIED</span>
                  </div>
                  <div className="h-20 bg-[#dae2ff] rounded-xl flex flex-col items-center justify-center border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-800 font-sans">B-BBEE</span>
                    <span className="text-[10px] text-indigo-600 font-sans mt-1">L1 FOCUS</span>
                  </div>
                  <div className="h-20 bg-[#ffdea5]/30 rounded-xl flex flex-col items-center justify-center border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 font-sans">TREASURY</span>
                    <span className="text-[10px] text-amber-600 font-sans mt-1">COMPLIANT</span>
                  </div>
                </div>
              </div>

              {/* Decorative gold vector */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rotate-45 transform translate-x-12 -translate-y-12"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why CapabilityPro? Bento Grid */}
      <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto text-center">
        <div className="mb-12 max-w-2xl mx-auto space-y-2">
          <h2 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27]">
            Why CapabilityPro?
          </h2>
          <p className="text-slate-600 font-sans text-sm md:text-base">
            Engineered meticulously for the unique regulatory and commercial demands of South African enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bento Box 1 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gavel className="h-6 w-6 text-[#0453cd]" />
              </div>
              <h3 className="font-sans font-bold text-xl text-[#000e27] mb-3">
                Government-Ready
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Fully aligned with the National Treasury regulations, SANS codes, and eTenders specifications. Our automated formats protect you against administrative rejection from day one.
              </p>
            </div>
          </div>

          {/* Bento Box 2: Premium highlighted box */}
          <div className="bg-[#000e27] text-white p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-left relative overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="font-sans font-bold text-xl text-white mb-3">
                AI-Powered Efficiency
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                Our fine-tuned generative intelligence drafts high-impact project descriptions and optimized company overviews directly from your basic CSD and registration records in seconds.
              </p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16 pointer-events-none"></div>
          </div>

          {/* Bento Box 3 */}
          <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bolt className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-sans font-bold text-xl text-[#000e27] mb-3">
                Unmatched Speed
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                Convert hours of expensive, stressful proposal writing into a streamlined 5-minute task. Focus strictly on executing physical contracts while we format the paperwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Enterprise Features - Zebra Table Style */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27]">
              Core Enterprise Features
            </h2>
            <p className="text-slate-600 font-sans text-sm md:text-base">
              Everything in place to satisfy corporate boards and state evaluators.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-xl shadow-sm">
            {/* Header row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-[#000e27] text-white p-4 text-xs font-bold tracking-wider uppercase font-sans">
              <div>FEATURE</div>
              <div className="hidden md:block">DESCRIPTION</div>
              <div className="hidden lg:block">BENEFIT</div>
              <div className="hidden lg:block text-right">STATUS</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-5 items-center border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors font-sans">
              <div className="font-bold text-base text-[#000e27] flex items-center gap-2">
                <FileDown className="h-5 w-5 text-[#0453cd]" />
                Multi-Format Export
              </div>
              <div className="text-sm text-slate-600 md:pr-4">
                Download instantly in high-impact PDF or fully editable Microsoft Word structures.
              </div>
              <div className="text-sm text-slate-600 hidden lg:block">
                Tender-ready dossiers without manual re-typing.
              </div>
              <div className="hidden lg:flex justify-end">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-5 items-center border-b border-slate-200 hover:bg-slate-50 transition-colors font-sans">
              <div className="font-bold text-base text-[#000e27] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#0453cd]" />
                AI Content Engine
              </div>
              <div className="text-sm text-slate-600 md:pr-4">
                High-density professional write-ups mapping individual services to state databases.
              </div>
              <div className="text-sm text-slate-600 hidden lg:block">
                Increases administrative score weight by up to 35%.
              </div>
              <div className="hidden lg:flex justify-end">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-5 items-center hover:bg-slate-50 transition-colors font-sans">
              <div className="font-bold text-base text-[#000e27] flex items-center gap-2">
                <Award className="h-5 w-5 text-[#0453cd]" />
                B-BBEE Focus
              </div>
              <div className="text-sm text-slate-600 md:pr-4">
                Dedicated highlighting of ownership parameters, skills transfer models, and localized suppliers.
              </div>
              <div className="text-sm text-slate-600 hidden lg:block">
                Maximized visualization of scorecards & target demographics.
              </div>
              <div className="hidden lg:flex justify-end">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  LIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
        <h2 className="font-sans font-bold text-3xl md:text-4xl text-[#000e27] mb-12 text-left">
          Trusted by SA Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="bg-slate-50 border-l-4 border-[#0453cd] p-8 rounded-r-xl relative shadow-sm">
            <Quote className="absolute top-4 right-4 h-8 w-8 text-[#0453cd]/15" />
            <p className="font-sans text-[#111d25] italic text-base md:text-lg mb-6 leading-relaxed">
              "CapabilityPro transformed how we respond to municipal tenders. The AI-generated content is articulate, authoritative, and perfectly suited for the South African procurement landscape."
            </p>
            <div>
              <p className="font-sans font-bold text-[#000e27] text-base">Lerato Moloi</p>
              <p className="font-sans text-xs font-bold text-[#0453cd] uppercase tracking-wider mt-1">
                Director, LTM Civil Engineering
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 border-l-4 border-amber-500 p-8 rounded-r-xl relative shadow-sm">
            <Quote className="absolute top-4 right-4 h-8 w-8 text-amber-500/15" />
            <p className="font-sans text-[#111d25] italic text-base md:text-lg mb-6 leading-relaxed">
              "The B-BBEE integration is brilliant. It highlighted our operational credentials in a way that actually caught the evaluator's attention. We've seen a 40% increase in shortlistings."
            </p>
            <div>
              <p className="font-sans font-bold text-[#000e27] text-base">Thabo Mbeki</p>
              <p className="font-sans text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">
                CEO, TechFrontier Solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="py-20 bg-[#000e27] text-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-300 font-sans text-sm md:text-base">
              Start building compliant portfolios for free and upgrade as your submission queue grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
            
            {/* SME Lite */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between text-left">
              <div>
                <h3 className="font-sans font-bold text-xl text-white">SME Lite</h3>
                <p className="font-sans font-extrabold text-4xl text-white my-6">Free</p>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <ul className="space-y-4 font-sans text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>1 Compliance Statement</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Basic PDF Export</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Standard South African Templates</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('SME Lite')}
                className="w-full mt-8 border border-white/20 hover:bg-white/5 py-3 rounded-xl font-sans font-bold text-sm text-center transition-all active:scale-95 text-white"
                id="plan-free-btn"
              >
                Select Plan
              </button>
            </div>

            {/* Enterprise Pro */}
            <div className="bg-white/10 border-2 border-[#ffdea5] p-8 rounded-2xl flex flex-col justify-between text-left relative transform scale-100 lg:scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#ffdea5] text-[#000e27] text-[10px] tracking-widest font-extrabold px-4 py-1.5 rounded-full font-sans shadow-md">
                MOST POPULAR
              </div>
              <div>
                <h3 className="font-sans font-bold text-xl text-white">Enterprise Pro</h3>
                <p className="font-sans font-extrabold text-4xl text-[#ffdea5] my-6">
                  R299<span className="text-sm font-semibold text-slate-300">/mo</span>
                </p>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <ul className="space-y-4 font-sans text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold">Unlimited Statements & Resubmissions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Gemini AI Copywriting Engine Assist</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Microsoft Word (Editable) & PDF Exports</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Custom Brand Layout Integration</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('Enterprise Pro')}
                className="w-full mt-8 bg-[#ffdea5] hover:bg-[#ffeac5] text-[#000e27] py-4 rounded-xl font-sans font-bold text-sm text-center shadow-lg transition-all active:scale-95"
                id="plan-pro-btn"
              >
                Start Pro Trial
              </button>
            </div>

            {/* Corporate */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between text-left">
              <div>
                <h3 className="font-sans font-bold text-xl text-white">Corporate</h3>
                <p className="font-sans font-extrabold text-4xl text-white my-6">
                  R899<span className="text-sm font-semibold text-slate-300">/mo</span>
                </p>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <ul className="space-y-4 font-sans text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>Multi-User Regional Team Channels</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold">Professional Tender Strategy Reviews</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <span>API Integrations & Custom Templates</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => onSelectPlan('Corporate')}
                className="w-full mt-8 border border-white/20 hover:bg-white/5 py-3 rounded-xl font-sans font-bold text-sm text-center transition-all active:scale-95 text-white"
                id="plan-corporate-btn"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
