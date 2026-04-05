import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../../Stepper";
import { AzureOrgFormData, AZURE_ORG_STEPS } from "../../../types";

const SCOPE_OPTIONS: {
  value: AzureOrgFormData["scope"];
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "Sync all subscriptions",
    description: "Monitor every subscription in the organization, including future ones.",
  },
  {
    value: "include",
    label: "Include specific Management Groups or subscriptions",
    description: "Only monitor subscriptions within the specified Management Groups.",
  },
  {
    value: "exclude",
    label: "Exclude specific Management Groups or subscriptions",
    description: "Monitor all subscriptions except those in the specified Management Groups.",
  },
];

interface Props {
  formData: AzureOrgFormData;
  onUpdate: (u: Partial<AzureOrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function AzureOrgStep4Scope({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [rootError, setRootError] = useState("");

  const handleNext = () => {
    if (formData.scope === "all") {
      if (!formData.rootManagementGroupId.trim()) {
        setRootError("Root Management Group ID is required");
        return;
      }
    }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={AZURE_ORG_STEPS} currentStep={3} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-0.5">Scope</h2>
          <p className="text-sm text-[#94A3B8] mb-1 font-medium">
            Management Group level scope definition
          </p>
          <p className="text-sm text-[#64748B] mb-6">
            Define which Management Groups and subscriptions to include in this onboarding.
          </p>

          {/* Radio options */}
          <div className="flex flex-col gap-3 mb-6">
            {SCOPE_OPTIONS.map(({ value, label, description }) => {
              const isSelected = formData.scope === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onUpdate({ scope: value, scopeIds: "", rootManagementGroupId: "" });
                    setRootError("");
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[#0078D4] bg-[#EFF6FF]"
                      : "border-[#E2E8F0] bg-white hover:border-[#6CB4F0] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-[#0078D4] bg-[#0078D4]" : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? "text-[#004578]" : "text-[#1E293B]"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic input */}
          {formData.scope === "all" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                <span className="text-[#EF4444]">*</span>
                Root Management Group ID
              </label>
              <input
                type="text"
                value={formData.rootManagementGroupId}
                onChange={(e) => { onUpdate({ rootManagementGroupId: e.target.value }); setRootError(""); }}
                placeholder="e.g. mg-root or your Tenant ID"
                className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 font-mono ${rootError ? "border-[#EF4444]" : "border-[#E2E8F0]"}`}
              />
              {rootError && <p className="text-[#EF4444] text-xs mt-1">{rootError}</p>}
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Azure Portal → Management Groups → click the root group → Properties. The root MG
                  ID is often the same as your Tenant ID.
                </p>
              </div>
            </div>
          )}

          {formData.scope === "include" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                Management Group or Subscription IDs to include
              </label>
              <input
                type="text"
                value={formData.scopeIds}
                onChange={(e) => onUpdate({ scopeIds: e.target.value })}
                placeholder="mg-prod, mg-dev, xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 font-mono"
              />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter Management Group IDs or Subscription IDs separated by commas. Found in Azure
                  Portal → Management Groups or Subscriptions.
                </p>
              </div>
            </div>
          )}

          {formData.scope === "exclude" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                Management Group or Subscription IDs to exclude
              </label>
              <input
                type="text"
                value={formData.scopeIds}
                onChange={(e) => onUpdate({ scopeIds: e.target.value })}
                placeholder="mg-sandbox, xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#6CB4F0] focus:border-[#0078D4] focus:ring-2 focus:ring-[#0078D4]/10 font-mono"
              />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter the Management Group or Subscription IDs to exclude. All other subscriptions
                  in the tenant will be onboarded.
                </p>
              </div>
            </div>
          )}
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
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-[#0078D4] text-white text-sm hover:bg-[#106EBE] shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
