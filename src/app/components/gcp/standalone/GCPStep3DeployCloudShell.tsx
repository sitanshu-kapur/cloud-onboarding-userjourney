import { useRef, useEffect, useState } from "react";
import { AlertTriangle, Info, Copy, Check, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPStandaloneFormData, GCP_STANDALONE_STEPS, GCP_AUTO_GENERATED } from "../../../types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="p-1 text-[#94A3B8] hover:text-[#4285F4] transition-colors" title="Copy">
      {copied ? <Check size={13} className="text-[#16A34A]" /> : <Copy size={13} />}
    </button>
  );
}

const WIF_POOL_REGEX = /^projects\/\d+\/locations\/global\/workloadIdentityPools\/.+$/;
const WIF_PROVIDER_REGEX = /^projects\/\d+\/locations\/global\/workloadIdentityPools\/.+\/providers\/.+$/;
const SA_EMAIL_REGEX = /^[a-z0-9-]+@[a-z0-9-]+\.iam\.gserviceaccount\.com$/;

interface Props {
  formData: GCPStandaloneFormData;
  onUpdate: (u: Partial<GCPStandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onOpenCloudShell: () => void;
  fieldsHighlighted: boolean;
  onFieldFocused: () => void;
}

export function GCPStep3DeployCloudShell({ formData, onUpdate, onNext, onBack, onCancel, onOpenCloudShell, fieldsHighlighted, onFieldFocused }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);
  const poolRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldsHighlighted && poolRef.current) {
      poolRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      poolRef.current.focus();
    }
  }, [fieldsHighlighted]);

  const command = `curl -sSL ${GCP_AUTO_GENERATED.scriptStandaloneUrl} \\
  | bash -s -- \\
    --project-id=${formData.projectId || "YOUR_PROJECT_ID"} \\
    --integration-id=${GCP_AUTO_GENERATED.integrationId} \\
    --oidc-issuer=${GCP_AUTO_GENERATED.accuknoxOidcIssuer}`;

  const handleVerify = () => {
    const errs: Record<string, string> = {};
    if (!formData.wifPoolId.trim()) errs.wifPoolId = "WIF Pool ID is required";
    else if (!WIF_POOL_REGEX.test(formData.wifPoolId.trim()))
      errs.wifPoolId = "Must be in format: projects/NUMBER/locations/global/workloadIdentityPools/POOL_ID";
    if (!formData.wifProviderId.trim()) errs.wifProviderId = "WIF Provider ID is required";
    else if (!WIF_PROVIDER_REGEX.test(formData.wifProviderId.trim()))
      errs.wifProviderId = "Must be the full provider resource path";
    if (!formData.serviceAccountEmail.trim()) errs.serviceAccountEmail = "Service account email is required";
    else if (!SA_EMAIL_REGEX.test(formData.serviceAccountEmail.trim()))
      errs.serviceAccountEmail = "Must end in .iam.gserviceaccount.com";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onNext(); }, 1200);
  };

  const inputClass = (highlighted: boolean, err?: string) =>
    `w-full px-3 py-2.5 border-2 rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none font-mono transition-all ${
      highlighted ? "border-[#4285F4] ring-4 ring-[#4285F4]/15 shadow-sm"
      : err ? "border-[#EF4444]"
      : "border-[#E2E8F0] hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10"
    }`;

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_STANDALONE_STEPS} currentStep={2} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Deploy via Cloud Shell</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Run the AccuKnox provisioning script in Google Cloud Shell to set up Workload Identity
            Federation in your project.
          </p>

          {/* Amber warning */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Before proceeding:</span> Ensure you are logged into the
              correct GCP project in your browser before opening Cloud Shell.
            </p>
          </div>

          {/* Command preview */}
          <div className="rounded-xl overflow-hidden border border-[#E2E8F0] mb-6">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#202124]">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#9AA0A6]" />
                <span className="text-xs text-[#9AA0A6]">Provisioning command — review before running</span>
              </div>
              <CopyButton text={command} />
            </div>
            <pre className="px-4 py-3 bg-[#2D2F31] text-xs text-[#8AB4F8] font-mono leading-relaxed overflow-x-auto whitespace-pre">
              {command}
            </pre>
          </div>

          {/* Open Cloud Shell button */}
          <div className="mb-2">
            <button
              onClick={onOpenCloudShell}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
              style={{ background: "#4285F4" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#3367D6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4285F4")}
            >
              <Terminal size={16} />
              Open Cloud Shell & Run Script
            </button>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Opens Google Cloud Shell with the provisioning command pre-loaded and ready to run.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">after script completes</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Info callout */}
          <div className="flex items-start gap-3 bg-[#E8F0FE] border border-[#AECBFA] rounded-lg p-4 mb-6">
            <Info size={16} className="text-[#4285F4] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1967D2]">
              AccuKnox uses Workload Identity Federation — no service account keys or static
              credentials are generated or stored.
            </p>
          </div>

          {/* WIF Pool ID */}
          <div className="mb-4">
            <label className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${fieldsHighlighted ? "text-[#4285F4]" : "text-[#1E293B]"}`}>
              <span className="text-[#EF4444]">*</span>
              Workload Identity Pool ID
              {fieldsHighlighted && <span className="ml-2 text-xs bg-[#4285F4] text-white px-2 py-0.5 rounded-full animate-pulse">← Paste here</span>}
            </label>
            <input ref={poolRef} type="text" value={formData.wifPoolId}
              onChange={(e) => { onUpdate({ wifPoolId: e.target.value }); setErrors((er) => ({ ...er, wifPoolId: "" })); onFieldFocused(); }}
              placeholder="projects/123456789012/locations/global/workloadIdentityPools/accuknox-wif-pool"
              className={inputClass(fieldsHighlighted, errors.wifPoolId)} />
            {errors.wifPoolId && <p className="text-[#EF4444] text-xs mt-1">{errors.wifPoolId}</p>}
          </div>

          {/* WIF Provider ID */}
          <div className="mb-4">
            <label className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${fieldsHighlighted ? "text-[#4285F4]" : "text-[#1E293B]"}`}>
              <span className="text-[#EF4444]">*</span>
              Workload Identity Provider ID
            </label>
            <input type="text" value={formData.wifProviderId}
              onChange={(e) => { onUpdate({ wifProviderId: e.target.value }); setErrors((er) => ({ ...er, wifProviderId: "" })); onFieldFocused(); }}
              placeholder="projects/123456789012/locations/global/workloadIdentityPools/accuknox-wif-pool/providers/accuknox-oidc-provider"
              className={inputClass(fieldsHighlighted, errors.wifProviderId)} />
            {errors.wifProviderId && <p className="text-[#EF4444] text-xs mt-1">{errors.wifProviderId}</p>}
          </div>

          {/* Service Account Email */}
          <div>
            <label className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${fieldsHighlighted ? "text-[#4285F4]" : "text-[#1E293B]"}`}>
              <span className="text-[#EF4444]">*</span>
              Service Account Email
            </label>
            <input type="text" value={formData.serviceAccountEmail}
              onChange={(e) => { onUpdate({ serviceAccountEmail: e.target.value }); setErrors((er) => ({ ...er, serviceAccountEmail: "" })); onFieldFocused(); }}
              placeholder={`accuknox-integration@${formData.projectId || "your-project"}.iam.gserviceaccount.com`}
              className={inputClass(fieldsHighlighted, errors.serviceAccountEmail)} />
            {errors.serviceAccountEmail && <p className="text-[#EF4444] text-xs mt-1">{errors.serviceAccountEmail}</p>}
            <p className="text-xs text-[#64748B] mt-1">All three values are printed in the Cloud Shell output after the script completes.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors"><ChevronLeft size={15} />Back</button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={handleVerify} disabled={verifying}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {verifying ? (
            <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying…</>
          ) : (
            <>Verify and Continue<ChevronRight size={15} /></>
          )}
        </button>
      </div>
    </div>
  );
}
