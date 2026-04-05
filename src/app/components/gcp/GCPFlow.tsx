import { useState } from "react";
import { GCPLanding } from "./GCPLanding";
import { GCPStandaloneFlow } from "./standalone/GCPStandaloneFlow";
import { GCPOrgFlow } from "./org/GCPOrgFlow";
import { GCPStandaloneFormData, GCPOrgFormData } from "../../types";

interface Props {
  onBack: () => void;
  onComplete: (
    result:
      | { flowType: "gcp-standalone"; data: GCPStandaloneFormData }
      | { flowType: "gcp-org"; data: GCPOrgFormData }
  ) => void;
}

export function GCPFlow({ onBack, onComplete }: Props) {
  const [subView, setSubView] = useState<"landing" | "standalone" | "org">("landing");

  if (subView === "standalone") {
    return <GCPStandaloneFlow onBack={() => setSubView("landing")} onComplete={(data) => onComplete({ flowType: "gcp-standalone", data })} />;
  }
  if (subView === "org") {
    return <GCPOrgFlow onBack={() => setSubView("landing")} onComplete={(data) => onComplete({ flowType: "gcp-org", data })} />;
  }
  return <GCPLanding onContinue={(type) => setSubView(type)} onBack={onBack} />;
}
