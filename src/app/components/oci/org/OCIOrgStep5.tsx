import { CheckCircle2, Info, RotateCcw } from "lucide-react";
import { OCIOrgFormData, OCI_AUTO_GENERATED, OCI_REGIONS } from "../../../types";

interface Props {
  data: OCIOrgFormData;
  onDashboard: () => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-44 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export function OCIOrgStep5({ data, onDashboard }: Props) {
  const regionLabel = OCI_REGIONS.find(r => r.value === data.homeRegion)?.label ?? data.homeRegion;
  const permMap: Record<string, string> = {
    monitoring: "Security Monitoring",
    remediation: "Remediation",
    dataScanning: "Data Scanning",
    workloadVMs: "VMs & Compute",
    workloadContainers: "Containers & OKE",
  };
  const permsEnabled = Object.entries(data.permissions).filter(([, v]) => v).map(([k]) => permMap[k]).join(", ");
  const scopeLabel =
    data.scope === "all" ? "All child tenancies" :
    data.scope === "include" ? `Include: ${data.scopeIds}` :
    `Exclude: ${data.scopeIds}`;
  const compartmentLabel =
    data.compartmentScope === "all" ? "All compartments" :
    data.compartmentScope === "include" ? `Include: ${data.compartmentIds}` :
    `Exclude: ${data.compartmentIds}`;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle2 size={22} className="text-[#16A34A]" />
          <h2 className="text-[#1E293B]">Organization Connected</h2>
        </div>
        <p className="text-sm text-[#64748B] mb-6">
          Your OCI Organization has been connected to AccuKnox. Review the configuration below.
        </p>

        <div className="max-w-2xl flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl p-4">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[#15803D]">Credentials received automatically</p>
              <p className="text-xs text-[#16A34A] mt-0.5">
                All child tenancy credentials were transmitted directly to AccuKnox by the Cloud Shell script.
              </p>
            </div>
          </div>

          <Section title="AccuKnox Configuration">
            <DetailRow label="IAM User" value={OCI_AUTO_GENERATED.iamUserName} />
            <DetailRow label="Group" value={OCI_AUTO_GENERATED.groupName} />
            <DetailRow label="Policy" value={OCI_AUTO_GENERATED.policyName} />
            <DetailRow label="Auth Type" value="Cross-tenancy Endorse/Admit" />
          </Section>

          <Section title="Organization Details">
            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <DetailRow label="Organization Name" value={data.displayName} />
                <DetailRow label="Home Region" value={regionLabel} />
                <DetailRow label="Auto-sync Tenancies" value={data.autoSyncTenancies ? "Enabled" : "Disabled"} />
              </div>
              <div>
                <DetailRow label="Admin Tenancy OCID" value={data.adminTenancyOcid} />
                <DetailRow label="Tenancy Scope" value={scopeLabel} />
                <DetailRow label="Compartment Scope" value={compartmentLabel} />
              </div>
            </div>
          </Section>

          <Section title="Permissions">
            <div className="py-2.5">
              <span className="text-sm text-[#1E293B] font-medium">{permsEnabled}</span>
            </div>
          </Section>

          <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl p-4">
            <RotateCcw size={16} className="text-[#D97706] shrink-0 mt-0.5" />
            <p className="text-sm text-[#92400E]">
              <span className="font-medium">API key rotation:</span> OCI API keys should be rotated every 90 days.
              A rotation reminder and one-click rotate action are available in Account Settings for each connected tenancy.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4">
            <Info size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
            <p className="text-sm text-[#1E40AF]">
              {data.autoSyncTenancies
                ? "Auto-sync is enabled. New child tenancies added to this OCI Organization will be automatically detected and onboarded via OCI Event Service."
                : "Auto-sync is disabled. New child tenancies must be onboarded manually from the Cloud Accounts settings page."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end px-8 py-4 border-t border-[#E2E8F0] shrink-0">
        <button onClick={onDashboard} className="px-6 py-2 rounded-lg bg-[#C74634] hover:bg-[#A8372A] text-white text-sm transition-colors">
          Go to Cloud Accounts
        </button>
      </div>
    </div>
  );
}
