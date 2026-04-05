import { ChevronLeft, CheckCircle2, Shield } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureStandaloneFormData, AZURE_STANDALONE_STEPS, AZURE_AUTO_GENERATED, LABEL_OPTIONS } from "../../../types";

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-52 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

interface Props {
  formData: AzureStandaloneFormData;
  onBack: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function AzureStep4ReviewComplete({ formData, onBack, onCancel, onComplete }: Props) {
  const permissionsSelected = Object.entries(formData.permissions)
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        monitoring: "Monitoring (read-only)",
        remediation: "Remediation (read-write)",
        dataScanning: "Data Resources Scanning",
        workloadVMs: "Workload Protection — VMs",
        workloadACR: "Workload Protection — ACR",
      };
      return labels[k];
    })
    .join(", ");

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_STANDALONE_STEPS} currentStep={3} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Review and Complete Onboarding</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Confirm all configuration details before completing the setup.
          </p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-6">
            {/* AccuKnox config */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                AccuKnox Configuration
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="AccuKnox Tenant ID" value={AZURE_AUTO_GENERATED.accuknoxTenantId} />
                <ReviewRow label="Verification Token" value={AZURE_AUTO_GENERATED.verificationToken} />
                <ReviewRow label="Application (Client) ID" value={formData.applicationId} />
                <ReviewRow label="Directory (Tenant) ID" value={formData.directoryId} />
                <ReviewRow label="Auth Method" value="Service Principal (Certificate)" />
              </div>
            </div>

            {/* Subscription details */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                Azure Subscription Details
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Display Name" value={formData.displayName} />
                <ReviewRow label="Subscription ID" value={formData.subscriptionId} />
                <ReviewRow label="Tenant ID" value={formData.tenantId} />
                <ReviewRow label="Label" value={formData.label} />
                <ReviewRow label="Tag" value={formData.tag} />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                Permissions
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Selected Capabilities" value={permissionsSelected} />
              </div>
            </div>
          </div>

          {/* Green success banner */}
          <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#86EFAC] border-l-4 border-l-[#16A34A] rounded-lg p-4 mb-2">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#166534] font-medium">App Registration verified successfully</p>
              <p className="text-sm text-[#15803D] mt-0.5">
                AccuKnox successfully authenticated via the Service Principal. Your subscription is
                ready to be onboarded.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 mt-5 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <Shield size={15} className="text-[#0078D4] shrink-0 mt-0.5" />
            <p className="text-xs text-[#004578] leading-relaxed">
              AccuKnox will begin scanning your Azure subscription within a few minutes of completing
              setup. Monitor scan progress on the Cloud Accounts dashboard.
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
          onClick={onComplete}
          className="flex items-center gap-2 px-7 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all"
        >
          <CheckCircle2 size={15} />
          Complete Setup
        </button>
      </div>
    </div>
  );
}
