import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../Stepper";
import { OrgFormData, ORG_STEPS } from "../../types";

const SCOPE_OPTIONS: {
  value: OrgFormData["ouScope"];
  label: string;
  description: string;
}[] = [
  {
    value: "all",
    label: "Sync all accounts",
    description: "Onboard every account in the organization.",
  },
  {
    value: "include",
    label: "Include specific OUs and child OUs with member accounts",
    description: "Only onboard accounts within the specified OUs.",
  },
  {
    value: "exclude",
    label: "Exclude specific OUs and accounts",
    description: "Onboard all accounts except those in the specified OUs.",
  },
];

interface Step4Props {
  formData: OrgFormData;
  onUpdate: (updates: Partial<OrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function OrgStep4OUScope({
  formData,
  onUpdate,
  onNext,
  onBack,
  onCancel,
}: Step4Props) {
  const [rootError, setRootError] = useState("");

  const handleNext = () => {
    if (formData.ouScope === "all") {
      if (!formData.rootOuId.trim()) {
        setRootError("Root OU ID is required");
        return;
      }
      if (!/^r-[a-z0-9]{4,32}$/.test(formData.rootOuId.trim())) {
        setRootError("Must be a valid root ID starting with r- (e.g. r-ab12)");
        return;
      }
    }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={ORG_STEPS} currentStep={3} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-0.5">Scope</h2>
          <p className="text-sm text-[#94A3B8] mb-1 font-medium">OU level scope definition</p>
          <p className="text-sm text-[#64748B] mb-6">
            Define which Organizational Units to include in this onboarding.
          </p>

          {/* Radio options */}
          <div className="flex flex-col gap-3 mb-6">
            {SCOPE_OPTIONS.map(({ value, label, description }) => {
              const isSelected = formData.ouScope === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    onUpdate({ ouScope: value, ouIds: "", rootOuId: "" });
                    setRootError("");
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-[#2563EB] bg-[#EFF6FF]"
                      : "border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Radio indicator */}
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-[#2563EB] bg-[#2563EB]" : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isSelected ? "text-[#1E40AF]" : "text-[#1E293B]"
                        }`}
                      >
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
          {formData.ouScope === "all" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                <span className="text-[#EF4444]">*</span>
                Root OU ID
              </label>
              <input
                type="text"
                value={formData.rootOuId}
                onChange={(e) => {
                  onUpdate({ rootOuId: e.target.value });
                  setRootError("");
                }}
                placeholder="r-xxxx"
                className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 font-mono ${
                  rootError ? "border-[#EF4444]" : "border-[#E2E8F0]"
                }`}
              />
              {rootError && <p className="text-[#EF4444] text-xs mt-1">{rootError}</p>}
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Your root OU ID can be found in AWS Console → Organizations → AWS Accounts. It
                  appears at the top of the OU tree and starts with r-.
                </p>
              </div>
            </div>
          )}

          {formData.ouScope === "include" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                OU IDs to include
              </label>
              <input
                type="text"
                value={formData.ouIds}
                onChange={(e) => onUpdate({ ouIds: e.target.value })}
                placeholder="ou-xxxx-yyyyyyy, ou-xxxx-zzzzzzz"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 font-mono"
              />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  OU IDs start with ou- and can be found in AWS Console → Organizations → AWS
                  Accounts. Click any OU to see its ID. Enter multiple IDs separated by commas.
                </p>
              </div>
            </div>
          )}

          {formData.ouScope === "exclude" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                OU IDs to exclude
              </label>
              <input
                type="text"
                value={formData.ouIds}
                onChange={(e) => onUpdate({ ouIds: e.target.value })}
                placeholder="ou-xxxx-yyyyyyy (OUs to exclude)"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 font-mono"
              />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter the OU IDs you want to exclude. All other accounts in the org will be
                  onboarded.
                </p>
              </div>
            </div>
          )}
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
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Continue
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
