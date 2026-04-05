import { ChevronLeft, CheckCircle2, Shield } from "lucide-react";
import { Stepper } from "../Stepper";
import {
  OrgFormData,
  ORG_STEPS,
  AUTO_GENERATED,
  MOCK_MANAGEMENT_ACCOUNTS,
} from "../../types";

const PERMISSION_LABELS: Record<keyof OrgFormData["permissions"], string> = {
  monitoring: "Monitoring (read-only)",
  remediation: "Remediation (read-write)",
  dataScanning: "Data Resources Scanning",
  workloadEC2: "Workload Protection — EC2 / AMI",
  workloadECR: "Workload Protection — ECR",
};

const SCOPE_LABELS: Record<OrgFormData["ouScope"], string> = {
  all: "Sync all accounts",
  include: "Include specific OUs",
  exclude: "Exclude specific OUs",
};

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-48 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

interface Step5Props {
  formData: OrgFormData;
  onBack: () => void;
  onCancel: () => void;
  onComplete: () => void;
}

export function OrgStep5ReviewComplete({ formData, onBack, onCancel, onComplete }: Step5Props) {
  const selectedAccount = MOCK_MANAGEMENT_ACCOUNTS.find(
    (a) => a.id === formData.managementAccountId
  );

  const managementAccountDisplay =
    formData.managementMethod === "select"
      ? selectedAccount
        ? `${selectedAccount.name} (${selectedAccount.id})`
        : formData.managementAccountId
      : formData.managementAccountId;

  const selectedPermissions = (
    Object.keys(formData.permissions) as (keyof OrgFormData["permissions"])[]
  )
    .filter((k) => formData.permissions[k])
    .map((k) => PERMISSION_LABELS[k])
    .join(", ");

  const ouScopeDisplay =
    formData.ouScope === "all"
      ? `Sync all accounts (root: ${formData.rootOuId || "—"})`
      : `${SCOPE_LABELS[formData.ouScope]}${formData.ouIds ? `: ${formData.ouIds}` : ""}`;

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={ORG_STEPS} currentStep={4} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Review and Complete Onboarding</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Confirm all configuration details before completing the setup.
          </p>

          {/* Summary box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-6">
            {/* AccuKnox config */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                AccuKnox Configuration
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="External ID" value={AUTO_GENERATED.externalId} />
                <ReviewRow label="IAM Role Name" value={formData.iamRoleName} />
                <ReviewRow label="IAM Role ARN" value={formData.iamRoleArn} />
                <ReviewRow label="Auth Method" value="STS AssumeRole" />
              </div>
            </div>

            {/* Org details */}
            <div className="mb-5">
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                AWS Organization Details
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Management Account" value={managementAccountDisplay} />
                {formData.managementMethod === "inline" && (
                  <ReviewRow label="Management Role ARN" value={formData.managementRoleArn} />
                )}
                <ReviewRow label="AWS Org ID" value={formData.awsOrgId} />
                <ReviewRow label="OU Scope" value={ouScopeDisplay} />
              </div>
            </div>

            {/* Permissions & settings */}
            <div>
              <p className="text-xs text-[#64748B] uppercase tracking-wider font-medium mb-1">
                Permissions & Settings
              </p>
              <div className="bg-white rounded-lg border border-[#E2E8F0] px-4">
                <ReviewRow label="Permissions" value={selectedPermissions} />
                <ReviewRow
                  label="Folder Sync"
                  value={formData.autoSyncFolder ? "Enabled" : "Disabled"}
                />
              </div>
            </div>
          </div>

          {/* Green success banner */}
          <div className="flex items-start gap-3 bg-[#F0FDF4] border border-[#86EFAC] border-l-4 border-l-[#16A34A] rounded-lg p-4 mb-2">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#166534] font-medium">Role verified successfully</p>
              <p className="text-sm text-[#15803D] mt-0.5">
                AccuKnox successfully assumed the IAM role via STS AssumeRole. Your organization is
                ready to be onboarded.
              </p>
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 mt-5 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <Shield size={15} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1E40AF] leading-relaxed">
              AccuKnox will begin scanning your organization within a few minutes of completing
              setup. You can monitor scan progress and OU sync status on the Cloud Accounts
              dashboard.
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
