import { useState } from "react";
import { Layers, FolderOpen, AlertTriangle, ChevronRight } from "lucide-react";

interface GCPLandingProps {
  onContinue: (type: "org" | "standalone") => void;
  onBack: () => void;
}

export function GCPLanding({ onContinue, onBack }: GCPLandingProps) {
  const [selected, setSelected] = useState<"org" | "standalone" | null>(null);

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4285F4 0%, #34A853 60%, #FBBC05 100%)" }}
          >
            <span className="text-white font-bold text-xs">G</span>
          </div>
          <h1 className="text-[#1E293B]">GCP Onboarding</h1>
        </div>
        <p className="text-[#64748B] text-sm">
          Select the scope of your Google Cloud environment to begin onboarding.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-8 py-8">
        <p className="text-sm text-[#475569] mb-5">
          <span className="text-[#EF4444] mr-0.5">*</span>
          Select Account Type
        </p>

        <div className="grid grid-cols-2 gap-5 max-w-2xl">
          {/* GCP Organization */}
          <button
            onClick={() => setSelected("org")}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:outline-none ${
              selected === "org"
                ? "border-[#4285F4] shadow-[0_0_0_3px_rgba(66,133,244,0.08)]"
                : "border-[#E2E8F0] hover:border-[#93C5FD]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${selected === "org" ? "bg-[#E8F0FE]" : "bg-[#F8FAFC]"}`}>
                <FolderOpen size={22} className={selected === "org" ? "text-[#4285F4]" : "text-[#94A3B8]"} />
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected === "org" ? "border-[#4285F4] bg-[#4285F4]" : "border-[#CBD5E1] bg-white"}`}>
                {selected === "org" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <h3 className={`mb-1.5 transition-colors ${selected === "org" ? "text-[#4285F4]" : "text-[#1E293B]"}`}>
              GCP Organization
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect your entire GCP organization or specific folders via Cloud Shell and Workload
              Identity Federation.
            </p>
            {selected === "org" && (
              <div className="mt-3 flex items-center gap-1 text-[#4285F4] text-xs">
                <span>Multi-project coverage</span>
                <ChevronRight size={12} />
              </div>
            )}
          </button>

          {/* Standalone Project */}
          <button
            onClick={() => setSelected("standalone")}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:outline-none ${
              selected === "standalone"
                ? "border-[#4285F4] shadow-[0_0_0_3px_rgba(66,133,244,0.08)]"
                : "border-[#E2E8F0] hover:border-[#93C5FD]"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${selected === "standalone" ? "bg-[#E8F0FE]" : "bg-[#F8FAFC]"}`}>
                <Layers size={22} className={selected === "standalone" ? "text-[#4285F4]" : "text-[#94A3B8]"} />
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected === "standalone" ? "border-[#4285F4] bg-[#4285F4]" : "border-[#CBD5E1] bg-white"}`}>
                {selected === "standalone" && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <h3 className={`mb-1.5 transition-colors ${selected === "standalone" ? "text-[#4285F4]" : "text-[#1E293B]"}`}>
              Standalone Project
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect a single GCP project via Cloud Shell and Workload Identity Federation.
            </p>
            {selected === "standalone" && (
              <div className="mt-3 flex items-center gap-1 text-[#4285F4] text-xs">
                <span>Single project setup</span>
                <ChevronRight size={12} />
              </div>
            )}
          </button>
        </div>

        {/* Org admin note */}
        <div className={`max-w-2xl mt-5 transition-all duration-300 ${selected === "org" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4">
            <AlertTriangle size={18} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-[#92400E] text-sm">
              <span className="font-medium">Organization Admin required.</span> The account used to run
              the provisioning script must have Organization Admin permissions on your GCP organization.
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] max-w-2xl">
          <button onClick={onBack} className="px-5 py-2 rounded-lg border border-[#4285F4] text-[#4285F4] bg-white text-sm hover:bg-[#E8F0FE] transition-colors">
            Back
          </button>
          <button
            onClick={() => selected && onContinue(selected)}
            disabled={!selected}
            className={`px-6 py-2 rounded-lg text-white text-sm transition-all duration-200 flex items-center gap-2 ${selected ? "bg-[#4285F4] hover:bg-[#3367D6] shadow-sm hover:shadow-md cursor-pointer" : "bg-[#CBD5E1] cursor-not-allowed"}`}
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
