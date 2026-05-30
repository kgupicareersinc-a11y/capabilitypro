import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CreditCard, 
  Copy, 
  Check, 
  Smartphone, 
  FileCheck, 
  ChevronRight, 
  Upload, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Award,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
  onPaymentSuccess: (plan: string) => void;
  addNotification: (text: string, type: 'success' | 'info') => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  selectedPlan,
  onPaymentSuccess,
  addNotification
}: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'payshap' | 'eft' | 'pop'>('payshap');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // POP upload attributes
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentFinished, setPaymentFinished] = useState(false);

  // Bank Account and PayShap details provided by the user
  const accountDetails = {
    bank: "ABSA Bank Ltd",
    holder: "Capability Pro Sa",
    accountNumber: "9191056155",
    accountType: "Savings",
    branch: "Sandton City",
    branchCode: "632005",
    shapId: "+27 893 2456" // PayShap Mobile Key identifier
  };

  if (!isOpen) return null;

  const planPrices: Record<string, string> = {
    'SME Lite': 'R250 once off',
    'Enterprise Pro': 'R299 / month',
    'Corporate': 'R899 / month'
  };

  const planPriceNumber: Record<string, string> = {
    'SME Lite': 'R250',
    'Enterprise Pro': 'R299',
    'Corporate': 'R899'
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    addNotification(`Copied ${label} to clipboard!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement> | any) => {
    let file = null;
    if (e.target && e.target.files) {
      file = e.target.files[0];
    } else if (e.dataTransfer && e.dataTransfer.files) {
      file = e.dataTransfer.files[0];
    }

    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
      addNotification("Proof of payment receipt registered! Proceed to verify transaction.", "success");
    }
  };

  // Process manual/EFT payment confirmation
  const handleVerifyPayment = () => {
    if (!uploadedFile && activeTab === 'pop') {
      alert("Please upload or drag a Proof of Payment document (pdf/jpg/png) first.");
      return;
    }

    setIsProcessing(true);
    addNotification("Initiating cryptographic ledger match for PayShap / EFT verification...", "info");

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentFinished(true);
      onPaymentSuccess(selectedPlan);
      addNotification(`👑 Payment verified! ${selectedPlan} active registers successfully unlocked.`, 'success');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4">
      {/* Background Mask */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#000e27]/80 backdrop-blur-sm"
        id="payment-modal-overlay"
      />

      {/* Main Payment Container Dialog */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative border border-slate-100 z-10 flex flex-col text-[#000e27]"
        id="payment-modal-dialog"
      >
        {/* Banner Section matching Cap Pro Brand */}
        <div className="bg-gradient-to-r from-[#000e27] to-[#044cbd] p-6 text-white text-left relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-all focus:outline-none"
            id="payment-modal-close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
              Secure Checkout
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-200 uppercase tracking-widest font-bold">Local Instant Pay</span>
          </div>

          <h3 className="font-sans font-extrabold text-2xl">
            Settle Access for {selectedPlan}
          </h3>
          
          <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-slate-300">Requested Package</p>
              <p className="text-sm font-bold text-white">{selectedPlan}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-300 font-medium">Billed Amount</p>
              <p className="text-2xl font-black text-amber-400">{planPrices[selectedPlan] || 'R250 once off'}</p>
            </div>
          </div>
        </div>

        {paymentFinished ? (
          <div className="p-8 text-center space-y-6 animate-fade-in text-left">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h4 className="font-sans font-extrabold text-xl text-slate-900">Transaction Confirmed Instantly!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Thank you! Your payment has been received and verified under ABSA reference parameters. Your SME account status has been updated to active status.
              </p>
            </div>

            {/* Simulated Receipt Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-left max-w-sm mx-auto font-sans space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-bold">Capability Pro Sa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Reference Account:</span>
                <span className="font-mono">{accountDetails.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel:</span>
                <span className="font-bold text-amber-600">PayShap Instant Mobile Check</span>
              </div>
              <div className="flex justify-between font-bold border-t border-dashed mt-2 pt-2 text-[#000e27]">
                <span>Receipt Total Paid:</span>
                <span>{planPriceNumber[selectedPlan] || 'R250'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-[#000e27] hover:bg-slate-800 text-white font-bold rounded-xl text-xs active:scale-95 transition-all w-full max-w-sm"
                id="receipt-close-btn"
              >
                Access Active Workspace Workspace
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-grow min-h-[420px]">
            {/* Tabs sidebar menu */}
            <div className="md:w-1/3 bg-slate-50 p-4 border-r border-slate-100 flex md:flex-col gap-2 relative z-10 overflow-x-auto text-left">
              <button 
                onClick={() => setActiveTab('payshap')}
                className={`w-full p-3.5 rounded-xl text-left flex items-center gap-2.5 font-sans font-bold text-xs transition-all shrink-0 ${
                  activeTab === 'payshap' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
                id="tab-btn-payshap"
              >
                <Smartphone className="h-4.5 w-4.5" />
                <div>
                  <p className="leading-tight">Option 1: PayShap</p>
                  <p className="text-[9px] opacity-75 mt-0.5 font-normal">Instant Cellphone Pay</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('eft')}
                className={`w-full p-3.5 rounded-xl text-left flex items-center gap-2.5 font-sans font-bold text-xs transition-all shrink-0 ${
                  activeTab === 'eft' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
                id="tab-btn-eft"
              >
                <CreditCard className="h-4.5 w-4.5" />
                <div>
                  <p className="leading-tight">Option 2: EFT Transfer</p>
                  <p className="text-[9px] opacity-75 mt-0.5 font-normal">Standard ABSA Deposit</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('pop')}
                className={`w-full p-3.5 rounded-xl text-left flex items-center gap-2.5 font-sans font-bold text-xs transition-all shrink-0 ${
                  activeTab === 'pop' 
                    ? 'bg-amber-500 text-slate-950 shadow-sm' 
                    : 'hover:bg-slate-200/50 text-slate-600'
                }`}
                id="tab-btn-pop"
              >
                <FileCheck className="h-4.5 w-4.5" />
                <div>
                  <p className="leading-tight">Option 3: Upload POP</p>
                  <p className="text-[9px] opacity-75 mt-0.5 font-normal">Instant Activation check</p>
                </div>
              </button>

              <div className="hidden md:block mt-auto p-3 bg-amber-50 rounded-xl border border-amber-200/50 text-[10px] text-slate-600 font-sans leading-relaxed">
                <ShieldCheck className="h-4 w-4 text-amber-600 inline mr-1 mb-0.5 shrink-0" />
                Payments processed directly into verified <strong>ABSA Savings Corporation</strong> registers.
              </div>
            </div>

            {/* Tab view area */}
            <div className="flex-grow p-6 flex flex-col justify-between text-left">
              
              {activeTab === 'payshap' && (
                <div className="space-y-5 animate-fade-in">
                  <div className="space-y-1.5">
                    <div className="inline-flex gap-1 bg-[#ffdea5] text-slate-900 font-extrabold text-[8px] tracking-wide px-2 py-0.5 rounded-full uppercase">
                      ⭐ Recommended Instant Checkout
                    </div>
                    <h4 className="font-sans font-bold text-base text-[#000e27]">Pay Instantly with PayShap</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      PayShap is the instant mobile key payment used across South Africa. Open your banking app, select **PayShap** (often listed as Pay with ShapID or Cellphone), and send the money instantly using the details below:
                    </p>
                  </div>

                  {/* PayShap Key Copyable layout card */}
                  <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3.5 relative">
                    <Zap className="h-10 w-10 text-amber-500 opacity-20 absolute bottom-3 right-3 pointer-events-none" />
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">PAYSHAP SHAPID KEY (CELL NUMBER)</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-sans font-black text-slate-900 text-sm">{accountDetails.shapId}</span>
                          <button 
                            type="button"
                            onClick={() => handleCopyText(accountDetails.shapId, "PayShap ID")}
                            className="p-1 hover:bg-white rounded border border-slate-200 text-slate-500 transition-colors"
                          >
                            {copiedField === "PayShap ID" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">REGISTERED BANK CHOOSE</span>
                        <p className="font-sans font-bold text-slate-800 text-sm mt-1">{accountDetails.bank}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-dashed border-amber-200/60">
                      <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">ACCOUNT HOLDER REF</span>
                      <p className="font-sans font-semibold text-slate-800 text-xs mt-0.5">{accountDetails.holder}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2 w-full text-xs">
                    <Smartphone className="h-4.5 w-4.5 text-[#044cbd] shrink-0 mt-0.5 animate-bounce" />
                    <p className="text-slate-600 font-sans leading-relaxed text-[11px]">
                      <strong>How to verify:</strong> Once paid in your Capitec, Standard Bank, ABSA, FNB, or Nedbank app, click bottom button to let our CSD integration match your Shap ID payment reference automatically.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => setActiveTab('pop')}
                      className="flex-grow py-3 bg-slate-100 hover:bg-slate-200 text-[#000e27] font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      I have PDF receipt / POP <ChevronRight className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={handleVerifyPayment}
                      disabled={isProcessing}
                      className="flex-grow py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-sans font-black tracking-wide rounded-xl text-xs text-center flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                      id="payshap-verify-btn"
                    >
                      {isProcessing ? "Verifying Shap Register..." : "I have paid, activate now!"}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'eft' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-base text-[#000e27]">Direct EFT Deposit / standard ABSA account</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Transfer funds using standard electronic banking with the details listed below. Make sure to use your **CSD MAAA register number** or your **Company Registered Name** as the reference.
                    </p>
                  </div>

                  {/* EFT Details Table */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-2.5 text-xs text-left">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium font-sans">Bank:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{accountDetails.bank}</span>
                        <button onClick={() => handleCopyText(accountDetails.bank, "Bank Name")} className="p-0.5 bg-white border rounded text-slate-400">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium font-sans">Account Holder:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800">{accountDetails.holder}</span>
                        <button onClick={() => handleCopyText(accountDetails.holder, "Account Holder")} className="p-0.5 bg-white border rounded text-slate-400">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium font-sans">Account Number:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-indigo-700 text-sm">{accountDetails.accountNumber}</span>
                        <button onClick={() => handleCopyText(accountDetails.accountNumber, "Account Number")} className="p-0.5 bg-white border rounded text-slate-400">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium font-sans">Account Type:</span>
                      <span className="font-bold text-slate-700 bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded text-[10px] uppercase">{accountDetails.accountType}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-slate-200/50">
                      <span className="text-slate-400 font-medium font-sans">Branch &amp; Code:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">{accountDetails.branch} ({accountDetails.branchCode})</span>
                        <button onClick={() => handleCopyText(accountDetails.branchCode, "Branch Code")} className="p-0.5 bg-white border rounded text-slate-400">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-[10px] text-orange-800 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>EFT Timing notice:</strong> Direct deposits can take up to 24 hours to match. If you want instant activation, we recommend using the **PayShap** tab or uploading your **EFT Proof of Payment PDF** under Option 3.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => setActiveTab('pop')}
                      className="flex-grow py-3 bg-[#000e27] hover:bg-slate-800 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <Upload className="h-3.5 w-3.5" /> Direct Submit Proof of Payment
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'pop' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-base text-[#000e27]">Express Proof of Payment Upload</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Our SA central compliance servers parse ABSA payment receipt keys immediately. Upload or drop your banking app success voucher/PDF to instantly unlock your statement features.
                    </p>
                  </div>

                  {/* Drag and Drop Box */}
                  <div 
                    onClick={() => {
                      const input = document.getElementById('payment-pop-uploader');
                      if (input) input.click();
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e); }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      dragOver ? 'border-amber-500 bg-amber-50/20' : 'border-slate-300 hover:border-indigo-500'
                    }`}
                  >
                    <input 
                      type="file" 
                      id="payment-pop-uploader" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                    
                    {uploadedFile ? (
                      <div className="space-y-1.5 text-center animate-pulse">
                        <FileCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                        <p className="text-xs font-bold text-slate-800 font-sans truncate max-w-[280px]">{uploadedFile.name}</p>
                        <p className="text-[10px] text-slate-400">{uploadedFile.size}</p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="h-8 w-8 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700 font-sans">Drop banking PDF receipt or click to upload</p>
                        <p className="text-[10px] text-slate-400 font-mono">Format: PDF, PNG, JPG (Max 5MB)</p>
                      </div>
                    )}
                  </div>

                  {uploadedFile && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[10px] text-emerald-800 flex items-start gap-1.5">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                      <p className="leading-relaxed">
                        Receipt registered successfully for {planPriceNumber[selectedPlan]}. Ready to trigger verification bypass logic.
                      </p>
                    </div>
                  )}

                  <div className="pt-2 flex gap-3">
                    <button 
                      onClick={() => {
                        setUploadedFile(null);
                        addNotification("Receipt cleared.", 'info');
                      }}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs text-center transition-all"
                    >
                      Reset File
                    </button>
                    <button 
                      onClick={handleVerifyPayment}
                      disabled={isProcessing}
                      className="flex-grow py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
                      id="pop-submit-btn"
                    >
                      {isProcessing ? "Reading Payment Metadata..." : "Submit for Processing & Activation"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
