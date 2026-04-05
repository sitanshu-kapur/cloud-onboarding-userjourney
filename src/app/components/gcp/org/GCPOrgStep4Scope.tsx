import { useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../../Stepper";
import { GCPOrgFormData, GCP_ORG_STEPS } from "../../../types";

const SCOPE_OPTIONS: { value: GCPOrgFormData["scope"]; label: string; description: string }[] = [
  { value: "all", label: "Sync all projects", description: "Monitor every project in the organization, including future ones." },
  { value: "include", label: "Include specific folders or projects", description: "Only monitor projects within the specified folders or explicitly listed projects." },
  { value: "exclude", label: "Exclude specific folders or projects", description: "Monitor all projects except those in the specified folders or project list." },
];

interface Props {
  formData: GCPOrgFormData;
  onUpdate: (u: Partial<GCPOrgFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function GCPOrgStep4Scope({ formData, onUpdate, onNext, onBack, onCancel }: Props) {
  const [rootError, setRootError] = useState("");

  const handleNext = () => {
    if (formData.scope === "all" && !formData.rootFolderId.trim()) {
      setRootError("Root Folder ID or Organization ID is required");
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <Stepper steps={GCP_ORG_STEPS} currentStep={3} />

      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-0.5">Scope</h2>
          <p className="text-sm text-[#94A3B8] mb-1 font-medium">Folder and project level scope definition</p>
          <p className="text-sm text-[#64748B] mb-6">Define which folders and projects to include in this onboarding.</p>

          <div className="flex flex-col gap-3 mb-6">
            {SCOPE_OPTIONS.map(({ value, label, description }) => {
              const isSelected = formData.scope === value;
              return (
                <button key={value} type="button"
                  onClick={() => { onUpdate({ scope: value, scopeIds: "", rootFolderId: "" }); setRootError(""); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? "border-[#4285F4] bg-[#E8F0FE]" : "border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-sm"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-[#4285F4] bg-[#4285F4]" : "border-[#CBD5E1] bg-white"}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${isSelected ? "text-[#1967D2]" : "text-[#1E293B]"}`}>{label}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {formData.scope === "all" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
                <span className="text-[#EF4444]">*</span>Root Folder ID
              </label>
              <input type="text" value={formData.rootFolderId}
                onChange={(e) => { onUpdate({ rootFolderId: e.target.value }); setRootError(""); }}
                placeholder="folders/123456789 or organizations/123456789"
                className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 font-mono ${rootError ? "border-[#EF4444]" : "border-[#E2E8F0]"}`} />
              {rootError && <p className="text-[#EF4444] text-xs mt-1">{rootError}</p>}
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Use <code className="font-mono text-xs">folders/FOLDER_ID</code> for a specific folder root, or <code className="font-mono text-xs">organizations/ORG_ID</code> to target the entire org. Found in Google Cloud Console → Resource Manager.
                </p>
              </div>
            </div>
          )}

          {formData.scope === "include" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">Folder or Project IDs to include</label>
              <input type="text" value={formData.scopeIds} onChange={(e) => onUpdate({ scopeIds: e.target.value })}
                placeholder="folders/111111, projects/my-project-id, folders/222222"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 font-mono" />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Enter <code className="font-mono text-xs">folders/FOLDER_ID</code> or <code className="font-mono text-xs">projects/PROJECT_ID</code> separated by commas. All current and future projects in included folders are covered.
                </p>
              </div>
            </div>
          )}

          {formData.scope === "exclude" && (
            <div>
              <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">Folder or Project IDs to exclude</label>
              <input type="text" value={formData.scopeIds} onChange={(e) => onUpdate({ scopeIds: e.target.value })}
                placeholder="folders/sandbox-folder, projects/legacy-project"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors hover:border-[#93C5FD] focus:border-[#4285F4] focus:ring-2 focus:ring-[#4285F4]/10 font-mono" />
              <div className="flex items-start gap-2 mt-2">
                <Info size={13} className="text-[#94A3B8] shrink-0 mt-0.5" />
                <p className="text-xs text-[#64748B] leading-relaxed">All other projects in the organization will be onboarded. Useful for excluding sandbox or legacy environments.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1 px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors"><ChevronLeft size={15} />Back</button>
          <button onClick={onCancel} className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors">Cancel</button>
        </div>
        <button onClick={handleNext} className="px-6 py-2 rounded-lg bg-[#4285F4] text-white text-sm hover:bg-[#3367D6] shadow-sm hover:shadow-md transition-all flex items-center gap-2">
          Continue<ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
