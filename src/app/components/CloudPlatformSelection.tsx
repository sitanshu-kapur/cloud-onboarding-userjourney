import { useState } from "react";
import { ChevronRight, Clock } from "lucide-react";

type CloudPlatform = "aws" | "azure" | "gcp" | "oci" | null;

interface CloudPlatformSelectionProps {
  onContinue: (platform: "aws" | "azure" | "gcp" | "oci") => void;
  onCancel?: () => void;
}

/* ─── provider logo badges ─── */
function ProviderLogo({ platform }: { platform: "aws" | "azure" | "gcp" | "oci" }) {
  if (platform === "aws") {
    return (
      <div className="w-12 h-12 rounded-xl bg-[#232F3E] flex items-center justify-center shrink-0">
        <span className="text-[#FF9900] font-bold text-sm tracking-wide">AWS</span>
      </div>
    );
  }
  if (platform === "azure") {
    return (
      <div className="w-12 h-12 rounded-xl bg-[#0078D4] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 18 14" width="28" height="22" fill="none">
          <path d="M6.5 0L0 14h4.5L9 5.5 13.5 14H18L11.5 0H6.5Z" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    );
  }
  if (platform === "gcp") {
    return (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "linear-gradient(135deg, #4285F4 0%, #34A853 50%, #FBBC05 75%, #EA4335 100%)" }}
      >
        <span className="text-white font-bold text-sm tracking-wide drop-shadow">GCP</span>
      </div>
    );
  }
  // OCI
  return (
    <div className="w-12 h-12 rounded-xl bg-[#C74634] flex items-center justify-center shrink-0">
      <span className="text-white font-bold text-sm tracking-wide">OCI</span>
    </div>
  );
}

/* ─── card data ─── */
const PLATFORMS: {
  id: "aws" | "azure" | "gcp" | "oci";
  name: string;
  description: string;
  detail: string;
  comingSoon: boolean;
}[] = [
  {
    id: "aws",
    name: "Amazon Web Services",
    description: "Connect standalone accounts or entire AWS Organizations.",
    detail: "Deploys via CloudFormation · STS AssumeRole auth · OU-level scoping",
    comingSoon: false,
  },
  {
    id: "azure",
    name: "Microsoft Azure",
    description: "Connect Azure subscriptions or full Azure tenants.",
    detail: "Deploys via ARM template · Azure Lighthouse delegated access · Subscription scoping",
    comingSoon: false,
  },
  {
    id: "gcp",
    name: "Google Cloud Platform",
    description: "Connect GCP projects or entire GCP organizations.",
    detail: "Deploys via Cloud Shell · Workload Identity Federation · Folder-level scoping",
    comingSoon: false,
  },
  {
    id: "oci",
    name: "Oracle Cloud Infrastructure",
    description: "Connect OCI tenancies or entire OCI Organizations.",
    detail: "Deploys via Cloud Shell · Automated credential callback · Tenancy-level scoping",
    comingSoon: false,
  },
];

export function CloudPlatformSelection({ onContinue, onCancel }: CloudPlatformSelectionProps) {
  const [selected, setSelected] = useState<CloudPlatform>(null);

  const canContinue = selected !== null;

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E2E8F0]">
        <h1 className="text-[#1E293B] mb-1">Cloud Onboarding</h1>
        <p className="text-[#64748B] text-sm">
          Select a cloud platform to begin connecting your infrastructure to AccuKnox.
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-8 py-8">
        <p className="text-sm text-[#475569] mb-5">
          <span className="text-[#EF4444] mr-0.5">*</span>
          Select Cloud Platform
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-5 max-w-2xl">
          {PLATFORMS.map(({ id, name, description, detail, comingSoon }) => {
            const isSelected = selected === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => !comingSoon && setSelected(id)}
                className={`text-left p-5 rounded-xl border-2 transition-all duration-200 bg-white focus:outline-none ${
                  comingSoon
                    ? "border-[#E2E8F0] opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.08)] shadow-md"
                    : "border-[#E2E8F0] hover:border-[#93C5FD] hover:shadow-md cursor-pointer"
                }`}
              >
                {/* Logo + radio row */}
                <div className="flex items-start justify-between mb-4">
                  <ProviderLogo platform={id} />
                  <div className="flex items-center gap-2">
                    {comingSoon && (
                      <span className="flex items-center gap-1 text-xs bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] px-2 py-0.5 rounded-full font-medium">
                        <Clock size={10} />
                        Coming Soon
                      </span>
                    )}
                    {!comingSoon && (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]"
                            : "border-[#CBD5E1] bg-white"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Text */}
                <h3
                  className={`mb-1.5 text-base transition-colors ${
                    comingSoon
                      ? "text-[#94A3B8]"
                      : isSelected
                      ? "text-[#2563EB]"
                      : "text-[#1E293B]"
                  }`}
                >
                  {name}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-3">{description}</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{detail}</p>

                {isSelected && !comingSoon && (
                  <div className="mt-3 flex items-center gap-1 text-[#2563EB] text-xs font-medium">
                    <span>Configure onboarding</span>
                    <ChevronRight size={12} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] max-w-2xl">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => selected && canContinue && onContinue(selected)}
            disabled={!canContinue}
            className={`px-6 py-2 rounded-lg text-white text-sm transition-all duration-200 flex items-center gap-2 ${
              canContinue
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm hover:shadow-md cursor-pointer"
                : "bg-[#CBD5E1] cursor-not-allowed"
            }`}
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
