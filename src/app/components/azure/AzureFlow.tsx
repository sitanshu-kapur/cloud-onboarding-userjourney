import { useState } from "react";
import { AzureLanding } from "./AzureLanding";
import { AzureStandaloneFlow } from "./standalone/AzureStandaloneFlow";
import { AzureOrgFlow } from "./org/AzureOrgFlow";
import { AzureStandaloneFormData, AzureOrgFormData } from "../../types";

type AzureSubView = "landing" | "standalone" | "org";

interface Props {
  onBack: () => void;
  onComplete: (
    result:
      | { flowType: "azure-standalone"; data: AzureStandaloneFormData }
      | { flowType: "azure-org"; data: AzureOrgFormData }
  ) => void;
}

export function AzureFlow({ onBack, onComplete }: Props) {
  const [subView, setSubView] = useState<AzureSubView>("landing");

  if (subView === "standalone") {
    return (
      <AzureStandaloneFlow
        onBack={() => setSubView("landing")}
        onComplete={(data) => onComplete({ flowType: "azure-standalone", data })}
      />
    );
  }

  if (subView === "org") {
    return (
      <AzureOrgFlow
        onBack={() => setSubView("landing")}
        onComplete={(data) => onComplete({ flowType: "azure-org", data })}
      />
    );
  }

  return (
    <AzureLanding
      onContinue={(type) => setSubView(type)}
      onBack={onBack}
    />
  );
}
