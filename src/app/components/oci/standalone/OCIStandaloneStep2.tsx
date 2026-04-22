import { OCIStandaloneFormData } from "../../../types";

interface Props {
  data: OCIStandaloneFormData;
  onChange: (data: OCIStandaloneFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

const PERMISSIONS = [
  {
    key: "monitoring" as const,
    label: "Security Monitoring",
    description: "Inspect all resources, read audit logs and Cloud Guard findings",
    locked: true,
  },
  {
    key: "remediation" as const,
    label: "Remediation",
    description: "Manage security findings and apply recommended remediations",
    locked: false,
  },
  {
    key: "dataScanning" as const,
    label: "Data Scanning",
    description: "Read Object Storage buckets, database metadata",
    locked: false,
  },
  {
    key: "workloadVMs" as const,
    label: "Workload — VMs & Compute",
    description: "Read compute instances, boot volumes, and images",
    locked: false,
  },
  {
    key: "workloadContainers" as const,
    label: "Workload — Containers & OKE",
    description: "Read OKE clusters, container images, and Artifact Registry",
    locked: false,
  },
];

function Toggle({ on, locked, onToggle }: { on: boolean; locked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={locked ? undefined : onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${locked ? "cursor-not-allowed" : "cursor-pointer"} ${on ? "bg-[#C74634]" : "bg-[#CBD5E1]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export function OCIStandaloneStep2({ data, onChange, onNext, onBack }: Props) {
  const toggle = (key: keyof OCIStandaloneFormData["permissions"]) => {
    onChange({ ...data, permissions: { ...data.permissions, [key]: !data.permissions[key] } });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto px-8 py-6">
        <h2 className="text-[#1E293B] mb-1">Permissions</h2>
        <p className="text-sm text-[#64748B] mb-6">
          Select the capabilities AccuKnox requires. Only the checked permissions are included in the provisioned IAM policy.
        </p>

        <div className="max-w-xl flex flex-col gap-3">
          {PERMISSIONS.map(({ key, label, description, locked }) => (
            <div key={key} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${data.permissions[key] ? "border-[#C74634] bg-[#FEF2EE]" : "border-[#E2E8F0] bg-white"}`}>
              <Toggle on={data.permissions[key]} locked={locked} onToggle={() => toggle(key)} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1E293B]">{label}</p>
                  {locked && (
                    <span className="text-xs bg-[#FEF2EE] text-[#C74634] border border-[#FECACA] px-1.5 py-0.5 rounded-full">Required</span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
              </div>
            </div>
          ))}

          {/* Compartment scope */}
          <div className="mt-2 pt-5 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-[#1E293B] mb-1">Compartment Scope</h3>
            <p className="text-xs text-[#64748B] mb-3">
              OCI organizes resources into compartments. Scope monitoring to all compartments or specific ones.
            </p>
            <div className="flex gap-3 mb-3">
              {(["all", "include", "exclude"] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ ...data, compartmentScope: opt, compartmentIds: "" })}
                  className={`flex-1 py-2 rounded-lg border text-sm transition-colors capitalize ${
                    data.compartmentScope === opt
                      ? "border-[#C74634] bg-[#FEF2EE] text-[#C74634] font-medium"
                      : "border-[#E2E8F0] text-[#64748B] hover:border-[#C74634]/40"
                  }`}
                >
                  {opt === "all" ? "All compartments" : opt === "include" ? "Include specific" : "Exclude specific"}
                </button>
              ))}
            </div>
            {(data.compartmentScope === "include" || data.compartmentScope === "exclude") && (
              <textarea
                rows={3}
                value={data.compartmentIds}
                onChange={e => onChange({ ...data, compartmentIds: e.target.value })}
                placeholder={`Enter compartment OCIDs, comma-separated\ne.g. ocid1.compartment.oc1..aaaa..., ocid1.compartment.oc1..bbbb...`}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-mono focus:outline-none focus:border-[#C74634] focus:ring-2 focus:ring-[#C74634]/10 resize-none"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] shrink-0">
        <button onClick={onBack} className="px-5 py-2 rounded-lg border border-[#C74634] text-[#C74634] bg-white text-sm hover:bg-[#FEF2EE] transition-colors">
          Back
        </button>
        <button onClick={onNext} className="px-6 py-2 rounded-lg bg-[#C74634] hover:bg-[#A8372A] text-white text-sm transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}
