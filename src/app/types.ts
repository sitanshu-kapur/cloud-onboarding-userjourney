export interface StandaloneFormData {
  accountName: string;
  awsAccountId: string;
  label: string;
  tag: string;
  isManagementAccount: boolean;
  partition: "global" | "govcloud";
  regions: string[];
  iamRoleArn: string;
}

export const STANDALONE_STEPS = ["Account Details", "Deploy Role", "Review & Complete"];

export const AUTO_GENERATED = {
  accuknoxAccountId: "081802104111",
  externalId: "akx-7f3d2a1b-9e4c-4f2a-8b1d-3e5f6a7c8d9e",
  roleName: "AccuKnox-CrossAccount-Role",
  cftUrl: "https://accuknox-cfn.s3.amazonaws.com/latest/role.json",
  stackName: "AccuKnox-CrossAccount-Setup",
};

export const AWS_REGIONS = [
  { value: "us-east-1", label: "US East (N. Virginia)" },
  { value: "us-east-2", label: "US East (Ohio)" },
  { value: "us-west-1", label: "US West (N. California)" },
  { value: "us-west-2", label: "US West (Oregon)" },
  { value: "ap-south-1", label: "Asia Pacific (Mumbai)" },
  { value: "ap-northeast-1", label: "Asia Pacific (Tokyo)" },
  { value: "ap-northeast-2", label: "Asia Pacific (Seoul)" },
  { value: "ap-southeast-1", label: "Asia Pacific (Singapore)" },
  { value: "ap-southeast-2", label: "Asia Pacific (Sydney)" },
  { value: "eu-west-1", label: "Europe (Ireland)" },
  { value: "eu-west-2", label: "Europe (London)" },
  { value: "eu-central-1", label: "Europe (Frankfurt)" },
  { value: "ca-central-1", label: "Canada (Central)" },
  { value: "sa-east-1", label: "South America (São Paulo)" },
];

export const LABEL_OPTIONS = ["Production", "Development", "Staging", "Testing", "Security"];
export const TAG_OPTIONS = ["Critical", "Non-Critical", "Compliance", "Security", "Monitoring"];

export interface OrgFormData {
  managementMethod: "select" | "inline";
  managementAccountId: string;
  managementRoleArn: string;
  awsOrgId: string;
  iamRoleName: string;
  permissions: {
    monitoring: boolean;
    remediation: boolean;
    dataScanning: boolean;
    workloadEC2: boolean;
    workloadECR: boolean;
  };
  autoSyncFolder: boolean;
  iamRoleArn: string;
  ouScope: "all" | "include" | "exclude";
  rootOuId: string;
  ouIds: string;
}

export const ORG_STEPS = [
  "Management Account",
  "Permissions",
  "Deploy Role",
  "OU Scope",
  "Review & Complete",
];

export const MOCK_MANAGEMENT_ACCOUNTS = [
  { id: "111122223333", name: "Prod Management Account" },
  { id: "444455556666", name: "Staging Management Account" },
];

/* ─── Azure ─── */

export interface AzureStandaloneFormData {
  displayName: string;
  subscriptionId: string;
  tenantId: string;
  label: string;
  tag: string;
  permissions: {
    monitoring: boolean;
    remediation: boolean;
    dataScanning: boolean;
    workloadVMs: boolean;
    workloadACR: boolean;
  };
  applicationId: string;
  directoryId: string;
}

export interface AzureOrgFormData {
  displayName: string;
  tenantId: string;
  managementGroupId: string;
  permissions: {
    monitoring: boolean;
    remediation: boolean;
    dataScanning: boolean;
    workloadVMs: boolean;
    workloadACR: boolean;
  };
  autoSyncSubscriptions: boolean;
  scope: "all" | "include" | "exclude";
  rootManagementGroupId: string;
  scopeIds: string;
}

export const AZURE_STANDALONE_STEPS = [
  "Subscription Details",
  "Permissions",
  "Deploy App Registration",
  "Review & Complete",
];

export const AZURE_ORG_STEPS = [
  "Tenant Details",
  "Permissions",
  "Deploy Lighthouse",
  "Scope",
  "Review & Complete",
];

export const AZURE_AUTO_GENERATED = {
  accuknoxTenantId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  verificationToken: "ak-vt-9f3e2b1a8c7d6e5f",
  appRegistrationName: "AccuKnox-Integration",
  lighthouseDefinitionName: "AccuKnox-Lighthouse-Delegation",
  armTemplateStandaloneUrl:
    "https://accuknox-templates.blob.core.windows.net/azure/v1/standalone.json",
  armTemplateOrgUrl:
    "https://accuknox-templates.blob.core.windows.net/azure/v1/org-lighthouse.json",
};

export const MOCK_AZURE_TENANTS = [
  { id: "11111111-2222-3333-4444-555555555555", name: "Prod Azure Tenant" },
  { id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", name: "Dev Azure Tenant" },
];

/* ─── GCP ─── */

export interface GCPStandaloneFormData {
  displayName: string;
  projectId: string;
  projectNumber: string;
  label: string;
  tag: string;
  permissions: {
    monitoring: boolean;
    remediation: boolean;
    dataScanning: boolean;
    workloadCompute: boolean;
    workloadGKE: boolean;
  };
  wifPoolId: string;
  wifProviderId: string;
  serviceAccountEmail: string;
}

export interface GCPOrgFormData {
  displayName: string;
  orgId: string;
  orchestratorProjectId: string;
  orchestratorProjectNumber: string;
  permissions: {
    monitoring: boolean;
    remediation: boolean;
    dataScanning: boolean;
    workloadCompute: boolean;
    workloadGKE: boolean;
  };
  autoEnrollNewProjects: boolean;
  scope: "all" | "include" | "exclude";
  rootFolderId: string;
  scopeIds: string;
}

export const GCP_STANDALONE_STEPS = [
  "Project Details",
  "Permissions",
  "Deploy via Cloud Shell",
  "Review & Complete",
];

export const GCP_ORG_STEPS = [
  "Organization Details",
  "Permissions",
  "Deploy via Cloud Shell",
  "Scope",
  "Review & Complete",
];

export const GCP_AUTO_GENERATED = {
  accuknoxOidcIssuer: "https://oidc.accuknox.io",
  integrationId: "ak-gcp-9f3e2b1a8c7d",
  serviceAccountName: "accuknox-integration",
  workloadPoolId: "accuknox-wif-pool",
  workloadProviderId: "accuknox-oidc-provider",
  scriptStandaloneUrl: "https://storage.googleapis.com/accuknox-scripts/v1/standalone.sh",
  scriptOrgUrl: "https://storage.googleapis.com/accuknox-scripts/v1/org.sh",
};
