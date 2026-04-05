import { useState } from "react";
import { AzureOrgFormData } from "../../../types";
import { AzureOrgStep1TenantDetails } from "./AzureOrgStep1TenantDetails";
import { AzureOrgStep2Permissions } from "./AzureOrgStep2Permissions";
import { AzureOrgStep3DeployLighthouse } from "./AzureOrgStep3DeployLighthouse";
import { AzureOrgStep4Scope } from "./AzureOrgStep4Scope";
import { AzureOrgStep5ReviewComplete } from "./AzureOrgStep5ReviewComplete";
import { AzurePortalFrame } from "../AzurePortalFrame";

const DEFAULT: AzureOrgFormData = {
  displayName: "",
  tenantId: "",
  managementGroupId: "",
  permissions: {
    monitoring: true,
    remediation: false,
    dataScanning: false,
    workloadVMs: false,
    workloadACR: false,
  },
  autoSyncSubscriptions: true,
  scope: "all",
  rootManagementGroupId: "",
  scopeIds: "",
};

interface Props {
  onBack: () => void;
  onComplete: (data: AzureOrgFormData) => void;
}

export function AzureOrgFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<AzureOrgFormData>(DEFAULT);
  const [showAzurePortal, setShowAzurePortal] = useState(false);
  const [deployConfirmed, setDeployConfirmed] = useState(false);

  const update = (u: Partial<AzureOrgFormData>) =>
    setFormData((prev) => ({ ...prev, ...u }));

  if (showAzurePortal) {
    return (
      <AzurePortalFrame
        mode="org"
        managementGroupId={formData.managementGroupId}
        tenantId={formData.tenantId}
        onComplete={() => {
          setShowAzurePortal(false);
          setDeployConfirmed(true);
        }}
        onCancel={() => setShowAzurePortal(false)}
      />
    );
  }

  const cancel = () => { setStep(0); setFormData(DEFAULT); onBack(); };

  if (step === 0) return <AzureOrgStep1TenantDetails formData={formData} onUpdate={update} onNext={() => setStep(1)} onBack={onBack} onCancel={cancel} />;
  if (step === 1) return <AzureOrgStep2Permissions formData={formData} onUpdate={update} onNext={() => setStep(2)} onBack={() => setStep(0)} onCancel={cancel} />;
  if (step === 2) return (
    <AzureOrgStep3DeployLighthouse
      formData={formData}
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
      onCancel={cancel}
      onRedirectToAzure={() => setShowAzurePortal(true)}
      deployConfirmed={deployConfirmed}
      onConfirmDeployed={() => setDeployConfirmed(!deployConfirmed)}
    />
  );
  if (step === 3) return <AzureOrgStep4Scope formData={formData} onUpdate={update} onNext={() => setStep(4)} onBack={() => setStep(2)} onCancel={cancel} />;
  return <AzureOrgStep5ReviewComplete formData={formData} onBack={() => setStep(3)} onCancel={cancel} onComplete={() => onComplete(formData)} />;
}
