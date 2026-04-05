import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Stepper } from "../Stepper";
import { OrgFormData, ORG_STEPS } from "../../types";

const PERMISSIONS: {
  key: keyof OrgFormData["permissions"];
  label: string;
  description: string;
  tag?: string;
  locked?: boolean;
}[] = [
  {
    key: "monitoring",
    label: "Monitoring (read-only)",
    description: "Full asset visibility, misconfigurations, identity security.",
    tag: "Required",
    locked: true,
  },
  {
    key: "remediation",
    label: "Remediation (read-write)",
    description:
      "Allow AccuKnox to automatically remediate findings in your environment.",
  },
  {
    key: "dataScanning",
    label: "Data Resources Scanning",
    description:
      "Scan and classify cloud resources for sensitive data. Enterprise tier only.",
  },
  {
    key: "workloadEC2",
    label: "Workload Protection — EC2 / AMI",
    description: "Scan EC2 instances and AMIs for vulnerabilities.",
  },
  {
    key: "workloadECR",
    label: "Workload Protection — ECR",
    description: "Scan container registries for vulnerabilities.",
  },
];

interface Step2Props {
  formData: OrgFormData;
  onUpdate: (updates: Partial<OrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function OrgStep2Permissions({
  formData,
  onUpdate,
  onNext,
  onBack,
  onCancel,
}: Step2Props) {
  const togglePermission = (key: keyof OrgFormData["permissions"]) => {
    onUpdate({
      permissions: { ...formData.permissions, [key]: !formData.permissions[key] },
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={ORG_STEPS} currentStep={1} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Permissions Selection</h2>
          <p className="text-sm text-[#64748B] mb-5">
            Choose which permissions to grant AccuKnox across your organization.
          </p>

          {/* Auto sync folder toggle */}
          <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] mb-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={formData.autoSyncFolder}
                onClick={() => onUpdate({ autoSyncFolder: !formData.autoSyncFolder })}
                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                  formData.autoSyncFolder ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    formData.autoSyncFolder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <div>
                <p className="text-sm text-[#1E293B] font-medium">
                  Automatically sync folder structure
                </p>
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                  AccuKnox will mirror your AWS OU hierarchy and update automatically when accounts
                  move.
                </p>
              </div>
            </div>
          </div>

          {/* Permission rows */}
          <div className="flex flex-col gap-3 mb-7">
            {PERMISSIONS.map(({ key, label, description, tag, locked }) => {
              const checked = formData.permissions[key];
              return (
                <div
                  key={key}
                  onClick={() => !locked && togglePermission(key)}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                    checked
                      ? "border-[#2563EB] bg-[#EFF6FF]"
                      : "border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-sm"
                  } ${locked ? "cursor-default" : "cursor-pointer"}`}
                >
                  {/* Checkbox */}
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${
                      checked ? "bg-[#2563EB] border-[#2563EB]" : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p
                        className={`text-sm font-medium ${
                          checked ? "text-[#1E40AF]" : "text-[#1E293B]"
                        }`}
                      >
                        {label}
                      </p>
                      {tag && (
                        <span className="text-xs bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      )}
                      {locked && <Lock size={12} className="text-[#94A3B8]" />}
                    </div>
                    <p className="text-xs text-[#64748B] leading-relaxed">{description}</p>
                  </div>
                </div>
              );
            })}
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
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
