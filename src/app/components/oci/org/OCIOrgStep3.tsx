import { useState } from "react";
import { Info } from "lucide-react";
import { OCIOrgFormData, OCI_AUTO_GENERATED } from "../../../types";
import { OCICloudShellFrame } from "../OCICloudShellFrame";

interface Props {
  data: OCIOrgFormData;
  showShell: boolean;
  onOpenShell: () => void;
  onShellDone: () => void;
  onNext: () => void;
  onBack: () => void;
}

export function OCIOrgStep3({ data, showShell, onOpenShell, onShellDone, onNext, onBack }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const command = [
    `bash <(curl -sL ${OCI_AUTO_GENERATED.scriptOrgUrl}) \\`,
    `  --tenancy-ocid "${data.adminTenancyOcid || "ocid1.tenancy.oc1..<admin-tenancy-ocid>"}" \\`,
    `  --region "${data.homeRegion || "<home-region>"}" \\`,
    `  --org-level \\`,
    `  --auto-sync-tenancies "${data.autoSyncTenancies ? "true" : "false"}" \\`,
    `  --verification-token "${OCI_AUTO_GENERATED.verificationToken}" \\`,
    `  --callback-endpoint "${OCI_AUTO_GENERATED.callbackEndpoint}"`,
  ].join("\n");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto px-8 py-6">
        <h2 className="text-[#1E293B] mb-1">Deploy via Cloud Shell</h2>
        <p className="text-sm text-[#64748B] mb-4">
          Run this org-level script in OCI Cloud Shell from your Organization Administrator tenancy. It creates cross-tenancy policies,
          enumerates child tenancies, and automatically transmits all credentials to AccuKnox.
        </p>

        <div className="max-w-2xl flex flex-col gap-5">
          <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg p-4">
            <Info size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1E40AF]">
              The script uses OCI's Endorse/Admit cross-tenancy policy pattern to grant AccuKnox read access across all child tenancies
              without deploying per-tenancy resources. Child tenancy OCIDs are automatically included in the callback payload.
            </p>
          </div>

          {showShell ? (
            <OCICloudShellFrame command={command} onDone={onShellDone} />
          ) : (
            <>
              <div className="rounded-xl overflow-hidden border border-[#3C3C3C]">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: "#1A1A2E" }}>
                  <div className="w-3 h-3 rounded-full bg-[#C74634]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
                  <span className="text-[#94A3B8] text-xs font-mono ml-2">Command preview</span>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed" style={{ backgroundColor: "#0F0F1A" }}>
                  <span className="text-[#C74634]">$</span>
                  <span className="text-[#E2E8F0] ml-2 whitespace-pre-wrap">{command}</span>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] accent-[#C74634]"
                />
                <span className="text-sm text-[#475569]">
                  I confirm I am running this script from the <span className="font-medium text-[#1E293B]">Organization Administrator tenancy</span> and understand
                  that it will create cross-tenancy policies in all child tenancies.
                </span>
              </label>

              <button
                onClick={onOpenShell}
                disabled={!confirmed}
                className={`self-start px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors ${confirmed ? "bg-[#C74634] hover:bg-[#A8372A]" : "bg-[#CBD5E1] cursor-not-allowed"}`}
              >
                Open Cloud Shell &amp; Run Script
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] shrink-0">
        <button onClick={onBack} className="px-5 py-2 rounded-lg border border-[#C74634] text-[#C74634] bg-white text-sm hover:bg-[#FEF2EE] transition-colors">Back</button>
        <button
          onClick={onNext}
          disabled={!showShell}
          className={`px-6 py-2 rounded-lg text-white text-sm transition-colors ${showShell ? "bg-[#C74634] hover:bg-[#A8372A]" : "bg-[#CBD5E1] cursor-not-allowed"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
