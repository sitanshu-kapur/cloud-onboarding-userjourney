import { useRef, useEffect, useState } from "react";
import {
  AlertTriangle,
  Info,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Stepper } from "../Stepper";
import { StandaloneFormData, STANDALONE_STEPS, AUTO_GENERATED } from "../../types";

/* ─── copy-to-clipboard helper ─── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check size={13} className="text-[#16A34A]" /> : <Copy size={13} />}
    </button>
  );
}

/* ─── read-only info row ─── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] shrink-0 w-52">{label}</span>
      <span className="text-sm text-[#1E293B] font-mono text-right break-all flex-1">{value}</span>
      <CopyButton text={value} />
    </div>
  );
}

/* ─── main component ─── */
interface Step2Props {
  formData: StandaloneFormData;
  onUpdate: (updates: Partial<StandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onRedirectToAWS: () => void;
  arnHighlighted: boolean;
  onArnFocused: () => void;
}

export function Step2DeployRole({
  formData,
  onUpdate,
  onNext,
  onBack,
  onCancel,
  onRedirectToAWS,
  arnHighlighted,
  onArnFocused,
}: Step2Props) {
  const [arnError, setArnError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const arnRef = useRef<HTMLInputElement>(null);

  // Scroll to + focus the ARN input when returning from AWS
  useEffect(() => {
    if (arnHighlighted && arnRef.current) {
      arnRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      arnRef.current.focus();
    }
  }, [arnHighlighted]);

  const handleVerify = () => {
    if (!formData.iamRoleArn.trim()) {
      setArnError("IAM Role ARN is required");
      arnRef.current?.focus();
      return;
    }
    const arnPattern = /^arn:aws[a-z-]*:iam::\d{12}:role\/.+$/;
    if (!arnPattern.test(formData.iamRoleArn.trim())) {
      setArnError("Must be a valid IAM Role ARN, e.g. arn:aws:iam::123456789012:role/RoleName");
      return;
    }
    setArnError("");
    setVerifying(true);
    // Simulate async verification
    setTimeout(() => {
      setVerifying(false);
      onNext();
    }, 1200);
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Stepper */}
      <Stepper steps={STANDALONE_STEPS} currentStep={1} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Deploy IAM Role</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Deploy the AccuKnox cross-account IAM role in your AWS account using CloudFormation.
          </p>

          {/* Amber warning banner */}
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Before proceeding:</span> Please ensure your AWS console
              is logged in to the correct account before deploying the IAM role.
            </p>
          </div>

          {/* Auto-generated values info box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-6">
            <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-3">
              Pre-filled deployment values
            </p>
            <InfoRow label="AccuKnox Account ID" value={AUTO_GENERATED.accuknoxAccountId} />
            <InfoRow label="External ID" value={AUTO_GENERATED.externalId} />
            <InfoRow label="Role Name" value={AUTO_GENERATED.roleName} />
            <InfoRow label="CloudFormation Template URL" value={AUTO_GENERATED.cftUrl} />
          </div>

          {/* Redirect button */}
          <div className="mb-2">
            <button
              onClick={onRedirectToAWS}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-lg bg-[#FF9900] hover:bg-[#EC7211] text-[#16191F] text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              <ExternalLink size={16} />
              Redirect: Deploy IAM Role in AWS Console
            </button>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Opens AWS Quick Create Stack — template URL, role name and External ID are pre-filled.
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
            <Info size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1E40AF]">
              AccuKnox uses cross-account IAM role assumption via STS AssumeRole. No static access
              keys are created or stored.
            </p>
          </div>

          {/* IAM Role ARN input */}
          <div>
            <label
              className={`flex items-center gap-1 text-sm mb-1.5 font-medium ${
                arnHighlighted ? "text-[#2563EB]" : "text-[#1E293B]"
              }`}
            >
              <span className="text-[#EF4444]">*</span>
              Paste IAM Role ARN after deployment
              {arnHighlighted && (
                <span className="ml-2 text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded-full animate-pulse">
                  ← Paste here
                </span>
              )}
            </label>
            <input
              ref={arnRef}
              type="text"
              value={formData.iamRoleArn}
              onChange={(e) => {
                onUpdate({ iamRoleArn: e.target.value });
                setArnError("");
                onArnFocused();
              }}
              placeholder="arn:aws:iam::123456789012:role/AccuKnox-..."
              className={`w-full px-3 py-2.5 border-2 rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none font-mono transition-all ${
                arnHighlighted
                  ? "border-[#2563EB] ring-4 ring-[#2563EB]/15 shadow-sm"
                  : arnError
                  ? "border-[#EF4444]"
                  : "border-[#E2E8F0] hover:border-[#93C5FD] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
              }`}
            />
            {arnError && <p className="text-[#EF4444] text-xs mt-1">{arnError}</p>}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
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
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
