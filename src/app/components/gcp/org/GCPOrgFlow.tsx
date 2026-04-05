import { useState } from "react";
import { GCPOrgFormData } from "../../../types";
import { GCPOrgStep1OrgDetails } from "./GCPOrgStep1OrgDetails";
import { GCPOrgStep2Permissions } from "./GCPOrgStep2Permissions";
import { GCPOrgStep3DeployCloudShell } from "./GCPOrgStep3DeployCloudShell";
import { GCPOrgStep4Scope } from "./GCPOrgStep4Scope";
import { GCPOrgStep5ReviewComplete } from "./GCPOrgStep5ReviewComplete";
import { GCPCloudShellFrame } from "../GCPCloudShellFrame";

const DEFAULT: GCPOrgFormData = {
  displayName: "",
  orgId: "",
  orchestratorProjectId: "",
  orchestratorProjectNumber: "",
  permissions: { monitoring: true, remediation: false, dataScanning: false, workloadCompute: false, workloadGKE: false },
  autoEnrollNewProjects: true,
  scope: "all",
  rootFolderId: "",
  scopeIds: "",
};

interface Props {
  onBack: () => void;
  onComplete: (data: GCPOrgFormData) => void;
}

export function GCPOrgFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<GCPOrgFormData>(DEFAULT);
  const [showShell, setShowShell] = useState(false);
  const [deployConfirmed, setDeployConfirmed] = useState(false);

  const update = (u: Partial<GCPOrgFormData>) => setFormData((p) => ({ ...p, ...u }));
  const cancel = () => { setStep(0); setFormData(DEFAULT); onBack(); };

  if (showShell) {
    return (
      <GCPCloudShellFrame
        mode="org"
        orgId={formData.orgId}
        orchestratorProjectId={formData.orchestratorProjectId}
        orchestratorProjectNumber={formData.orchestratorProjectNumber}
        onComplete={() => { setShowShell(false); setDeployConfirmed(true); }}
        onCancel={() => setShowShell(false)}
      />
    );
  }

  if (step === 0) return <GCPOrgStep1OrgDetails formData={formData} onUpdate={update} onNext={() => setStep(1)} onBack={onBack} onCancel={cancel} />;
  if (step === 1) return <GCPOrgStep2Permissions formData={formData} onUpdate={update} onNext={() => setStep(2)} onBack={() => setStep(0)} onCancel={cancel} />;
  if (step === 2) return (
    <GCPOrgStep3DeployCloudShell
      formData={formData} onNext={() => setStep(3)} onBack={() => setStep(1)} onCancel={cancel}
      onOpenCloudShell={() => setShowShell(true)}
      deployConfirmed={deployConfirmed}
      onConfirmDeployed={() => setDeployConfirmed(!deployConfirmed)}
    />
  );
  if (step === 3) return <GCPOrgStep4Scope formData={formData} onUpdate={update} onNext={() => setStep(4)} onBack={() => setStep(2)} onCancel={cancel} />;
  return <GCPOrgStep5ReviewComplete formData={formData} onBack={() => setStep(3)} onCancel={cancel} onComplete={() => onComplete(formData)} />;
}
