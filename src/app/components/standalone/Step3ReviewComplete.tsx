import { ChevronLeft, CheckCircle2, Shield } from "lucide-react";
import { Stepper } from "../Stepper";
import { StandaloneFormData, STANDALONE_STEPS, AUTO_GENERATED, AWS_REGIONS } from "../../types";

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-52 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

interface Step3Props {
  formData: StandaloneFormData;
  onBack: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function Step3ReviewComplete({ formData, onBack, onCancel, onComplete }: Step3Props) {
  const regionLabels = formData.regions
    .map((r) => AWS_REGIONS.find((a) => a.value === r)?.label ?? r)
    .join(", ");

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Stepper */}
      <Stepper steps={STANDALONE_STEPS} currentStep={2} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Review and Complete Onboarding</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Confirm all configuration details before completing the setup.
          </p>

          {/* Summary box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-6">
            {/* Identity section */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                AccuKnox Configuration
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="External ID" value={AUTO_GENERATED.externalId} />
                <ReviewRow label="IAM Role Name" value={AUTO_GENERATED.roleName} />
                <ReviewRow label="IAM Role ARN" value={formData.iamRoleArn} />
                <ReviewRow label="Auth Method" value="STS AssumeRole" />
              </div>
            </div>

            {/* Account section */}
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                AWS Account Details
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Account Name" value={formData.accountName} />
                <ReviewRow label="AWS Account ID" value={formData.awsAccountId} />
                <ReviewRow
                  label="AWS Partition"
                  value={
                    formData.partition === "global"
                      ? "AWS Global"
                      : "AWS GovCloud"
                  }
                />
                <ReviewRow
                  label="Active Regions"
                  value={regionLabels || "None selected"}
                />
                <ReviewRow label="Label" value={formData.label} />
                <ReviewRow label="Tag" value={formData.tag} />
                <ReviewRow
                  label="Management Account"
                  value={formData.isManagementAccount ? "Yes" : "No"}
                />
              </div>
            </div>
          </div>

          {/* Green success / verification banner */}
          <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#86EFAC] border-l-4 border-l-[#16A34A] rounded-lg p-4 mb-2">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#166534] font-medium">
                Role verified successfully
              </p>
              <p className="text-sm text-[#15803D] mt-0.5">
                AccuKnox successfully assumed the IAM role via STS AssumeRole. Your account is
                ready to be onboarded.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 mt-5 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <Shield size={15} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1E40AF] leading-relaxed">
              AccuKnox will begin scanning your account within a few minutes of completing setup.
              You can monitor scan progress on the Cloud Accounts dashboard.
            </p>
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
          onClick={onComplete}
          className="flex items-center gap-2 px-7 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all"
        >
          <CheckCircle2 size={15} />
          Complete Setup
        </button>
      </div>
    </div>
  );
}
