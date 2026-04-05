import { useState } from "react";
import { StandaloneFormData } from "../../types";
import { Step1AccountDetails } from "./Step1AccountDetails";
import { Step2DeployRole } from "./Step2DeployRole";
import { Step3ReviewComplete } from "./Step3ReviewComplete";
import { AWSConsoleFrame } from "./AWSConsoleFrame";

const DEFAULT_FORM: StandaloneFormData = {
  accountName: "",
  awsAccountId: "",
  label: "",
  tag: "",
  isManagementAccount: false,
  partition: "global",
  regions: [],
  iamRoleArn: "",
};

interface StandaloneFlowProps {
  onBack: () => void;
  onComplete: (data: StandaloneFormData) => void;
}

export function StandaloneFlow({ onBack, onComplete }: StandaloneFlowProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [formData, setFormData] = useState<StandaloneFormData>(DEFAULT_FORM);
  const [showAWSConsole, setShowAWSConsole] = useState(false);
  const [arnHighlighted, setArnHighlighted] = useState(false);

  const update = (updates: Partial<StandaloneFormData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const handleRedirectToAWS = () => {
    setShowAWSConsole(true);
  };

  const handleCreateStack = () => {
    // User clicked "Create Stack" in the AWS Console
    setShowAWSConsole(false);
    setArnHighlighted(true); // highlight ARN input
  };

  const handleCancel = () => {
    onBack();
  };

  /* ── AWS Console overlay ── */
  if (showAWSConsole) {
    return (
      <AWSConsoleFrame
        accountId={formData.awsAccountId}
        onCreateStack={handleCreateStack}
        onBack={() => setShowAWSConsole(false)}
      />
    );
  }

  /* ── Wizard steps ── */
  return (
    <>
      {step === 0 && (
        <Step1AccountDetails
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(1)}
          onBack={onBack}
          onCancel={handleCancel}
        />
      )}
      {step === 1 && (
        <Step2DeployRole
          formData={formData}
          onUpdate={update}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
          onCancel={handleCancel}
          onRedirectToAWS={handleRedirectToAWS}
          arnHighlighted={arnHighlighted}
          onArnFocused={() => setArnHighlighted(false)}
        />
      )}
      {step === 2 && (
        <Step3ReviewComplete
          formData={formData}
          onBack={() => setStep(1)}
          onCancel={handleCancel}
          onComplete={() => onComplete(formData)}
        />
      )}
    </>
  );
}
