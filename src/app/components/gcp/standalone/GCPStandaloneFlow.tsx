import { useState } from "react";
import { GCPStandaloneFormData } from "../../../types";
import { GCPStep1ProjectDetails } from "./GCPStep1ProjectDetails";
import { GCPStep2Permissions } from "./GCPStep2Permissions";
import { GCPStep3DeployCloudShell } from "./GCPStep3DeployCloudShell";
import { GCPStep4ReviewComplete } from "./GCPStep4ReviewComplete";
import { GCPCloudShellFrame } from "../GCPCloudShellFrame";

const DEFAULT: GCPStandaloneFormData = {
  displayName: "",
  projectId: "",
  projectNumber: "",
  label: "",
  tag: "",
  permissions: { monitoring: true, remediation: false, dataScanning: false, workloadCompute: false, workloadGKE: false },
  wifPoolId: "",
  wifProviderId: "",
  serviceAccountEmail: "",
};

interface Props {
  onBack: () => void;
  onComplete: (data: GCPStandaloneFormData) => void;
}

export function GCPStandaloneFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<GCPStandaloneFormData>(DEFAULT);
  const [showShell, setShowShell] = useState(false);
  const [fieldsHighlighted, setFieldsHighlighted] = useState(false);

  const update = (u: Partial<GCPStandaloneFormData>) => setFormData((p) => ({ ...p, ...u }));
  const cancel = () => { setStep(0); setFormData(DEFAULT); onBack(); };

  if (showShell) {
    return (
      <GCPCloudShellFrame
        mode="standalone"
        projectId={formData.projectId}
        projectNumber={formData.projectNumber}
        onComplete={() => { setShowShell(false); setFieldsHighlighted(true); }}
        onCancel={() => setShowShell(false)}
      />
    );
  }

  if (step === 0) return <GCPStep1ProjectDetails formData={formData} onUpdate={update} onNext={() => setStep(1)} onBack={onBack} onCancel={cancel} />;
  if (step === 1) return <GCPStep2Permissions formData={formData} onUpdate={update} onNext={() => setStep(2)} onBack={() => setStep(0)} onCancel={cancel} />;
  if (step === 2) return (
    <GCPStep3DeployCloudShell
      formData={formData} onUpdate={update}
      onNext={() => setStep(3)} onBack={() => setStep(1)} onCancel={cancel}
      onOpenCloudShell={() => setShowShell(true)}
      fieldsHighlighted={fieldsHighlighted}
      onFieldFocused={() => setFieldsHighlighted(false)}
    />
  );
  return <GCPStep4ReviewComplete formData={formData} onBack={() => setStep(2)} onCancel={cancel} onComplete={() => onComplete(formData)} />;
}
