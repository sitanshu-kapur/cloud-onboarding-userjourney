import { useState } from "react";
import { Building2, Server, AlertTriangle, ChevronRight } from "lucide-react";

type AccountType = "organization" | "standalone" | null;

interface OnboardingLandingProps {
  existingStandaloneAccounts?: number;
  onContinue?: (type: AccountType) => void;
  onCancel?: () => void;
}

export function OnboardingLanding({
  existingStandaloneAccounts = 0,
  onContinue,
  onCancel,
}: OnboardingLandingProps) {
  const [selected, setSelected] = useState<AccountType>(null);
  const [showError, setShowError] = useState(false);

  const handleContinue = () => {
    if (!selected) return;
    if (selected === "organization" && existingStandaloneAccounts === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onContinue?.(selected);
  };

  const handleCardSelect = (type: AccountType) => {
    setSelected(type);
    setShowError(false);
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-[#E2E8F0]">
        <h1 className="text-[#1E293B] mb-1">AWS Onboarding</h1>
        <p className="text-[#64748B] text-sm">
          Select Account Type to begin your onboarding journey
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-8 py-8">
        {/* Section label */}
        <p className="text-sm text-[#475569] mb-5">
          <span className="text-[#EF4444] mr-0.5">*</span>
          Select Account Type
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-5 max-w-2xl">
          {/* AWS Organization card */}
          <button
            onClick={() => handleCardSelect("organization")}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:outline-none ${
              selected === "organization"
                ? "border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                : "border-[#E2E8F0] hover:border-[#93C5FD]"
            }`}
          >
            {/* Radio + Icon row */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selected === "organization" ? "bg-[#EFF6FF]" : "bg-[#F8FAFC]"
                }`}
              >
                <Building2
                  size={22}
                  className={
                    selected === "organization"
                      ? "text-[#2563EB]"
                      : "text-[#94A3B8]"
                  }
                />
              </div>

              {/* Radio button */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected === "organization"
                    ? "border-[#2563EB] bg-[#2563EB]"
                    : "border-[#CBD5E1] bg-white"
                }`}
              >
                {selected === "organization" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            <h3
              className={`mb-1.5 transition-colors ${
                selected === "organization"
                  ? "text-[#2563EB]"
                  : "text-[#1E293B]"
              }`}
            >
              AWS Organization
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect your entire AWS org or specific OUs via CloudFormation
              StackSet
            </p>

            {selected === "organization" && (
              <div className="mt-3 flex items-center gap-1 text-[#2563EB] text-xs">
                <span>Multi-account coverage</span>
                <ChevronRight size={12} />
              </div>
            )}
          </button>

          {/* Standalone Account card */}
          <button
            onClick={() => handleCardSelect("standalone")}
            className={`text-left p-5 rounded-xl border-2 transition-all duration-200 bg-white shadow-sm hover:shadow-md focus:outline-none ${
              selected === "standalone"
                ? "border-[#2563EB] shadow-[0_0_0_3px_rgba(37,99,235,0.08)]"
                : "border-[#E2E8F0] hover:border-[#93C5FD]"
            }`}
          >
            {/* Radio + Icon row */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selected === "standalone" ? "bg-[#EFF6FF]" : "bg-[#F8FAFC]"
                }`}
              >
                <Server
                  size={22}
                  className={
                    selected === "standalone"
                      ? "text-[#2563EB]"
                      : "text-[#94A3B8]"
                  }
                />
              </div>

              {/* Radio button */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  selected === "standalone"
                    ? "border-[#2563EB] bg-[#2563EB]"
                    : "border-[#CBD5E1] bg-white"
                }`}
              >
                {selected === "standalone" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            <h3
              className={`mb-1.5 transition-colors ${
                selected === "standalone" ? "text-[#2563EB]" : "text-[#1E293B]"
              }`}
            >
              Standalone Account
            </h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Connect a single AWS account via a single CloudFormation Stack
            </p>

            {selected === "standalone" && (
              <div className="mt-3 flex items-center gap-1 text-[#2563EB] text-xs">
                <span>Single account setup</span>
                <ChevronRight size={12} />
              </div>
            )}
          </button>
        </div>

        {/* Error / Warning banner */}
        <div
          className={`max-w-2xl mt-5 transition-all duration-300 ${
            showError
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4">
            <AlertTriangle
              size={18}
              className="text-[#D97706] shrink-0 mt-0.5"
            />
            <div>
              <p className="text-[#92400E] text-sm font-medium">
                No accounts onboarded
              </p>
              <p className="text-[#B45309] text-sm mt-0.5">
                You have no accounts onboarded. Please add at least one
                management account first.
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-6 border-t border-[#E2E8F0] max-w-2xl">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleContinue}
            disabled={!selected}
            className={`px-6 py-2 rounded-lg text-white text-sm transition-all duration-200 flex items-center gap-2 ${
              selected
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
