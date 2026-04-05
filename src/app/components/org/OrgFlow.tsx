import { useState } from "react";
import { OrgFormData } from "../../types";
import { OrgStep1ManagementAccount } from "./OrgStep1ManagementAccount";
import { OrgStep2Permissions } from "./OrgStep2Permissions";
import { OrgStep3DeployRole } from "./OrgStep3DeployRole";
import { OrgStep4OUScope } from "./OrgStep4OUScope";
import { OrgStep5ReviewComplete } from "./OrgStep5ReviewComplete";
import { OrgAWSConsoleFrame } from "./OrgAWSConsoleFrame";

const DEFAULT_FORM: OrgFormData = {
  managementMethod: "select",
  managementAccountId: "",
  managementRoleArn: "",
  awsOrgId: "",
  iamRoleName: "AccuKnox-CrossAccount-Role",
  permissions: {
    monitoring: true,
    remediation: false,
    dataScanning: false,
    workloadEC2: false,
    workloadECR: false,
  },
  autoSyncFolder: true,
  iamRoleArn: "",
  ouScope: "all",
  rootOuId: "",
  ouIds: "",
};

interface OrgFlowProps {
  onBack: () => void;
  onComplete: (data: OrgFormData) => void;
}

export function OrgFlow({ onBack, onComplete }: OrgFlowProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [formData, setFormData] = useState<OrgFormData>(DEFAULT_FORM);
  const [showAWSConsole, setShowAWSConsole] = useState(false);
  const [arnHighlighted, setArnHighlighted] = useState(false);

  const update = (updates: Partial<OrgFormData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  if (showAWSConsole) {
    return (
      <OrgAWSConsoleFrame
        accountId={formData.managementAccountId}
        onCreateStack={() => {
          setShowAWSConsole(false);
          setArnHighlighted(true);
        }}
        onBack={() => setShowAWSConsole(false)}
      />
    );
  }

  return (
    <>
      {step === 0 && (
        <OrgStep1ManagementAccount
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(1)}
          onBack={onBack}
          onCancel={onBack}
        />
      )}
      {step === 1 && (
        <OrgStep2Permissions
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          onCancel={onBack}
        />
      )}
      {step === 2 && (
        <OrgStep3DeployRole
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
          onCancel={onBack}
          onRedirectToAWS={() => setShowAWSConsole(true)}
          arnHighlighted={arnHighlighted}
          onArnFocused={() => setArnHighlighted(false)}
        />
      )}
      {step === 3 && (
        <OrgStep4OUScope
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
          onCancel={onBack}
        />
      )}
      {step === 4 && (
        <OrgStep5ReviewComplete
          formData={formData}
          onBack={() => setStep(3)}
          onCancel={onBack}
          onComplete={() => onComplete(formData)}
        />
      )}
    </>
  );
}
