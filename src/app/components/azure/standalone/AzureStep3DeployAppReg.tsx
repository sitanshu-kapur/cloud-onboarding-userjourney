import { useRef, useEffect, useState } from "react";
import { AlertTriangle, Info, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureStandaloneFormData, AZURE_STANDALONE_STEPS, AZURE_AUTO_GENERATED } from "../../../types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="p-1 text-[#94A3B8] hover:text-[#0078D4] transition-colors"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-[#16A34A]" /> : <Copy size={13} />}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] shrink-0 w-52">{label}</span>
      <span className="text-sm text-[#1E293B] font-mono text-right break-all flex-1">{value}</span>
      <CopyButton text={value} />
    </div>
  );
}

interface Props {
  formData: AzureStandaloneFormData;
  onUpdate: (u: Partial<AzureStandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRedirectToAzure: () => void;
  fieldsHighlighted: boolean;
  onFieldFocused: () => void;
}

export function AzureStep3DeployAppReg({
  formData,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  onRedirectToAzure,
  fieldsHighlighted,
  onFieldFocused,
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verifying, setVerifying] = useState(false);
  const appIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fieldsHighlighted && appIdRef.current) {
      appIdRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      appIdRef.current.focus();
    }
  }, [fieldsHighlighted]);

  const handleVerify = () => {
    const errs: Record<string, string> = {};
    if (!formData.applicationId.trim()) errs.applicationId = "Application (Client) ID is required";
    else if (!UUID_REGEX.test(formData.applicationId.trim()))
      errs.applicationId = "Must be a valid UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)";
    if (!formData.directoryId.trim()) errs.directoryId = "Directory (Tenant) ID is required";
    else if (!UUID_REGEX.test(formData.directoryId.trim()))
      errs.directoryId = "Must be a valid UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setVerifying(true);
    setTimeout(() => { setVerifying(false); onNext(); }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_STANDALONE_STEPS} currentStep={2} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Deploy App Registration</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Deploy the AccuKnox App Registration in your Azure subscription using an ARM template.
          </p>

          {/* Amber warning */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Before proceeding:</span> Ensure you are logged into the
              correct Azure subscription in your browser before deploying the ARM template.
            </p>
          </div>

          {/* Pre-filled values */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-6">
            <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-3">
              Pre-filled deployment values
            </p>
            <InfoRow label="AccuKnox Tenant ID" value={AZURE_AUTO_GENERATED.accuknoxTenantId} />
            <InfoRow label="Verification Token" value={AZURE_AUTO_GENERATED.verificationToken} />
            <InfoRow label="App Registration Name" value={AZURE_AUTO_GENERATED.appRegistrationName} />
            <InfoRow label="ARM Template URL" value={AZURE_AUTO_GENERATED.armTemplateStandaloneUrl} />
          </div>

          {/* Deploy button */}
          <div className="mb-2">
            <button
              onClick={onRedirectToAzure}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-lg bg-[#0078D4] hover:bg-[#106EBE] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink size={16} />
              Deploy App Registration in Azure Portal
            </button>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Opens Azure Portal Custom Deployment — template URL and all parameters are pre-filled.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E2E8F0]" />
            <span className="text-xs text-[#94A3B8]">after deployment</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>

          {/* Info callout */}
          <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4 mb-6">
            <Info size={16} className="text-[#0078D4] shrink-0 mt-0.5" />
            <p className="text-sm text-[#004578]">
              AccuKnox authenticates using a Service Principal with a certificate credential — no
              client secrets or static keys are created or stored.
            </p>
          </div>

          {/* Application ID input */}
          <div className="mb-4">
            <label className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${fieldsHighlighted ? "text-[#0078D4]" : "text-[#1E293B]"}`}>
              <span className="text-[#EF4444]">*</span>
              Application (Client) ID
              {fieldsHighlighted && (
                <span className="ml-2 text-xs bg-[#0078D4] text-white px-2 py-0.5 rounded-full animate-pulse">
                  ← Paste here
                </span>
              )}
            </label>
            <input
              ref={appIdRef}
              type="text"
              value={formData.applicationId}
              onChange={(e) => { onUpdate({ applicationId: e.target.value }); setErrors((er) => ({ ...er, applicationId: "" })); onFieldFocused(); }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className={`w-full px-3 py-2.5 border-2 rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none font-mono transition-all ${
                fieldsHighlighted
                  ? "border-[#0078D4] ring-4 ring-[#0078D4]/15 shadow-sm"
                  : errors.applicationId
                  ? "border-[#EF4444]"
                  : "border-[#E2E8F0] hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10"
              }`}
            />
            {errors.applicationId && <p className="text-[#EF4444] text-xs mt-1">{errors.applicationId}</p>}
            <p className="text-xs text-[#64748B] mt-1">
              Found in Azure Portal → App Registrations → your app → Overview
            </p>
          </div>

          {/* Directory ID input */}
          <div>
            <label className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${fieldsHighlighted ? "text-[#0078D4]" : "text-[#1E293B]"}`}>
              <span className="text-[#EF4444]">*</span>
              Directory (Tenant) ID
            </label>
            <input
              type="text"
              value={formData.directoryId}
              onChange={(e) => { onUpdate({ directoryId: e.target.value }); setErrors((er) => ({ ...er, directoryId: "" })); onFieldFocused(); }}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className={`w-full px-3 py-2.5 border-2 rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none font-mono transition-all ${
                fieldsHighlighted
                  ? "border-[#0078D4] ring-4 ring-[#0078D4]/15 shadow-sm"
                  : errors.directoryId
                  ? "border-[#EF4444]"
                  : "border-[#E2E8F0] hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10"
              }`}
            />
            {errors.directoryId && <p className="text-[#EF4444] text-xs mt-1">{errors.directoryId}</p>}
            <p className="text-xs text-[#64748B] mt-1">
              Found in Azure Portal → App Registrations → your app → Overview
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#0078D4] text-[#0078D4] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
            <ChevronLeft size={15} />
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
        </div>
        <button
          onClick={handleVerify}
          disabled={verifying}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {verifying ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify and Continue
              <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
