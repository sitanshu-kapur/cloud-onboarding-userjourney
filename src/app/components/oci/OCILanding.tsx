import { Building2, Server, AlertTriangle } from "lucide-react";

interface OCILandingProps {
  onBack: () => void;
  onContinue: (type: "standalone" | "org") => void;
}

export function OCILanding({ onBack, onContinue }: OCILandingProps) {
  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      <div className="px-8 pt-8 pb-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#C74634] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs tracking-wide">OCI</span>
          </div>
          <h1 className="text-[#1E293B]">Oracle Cloud Infrastructure</h1>
        </div>
        <p className="text-[#64748B] text-sm">
          Choose whether to connect a single OCI tenancy or an entire OCI Organization.
        </p>
      </div>

      <div className="flex flex-col flex-1 px-8 py-8 gap-6">
        <div className="grid grid-cols-2 gap-5 max-w-2xl">
          {/* Standalone */}
          <button
            type="button"
            onClick={() => onContinue("standalone")}
            className="text-left p-6 rounded-xl border-2 border-[#E2E8F0] hover:border-[#C74634] hover:shadow-md transition-all duration-200 bg-white group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FEF2EE] flex items-center justify-center mb-4 group-hover:bg-[#FDDDD8] transition-colors">
              <Server size={20} className="text-[#C74634]" />
            </div>
            <h3 className="text-[#1E293B] mb-1.5">Single Tenancy</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect one OCI tenancy. A Cloud Shell script provisions the required IAM resources and automatically transmits credentials to AccuKnox.
            </p>
          </button>

          {/* Org */}
          <button
            type="button"
            onClick={() => onContinue("org")}
            className="text-left p-6 rounded-xl border-2 border-[#E2E8F0] hover:border-[#C74634] hover:shadow-md transition-all duration-200 bg-white group"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FEF2EE] flex items-center justify-center mb-4 group-hover:bg-[#FDDDD8] transition-colors">
              <Building2 size={20} className="text-[#C74634]" />
            </div>
            <h3 className="text-[#1E293B] mb-1.5">OCI Organization</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect your entire OCI Organization — admin tenancy plus all child tenancies — using cross-tenancy policies and org-level governance.
            </p>
            <div className="mt-3 flex items-start gap-2 bg-[#FFFBEB] border border-[#FCD34D] rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-[#D97706] shrink-0 mt-0.5" />
              <p className="text-xs text-[#92400E]">Requires Organization Administrator privileges</p>
            </div>
          </button>
        </div>

        <div className="flex-1" />

        <div className="flex items-center pt-6 border-t border-[#E2E8F0] max-w-2xl">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg border border-[#C74634] text-[#C74634] bg-white text-sm hover:bg-[#FEF2EE] transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
