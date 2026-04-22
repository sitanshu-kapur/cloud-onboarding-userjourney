import { OCIOrgFormData } from "../../../types";

interface Props {
  data: OCIOrgFormData;
  onChange: (data: OCIOrgFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OCIOrgStep4({ data, onChange, onNext, onBack }: Props) {
  const canContinue =
    data.scope === "all"
      ? data.rootTenancyOcid.trim() !== ""
      : data.scopeIds.trim() !== "";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto px-8 py-6">
        <h2 className="text-[#1E293B] mb-1">Tenancy Scope</h2>
        <p className="text-sm text-[#64748B] mb-6">
          Choose which child tenancies AccuKnox should monitor within your OCI Organization.
        </p>

        <div className="max-w-xl flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            {(["all", "include", "exclude"] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ ...data, scope: opt, scopeIds: "" })}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  data.scope === opt
                    ? "border-[#C74634] bg-[#FEF2EE]"
                    : "border-[#E2E8F0] hover:border-[#C74634]/40"
                }`}
              >
                <p className={`text-sm font-semibold mb-0.5 ${data.scope === opt ? "text-[#C74634]" : "text-[#1E293B]"}`}>
                  {opt === "all" ? "Sync all tenancies" : opt === "include" ? "Include specific tenancies" : "Exclude specific tenancies"}
                </p>
                <p className="text-xs text-[#64748B]">
                  {opt === "all"
                    ? "Monitor all current and future child tenancies in the organization"
                    : opt === "include"
                    ? "Only monitor the tenancies you specify below"
                    : "Monitor all tenancies except those you specify below"}
                </p>
              </button>
            ))}
          </div>

          {data.scope === "all" && (
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                <span className="text-[#EF4444] mr-0.5">*</span>Root / Admin Tenancy OCID
              </label>
              <input
                type="text"
                value={data.rootTenancyOcid}
                onChange={e => onChange({ ...data, rootTenancyOcid: e.target.value })}
                placeholder="ocid1.tenancy.oc1..aaaaaaaaxxxxxxxx"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-sm font-mono focus:outline-none focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/10"
              />
            </div>
          )}

          {(data.scope === "include" || data.scope === "exclude") && (
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
                <span className="text-[#EF4444] mr-0.5">*</span>
                Child Tenancy OCIDs ({data.scope === "include" ? "to include" : "to exclude"})
              </label>
              <textarea
                rows={4}
                value={data.scopeIds}
                onChange={e => onChange({ ...data, scopeIds: e.target.value })}
                placeholder={"Enter tenancy OCIDs, comma-separated\ne.g. ocid1.tenancy.oc1..aaaa..., ocid1.tenancy.oc1..bbbb..."}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-mono focus:outline-none focus:border-[#C74634] resize-none"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] shrink-0">
        <button onClick={onBack} className="px-5 py-2 rounded-lg border border-[#C74634] text-[#C74634] bg-white text-sm hover:bg-[#FEF2EE] transition-colors">Back</button>
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
