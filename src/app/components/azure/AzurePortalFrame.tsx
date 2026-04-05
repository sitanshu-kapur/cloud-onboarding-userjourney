import { useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { AZURE_AUTO_GENERATED } from "../../types";

interface AzurePortalFrameProps {
  mode: "standalone" | "org";
  subscriptionId?: string;
  managementGroupId?: string;
  tenantId?: string;
  onComplete: () => void;
  onCancel: () => void;
}

function PortalField({
  label,
  value,
  locked,
}: {
  label: string;
  value: string;
  locked?: boolean;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs text-[#605E5C] mb-1 font-medium">{label}</p>
      <div
        className={`px-3 py-2 rounded border text-sm font-mono ${
          locked
            ? "bg-[#F3F2F1] border-[#C8C6C4] text-[#323130]"
            : "bg-white border-[#C8C6C4] text-[#323130]"
        }`}
      >
        {value}
        {locked && (
          <span className="ml-2 text-[10px] text-[#A19F9D] font-sans font-normal">(pre-filled)</span>
        )}
      </div>
    </div>
  );
}

export function AzurePortalFrame({
  mode,
  subscriptionId,
  managementGroupId,
  tenantId,
  onComplete,
  onCancel,
}: AzurePortalFrameProps) {
  const [tab, setTab] = useState<"basics" | "review">("basics");
  const [agreed, setAgreed] = useState(false);

  const isOrg = mode === "org";

  const handleNext = () => {
    if (tab === "basics") setTab("review");
    else if (agreed) onComplete();
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Azure Portal top nav */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] shrink-0">
        <div className="flex items-center gap-3">
          {/* Azure logo mark */}
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M6.5 0L0 14h4.5L9 5.5 13.5 14H18L11.5 0H6.5Z" fill="#0078D4" />
          </svg>
          <span className="text-white text-sm font-semibold">Microsoft Azure</span>
          <span className="text-[#6B6B6B] text-xs">|</span>
          <span className="text-[#A0A0A0] text-xs">Custom deployment</span>
        </div>
        <button onClick={onCancel} className="text-[#A0A0A0] hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Azure Portal breadcrumb bar */}
      <div className="flex items-center gap-2 px-6 py-2.5 bg-[#FAF9F8] border-b border-[#EDEBE9] shrink-0">
        <span className="text-[#605E5C] text-xs">Home</span>
        <ChevronRight size={12} className="text-[#A19F9D]" />
        <span className="text-[#605E5C] text-xs">Custom deployment</span>
        <ChevronRight size={12} className="text-[#A19F9D]" />
        <span className="text-[#323130] text-xs font-medium">
          {isOrg ? "Deploy Lighthouse Delegation" : "Deploy App Registration"}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 px-6 bg-white border-b border-[#EDEBE9] shrink-0">
        {(["basics", "review"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm capitalize border-b-2 transition-colors -mb-px ${
              tab === t
                ? "border-[#0078D4] text-[#0078D4] font-medium"
                : "border-transparent text-[#605E5C] hover:text-[#323130]"
            }`}
          >
            {t === "basics" ? "Basics" : "Review + create"}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-[#FAF9F8]">
        {tab === "basics" && (
          <div className="max-w-xl mx-auto py-6 px-6">
            <div className="bg-white border border-[#EDEBE9] rounded-lg p-6 mb-4 shadow-sm">
              <h2 className="text-[#323130] text-base font-semibold mb-1">
                {isOrg ? "AccuKnox Lighthouse Delegation" : "AccuKnox App Registration"}
              </h2>
              <p className="text-[#605E5C] text-sm mb-5">
                {isOrg
                  ? "Deploys Azure Lighthouse delegation and an Azure Policy for automatic subscription coverage."
                  : "Creates an Azure App Registration and Service Principal for AccuKnox monitoring access."}
              </p>

              {/* Subscription / scope */}
              {!isOrg && subscriptionId && (
                <PortalField label="Subscription" value={subscriptionId} locked />
              )}
              {isOrg && managementGroupId && (
                <PortalField label="Management Group" value={managementGroupId} locked />
              )}

              {/* AccuKnox fields */}
              <PortalField
                label="AccuKnox Tenant ID"
                value={AZURE_AUTO_GENERATED.accuknoxTenantId}
                locked
              />
              <PortalField
                label="Verification Token"
                value={AZURE_AUTO_GENERATED.verificationToken}
                locked
              />
              <PortalField
                label={isOrg ? "Lighthouse Definition Name" : "App Registration Name"}
                value={
                  isOrg
                    ? AZURE_AUTO_GENERATED.lighthouseDefinitionName
                    : AZURE_AUTO_GENERATED.appRegistrationName
                }
                locked
              />
              <PortalField
                label="Template URL"
                value={
                  isOrg
                    ? AZURE_AUTO_GENERATED.armTemplateOrgUrl
                    : AZURE_AUTO_GENERATED.armTemplateStandaloneUrl
                }
                locked
              />
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-2 p-3 bg-[#EFF6FC] border border-[#B3D7F2] rounded text-xs text-[#004578]">
              <span className="font-semibold shrink-0">ⓘ</span>
              <span>
                {isOrg
                  ? "This template creates the Lighthouse definition and an Azure Policy that automatically delegates new subscriptions to AccuKnox."
                  : "This template creates an App Registration, Service Principal, and assigns the required Reader and Security Reader roles."}
              </span>
            </div>
          </div>
        )}

        {tab === "review" && (
          <div className="max-w-xl mx-auto py-6 px-6">
            <div className="bg-white border border-[#EDEBE9] rounded-lg p-6 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Check size={18} className="text-[#107C10]" />
                <h2 className="text-[#323130] text-base font-semibold">Validation passed</h2>
              </div>
              <p className="text-[#605E5C] text-sm mb-5">
                Review the configuration below before creating the deployment.
              </p>
              <div className="flex flex-col gap-2.5">
                {[
                  ["Resource", isOrg ? "Azure Lighthouse Delegation" : "App Registration + Service Principal"],
                  ["Scope", isOrg ? managementGroupId || "Management Group" : subscriptionId || "Subscription"],
                  ["AccuKnox Tenant ID", AZURE_AUTO_GENERATED.accuknoxTenantId],
                  ["Verification Token", AZURE_AUTO_GENERATED.verificationToken],
                  [
                    isOrg ? "Lighthouse Definition" : "App Registration Name",
                    isOrg
                      ? AZURE_AUTO_GENERATED.lighthouseDefinitionName
                      : AZURE_AUTO_GENERATED.appRegistrationName,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start gap-4 py-2 border-b border-[#F3F2F1] last:border-0">
                    <span className="text-xs text-[#A19F9D] w-44 shrink-0">{label}</span>
                    <span className="text-xs text-[#323130] font-mono break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <div
                onClick={() => setAgreed(!agreed)}
                className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  agreed ? "bg-[#0078D4] border-[#0078D4]" : "border-[#C8C6C4] bg-white"
                }`}
              >
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-[#323130] leading-relaxed">
                I confirm I have the required permissions and understand this will{" "}
                {isOrg
                  ? "delegate management access to AccuKnox's managing tenant across the specified scope."
                  : "create an App Registration and grant reader-level access to AccuKnox."}
              </p>
            </label>
          </div>
        )}
      </div>

      {/* Azure Portal footer */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white border-t border-[#EDEBE9] shrink-0">
        {tab === "review" ? (
          <button
            onClick={handleNext}
            disabled={!agreed}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
              agreed
                ? "bg-[#0078D4] text-white hover:bg-[#106EBE]"
                : "bg-[#C8C6C4] text-white cursor-not-allowed"
            }`}
          >
            Create
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-[#0078D4] text-white rounded text-sm font-medium hover:bg-[#106EBE] transition-colors"
          >
            Next: Review + create
          </button>
        )}
        <button
          onClick={() => (tab === "review" ? setTab("basics") : onCancel())}
          className="px-5 py-2 border border-[#C8C6C4] text-[#323130] rounded text-sm hover:bg-[#F3F2F1] transition-colors"
        >
          {tab === "review" ? "Previous" : "Cancel"}
        </button>
      </div>
    </div>
  );
}
