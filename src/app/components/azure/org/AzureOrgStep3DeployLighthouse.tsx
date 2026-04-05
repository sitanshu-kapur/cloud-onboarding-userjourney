import { useState } from "react";
import { AlertTriangle, Info, Copy, Check, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureOrgFormData, AZURE_ORG_STEPS, AZURE_AUTO_GENERATED } from "../../../types";

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
  formData: AzureOrgFormData;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRedirectToAzure: () => void;
  deployConfirmed: boolean;
  onConfirmDeployed: () => void;
}

export function AzureOrgStep3DeployLighthouse({
  formData,
  onNext,
  onBack,
  onCancel,
  onRedirectToAzure,
  deployConfirmed,
  onConfirmDeployed,
}: Props) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!deployConfirmed) { setError("Please confirm the deployment is complete before continuing."); return; }
    setError("");
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_ORG_STEPS} currentStep={2} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Deploy Lighthouse Delegation</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Deploy the AccuKnox Lighthouse ARM template to delegate management access across your
            Azure organization.
          </p>

          {/* Amber warning */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Before proceeding:</span> Ensure you are logged into your
              Azure portal with an account that has{" "}
              <span className="font-medium">Global Administrator</span> access on the tenant.
            </p>
          </div>

          {/* Pre-filled values */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-6">
            <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-3">
              Pre-filled deployment values
            </p>
            <InfoRow label="AccuKnox Managing Tenant ID" value={AZURE_AUTO_GENERATED.accuknoxTenantId} />
            <InfoRow label="Verification Token" value={AZURE_AUTO_GENERATED.verificationToken} />
            <InfoRow label="Lighthouse Definition Name" value={AZURE_AUTO_GENERATED.lighthouseDefinitionName} />
            <InfoRow label="Management Group ID" value={formData.managementGroupId || "—"} />
            <InfoRow label="ARM Template URL" value={AZURE_AUTO_GENERATED.armTemplateOrgUrl} />
          </div>

          {/* Deploy button */}
          <div className="mb-2">
            <button
              onClick={onRedirectToAzure}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-lg bg-[#0078D4] hover:bg-[#106EBE] text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink size={16} />
              Deploy Lighthouse in Azure Portal
            </button>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Opens Azure Portal Custom Deployment — Lighthouse definition, policy, and Management
              Group are pre-filled.
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
              Azure Lighthouse uses delegated resource management — AccuKnox's managing tenant gains
              read access to your subscriptions without storing any credentials.
            </p>
          </div>

          {/* Confirm deployment checkbox */}
          <label
            onClick={() => { onConfirmDeployed(); setError(""); }}
            className="flex items-start gap-3 cursor-pointer select-none"
          >
            <div
              className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                deployConfirmed ? "bg-[#0078D4] border-[#0078D4]" : error ? "border-[#EF4444] bg-white" : "border-[#CBD5E1] bg-white"
              }`}
            >
              {deployConfirmed && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <p className="text-sm text-[#1E293B] leading-relaxed">
              I have completed the Lighthouse ARM template deployment in Azure Portal.
            </p>
          </label>
          {error && <p className="text-[#EF4444] text-xs mt-1.5 ml-7">{error}</p>}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#0078D4] text-[#0078D4] bg-white text-sm hover:bg-[#EFF6FF] transition-colors">
            <ChevronLeft size={15} />
            Back
          </button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">
            Cancel
          </button>
        </div>
        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
