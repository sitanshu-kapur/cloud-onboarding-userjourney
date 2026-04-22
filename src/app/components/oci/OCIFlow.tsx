import { useState } from "react";
import { OCIStandaloneFormData, OCIOrgFormData } from "../../types";
import { OCILanding } from "./OCILanding";
import { OCIStandaloneFlow } from "./standalone/OCIStandaloneFlow";
import { OCIOrgFlow } from "./org/OCIOrgFlow";

type OCIView = "landing" | "standalone" | "org";

interface Props {
  onBack: () => void;
  onComplete: (result: { flowType: "oci-standalone"; data: OCIStandaloneFormData } | { flowType: "oci-org"; data: OCIOrgFormData }) => void;
}

export function OCIFlow({ onBack, onComplete }: Props) {
  const [view, setView] = useState<OCIView>("landing");

  return (
    <>
      {view === "landing" && (
        <OCILanding
          onBack={onBack}
          onContinue={(type) => setView(type)}
        />
      )}
      {view === "standalone" && (
        <OCIStandaloneFlow
          onBack={() => setView("landing")}
          onComplete={(data) => onComplete({ flowType: "oci-standalone", data })}
        />
      )}
      {view === "org" && (
        <OCIOrgFlow
          onBack={() => setView("landing")}
          onComplete={(data) => onComplete({ flowType: "oci-org", data })}
        />
      )}
    </>
  );
}
