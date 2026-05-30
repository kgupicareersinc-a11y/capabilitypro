import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, ArrowRight, ArrowLeft, Plus, Trash, Printer, FileEdit, Clipboard, CheckCircle, Eye, RefreshCw, Layers } from 'lucide-react';
import { CapabilityStatement, TemplateId, ProjectPerformance } from '../types';
import { TEMPLATES_CONFIG } from '../initialData';

interface GeneratorViewProps {
  initialStatement?: CapabilityStatement | null;
  onSave: (statement: CapabilityStatement) => void;
  onCancel: () => void;
}

export default function GeneratorView({ initialStatement, onSave, onCancel }: GeneratorViewProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialStatement?.title || 'New South African Tender Statement');
  const [templateId, setTemplateId] = useState<TemplateId>(initialStatement?.templateId || 'corporate');

  // Form Fields
  const [companyName, setCompanyName] = useState(initialStatement?.companyName || '');
  const [registrationNumber, setRegistrationNumber] = useState(initialStatement?.registrationNumber || '');
  const [bbbeeLevel, setBbbeeLevel] = useState(initialStatement?.bbbeeLevel || '1');
  const [overview, setOverview] = useState(initialStatement?.overview || '');
  const [csdNumber, setCsdNumber] = useState(initialStatement?.csdNumber || '');
  const [cidbGrade, setCidbGrade] = useState(initialStatement?.cidbGrade || 'Not Applicable');
  const [contactEmail, setContactEmail] = useState(initialStatement?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(initialStatement?.contactPhone || '');
  const [physicalAddress, setPhysicalAddress] = useState(initialStatement?.physicalAddress || '');

  // Core Competencies Lists
  const [services, setServices] = useState<string[]>(initialStatement?.services || []);
  const [newService, setNewService] = useState('');
  
  const [differentiators, setDifferentiators] = useState<string[]>(initialStatement?.differentiators || []);
  const [newDifferentiator, setNewDifferentiator] = useState('');

  const [certifications, setCertifications] = useState<string[]>(initialStatement?.certifications || []);
  const [newCertification, setNewCertification] = useState('');

  // Past Performance List
  const [pastPerformance, setPastPerformance] = useState<ProjectPerformance[]>(initialStatement?.pastPerformance || []);
  const [editingProject, setEditingProject] = useState<Partial<ProjectPerformance> | null>(null);

  // AI Loading & Success Metrics
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingCompetencies, setLoadingCompetencies] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Load template specific styling presets
  const activeTemplate = TEMPLATES_CONFIG.find(t => t.id === templateId) || TEMPLATES_CONFIG[0];

  // Past Performance dynamic handlers
  const handleAddProject = () => {
    if (!editingProject?.projectName || !editingProject?.client) {
      alert("Please specify at least Project Name and Client.");
      return;
    }
    const newProj: ProjectPerformance = {
      id: editingProject.id || `perf-${Date.now()}`,
      projectName: editingProject.projectName,
      client: editingProject.client,
      value: Number(editingProject.value) || 0,
      year: Number(editingProject.year) || new Date().getFullYear(),
      status: editingProject.status || 'completed',
      description: editingProject.description || ''
    };

    if (editingProject.id) {
      // Edit mode
      setPastPerformance(pastPerformance.map(p => p.id === editingProject.id ? newProj : p));
    } else {
      // Create mode
      setPastPerformance([...pastPerformance, newProj]);
    }

    setEditingProject(null); // Reset
  };

  const handleEditProjectInline = (proj: ProjectPerformance) => {
    setEditingProject({ ...proj });
  };

  const handleDeleteProject = (id: string) => {
    setPastPerformance(pastPerformance.filter(p => p.id !== id));
  };

  // AI Assist: Overview Rewrite
  const handleAiOverview = async () => {
    setLoadingOverview(true);
    try {
      const response = await fetch('/api/gemini/improve-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          registrationNumber,
          bbbeeLevel,
          currentOverview: overview,
          industry: services[0] || 'SME sector'
        })
      });
      const data = await response.json();
      if (data.success) {
        setOverview(data.text);
      } else {
        alert("AI Rewrite error. Active template fallback applied instead.");
      }
    } catch {
      alert("Error contacting rewrite server. Check network or key config.");
    } finally {
      setLoadingOverview(false);
    }
  };

  // AI Assist: Services Autopilot suggestion
  const handleAiCompetencies = async () => {
    setLoadingCompetencies(true);
    try {
      const response = await fetch('/api/gemini/generate-competencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industry: cidbGrade !== "Not Applicable" ? "Construction" : "Services",
          coreServices: services.join(', ') || 'Custom corporate operations'
        })
      });
      const data = await response.json();
      if (data.success && data.competencies) {
        setServices([...new Set([...services, ...data.competencies])]);
      } else {
        alert("Services AI assist failed to respond.");
      }
    } catch {
      alert("Error contacting competencies server.");
    } finally {
      setLoadingCompetencies(false);
    }
  };

  // Document Compilation export save
  const handleFinalSave = () => {
    const finalStatement: CapabilityStatement = {
      id: initialStatement?.id || `stmt-${Date.now()}`,
      title,
      templateId,
      companyName: companyName || 'unnamed SME',
      registrationNumber,
      bbbeeLevel,
      overview,
      csdNumber,
      cidbGrade,
      contactEmail,
      contactPhone,
      physicalAddress,
      services,
      differentiators,
      certifications,
      pastPerformance,
      lastEdited: new Date().toISOString().split('T')[0]
    };
    onSave(finalStatement);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to compile print statement.");
      return;
    }

    const compiledHtml = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;600&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; margin: 0; line-height: 1.6; }
            h1, h2, h3 { font-family: 'Montserrat', sans-serif; color: #0f172a; }
            .header-banner { border-bottom: 4px solid #a88642; padding-bottom: 20px; margin-bottom: 40px; }
            .meta-details { display: grid; grid-cols: 2; font-size: 13px; color: #475569; margin-bottom: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
            .section { margin-bottom: 35px; }
            .section-title { font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
            .bullet-list { margin: 0; padding-left: 20px; }
            .bullet-list li { margin-bottom: 8px; }
            .project-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .project-table th { background: #0f172a; color: white; padding: 10px; font-size: 12px; font-weight: bold; text-align: left; }
            .project-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            .footer { margin-top: 60px; font-size: 11px; text-align: center; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1 style="margin: 0 0 10px 0; font-size: 28px;">${companyName || 'SME ENTERPRISE'}</h1>
            <p style="margin: 0; font-size: 16px; color: #475569; font-weight: 600;">CAPABILITY STATEMENT</p>
          </div>

          <div class="meta-details">
            <div>
              <strong>CIPC Registration:</strong> ${registrationNumber || 'Not registered'}<br>
              <strong>B-BBEE Status:</strong> Level ${bbbeeLevel} Contributor<br>
              <strong>CSD Number:</strong> ${csdNumber || 'Pending'}
            </div>
            <div style="margin-top: 10px;">
              <strong>CIDB Grade:</strong> ${cidbGrade}<br>
              <strong>Email:</strong> ${contactEmail || 'Not listed'}<br>
              <strong>Phone:</strong> ${contactPhone || 'Not listed'}<br>
              <strong>Address:</strong> ${physicalAddress || 'Not listed'}
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Corporate Overview</h2>
            <p style="font-size: 14px; text-align: justify; margin: 0;">${overview || 'Please configure overview description.'}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Core Competencies</h2>
            <ul class="bullet-list">
              ${services.map(s => `<li style="font-size: 14px;">${s}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <h2 class="section-title">Key Differentiators</h2>
            <ul class="bullet-list">
              ${differentiators.map(d => `<li style="font-size: 14px;">${d}</li>`).join('')}
            </ul>
          </div>

          ${certifications.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Certifications & Standards</h2>
            <ul class="bullet-list">
              ${certifications.map(c => `<li style="font-size: 14px;">${c}</li>`).join('')}
            </ul>
          </div>` : ''}

          <div class="section">
            <h2 class="section-title">Past Performance & Reference Works</h2>
            <table class="project-table">
              <thead>
                <tr>
                  <th>PROJECT NAME</th>
                  <th>CLIENT / DEPT</th>
                  <th>VALUE (ZAR)</th>
                  <th>YEAR</th>
                  <th>DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                ${pastPerformance.map(p => `
                  <tr>
                    <td><strong>${p.projectName}</strong></td>
                    <td>${p.client}</td>
                    <td>R ${p.value.toLocaleString('en-ZA')}</td>
                    <td>${p.year}</td>
                    <td>${p.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            Compiled via CapabilityPro SA of South Africa. Approved CSD procurement dossier format.
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(compiledHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 1000);
  };

  const copyToClipboard = () => {
    const rawStructure = `
======== CAPABILITY STATEMENT: ${companyName} ========
CIPC Number: ${registrationNumber}
B-BBEE Status: Level ${bbbeeLevel}
CSD MAAA No: ${csdNumber}
CIDB Rating: ${cidbGrade}

OVERVIEW:
${overview}

PRIMARY COMPETENCIES:
${services.map((s, i) => `${i + 1}. ${s}`).join('\n')}

DIFFERENTIATORS:
${differentiators.map((d, i) => `- ${d}`).join('\n')}

PAST PROJECTS:
${pastPerformance.map((p, i) => `${i + 1}. ${p.projectName} | Client: ${p.client} | Value: R${p.value}`).join('\n')}
    `;

    navigator.clipboard.writeText(rawStructure.trim());
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="w-full bg-[#f6faff] min-h-screen pt-4 pb-20 px-4 md:px-8 max-w-[1440px] mx-auto" id="generator-root">
      
      {/* Title block */}
      <section className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono">STEP-BY-STEP BID PREPARATION</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold bg-[#000e27] text-white px-2 py-0.5 rounded font-mono">REG</span>
            <input 
              type="text" 
              className="font-sans font-bold text-xl md:text-2xl text-[#000e27] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#0453cd] focus:outline-none transition-all py-0.5 w-[320px] md:w-[480px]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-sans font-bold text-[#111d25] text-sm active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleFinalSave}
            className="px-5 py-2 bg-[#0453cd] hover:bg-[#033ea1] text-white rounded-xl font-sans font-bold text-sm active:scale-95 transition-all"
          >
            Save Progress
          </button>
        </div>
      </section>

      {/* Steps indicator bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-3 text-left">
          <h2 className="font-sans font-extrabold text-[#000e27] text-lg lg:text-xl">
            {step === 1 && "Step 1 of 4: Company Identification"}
            {step === 2 && "Step 2 of 4: Core Services & Strengths"}
            {step === 3 && "Step 3 of 4: Projects & Reference Performance"}
            {step === 4 && "Step 4 of 4: Template Theme & Compilation"}
          </h2>
          <span className="font-sans font-bold text-sm text-[slate-500] bg-slate-100 px-3 py-1 rounded-full">
            Step {step} of 4
          </span>
        </div>
        
        {/* Dynamic progress indicators */}
        <div className="flex gap-2 w-full h-2">
          {[1, 2, 3, 4].map(sKey => (
            <div 
              key={sKey}
              onClick={() => setStep(sKey)}
              className={`flex-1 rounded-full cursor-pointer transition-all ${
                sKey <= step ? 'bg-[#0453cd]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2.5 text-[11px] font-sans font-bold text-slate-500 uppercase tracking-widest">
          <span className={step === 1 ? 'text-[#0453cd]' : ''}>1. Company ID</span>
          <span className={step === 2 ? 'text-[#0453cd]' : ''}>2. Core Competencies</span>
          <span className={step === 3 ? 'text-[#0453cd]' : ''}>3. Reference Works</span>
          <span className={step === 4 ? 'text-[#0453cd]' : ''}>4. Export Suite</span>
        </div>
      </div>

      {/* Asymmetric layout bento form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Primary input workspace card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          
          {/* STEP 1 workspace view */}
          {step === 1 && (
            <div className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
              <div className="bg-[#000e27]/5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-6 border-b border-slate-200">
                <h3 className="font-sans font-bold text-base text-[#000e27]">Company Identification Details</h3>
                <p className="text-xs text-slate-500 font-sans mt-1">Please enter foundational metrics exactly matching CIPC and CSD registers to avoid bid disqualification.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">COMPANY REGISTERED NAME <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. Acme Civil Works SA"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                {/* Reg No */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">CIPC REGISTRATION NUMBER</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="2018/039481/07"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                  />
                </div>

                {/* CSD number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">CSD MAAA NUMBER (CSD REGISTERED)</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. MAAA0593821"
                    value={csdNumber}
                    onChange={(e) => setCsdNumber(e.target.value)}
                  />
                </div>

                {/* CIDB Grade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">CIDB GRADING LEVEL</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. 6CE, 7GB, Not Applicable"
                    value={cidbGrade}
                    onChange={(e) => setCidbGrade(e.target.value)}
                  />
                </div>
              </div>

              {/* BBBEE select dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-sans text-slate-600 block uppercase font-sans">B-BBEE CONTRIBUTION STATUS LEVEL</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  value={bbbeeLevel}
                  onChange={(e) => setBbbeeLevel(e.target.value)}
                >
                  <option value="1">Level 1 Contributor (135% Procurement Recog. - High Priority)</option>
                  <option value="2">Level 2 Contributor (125% Procurement Recog.)</option>
                  <option value="3">Level 3 Contributor (110% Procurement Recog.)</option>
                  <option value="4">Level 4 Contributor (100% Procurement Recog.)</option>
                  <option value="non">Non-Compliant Status Contributor</option>
                </select>
              </div>

              {/* Company overview text */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">COMPANY EXECUTIVE OVERVIEW</label>
                  <button 
                    type="button"
                    onClick={handleAiOverview}
                    disabled={loadingOverview}
                    className="text-xs font-bold font-sans text-[#0453cd] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {loadingOverview ? <RefreshCw className="animate-spin h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {loadingOverview ? 'Generating overview...' : 'AI Assist Write overview'}
                  </button>
                </div>
                <textarea 
                  rows={6}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm resize-none transition-all"
                  placeholder="Provide a comprehensive profile including mission, expertise, regions, and core offerings..."
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 font-sans">Maximum 250 words. This forms the introductory column of your statement deck.</p>
              </div>

              {/* Contacts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">CONTACT PORT EMAIL</label>
                  <input 
                    type="email"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="tender@ltmcivil.co.za"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">CONTACT TELEPHONE</label>
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="+27 (0) 11 829 0319"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Physical address text */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold font-sans text-slate-600 block uppercase">HEAD OFFICE PHYSICAL ADDRESS</label>
                <input 
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                  placeholder="Gate 1A, Sandton Executive Gateway, Johannesburg"
                  value={physicalAddress}
                  onChange={(e) => setPhysicalAddress(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2 workspace view */}
          {step === 2 && (
            <div className="p-6 md:p-8 space-y-8 animate-fade-in text-left">
              
              <div className="bg-[#000e27]/5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-sans font-bold text-base text-[#000e27]">Core Capabilities & Strengths</h3>
                    <p className="text-xs text-slate-500 font-sans mt-1">Specify core competencies and key discriminators justifying tender award.</p>
                  </div>
                  <button 
                    onClick={handleAiCompetencies}
                    disabled={loadingCompetencies}
                    className="bg-[#000e27] hover:bg-slate-800 text-white font-sans font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {loadingCompetencies ? <RefreshCw className="animate-spin h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5 text-amber-400" />}
                    <span>AI Autocomplete Core Comp</span>
                  </button>
                </div>
              </div>

              {/* Services List Tag Builder */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">
                    1. PRIMARY SERVICES / CORE COMPETENCIES
                  </label>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    List bullet items representing key technical offerings of your enterprise (such as Bulk hauling, high voltage grid planning, etc).
                  </p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. Bulk water reticulation & sub-contract coordination"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newService.trim()) {
                          setServices([...services, newService.trim()]);
                          setNewService('');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newService.trim()) {
                        setServices([...services, newService.trim()]);
                        setNewService('');
                      }
                    }}
                    className="bg-[#000e27] text-white hover:bg-slate-800 px-4 rounded-lg flex items-center justify-center font-bold font-sans text-sm"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Display Services bullets */}
                <div className="space-y-2">
                  {services.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-sm font-sans font-medium text-slate-700">📌 {item}</span>
                      <button 
                        onClick={() => setServices(services.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <p className="text-xs text-slate-400 font-sans italic">No competencies added yet. Click autocomplete or type to add items manually.</p>
                  )}
                </div>
              </div>

              {/* Differentiators builder */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">
                    2. KEY DIFFERENTIATORS (Why choose your enterprise?)
                  </label>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    What makes you unique? (e.g. Level 1 scorecard advantages, indigenous team translation capabilities, or specialized road graders).
                  </p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. Level 1 B-BBEE giving evaluators 135% procurement score"
                    value={newDifferentiator}
                    onChange={(e) => setNewDifferentiator(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newDifferentiator.trim()) {
                          setDifferentiators([...differentiators, newDifferentiator.trim()]);
                          setNewDifferentiator('');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newDifferentiator.trim()) {
                        setDifferentiators([...differentiators, newDifferentiator.trim()]);
                        setNewDifferentiator('');
                      }
                    }}
                    className="bg-[#000e27] text-white hover:bg-slate-800 px-4 rounded-lg flex items-center justify-center font-bold font-sans text-sm"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {differentiators.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-sm font-sans font-medium text-slate-700">⭐️ {item}</span>
                      <button 
                        onClick={() => setDifferentiators(differentiators.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications builder */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold font-sans text-slate-600 block uppercase">
                    3. CERTIFICATIONS & STANDARDS (Optional)
                  </label>
                  <p className="text-xs text-slate-400 leading-normal font-sans">
                    Any regulatory credentials or compliance ratings? (e.g. SABS ISO 9001, NHBRC, SAICA status).
                  </p>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0453cd]/20 focus:border-[#0453cd] outline-none font-sans text-sm transition-all"
                    placeholder="e.g. SABS Approved ISO 9001:2015"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newCertification.trim()) {
                          setCertifications([...certifications, newCertification.trim()]);
                          setNewCertification('');
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newCertification.trim()) {
                        setCertifications([...certifications, newCertification.trim()]);
                        setNewCertification('');
                      }
                    }}
                    className="bg-[#000e27] text-white hover:bg-slate-800 px-4 rounded-lg flex items-center justify-center font-bold font-sans text-sm"
                  >
                    <Plus className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {certifications.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-sm font-sans font-medium text-slate-700">🏆 {item}</span>
                      <button 
                        onClick={() => setCertifications(certifications.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3 workspace view */}
          {step === 3 && (
            <div className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
              
              <div className="bg-[#000e27]/5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-6 border-b border-slate-200">
                <h3 className="font-sans font-bold text-base text-[#000e27]">Past Reference Performance</h3>
                <p className="text-xs text-slate-500 font-sans mt-1">Evaluators put up to 40% weight on verifiable project records. Document your previous project values and client sign-offs below.</p>
              </div>

              {/* Dynamic Project Editor panel */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-extrabold font-sans text-[#000e27] uppercase tracking-widest block font-sans">
                  {editingProject?.id ? 'Edit Selected Reference Project' : 'Add New Reference Project Record'}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">PROJECT CONTRACT NAME *</label>
                    <input 
                      type="text"
                      className="w-full p-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-[#0453cd] font-sans text-sm"
                      placeholder="e.g. Durban Terminal Decking"
                      value={editingProject?.projectName || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, projectName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">CLIENT / GOVERNMENT DEPT *</label>
                    <input 
                      type="text"
                      className="w-full p-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-[#0453cd] font-sans text-sm"
                      placeholder="e.g. Transnet Ports"
                      value={editingProject?.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">CONTRACT VALUE (ZAR RAND VALUE)</label>
                    <input 
                      type="number"
                      className="w-full p-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-[#0453cd] font-sans text-sm"
                      placeholder="e.g. 5200000"
                      value={editingProject?.value || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, value: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">COMPLETED YEAR</label>
                    <input 
                      type="number"
                      className="w-full p-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-[#0453cd] font-sans text-sm"
                      placeholder="e.g. 2024"
                      value={editingProject?.year || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, year: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">PROJECT DESCRIPTION</label>
                  <textarea 
                    rows={2}
                    className="w-full p-2 bg-white border border-slate-200 rounded focus:outline-none focus:border-[#0453cd] font-sans text-sm resize-none"
                    placeholder="Brief scope summary (earthworks, logistics, materials supply, concrete decking)..."
                    value={editingProject?.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  {editingProject && (
                    <button 
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-1.5 border border-slate-300 rounded text-slate-600 font-sans text-xs cursor-pointer font-bold"
                    >
                      Clear
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => {
                      if (!editingProject) {
                        setEditingProject({});
                      } else {
                        handleAddProject();
                      }
                    }}
                    className="px-5 py-1.5 bg-[#000e27] text-white hover:bg-slate-800 rounded font-sans text-xs font-bold cursor-pointer"
                  >
                    {!editingProject ? 'Draft Project Form' : (editingProject.id ? 'Update Project' : 'Add Project to Performance')}
                  </button>
                </div>
              </div>

              {/* Display Table of reference projects */}
              <div className="overflow-hidden border border-slate-200 rounded-xl">
                <table className="w-full text-left">
                  <thead className="bg-[#000e27] text-white font-sans text-xs tracking-wider uppercase">
                    <tr>
                      <th className="px-4 py-3">PROJECT NAME</th>
                      <th className="px-4 py-3">CLIENT</th>
                      <th className="px-4 py-3">VALUE</th>
                      <th className="px-4 py-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-sm text-slate-700">
                    {pastPerformance.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-[#000e27]">{item.projectName}</td>
                        <td className="px-4 py-3">{item.client}</td>
                        <td className="px-4 py-3 font-mono text-xs">R {item.value.toLocaleString('en-ZA')}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={() => handleEditProjectInline(item)}
                              className="text-slate-500 hover:text-[#0453cd] p-1 rounded hover:bg-slate-100"
                              title="Edit"
                            >
                              <FileEdit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(item.id)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pastPerformance.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-xs text-slate-400 italic">No reference works documented. Fully configured profiles score up to 40% higher weights in National Treasury reviews.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* STEP 4 workspace view */}
          {step === 4 && (
            <div className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
              
              <div className="bg-[#000e27]/5 -mx-6 md:-mx-8 -mt-6 md:-mt-8 p-6 border-b border-slate-200">
                <h3 className="font-sans font-bold text-base text-[#000e27]">Select Document Theme Style</h3>
                <p className="text-xs text-slate-500 font-sans mt-1">Change columns alignment and visual layouts immediately. All text is automatically mapped into the selected grid structure below.</p>
              </div>

              {/* Grid of styles selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {TEMPLATES_CONFIG.map(preset => (
                  <div 
                    key={preset.id}
                    onClick={() => setTemplateId(preset.id as TemplateId)}
                    className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all active:scale-95 flex flex-col justify-between ${
                      templateId === preset.id 
                        ? 'border-[#0453cd] bg-[#eaf5ff]' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-sans font-bold text-sm text-[#000e27]">{preset.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block tracking-wider uppercase">{preset.tagline}</span>
                  </div>
                ))}
              </div>

              {/* Exports Trigger Actions row */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                <button 
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-[#000e27] hover:bg-slate-800 text-white rounded-lg font-sans font-bold text-xs tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save PDF Portfolio
                </button>

                <button 
                  onClick={copyToClipboard}
                  className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-sans font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Clipboard className="h-4 w-4" />
                  {copySuccess ? 'Copied to clipboard!' : 'Copy RAW Dossier Payload'}
                </button>

                <button 
                  onClick={() => alert("Word Document Export:\n\nYour Capability Statement is ready for Microsoft Word (DOCX) export.\n\nSince this is running in a preview environment, a pristine formatted copy-paste text package has been placed on your clipboard instead.")}
                  className="px-5 py-2.5 bg-slate-100 border border-transparent hover:bg-slate-200 text-slate-700 rounded-lg font-sans font-bold text-xs tracking-wider transition-all"
                >
                  Mock Word (DOCX) Export
                </button>
              </div>

              {/* Compilation publishing */}
              <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
                <div>
                  <h4 className="font-sans font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Bid Statement Dossier Compiled successfully!
                  </h4>
                  <p className="text-xs text-emerald-700 font-sans mt-1">Ready to be published into your local CSD-compliant active projects folder.</p>
                </div>
                <button 
                  onClick={handleFinalSave}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-sans font-bold text-sm active:scale-95 transition-all shadow"
                >
                  Publish to Dashboard Location
                </button>
              </div>

            </div>
          )}

          {/* Navigation drawer inside workspace footer */}
          <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
            <button 
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-bold text-[#111d25] hover:text-[#0453cd] flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none font-sans"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Step
            </button>

            {step < 4 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="bg-[#000e27] text-white hover:bg-slate-800 px-6 py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center gap-1 hover:shadow shadow-sm font-sans transition-all active:scale-95"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button 
                onClick={handleFinalSave}
                className="bg-[#0453cd] hover:bg-[#033ea1] text-white px-7 py-3 rounded-lg text-xs font-bold tracking-wider shadow"
              >
                Complete Statement compile
              </button>
            )}
          </div>
        </div>

        {/* Informational Sidebar: Tips & Real-time styling preview representation */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Expert Board guidelines */}
          <div className="bg-[#ddeaf5] p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-2 mb-4 text-[#000e27]">
              <HelpCircle className="h-5.5 w-5.5 text-[#0453cd]" />
              <h4 className="font-sans font-bold text-base">Expert Bid Writing Tips</h4>
            </div>
            <ul className="space-y-4 text-xs font-sans text-slate-700 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-[#0453cd] font-bold">●</span>
                <p>Ensure your <strong>Company Name</strong> matches your official Central Supplier Database (CSD) profile exactly to prevent administrative rejection.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0453cd] font-bold">●</span>
                <p>Your <strong>B-BBEE Level</strong> acts as a primary weighting score. Highlighting a verified Level 1 status yields instant priority review points in SA procurement.</p>
              </li>
              <li className="flex gap-2">
                <span className="text-[#0453cd] font-bold">●</span>
                <p>Verify that referenced project contract values represent correct completed volumes matching past audits.</p>
              </li>
            </ul>
          </div>

          {/* Live mini document preview dashboard */}
          <div className="bg-[#000e27] text-white p-6 rounded-2xl border border-[#00234e] shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Eye className="h-4.5 w-4.5 text-amber-400" />
                  Live Preview Panel
                </h4>
                <span className="text-[10px] font-mono bg-white/10 text-slate-300 px-2 py-0.5 rounded uppercase">
                  {activeTemplate.name}
                </span>
              </div>
              
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                See your tender document format dynamically adapt below as you input metrics in real time.
              </p>

              {/* Document mini design preview representer */}
              <div className={`aspect-[1/1.4] bg-white rounded-xl border-t-[8px] ${activeTemplate.colors.accent} p-4 text-[#111d25] flex flex-col justify-between shadow-lg overflow-hidden`}>
                <div className="space-y-3 shrink-0">
                  {/* Miniature header */}
                  <div className="space-y-1">
                    <div className="font-sans font-bold text-[10px] text-slate-900 tracking-tight uppercase leading-none">
                      {companyName || 'SME Organization SA'}
                    </div>
                    <div className="text-[8px] text-slate-400 font-sans uppercase font-bold tracking-widest leading-none">
                      Capability Statement
                    </div>
                  </div>
                  
                  {/* Divider */}
                  <div className="h-[1px] bg-slate-200"></div>

                  {/* Overview representer */}
                  <div className="space-y-1">
                    <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
                    <div className="text-[8px] text-slate-500 font-sans leading-tight line-clamp-3 italic">
                      {overview || 'Corporate overview description will populate here.'}
                    </div>
                  </div>

                  {/* Competencies representer */}
                  <div className="space-y-1">
                    <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
                    <div className="space-y-1">
                      {services.slice(0, 3).map((item, id) => (
                        <div key={id} className="text-[7px] text-slate-500 font-sans truncate font-medium">
                          📌 {item}
                        </div>
                      ))}
                      {services.length === 0 && <div className="h-1.5 w-2/3 bg-slate-100 rounded"></div>}
                    </div>
                  </div>

                  {/* Highlights credentials */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-1.5 rounded border border-slate-100 font-mono text-[6px] text-slate-500">
                    <div>CSD: {csdNumber || 'Pending'}</div>
                    <div>B-BBEE: Level {bbbeeLevel}</div>
                  </div>
                </div>

                {/* Performance table miniatures */}
                <div className="space-y-1">
                  <div className="h-1.5 w-1/3 bg-slate-200 rounded"></div>
                  <div className="border border-slate-200 rounded-sm overflow-hidden text-[5px] text-slate-400 font-mono leading-none">
                    <div className="grid grid-cols-3 bg-[#000e27] text-white p-0.5 font-bold uppercase">
                      <div>Project</div>
                      <div>Dept</div>
                      <div>Val</div>
                    </div>
                    {pastPerformance.slice(0, 2).map((item, id) => (
                      <div key={id} className="grid grid-cols-3 p-0.5 border-b border-slate-100 text-slate-600 font-sans">
                        <div className="truncate font-bold">{item.projectName}</div>
                        <div>{item.client}</div>
                        <div>R {item.value ? (item.value / 1000).toFixed(0) + 'K' : '0'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
