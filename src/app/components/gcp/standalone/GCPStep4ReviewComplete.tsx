import { ChevronLeft, CheckCircle2, Shield } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPStandaloneFormData, GCP_STANDALONE_STEPS, GCP_AUTO_GENERATED } from "../../../types";

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-52 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

interface Props {
  formData: GCPStandaloneFormData;
  onBack: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function GCPStep4ReviewComplete({ formData, onBack, onCancel, onComplete }: Props) {
  const permissionsSelected = Object.entries(formData.permissions)
    .filter(([, v]) => v)
    .map(([k]) => ({ monitoring: "Monitoring", remediation: "Remediation", dataScanning: "Data Scanning", workloadCompute: "Compute Protection", workloadGKE: "GKE & ACR Protection" }[k]))
    .join(", ");

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_STANDALONE_STEPS} currentStep={3} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Review and Complete Onboarding</h2>
          <p className="text-sm text-[#64748B] mb-7">Confirm all configuration details before completing the setup.</p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-6">
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">AccuKnox Configuration</p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="OIDC Issuer" value={GCP_AUTO_GENERATED.accuknoxOidcIssuer} />
                <ReviewRow label="Integration ID" value={GCP_AUTO_GENERATED.integrationId} />
                <ReviewRow label="WIF Pool ID" value={formData.wifPoolId} />
                <ReviewRow label="WIF Provider ID" value={formData.wifProviderId} />
                <ReviewRow label="Service Account Email" value={formData.serviceAccountEmail} />
                <ReviewRow label="Auth Method" value="Workload Identity Federation (OIDC)" />
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">GCP Project Details</p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Display Name" value={formData.displayName} />
                <ReviewRow label="Project ID" value={formData.projectId} />
                <ReviewRow label="Project Number" value={formData.projectNumber} />
                <ReviewRow label="Label" value={formData.label} />
                <ReviewRow label="Tag" value={formData.tag} />
              </div>
            </div>

            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">Permissions</p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Selected Capabilities" value={permissionsSelected} />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#86EFAC] border-l-4 border-l-[#16A34A] rounded-lg p-4 mb-2">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#166534] font-medium">WIF configuration verified successfully</p>
              <p className="text-sm text-[#15803D] mt-0.5">
                AccuKnox successfully obtained a federated access token via Google STS. Your project
                is ready to be onboarded.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-5 p-4 bg-[#E8F0FE] border border-[#AECBFA] rounded-lg">
            <Shield size={15} className="text-[#4285F4] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1967D2] leading-relaxed">
              AccuKnox will begin scanning your GCP project within a few minutes. Monitor progress
              on the Cloud Accounts dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors"><ChevronLeft size={15} />Back</button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={onComplete} className="flex items-center gap-2 px-7 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all">
          <CheckCircle2 size={15} />Complete Setup
        </button>
      </div>
    </div>
  );
}
