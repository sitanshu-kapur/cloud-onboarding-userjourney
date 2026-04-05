import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureStandaloneFormData, AZURE_STANDALONE_STEPS } from "../../../types";

const PERMISSIONS: {
  key: keyof AzureStandaloneFormData["permissions"];
  label: string;
  description: string;
  tag?: string;
  locked?: boolean;
}[] = [
  {
    key: "monitoring",
    label: "Monitoring (read-only)",
    description: "Full asset visibility, misconfigurations, identity security across your subscription.",
    tag: "Required",
    locked: true,
  },
  {
    key: "remediation",
    label: "Remediation (read-write)",
    description: "Allow AccuKnox to automatically remediate findings in your Azure environment.",
  },
  {
    key: "dataScanning",
    label: "Data Resources Scanning",
    description: "Scan and classify Azure storage and database resources for sensitive data. Enterprise tier only.",
  },
  {
    key: "workloadVMs",
    label: "Workload Protection — Azure VMs",
    description: "Scan virtual machines and VM scale sets for vulnerabilities and misconfigurations.",
  },
  {
    key: "workloadACR",
    label: "Workload Protection — ACR",
    description: "Scan Azure Container Registry images for vulnerabilities.",
  },
];

interface Props {
  formData: AzureStandaloneFormData;
  onUpdate: (u: Partial<AzureStandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function AzureStep2Permissions({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const toggle = (key: keyof AzureStandaloneFormData["permissions"]) => {
    onUpdate({ permissions: { ...formData.permissions, [key]: !formData.permissions[key] } });
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_STANDALONE_STEPS} currentStep={1} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Permissions Selection</h2>
          <p className="text-sm text-[#64748B] mb-6">
            Choose which permissions to grant AccuKnox on your Azure subscription.
          </p>

          <div className="flex flex-col gap-3 mb-7">
            {PERMISSIONS.map(({ key, label, description, tag, locked }) => {
              const checked = formData.permissions[key];
              return (
                <div
                  key={key}
                  onClick={() => !locked && toggle(key)}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                    checked
                      ? "border-[#0078D4] bg-[#EFF6FF]"
                      : "border-[#E2E8F0] bg-white hover:border-[#6CB4F0] hover:shadow-sm"
                  } ${locked ? "cursor-default" : "cursor-pointer"}`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border-2 transition-colors ${
                      checked ? "bg-[#0078D4] border-[#0078D4]" : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {checked && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className={`text-sm font-medium ${checked ? "text-[#004578]" : "text-[#1E293B]"}`}>
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
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
