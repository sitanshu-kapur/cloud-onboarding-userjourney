import { AlertTriangle } from "lucide-react";
import { OCIOrgFormData, OCI_REGIONS } from "../../../types";

interface Props {
  data: OCIOrgFormData;
  onChange: (data: OCIOrgFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const OCID_REGEX = /^ocid1\.tenancy\.[a-z0-9-]+\.\.[a-zA-Z0-9]{20,}$/;

export function OCIOrgStep1({ data, onChange, onNext, onBack }: Props) {
  const ocidValid = !data.adminTenancyOcid || OCID_REGEX.test(data.adminTenancyOcid);
  const canContinue =
    data.displayName.trim() !== "" &&
    OCID_REGEX.test(data.adminTenancyOcid) &&
    data.homeRegion !== "";

  const field = (label: string, required: boolean, children: React.ReactNode, hint?: string) => (
    <div>
      <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
        {required && <span className="text-[#EF4444] mr-0.5">*</span>}
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-[#94A3B8] mt-1">{hint}</p>}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto px-8 py-6">
        <h2 className="text-[#1E293B] mb-1">Organization Details</h2>
        <p className="text-sm text-[#64748B] mb-4">
          Provide details for your OCI Organization Administrator tenancy. Child tenancies are discovered automatically.
        </p>

        <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg p-4 mb-6 max-w-xl">
          <AlertTriangle size={16} className="text-[#D97706] shrink-0 mt-0.5" />
          <p className="text-sm text-[#92400E]">
            <span className="font-medium">Organization Administrator required.</span> The tenancy must have
            org-level privileges to enumerate child tenancies and create cross-tenancy policies via the Endorse/Admit pattern.
          </p>
        </div>

        <div className="max-w-xl flex flex-col gap-5">
          {field("Display Name", true,
            <input
              type="text"
              value={data.displayName}
              onChange={e => onChange({ ...data, displayName: e.target.value })}
              placeholder="e.g. Contoso OCI Organization"
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/10"
            />
          )}

          {field("Admin Tenancy OCID", true,
            <>
              <input
                type="text"
                value={data.adminTenancyOcid}
                onChange={e => onChange({ ...data, adminTenancyOcid: e.target.value })}
                placeholder="ocid1.tenancy.oc1..aaaaaaaaxxxxxxxx"
                className={`w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none transition-colors ${
                  !ocidValid
                    ? "border-[#EF4444] bg-[#FEF2F2]"
                    : "border-[#E2E8F0] focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/10"
                }`}
              />
              {!ocidValid && (
                <p className="text-xs text-[#EF4444] mt-1">Must be a valid OCI Tenancy OCID</p>
              )}
            </>,
            "The Organization Administrator tenancy OCID — found in OCI Console → Profile → Tenancy"
          )}

          {field("Home Region", true,
            <select
              value={data.homeRegion}
              onChange={e => onChange({ ...data, homeRegion: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#C74634] bg-white"
            >
              <option value="">Select home region</option>
              {OCI_REGIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label} ({r.value})</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] shrink-0">
        <button onClick={onBack} className="px-5 py-2 rounded-lg border border-[#C74634] text-[#C74634] bg-white text-sm hover:bg-[#FEF2EE] transition-colors">
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`px-6 py-2 rounded-lg text-white text-sm transition-colors ${canContinue ? "bg-[#C74634] hover:bg-[#A8372A]" : "bg-[#CBD5E1] cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
