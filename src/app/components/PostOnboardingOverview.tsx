import { Fragment } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
  Building2,
  Server,
  RefreshCw,
  Shield,
  CreditCard,
} from "lucide-react";
import {
  StandaloneFormData,
  OrgFormData,
  AUTO_GENERATED,
  AWS_REGIONS,
  MOCK_MANAGEMENT_ACCOUNTS,
  AzureStandaloneFormData,
  AzureOrgFormData,
  AZURE_AUTO_GENERATED,
  GCPStandaloneFormData,
  GCPOrgFormData,
  GCP_AUTO_GENERATED,
} from "../types";

/* ─── mock org data ─── */

const MOCK_OU_ACCOUNTS = [
  {
    name: "Prod-App-01",
    id: "111122223333",
    ou: "Production",
    ouId: "ou-root-abc12345",
    status: "connected" as const,
  },
  {
    name: "Prod-DB-01",
    id: "222233334444",
    ou: "Production",
    ouId: "ou-root-abc12345",
    status: "syncing" as const,
  },
  {
    name: "Prod-Network-01",
    id: "333344445555",
    ou: "Production",
    ouId: "ou-root-abc12345",
    status: "syncing" as const,
  },
  {
    name: "Dev-App-01",
    id: "444455556666",
    ou: "Development",
    ouId: "ou-root-def67890",
    status: "connected" as const,
  },
  {
    name: "Dev-DB-01",
    id: "555566667777",
    ou: "Development",
    ouId: "ou-root-def67890",
    status: "syncing" as const,
  },
  {
    name: "Sec-Hub-01",
    id: "666677778888",
    ou: "Security",
    ouId: "ou-root-ghi11223",
    status: "syncing" as const,
  },
];

const UNIQUE_OUS = [
  ...new Map(MOCK_OU_ACCOUNTS.map((a) => [a.ouId, { name: a.ou, id: a.ouId }])).values(),
];

/* ─── sub-components ─── */

function StatusBadge({ status }: { status: "connected" | "syncing" }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC] px-2.5 py-0.5 rounded-full font-medium">
        <CheckCircle2 size={11} />
        Connected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-2.5 py-0.5 rounded-full font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
      Syncing…
    </span>
  );
}

function ScanStatusCard({ scanPercent, label }: { scanPercent: number; label: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw size={15} className="text-[#2563EB] animate-spin" />
          <h3 className="text-sm font-semibold text-[#1E293B]">Current Scan Status</h3>
        </div>
        <span className="text-xs bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] px-2 py-0.5 rounded-full font-medium">
          In Progress
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
        <span>{label}</span>
        <span className="font-medium text-[#1E293B]">{scanPercent}%</span>
      </div>
      <div className="w-full bg-[#E2E8F0] rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#2563EB] animate-pulse"
          style={{ width: `${scanPercent}%` }}
        />
      </div>
      <p className="text-xs text-[#94A3B8] mt-2">
        Estimated time remaining: ~{Math.ceil((100 - scanPercent) / 12)} minutes
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-[#E2E8F0] last:border-0">
      <span className="text-sm text-[#64748B] w-44 shrink-0">{label}</span>
      <span className="text-sm text-[#1E293B] font-medium break-all">{value || "—"}</span>
    </div>
  );
}

function AmberMigrationBanner() {
  return (
    <div className="flex items-start gap-3 bg-[#FFFBEB] border border-[#FCD34D] border-l-4 border-l-[#F59E0B] rounded-lg p-4">
      <AlertTriangle size={17} className="text-[#D97706] shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-[#92400E]">
          <span className="font-medium">Action recommended:</span> You have existing accounts using
          static key authentication. We recommend migrating to AssumeRole in Account Settings.
        </p>
      </div>
      <a
        href="#"
        className="text-sm text-[#D97706] hover:text-[#B45309] font-medium whitespace-nowrap flex items-center gap-1 transition-colors"
      >
        Go to Account Settings
        <ArrowRight size={13} />
      </a>
    </div>
  );
}

/* ─── standalone content ─── */

function StandaloneContent({ data }: { data: StandaloneFormData }) {
  const regionLabels = data.regions
    .map((r) => AWS_REGIONS.find((a) => a.value === r)?.label ?? r)
    .join(", ");

  const partitionLabel =
    data.partition === "global" ? "AWS Global" : "AWS GovCloud";

  return (
    <div className="flex flex-col gap-5">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Server size={18} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Account</p>
            <p className="text-sm font-semibold text-[#1E293B]">{data.accountName || "—"}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Auth Method</p>
            <p className="text-sm font-semibold text-[#1E293B]">STS AssumeRole</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
            <Shield size={18} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Last Synced</p>
            <p className="text-sm font-semibold text-[#1E293B]">Just now</p>
          </div>
        </div>
      </div>

      {/* Account detail card */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Account Details
          </p>
        </div>
        <div className="px-5">
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <DetailRow label="Account Name" value={data.accountName} />
              <DetailRow label="AWS Account ID" value={data.awsAccountId} />
              <DetailRow label="AWS Partition" value={partitionLabel} />
              <DetailRow label="Management Account" value={data.isManagementAccount ? "Yes" : "No"} />
            </div>
            <div>
              <DetailRow label="External ID" value={AUTO_GENERATED.externalId} />
              <DetailRow label="IAM Role ARN" value={data.iamRoleArn} />
              <DetailRow label="Label" value={data.label} />
              <DetailRow label="Tag" value={data.tag} />
            </div>
          </div>
          {/* Regions — full width */}
          <div className="flex items-start gap-4 py-2.5">
            <span className="text-sm text-[#64748B] w-44 shrink-0">Active Regions</span>
            <span className="text-sm text-[#1E293B] font-medium">
              {regionLabels || "None selected"}
            </span>
          </div>
        </div>
      </div>

      {/* Scan status */}
      <ScanStatusCard scanPercent={23} label="Scanning IAM, EC2, S3 resources…" />
    </div>
  );
}

/* ─── org content ─── */

function OrgContent({ data }: { data: OrgFormData }) {
  const managementAccount = MOCK_MANAGEMENT_ACCOUNTS.find(
    (a) => a.id === data.managementAccountId
  );
  const connectedCount = MOCK_OU_ACCOUNTS.filter((a) => a.status === "connected").length;
  const syncingCount = MOCK_OU_ACCOUNTS.filter((a) => a.status === "syncing").length;

  return (
    <div className="flex flex-col gap-5">
      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">OUs</p>
            <p className="text-lg font-bold text-[#1E293B]">{UNIQUE_OUS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
            <Server size={18} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Total Accounts</p>
            <p className="text-lg font-bold text-[#1E293B]">{MOCK_OU_ACCOUNTS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Connected</p>
            <p className="text-lg font-bold text-[#16A34A]">{connectedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <RefreshCw size={18} className="text-[#2563EB]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Syncing</p>
            <p className="text-lg font-bold text-[#2563EB]">{syncingCount}</p>
          </div>
        </div>
      </div>

      {/* Scan status */}
      <ScanStatusCard
        scanPercent={12}
        label={`Scanning ${MOCK_OU_ACCOUNTS.length} accounts… (${connectedCount} complete)`}
      />

      {/* Org config summary */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            Organization Configuration
          </p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow
              label="Management Account"
              value={
                managementAccount
                  ? `${managementAccount.name} (${managementAccount.id})`
                  : data.managementAccountId
              }
            />
            <DetailRow label="AWS Org ID" value={data.awsOrgId} />
            <DetailRow label="IAM Role Name" value={data.iamRoleName} />
          </div>
          <div>
            <DetailRow label="Auth Method" value="STS AssumeRole" />
            <DetailRow label="External ID" value={AUTO_GENERATED.externalId} />
            <DetailRow
              label="Folder Sync"
              value={data.autoSyncFolder ? "Enabled" : "Disabled"}
            />
          </div>
        </div>
      </div>

      {/* Accounts table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
            OUs & Member Accounts
          </p>
          <span className="text-xs text-[#64748B]">
            {MOCK_OU_ACCOUNTS.length} accounts across {UNIQUE_OUS.length} OUs
          </span>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">
                Account Name
              </th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">
                Account ID
              </th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">
                OU
              </th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {UNIQUE_OUS.map((ou) => {
              const accounts = MOCK_OU_ACCOUNTS.filter((a) => a.ouId === ou.id);
              return (
                <Fragment key={ou.id}>
                  {/* OU group header */}
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <td colSpan={4} className="px-5 py-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[#64748B]" />
                        <span className="text-xs font-semibold text-[#475569]">{ou.name}</span>
                        <span className="text-xs text-[#94A3B8] font-mono">{ou.id}</span>
                        <span className="ml-auto text-xs text-[#94A3B8]">
                          {accounts.length} account{accounts.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                  </tr>
                  {/* Account rows */}
                  {accounts.map((account) => (
                    <tr
                      key={account.id}
                      className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-5 py-3 text-sm text-[#1E293B] font-medium pl-9">
                        {account.name}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#64748B] font-mono">
                        {account.id}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{account.ou}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={account.status} />
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── azure mock data ─── */

const MOCK_AZURE_SUBSCRIPTIONS = [
  { name: "Prod-App-Sub", id: "aaaa1111-bbbb-cccc-dddd-eeee11112222", mg: "Production", mgId: "mg-prod", status: "connected" as const },
  { name: "Prod-DB-Sub", id: "bbbb2222-cccc-dddd-eeee-ffff22223333", mg: "Production", mgId: "mg-prod", status: "syncing" as const },
  { name: "Prod-Network-Sub", id: "cccc3333-dddd-eeee-ffff-aaaa33334444", mg: "Production", mgId: "mg-prod", status: "syncing" as const },
  { name: "Dev-App-Sub", id: "dddd4444-eeee-ffff-aaaa-bbbb44445555", mg: "Development", mgId: "mg-dev", status: "connected" as const },
  { name: "Dev-Test-Sub", id: "eeee5555-ffff-aaaa-bbbb-cccc55556666", mg: "Development", mgId: "mg-dev", status: "syncing" as const },
  { name: "Security-Sub", id: "ffff6666-aaaa-bbbb-cccc-dddd66667777", mg: "Security", mgId: "mg-security", status: "syncing" as const },
];

const UNIQUE_MGS = [
  ...new Map(MOCK_AZURE_SUBSCRIPTIONS.map((s) => [s.mgId, { name: s.mg, id: s.mgId }])).values(),
];

/* ─── azure content ─── */

function AzureStandaloneContent({ data }: { data: AzureStandaloneFormData }) {
  const permissionsSelected = Object.entries(data.permissions)
    .filter(([, v]) => v)
    .map(([k]) => ({ monitoring: "Monitoring", remediation: "Remediation", dataScanning: "Data Scanning", workloadVMs: "VM Protection", workloadACR: "ACR Protection" }[k]))
    .join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-[#0078D4]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Subscription</p>
            <p className="text-sm font-semibold text-[#1E293B]">{data.displayName || "—"}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Auth Method</p>
            <p className="text-sm font-semibold text-[#1E293B]">Service Principal</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
            <Shield size={18} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Last Synced</p>
            <p className="text-sm font-semibold text-[#1E293B]">Just now</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Subscription Details</p>
        </div>
        <div className="px-5">
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <DetailRow label="Display Name" value={data.displayName} />
              <DetailRow label="Subscription ID" value={data.subscriptionId} />
              <DetailRow label="Tenant ID" value={data.tenantId} />
            </div>
            <div>
              <DetailRow label="Application (Client) ID" value={data.applicationId} />
              <DetailRow label="Directory (Tenant) ID" value={data.directoryId} />
              <DetailRow label="AccuKnox Tenant ID" value={AZURE_AUTO_GENERATED.accuknoxTenantId} />
            </div>
          </div>
          <div className="flex items-start gap-4 py-2.5">
            <span className="text-sm text-[#64748B] w-44 shrink-0">Permissions</span>
            <span className="text-sm text-[#1E293B] font-medium">{permissionsSelected}</span>
          </div>
        </div>
      </div>

      <ScanStatusCard scanPercent={18} label="Scanning Azure resources in subscription…" />
    </div>
  );
}

function AzureOrgContent({ data }: { data: AzureOrgFormData }) {
  const connectedCount = MOCK_AZURE_SUBSCRIPTIONS.filter((s) => s.status === "connected").length;
  const syncingCount = MOCK_AZURE_SUBSCRIPTIONS.filter((s) => s.status === "syncing").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <Building2 size={18} className="text-[#0078D4]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Mgmt Groups</p>
            <p className="text-lg font-bold text-[#1E293B]">{UNIQUE_MGS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
            <CreditCard size={18} className="text-[#64748B]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Subscriptions</p>
            <p className="text-lg font-bold text-[#1E293B]">{MOCK_AZURE_SUBSCRIPTIONS.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-[#16A34A]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Connected</p>
            <p className="text-lg font-bold text-[#16A34A]">{connectedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center shrink-0">
            <RefreshCw size={18} className="text-[#0078D4]" />
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Syncing</p>
            <p className="text-lg font-bold text-[#0078D4]">{syncingCount}</p>
          </div>
        </div>
      </div>

      <ScanStatusCard scanPercent={9} label={`Scanning ${MOCK_AZURE_SUBSCRIPTIONS.length} subscriptions… (${connectedCount} complete)`} />

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Organization Configuration</p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Organization Name" value={data.displayName} />
            <DetailRow label="Tenant ID" value={data.tenantId} />
            <DetailRow label="Management Group ID" value={data.managementGroupId} />
          </div>
          <div>
            <DetailRow label="Auth Method" value="Azure Lighthouse Delegation" />
            <DetailRow label="AccuKnox Managing Tenant" value={AZURE_AUTO_GENERATED.accuknoxTenantId} />
            <DetailRow label="Subscription Sync" value={data.autoSyncSubscriptions ? "Automatic" : "Manual"} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Management Groups & Subscriptions</p>
          <span className="text-xs text-[#64748B]">{MOCK_AZURE_SUBSCRIPTIONS.length} subscriptions across {UNIQUE_MGS.length} management groups</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">Subscription Name</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/3">Subscription ID</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/5">Mgmt Group</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/6">Status</th>
            </tr>
          </thead>
          <tbody>
            {UNIQUE_MGS.map((mg) => {
              const subs = MOCK_AZURE_SUBSCRIPTIONS.filter((s) => s.mgId === mg.id);
              return (
                <Fragment key={mg.id}>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <td colSpan={4} className="px-5 py-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[#64748B]" />
                        <span className="text-xs font-semibold text-[#475569]">{mg.name}</span>
                        <span className="text-xs text-[#94A3B8] font-mono">{mg.id}</span>
                        <span className="ml-auto text-xs text-[#94A3B8]">{subs.length} subscription{subs.length !== 1 ? "s" : ""}</span>
                      </div>
                    </td>
                  </tr>
                  {subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3 text-sm text-[#1E293B] font-medium pl-9">{sub.name}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B] font-mono text-xs">{sub.id}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{sub.mg}</td>
                      <td className="px-5 py-3"><StatusBadge status={sub.status} /></td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── gcp mock data ─── */

const MOCK_GCP_PROJECTS = [
  { name: "prod-app-01", id: "prod-app-01", folder: "Production", folderId: "folders/111111", status: "connected" as const },
  { name: "prod-db-01", id: "prod-db-01", folder: "Production", folderId: "folders/111111", status: "syncing" as const },
  { name: "prod-network-01", id: "prod-network-01", folder: "Production", folderId: "folders/111111", status: "syncing" as const },
  { name: "dev-app-01", id: "dev-app-01", folder: "Development", folderId: "folders/222222", status: "connected" as const },
  { name: "dev-test-01", id: "dev-test-01", folder: "Development", folderId: "folders/222222", status: "syncing" as const },
  { name: "security-hub-01", id: "security-hub-01", folder: "Security", folderId: "folders/333333", status: "syncing" as const },
];

const UNIQUE_FOLDERS = [
  ...new Map(MOCK_GCP_PROJECTS.map((p) => [p.folderId, { name: p.folder, id: p.folderId }])).values(),
];

/* ─── gcp content ─── */

function GCPStandaloneContent({ data }: { data: GCPStandaloneFormData }) {
  const permissionsSelected = Object.entries(data.permissions)
    .filter(([, v]) => v)
    .map(([k]) => ({ monitoring: "Monitoring", remediation: "Remediation", dataScanning: "Data Scanning", workloadCompute: "Compute Protection", workloadGKE: "GKE & AR Protection" }[k]))
    .join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Server size={18} className="text-[#4285F4]" />, bg: "bg-[#E8F0FE]", label: "Project", value: data.displayName || "—" },
          { icon: <CheckCircle2 size={18} className="text-[#16A34A]" />, bg: "bg-[#F0FDF4]", label: "Auth Method", value: "Workload Identity Fed." },
          { icon: <Shield size={18} className="text-[#64748B]" />, bg: "bg-[#F8FAFC]", label: "Last Synced", value: "Just now" },
        ].map(({ icon, bg, label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
            <div><p className="text-xs text-[#64748B]">{label}</p><p className="text-sm font-semibold text-[#1E293B]">{value}</p></div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Project Details</p>
        </div>
        <div className="px-5">
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <DetailRow label="Display Name" value={data.displayName} />
              <DetailRow label="Project ID" value={data.projectId} />
              <DetailRow label="Project Number" value={data.projectNumber} />
            </div>
            <div>
              <DetailRow label="WIF Pool ID" value={data.wifPoolId} />
              <DetailRow label="Service Account" value={data.serviceAccountEmail} />
              <DetailRow label="OIDC Issuer" value={GCP_AUTO_GENERATED.accuknoxOidcIssuer} />
            </div>
          </div>
          <div className="flex items-start gap-4 py-2.5">
            <span className="text-sm text-[#64748B] w-44 shrink-0">Permissions</span>
            <span className="text-sm text-[#1E293B] font-medium">{permissionsSelected}</span>
          </div>
        </div>
      </div>

      <ScanStatusCard scanPercent={21} label="Scanning GCP resources in project…" />
    </div>
  );
}

function GCPOrgContent({ data }: { data: GCPOrgFormData }) {
  const connectedCount = MOCK_GCP_PROJECTS.filter((p) => p.status === "connected").length;
  const syncingCount = MOCK_GCP_PROJECTS.filter((p) => p.status === "syncing").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <Building2 size={18} className="text-[#4285F4]" />, bg: "bg-[#E8F0FE]", label: "Folders", value: String(UNIQUE_FOLDERS.length), color: "text-[#1E293B]" },
          { icon: <Server size={18} className="text-[#64748B]" />, bg: "bg-[#F8FAFC]", label: "Total Projects", value: String(MOCK_GCP_PROJECTS.length), color: "text-[#1E293B]" },
          { icon: <CheckCircle2 size={18} className="text-[#16A34A]" />, bg: "bg-[#F0FDF4]", label: "Connected", value: String(connectedCount), color: "text-[#16A34A]" },
          { icon: <RefreshCw size={18} className="text-[#4285F4]" />, bg: "bg-[#E8F0FE]", label: "Syncing", value: String(syncingCount), color: "text-[#4285F4]" },
        ].map(({ icon, bg, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
            <div><p className="text-xs text-[#64748B]">{label}</p><p className={`text-lg font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      <ScanStatusCard scanPercent={8} label={`Scanning ${MOCK_GCP_PROJECTS.length} projects… (${connectedCount} complete)`} />

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Organization Configuration</p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Organization Name" value={data.displayName} />
            <DetailRow label="Organization ID" value={data.orgId} />
            <DetailRow label="Orchestrator Project" value={data.orchestratorProjectId} />
          </div>
          <div>
            <DetailRow label="Auth Method" value="Workload Identity Federation" />
            <DetailRow label="OIDC Issuer" value={GCP_AUTO_GENERATED.accuknoxOidcIssuer} />
            <DetailRow label="Auto-enroll Projects" value={data.autoEnrollNewProjects ? "Enabled" : "Disabled"} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Folders & Projects</p>
          <span className="text-xs text-[#64748B]">{MOCK_GCP_PROJECTS.length} projects across {UNIQUE_FOLDERS.length} folders</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">Project Name</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/3">Project ID</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/5">Folder</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/6">Status</th>
            </tr>
          </thead>
          <tbody>
            {UNIQUE_FOLDERS.map((folder) => {
              const projects = MOCK_GCP_PROJECTS.filter((p) => p.folderId === folder.id);
              return (
                <Fragment key={folder.id}>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <td colSpan={4} className="px-5 py-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[#64748B]" />
                        <span className="text-xs font-semibold text-[#475569]">{folder.name}</span>
                        <span className="text-xs text-[#94A3B8] font-mono">{folder.id}</span>
                        <span className="ml-auto text-xs text-[#94A3B8]">{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
                      </div>
                    </td>
                  </tr>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3 text-sm text-[#1E293B] font-medium pl-9">{project.name}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B] font-mono text-xs">{project.id}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{project.folder}</td>
                      <td className="px-5 py-3"><StatusBadge status={project.status} /></td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── main component ─── */

type PostOnboardingOverviewProps =
  | { flowType: "standalone"; data: StandaloneFormData; onDashboard: () => void }
  | { flowType: "org"; data: OrgFormData; onDashboard: () => void }
  | { flowType: "azure-standalone"; data: AzureStandaloneFormData; onDashboard: () => void }
  | { flowType: "azure-org"; data: AzureOrgFormData; onDashboard: () => void }
  | { flowType: "gcp-standalone"; data: GCPStandaloneFormData; onDashboard: () => void }
  | { flowType: "gcp-org"; data: GCPOrgFormData; onDashboard: () => void };

const BADGE_CONFIG: Record<PostOnboardingOverviewProps["flowType"], { label: string; color: string }> = {
  standalone: { label: "AWS Account Connected", color: "bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]" },
  org: { label: "AWS Organization Connected", color: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]" },
  "azure-standalone": { label: "Azure Subscription Connected", color: "bg-[#EFF6FF] text-[#0078D4] border-[#BFDBFE]" },
  "azure-org": { label: "Azure Organization Connected", color: "bg-[#EFF6FF] text-[#0078D4] border-[#BFDBFE]" },
  "gcp-standalone": { label: "GCP Project Connected", color: "bg-[#E8F0FE] text-[#4285F4] border-[#AECBFA]" },
  "gcp-org": { label: "GCP Organization Connected", color: "bg-[#E8F0FE] text-[#4285F4] border-[#AECBFA]" },
};

const SUBTITLE_CONFIG: Record<PostOnboardingOverviewProps["flowType"], string> = {
  standalone: "Your AWS account has been connected to AccuKnox. Scanning is underway.",
  org: "Your AWS Organization has been connected to AccuKnox. Scanning is underway.",
  "azure-standalone": "Your Azure subscription has been connected to AccuKnox. Scanning is underway.",
  "azure-org": "Your Azure organization has been connected to AccuKnox. Subscription discovery is underway.",
  "gcp-standalone": "Your GCP project has been connected to AccuKnox. Scanning is underway.",
  "gcp-org": "Your GCP organization has been connected to AccuKnox. Project discovery is underway.",
};

export function PostOnboardingOverview(props: PostOnboardingOverviewProps) {
  const { onDashboard } = props;
  const badge = BADGE_CONFIG[props.flowType];
  const isAzure = props.flowType === "azure-standalone" || props.flowType === "azure-org";
  const isGCP = props.flowType === "gcp-standalone" || props.flowType === "gcp-org";
  const accentBorder = isAzure ? "border-[#0078D4]" : isGCP ? "border-[#4285F4]" : "border-[#2563EB]";
  const accentText = isAzure ? "text-[#0078D4]" : isGCP ? "text-[#4285F4]" : "text-[#2563EB]";
  const accentHover = isGCP ? "hover:bg-[#E8F0FE]" : "hover:bg-[#EFF6FF]";
  const primaryBg = isAzure ? "bg-[#0078D4] hover:bg-[#106EBE]" : isGCP ? "bg-[#4285F4] hover:bg-[#3367D6]" : "bg-[#2563EB] hover:bg-[#1D4ED8]";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Page header */}
      <div className="px-8 pt-7 pb-5 border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[#1E293B]">Overview</h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium flex items-center gap-1.5 ${badge.color}`}>
                <CheckCircle2 size={12} />
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-[#64748B]">{SUBTITLE_CONFIG[props.flowType]}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onDashboard}
              className={`flex items-center gap-2 px-5 py-2 border ${accentBorder} ${accentText} rounded-lg text-sm ${accentHover} transition-colors`}
            >
              Add Another Account
              <ArrowRight size={14} />
            </button>
            <button
              onClick={onDashboard}
              className={`flex items-center gap-2 px-5 py-2 ${primaryBg} text-white rounded-lg text-sm shadow-sm transition-all`}
            >
              <LayoutDashboard size={14} />
              Go to Cloud Accounts
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto px-8 py-6 flex flex-col gap-5">
        {props.flowType === "org" && <OrgContent data={props.data} />}
        {props.flowType === "standalone" && <StandaloneContent data={props.data} />}
        {props.flowType === "azure-standalone" && <AzureStandaloneContent data={props.data} />}
        {props.flowType === "azure-org" && <AzureOrgContent data={props.data} />}
        {props.flowType === "gcp-standalone" && <GCPStandaloneContent data={props.data} />}
        {props.flowType === "gcp-org" && <GCPOrgContent data={props.data} />}

        {/* Amber migration banner — always shown */}
        <AmberMigrationBanner />

        {/* Bottom padding */}
        <div className="pb-2" />
      </div>
    </div>
  );
}
