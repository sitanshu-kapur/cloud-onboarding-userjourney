import { Fragment, ReactNode } from "react";
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
  OCIStandaloneFormData,
  OCIOrgFormData,
  OCI_AUTO_GENERATED,
  OCI_REGIONS,
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

/* ─── oci mock data ─── */

const MOCK_OCI_TENANCIES = [
  { name: "prod-tenancy-01", id: "ocid1.tenancy.oc1..aaaaaaaaprod01", folder: "Production", status: "connected" as const },
  { name: "prod-db-01", id: "ocid1.tenancy.oc1..aaaaaaaaproddb01", folder: "Production", status: "syncing" as const },
  { name: "dev-tenancy-01", id: "ocid1.tenancy.oc1..aaaaaaaadev01", folder: "Development", status: "connected" as const },
  { name: "dev-test-01", id: "ocid1.tenancy.oc1..aaaaaaaadevtest01", folder: "Development", status: "syncing" as const },
  { name: "security-hub-01", id: "ocid1.tenancy.oc1..aaaaaaaasechub01", folder: "Security", status: "syncing" as const },
];

const UNIQUE_OCI_GROUPS = [
  ...new Map(MOCK_OCI_TENANCIES.map((t) => [t.folder, { name: t.folder }])).values(),
];

/* ─── oci content ─── */

function OCIStandaloneContent({ data }: { data: OCIStandaloneFormData }) {
  const regionLabel = OCI_REGIONS.find(r => r.value === data.homeRegion)?.label ?? data.homeRegion;
  const permMap: Record<string, string> = {
    monitoring: "Monitoring", remediation: "Remediation", dataScanning: "Data Scanning",
    workloadVMs: "VMs & Compute", workloadContainers: "Containers & OKE",
  };
  const permsEnabled = Object.entries(data.permissions).filter(([, v]) => v).map(([k]) => permMap[k]).join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Server size={18} className="text-[#C74634]" />, bg: "bg-[#FEF2EE]", label: "Tenancy", value: data.displayName || "—" },
          { icon: <CheckCircle2 size={18} className="text-[#16A34A]" />, bg: "bg-[#F0FDF4]", label: "Auth Method", value: "IAM User + API Key" },
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
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Tenancy Details</p>
        </div>
        <div className="px-5">
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <DetailRow label="Display Name" value={data.displayName} />
              <DetailRow label="Home Region" value={regionLabel} />
              <DetailRow label="IAM User" value={OCI_AUTO_GENERATED.iamUserName} />
            </div>
            <div>
              <DetailRow label="Tenancy OCID" value={data.tenancyOcid} />
              <DetailRow label="Compartment Scope" value={data.compartmentScope === "all" ? "All compartments" : data.compartmentIds} />
              <DetailRow label="Policy" value={OCI_AUTO_GENERATED.policyName} />
            </div>
          </div>
          <div className="flex items-start gap-4 py-2.5">
            <span className="text-sm text-[#64748B] w-44 shrink-0">Permissions</span>
            <span className="text-sm text-[#1E293B] font-medium">{permsEnabled}</span>
          </div>
        </div>
      </div>
      <ScanStatusCard scanPercent={15} label="Scanning OCI resources in tenancy…" />
    </div>
  );
}

function OCIOrgContent({ data }: { data: OCIOrgFormData }) {
  const connectedCount = MOCK_OCI_TENANCIES.filter(t => t.status === "connected").length;
  const syncingCount = MOCK_OCI_TENANCIES.filter(t => t.status === "syncing").length;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: <Building2 size={18} className="text-[#C74634]" />, bg: "bg-[#FEF2EE]", label: "Groups", value: String(UNIQUE_OCI_GROUPS.length), color: "text-[#1E293B]" },
          { icon: <Server size={18} className="text-[#64748B]" />, bg: "bg-[#F8FAFC]", label: "Total Tenancies", value: String(MOCK_OCI_TENANCIES.length), color: "text-[#1E293B]" },
          { icon: <CheckCircle2 size={18} className="text-[#16A34A]" />, bg: "bg-[#F0FDF4]", label: "Connected", value: String(connectedCount), color: "text-[#16A34A]" },
          { icon: <RefreshCw size={18} className="text-[#C74634]" />, bg: "bg-[#FEF2EE]", label: "Syncing", value: String(syncingCount), color: "text-[#C74634]" },
        ].map(({ icon, bg, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>{icon}</div>
            <div><p className="text-xs text-[#64748B]">{label}</p><p className={`text-lg font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>
      <ScanStatusCard scanPercent={11} label={`Scanning ${MOCK_OCI_TENANCIES.length} tenancies… (${connectedCount} complete)`} />
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Organization Configuration</p>
        </div>
        <div className="px-5 grid grid-cols-2 gap-x-8">
          <div>
            <DetailRow label="Organization Name" value={data.displayName} />
            <DetailRow label="Admin Tenancy OCID" value={data.adminTenancyOcid} />
            <DetailRow label="Home Region" value={data.homeRegion} />
          </div>
          <div>
            <DetailRow label="Auth Method" value="Cross-tenancy Endorse/Admit" />
            <DetailRow label="IAM User" value={OCI_AUTO_GENERATED.iamUserName} />
            <DetailRow label="Auto-sync Tenancies" value={data.autoSyncTenancies ? "Enabled" : "Disabled"} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Child Tenancies</p>
          <span className="text-xs text-[#64748B]">{MOCK_OCI_TENANCIES.length} tenancies</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/4">Tenancy Name</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-2/5">Tenancy OCID</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/5">Group</th>
              <th className="text-left text-xs font-medium text-[#94A3B8] px-5 py-3 w-1/6">Status</th>
            </tr>
          </thead>
          <tbody>
            {UNIQUE_OCI_GROUPS.map((group) => {
              const tenancies = MOCK_OCI_TENANCIES.filter(t => t.folder === group.name);
              return (
                <Fragment key={group.name}>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <td colSpan={4} className="px-5 py-2">
                      <div className="flex items-center gap-2">
                        <Building2 size={13} className="text-[#64748B]" />
                        <span className="text-xs font-semibold text-[#475569]">{group.name}</span>
                        <span className="ml-auto text-xs text-[#94A3B8]">{tenancies.length} tenanc{tenancies.length !== 1 ? "ies" : "y"}</span>
                      </div>
                    </td>
                  </tr>
                  {tenancies.map(t => (
                    <tr key={t.id} className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3 text-sm text-[#1E293B] font-medium pl-9">{t.name}</td>
                      <td className="px-5 py-3 text-xs text-[#64748B] font-mono">{t.id}</td>
                      <td className="px-5 py-3 text-sm text-[#64748B]">{t.folder}</td>
                      <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
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

/* ─── mock form data for non-active orgs in multi-cloud view ─── */

const MOCK_AWS_ORG_DATA: OrgFormData = {
  managementMethod: "select",
  managementAccountId: "111122223333",
  managementRoleArn: "",
  awsOrgId: "o-ab12cd34ef",
  iamRoleName: "AccuKnox-OrgRole",
  permissions: { monitoring: true, remediation: true, dataScanning: true, workloadEC2: true, workloadECR: false },
  autoSyncFolder: true,
  iamRoleArn: "arn:aws:iam::111122223333:role/AccuKnox-OrgRole",
  ouScope: "all",
  rootOuId: "r-ab12",
  ouIds: "",
};

const MOCK_AZURE_ORG_DATA: AzureOrgFormData = {
  displayName: "Contoso Azure Org",
  tenantId: "11111111-2222-3333-4444-555555555555",
  managementGroupId: "mg-contoso-root",
  permissions: { monitoring: true, remediation: true, dataScanning: true, workloadVMs: true, workloadACR: false },
  autoSyncSubscriptions: true,
  scope: "all",
  rootManagementGroupId: "mg-contoso-root",
  scopeIds: "",
};

const MOCK_GCP_ORG_DATA: GCPOrgFormData = {
  displayName: "My GCP Org",
  orgId: "123456789012",
  orchestratorProjectId: "accuknox-orchestrator-01",
  orchestratorProjectNumber: "987654321098",
  permissions: { monitoring: true, remediation: true, dataScanning: true, workloadCompute: true, workloadGKE: false },
  autoEnrollNewProjects: true,
  scope: "all",
  rootFolderId: "folders/123456789",
  scopeIds: "",
};

const MOCK_OCI_ORG_DATA: OCIOrgFormData = {
  displayName: "Contoso OCI Org",
  adminTenancyOcid: "ocid1.tenancy.oc1..aaaaaaaaadmintenancy",
  homeRegion: "us-ashburn-1",
  permissions: { monitoring: true, remediation: true, dataScanning: true, workloadVMs: true, workloadContainers: false },
  autoSyncTenancies: true,
  compartmentScope: "all",
  compartmentIds: "",
  scope: "all",
  rootTenancyOcid: "ocid1.tenancy.oc1..aaaaaaaaadmintenancy",
  scopeIds: "",
};

/* ─── cloud org section wrapper ─── */

function CloudOrgSection({
  cloud,
  isNew,
  children,
}: {
  cloud: "aws" | "azure" | "gcp" | "oci";
  isNew: boolean;
  children: ReactNode;
}) {
  const CLOUD_CONFIG = {
    aws: {
      bg: "#232F3E",
      label: "Amazon Web Services",
      logo: <span className="text-[#FF9900] font-bold text-xs tracking-wide">AWS</span>,
    },
    azure: {
      bg: "#0078D4",
      label: "Microsoft Azure",
      logo: (
        <svg viewBox="0 0 18 14" width="18" height="14" fill="none">
          <path d="M6.5 0L0 14h4.5L9 5.5 13.5 14H18L11.5 0H6.5Z" fill="white" fillOpacity="0.9" />
        </svg>
      ),
    },
    gcp: {
      bg: "#4285F4",
      label: "Google Cloud Platform",
      logo: <span className="text-white font-bold text-xs tracking-wide">GCP</span>,
    },
    oci: {
      bg: "#C74634",
      label: "Oracle Cloud Infrastructure",
      logo: <span className="text-white font-bold text-xs tracking-wide">OCI</span>,
    },
  };
  const { bg, label, logo } = CLOUD_CONFIG[cloud];

  return (
    <div className="rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center shrink-0">
            {logo}
          </div>
          <span className="text-white font-semibold text-sm">{label}</span>
        </div>
        {isNew ? (
          <span className="flex items-center gap-1.5 text-xs bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded-full font-medium">
            <CheckCircle2 size={11} />
            Just Connected
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-xs bg-white/10 text-white/70 border border-white/20 px-2.5 py-0.5 rounded-full font-medium">
            <CheckCircle2 size={11} />
            Connected
          </span>
        )}
      </div>
      <div className="p-5 bg-[#F8FAFC] flex flex-col gap-4">{children}</div>
    </div>
  );
}

/* ─── multi-cloud org overview ─── */

function MultiCloudOrgOverview({
  activeCloud,
  data,
}: {
  activeCloud: "aws" | "azure" | "gcp" | "oci";
  data: OrgFormData | AzureOrgFormData | GCPOrgFormData | OCIOrgFormData;
}) {
  const awsData = activeCloud === "aws" ? (data as OrgFormData) : MOCK_AWS_ORG_DATA;
  const azureData = activeCloud === "azure" ? (data as AzureOrgFormData) : MOCK_AZURE_ORG_DATA;
  const gcpData = activeCloud === "gcp" ? (data as GCPOrgFormData) : MOCK_GCP_ORG_DATA;
  const ociData = activeCloud === "oci" ? (data as OCIOrgFormData) : MOCK_OCI_ORG_DATA;

  return (
    <div className="flex flex-col gap-6">
      <CloudOrgSection cloud="aws" isNew={activeCloud === "aws"}>
        <OrgContent data={awsData} />
      </CloudOrgSection>
      <CloudOrgSection cloud="azure" isNew={activeCloud === "azure"}>
        <AzureOrgContent data={azureData} />
      </CloudOrgSection>
      <CloudOrgSection cloud="gcp" isNew={activeCloud === "gcp"}>
        <GCPOrgContent data={gcpData} />
      </CloudOrgSection>
      <CloudOrgSection cloud="oci" isNew={activeCloud === "oci"}>
        <OCIOrgContent data={ociData} />
      </CloudOrgSection>
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
  | { flowType: "gcp-org"; data: GCPOrgFormData; onDashboard: () => void }
  | { flowType: "oci-standalone"; data: OCIStandaloneFormData; onDashboard: () => void }
  | { flowType: "oci-org"; data: OCIOrgFormData; onDashboard: () => void };

const BADGE_CONFIG: Record<PostOnboardingOverviewProps["flowType"], { label: string; color: string }> = {
  standalone: { label: "AWS Account Connected", color: "bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]" },
  org: { label: "4 Organizations Connected", color: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]" },
  "azure-standalone": { label: "Azure Subscription Connected", color: "bg-[#EFF6FF] text-[#0078D4] border-[#BFDBFE]" },
  "azure-org": { label: "4 Organizations Connected", color: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]" },
  "gcp-standalone": { label: "GCP Project Connected", color: "bg-[#E8F0FE] text-[#4285F4] border-[#AECBFA]" },
  "gcp-org": { label: "4 Organizations Connected", color: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]" },
  "oci-standalone": { label: "OCI Tenancy Connected", color: "bg-[#FEF2EE] text-[#C74634] border-[#FECACA]" },
  "oci-org": { label: "4 Organizations Connected", color: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]" },
};

const SUBTITLE_CONFIG: Record<PostOnboardingOverviewProps["flowType"], string> = {
  standalone: "Your AWS account has been connected to AccuKnox. Scanning is underway.",
  org: "Your AWS Organization has been connected. All connected cloud organizations are shown below.",
  "azure-standalone": "Your Azure subscription has been connected to AccuKnox. Scanning is underway.",
  "azure-org": "Your Azure Organization has been connected. All connected cloud organizations are shown below.",
  "gcp-standalone": "Your GCP project has been connected to AccuKnox. Scanning is underway.",
  "gcp-org": "Your GCP Organization has been connected. All connected cloud organizations are shown below.",
  "oci-standalone": "Your OCI tenancy has been connected to AccuKnox. Scanning is underway.",
  "oci-org": "Your OCI Organization has been connected. All connected cloud organizations are shown below.",
};

export function PostOnboardingOverview(props: PostOnboardingOverviewProps) {
  const { onDashboard } = props;
  const badge = BADGE_CONFIG[props.flowType];
  const isAzure = props.flowType === "azure-standalone" || props.flowType === "azure-org";
  const isGCP = props.flowType === "gcp-standalone" || props.flowType === "gcp-org";
  const isOCI = props.flowType === "oci-standalone" || props.flowType === "oci-org";
  const accentBorder = isAzure ? "border-[#0078D4]" : isGCP ? "border-[#4285F4]" : isOCI ? "border-[#C74634]" : "border-[#2563EB]";
  const accentText = isAzure ? "text-[#0078D4]" : isGCP ? "text-[#4285F4]" : isOCI ? "text-[#C74634]" : "text-[#2563EB]";
  const accentHover = isGCP ? "hover:bg-[#E8F0FE]" : isOCI ? "hover:bg-[#FEF2EE]" : "hover:bg-[#EFF6FF]";
  const primaryBg = isAzure ? "bg-[#0078D4] hover:bg-[#106EBE]" : isGCP ? "bg-[#4285F4] hover:bg-[#3367D6]" : isOCI ? "bg-[#C74634] hover:bg-[#A8372A]" : "bg-[#2563EB] hover:bg-[#1D4ED8]";

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
        {props.flowType === "standalone" && <StandaloneContent data={props.data} />}
        {props.flowType === "azure-standalone" && <AzureStandaloneContent data={props.data} />}
        {props.flowType === "gcp-standalone" && <GCPStandaloneContent data={props.data} />}
        {props.flowType === "oci-standalone" && <OCIStandaloneContent data={props.data} />}
        {props.flowType === "org" && <MultiCloudOrgOverview activeCloud="aws" data={props.data} />}
        {props.flowType === "azure-org" && <MultiCloudOrgOverview activeCloud="azure" data={props.data} />}
        {props.flowType === "gcp-org" && <MultiCloudOrgOverview activeCloud="gcp" data={props.data} />}
        {props.flowType === "oci-org" && <MultiCloudOrgOverview activeCloud="oci" data={props.data} />}

        {/* Amber migration banner — always shown */}
        <AmberMigrationBanner />

        {/* Bottom padding */}
        <div className="pb-2" />
      </div>
    </div>
  );
}
