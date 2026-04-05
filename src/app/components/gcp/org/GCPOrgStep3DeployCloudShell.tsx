import { useState } from "react";
import { AlertTriangle, Info, Copy, Check, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPOrgFormData, GCP_ORG_STEPS, GCP_AUTO_GENERATED } from "../../../types";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="p-1 text-[#94A3B8] hover:text-[#4285F4] transition-colors" title="Copy">
      {copied ? <Check size={13} className="text-[#16A34A]" /> : <Copy size={13} />}
    </button>
  );
}

interface Props {
  formData: GCPOrgFormData;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
  onOpenCloudShell: () => void;
  deployConfirmed: boolean;
  onConfirmDeployed: () => void;
}

export function GCPOrgStep3DeployCloudShell({ formData, onNext, onBack, onCancel, onOpenCloudShell, deployConfirmed, onConfirmDeployed }: Props) {
  const [error, setError] = useState("");

  const command = `curl -sSL ${GCP_AUTO_GENERATED.scriptOrgUrl} \\
  | bash -s -- \\
    --org-id=${formData.orgId || "YOUR_ORG_ID"} \\
    --orchestrator-project=${formData.orchestratorProjectId || "YOUR_PROJECT_ID"} \\
    --integration-id=${GCP_AUTO_GENERATED.integrationId} \\
    --oidc-issuer=${GCP_AUTO_GENERATED.accuknoxOidcIssuer}`;

  const handleNext = () => {
    if (!deployConfirmed) { setError("Please confirm the script completed successfully before continuing."); return; }
    setError("");
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_ORG_STEPS} currentStep={2} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Deploy via Cloud Shell</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Run the AccuKnox org provisioning script in Google Cloud Shell to set up Workload
            Identity Federation and org-level IAM bindings.
          </p>

          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4 mb-6">
            <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">Before proceeding:</span> Ensure you are authenticated with
              an account that has <span className="font-medium">Organization Admin</span> permissions
              before opening Cloud Shell.
            </p>
          </div>

          {/* Command preview */}
          <div className="rounded-xl overflow-hidden border border-[#E2E8F0] mb-6">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#202124]">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-[#9AA0A6]" />
                <span className="text-xs text-[#9AA0A6]">Org provisioning command — review before running</span>
              </div>
              <CopyButton text={command} />
            </div>
            <pre className="px-4 py-3 bg-[#2D2F31] text-xs text-[#8AB4F8] font-mono leading-relaxed overflow-x-auto whitespace-pre">
              {command}
            </pre>
          </div>

          {/* Open Cloud Shell button */}
          <div className="mb-2">
            <button onClick={onOpenCloudShell}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-5 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
              style={{ background: "#4285F4" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#3367D6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4285F4")}>
              <Terminal size={16} />
              Open Cloud Shell & Run Script
            </button>
            <p className="text-xs text-[#64748B] mt-2 text-center">
              Opens Google Cloud Shell with the org provisioning command pre-loaded. The script creates
              the WIF Pool, service account, and org-level IAM bindings.
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
              The script uses Cloud Asset Inventory for org-wide resource discovery — no per-project
              API calls are made, avoiding GCP rate limits at scale.
            </p>
          </div>

          {/* Confirmation checkbox */}
          <label onClick={() => { onConfirmDeployed(); setError(""); }} className="flex items-start gap-3 cursor-pointer select-none">
            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${deployConfirmed ? "bg-[#4285F4] border-[#4285F4]" : error ? "border-[#EF4444] bg-white" : "border-[#CBD5E1] bg-white"}`}>
              {deployConfirmed && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </div>
            <p className="text-sm text-[#1E293B] leading-relaxed">
              I have successfully run the provisioning script in Google Cloud Shell and confirmed it
              completed without errors.
            </p>
          </label>
          {error && <p className="text-[#EF4444] text-xs mt-1.5 ml-7">{error}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors"><ChevronLeft size={15} />Back</button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={handleNext} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all">
          Continue<ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
