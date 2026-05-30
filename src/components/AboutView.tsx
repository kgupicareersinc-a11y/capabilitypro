import { motion } from 'motion/react';
import { 
  Building2, 
  Target, 
  Sparkles, 
  Award, 
  MapPin, 
  Mail, 
  Globe, 
  Quote, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Check, 
  ChevronsRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface AboutViewProps {
  onStartFree: () => void;
}

export default function AboutView({ onStartFree }: AboutViewProps) {
  const marketingPlaces = [
    "Government Portals (CSD, municipal databases)",
    "Bids and Proposals (RFPs, RFQs)",
    "Capability Briefings with procurement officers",
    "Networking events and industry conferences",
    "Corporate introductions and emails",
    "Your website's B2B landing page",
    "Email signatures (passive discovery)",
    "Direct mail campaigns",
    "LinkedIn lead generation",
    "Partner and supplier vetting"
  ];

  const valueProps = [
    {
      challenge: "Tenders lost due to weak first impressions",
      solution: "Professionally structured capability statements that procurement officers actually read"
    },
    {
      challenge: "Generic profiles that don't differentiate",
      solution: "Targeted messaging aligned to your specific audience (government, corporate, or subcontractor)"
    },
    {
      challenge: "No clear 'past performance' section",
      solution: "We help you articulate results, not just duties"
    },
    {
      challenge: "Wasted time on incorrect formatting",
      solution: "CSD-compliant and RFP-ready documents"
    },
    {
      challenge: "Low response from cold outreach",
      solution: "High-impact PDFs designed for email and LinkedIn"
    }
  ];

  const industries = [
    "Construction and civil engineering",
    "IT and software development",
    "Security and cleaning services",
    "Logistics and supply chain",
    "Professional services (consulting, training, HR)",
    "Manufacturing and procurement",
    "Non-profits seeking government grants"
  ];

  const trackRecords = [
    "Helped 50+ South African SMEs register confidently on the CSD",
    "Assisted businesses in winning over R200 million in combined tender value",
    "Reduced procurement rejection rates by an average of 40% for repeat clients",
    "Trusted by prime contractors to prepare subcontractor capability packages"
  ];

  return (
    <div className="w-full pb-16 pt-6">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#000e27] via-[#001b44] to-[#0453cd] text-white py-16 md:py-24 px-4 md:px-8 text-center" id="about-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.08),transparent)] pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            ABOUT CAPABILITY PRO SA
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight"
          >
            Your Strategic Edge in Government &amp; Corporate Bidding
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-sans text-slate-200 text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            A specialized South African marketing and documentation firm dedicated to helping businesses win tenders, secure corporate partnerships, and build unshakable B2B trust.
          </motion.p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Content */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Who We Are Module */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100" id="about-who-we-are">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0453cd]/10 flex items-center justify-center text-[#0453cd]">
                <Building2 className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-bold text-2xl text-[#000e27]">Who We Are</h2>
            </div>
            
            <div className="space-y-4 text-slate-600 font-sans leading-relaxed text-sm md:text-base">
              <p>
                <strong>Capability Pro SA</strong> is a specialized marketing and documentation firm dedicated to helping South African businesses win government tenders, secure corporate partnerships, and build unshakable B2B trust.
              </p>
              <p>
                We understand that in high-stakes procurement environments—from the Central Supplier Database (CSD) to corporate vendor onboarding—a generic company profile is not enough. Decision-makers need proof. They need clarity. They need a capability statement.
              </p>
              <div className="p-4 bg-amber-50 rounded-2xl border-l-4 border-amber-500 font-medium text-slate-800 text-sm">
                "That is all we do. And we do it exceptionally well."
              </div>
            </div>
          </section>

          {/* What We Do & Top 10 Places */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100" id="about-what-we-do">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                <Target className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-bold text-2xl text-[#000e27]">What We Do</h2>
            </div>

            <p className="text-slate-600 font-sans leading-relaxed text-sm md:text-base mb-6">
              We design concise, highly targeted capability statements that transform how you present your core competencies, past performance, and competitive differentiators.
            </p>

            <h3 className="font-sans font-bold text-[#000e27] text-md mb-4 uppercase tracking-wider text-xs">
              ENGINEERED FOR THE TOP 10 PLACES WHERE BUSINESS RELATIONSHIPS ARE WON:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {marketingPlaces.map((place, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-sans text-xs md:text-sm font-medium text-slate-700">{place}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us Challenges Table */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100" id="about-why-choose-us">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="font-sans font-bold text-2xl text-[#000e27]">Why South African Businesses Choose Us</h2>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#000e27] text-white text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold font-sans w-1/3">Challenge</th>
                    <th className="p-4 font-semibold font-sans">Our Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                  {valueProps.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-[#000e27] bg-slate-50/35 align-top">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{item.challenge}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-sans">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.solution}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How We Help */}
          <section className="bg-gradient-to-br from-slate-550 to-slate-50 bg-[#f8fafc] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200" id="about-how-we-help">
            <h2 className="font-sans font-bold text-2xl text-[#000e27] mb-3">How We Help You Get More Business</h2>
            <p className="text-sm md:text-base text-slate-600 mb-6 font-sans">
              When you use Capability Pro SA, you stop introducing your business—and start proving it.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#000e27]">Tailored Positioning</h4>
                  <p className="text-xs text-slate-500 mt-1">We tailor every statement to the specific audience you are pitching.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#000e27]">Eliminate the Fluff</h4>
                  <p className="text-xs text-slate-500 mt-1">We eliminate fluff so procurement officers see your value in under 60 seconds.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#000e27]">Scalable Formats</h4>
                  <p className="text-xs text-slate-500 mt-1">We provide editable, scalable templates so you can adapt for different tenders without starting from scratch.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-3">
                <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-[#000e27]">Strategic Deployment</h4>
                  <p className="text-xs text-slate-500 mt-1">We educate your team on where and how to deploy each version for maximum ROI.</p>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right 1 Col: Sidebar Info & Track Records */}
        <div className="space-y-8">
          
          {/* Quick Metrics Track Record */}
          <div className="bg-gradient-to-tr from-[#000e27] to-[#0a2342] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden" id="about-track-record">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-12 -translate-y-12" />
            <div className="relative">
              <div className="inline-flex p-2.5 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-400 mb-4">
                <TrendingUp className="h-5 w-5 animate-pulse" />
              </div>
              <h3 className="font-sans font-extrabold text-xl text-white mb-2">Our Track Record</h3>
              <p className="text-xs text-slate-300 font-sans mb-6">Proven performance backing South African innovators &amp; suppliers.</p>

              <div className="space-y-4">
                {trackRecords.map((track, i) => (
                  <div key={i} className="flex gap-2 text-xs font-sans items-start leading-relaxed border-b border-white/5 pb-3">
                    <ChevronsRight className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{track}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Industries served */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100" id="about-industries-served">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-[#0453cd]" />
              <h3 className="font-sans font-bold text-[#000e27] text-md">Industries We Serve</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">We work across multiple high-stakes sectors, including:</p>
            <div className="space-y-2">
              {industries.map((ind, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0453cd]" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic text-center mt-4">
              No matter your industry, if you sell B2B or bid for tenders, you need a capability statement.
            </p>
          </div>

          {/* Contact & Free Assessment Card */}
          <div className="bg-amber-50 rounded-3xl p-6 md:p-8 border border-amber-200/50" id="about-contact-info">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h3 className="font-sans font-extrabold text-[#000e27] text-lg">Stop Introducing. Start Proving.</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-6">
              Contact us for a free 15-minute tender-readiness assessment or download a sample capability statement.
            </p>

            <div className="space-y-3.5 text-xs text-slate-800">
              <a href="mailto:hello@capabilityprosa.co.za" className="flex items-center gap-3 hover:text-[#0453cd] hover:underline transition-all">
                <div className="p-2 bg-white rounded-lg border border-amber-200 text-amber-600">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <strong>hello@capabilityprosa.co.za</strong>
              </a>

              <a href="https://www.capabilityprosa.co.za" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#0453cd] hover:underline transition-all">
                <div className="p-2 bg-white rounded-lg border border-amber-200 text-amber-600">
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <strong>www.capabilityprosa.co.za</strong>
              </a>

              <div className="flex items-center gap-3 text-slate-600">
                <div className="p-2 bg-white rounded-lg border border-amber-200 text-amber-600">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span>South Africa (virtual, serving all provinces)</span>
              </div>
            </div>

            <button 
              onClick={onStartFree}
              className="mt-6 w-full py-2.5 bg-[#000e27] hover:bg-slate-800 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-sm"
            >
              Get Free Assessment
            </button>
          </div>

        </div>
      </div>

      {/* Testimonials Quote */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 mb-6" id="about-quote">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative shadow-sm">
          <div className="p-4 bg-amber-500/10 text-amber-600 rounded-2xl shrink-0">
            <Quote className="h-6 w-6" />
          </div>
          <div>
            <blockquote className="text-slate-700 italic font-sans text-sm md:text-base leading-relaxed">
              “Capability Pro SA didn’t just give us a document—they gave us a strategy. We now know exactly where to use our capability statement and how to tailor it for each opportunity.”
            </blockquote>
            <cite className="block text-xs font-bold text-[#000e27] mt-3 not-italic">
              — Thabo M., Director, Gauteng-based construction firm
            </cite>
          </div>
        </div>
      </section>

    </div>
  );
}
