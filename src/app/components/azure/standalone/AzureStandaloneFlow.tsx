import { useState } from "react";
import { AzureStandaloneFormData } from "../../../types";
import { AzureStep1SubscriptionDetails } from "./AzureStep1SubscriptionDetails";
import { AzureStep2Permissions } from "./AzureStep2Permissions";
import { AzureStep3DeployAppReg } from "./AzureStep3DeployAppReg";
import { AzureStep4ReviewComplete } from "./AzureStep4ReviewComplete";
import { AzurePortalFrame } from "../AzurePortalFrame";

const DEFAULT: AzureStandaloneFormData = {
  displayName: "",
  subscriptionId: "",
  tenantId: "",
  label: "",
  tag: "",
  permissions: {
    monitoring: true,
    remediation: false,
    dataScanning: false,
    workloadVMs: false,
    workloadACR: false,
  },
  applicationId: "",
  directoryId: "",
};

interface Props {
  onBack: () => void;
  onComplete: (data: AzureStandaloneFormData) => void;
}

export function AzureStandaloneFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<AzureStandaloneFormData>(DEFAULT);
  const [showAzurePortal, setShowAzurePortal] = useState(false);
  const [fieldsHighlighted, setFieldsHighlighted] = useState(false);

  const update = (u: Partial<AzureStandaloneFormData>) =>
    setFormData((prev) => ({ ...prev, ...u }));

  if (showAzurePortal) {
    return (
      <AzurePortalFrame
        mode="standalone"
        subscriptionId={formData.subscriptionId}
        tenantId={formData.tenantId}
        onComplete={() => {
          setShowAzurePortal(false);
          setFieldsHighlighted(true);
        }}
        onCancel={() => setShowAzurePortal(false)}
      />
    );
  }

  const cancel = () => { setStep(0); setFormData(DEFAULT); onBack(); };

  if (step === 0) return <AzureStep1SubscriptionDetails formData={formData} onUpdate={update} onNext={() => setStep(1)} onBack={onBack} onCancel={cancel} />;
  if (step === 1) return <AzureStep2Permissions formData={formData} onUpdate={update} onNext={() => setStep(2)} onBack={() => setStep(0)} onCancel={cancel} />;
  if (step === 2) return (
    <AzureStep3DeployAppReg
      formData={formData}
      onUpdate={update}
      onNext={() => setStep(3)}
      onBack={() => setStep(1)}
      onCancel={cancel}
      onRedirectToAzure={() => setShowAzurePortal(true)}
      fieldsHighlighted={fieldsHighlighted}
      onFieldFocused={() => setFieldsHighlighted(false)}
    />
  );
  return <AzureStep4ReviewComplete formData={formData} onBack={() => setStep(2)} onCancel={cancel} onComplete={() => onComplete(formData)} />;
}
