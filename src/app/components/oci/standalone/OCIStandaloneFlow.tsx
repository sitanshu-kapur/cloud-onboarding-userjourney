import { useState } from "react";
import { OCIStandaloneFormData, OCI_STANDALONE_STEPS } from "../../../types";
import { OCIStandaloneStep1 } from "./OCIStandaloneStep1";
import { OCIStandaloneStep2 } from "./OCIStandaloneStep2";
import { OCIStandaloneStep3 } from "./OCIStandaloneStep3";
import { OCIStandaloneStep4 } from "./OCIStandaloneStep4";

interface Props {
  onBack: () => void;
  onComplete: (data: OCIStandaloneFormData) => void;
}

const DEFAULT: OCIStandaloneFormData = {
  displayName: "",
  tenancyOcid: "",
  homeRegion: "",
  label: "",
  tag: "",
  permissions: {
    monitoring: true,
    remediation: false,
    dataScanning: false,
    workloadVMs: false,
    workloadContainers: false,
  },
  compartmentScope: "all",
  compartmentIds: "",
};

export function OCIStandaloneFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OCIStandaloneFormData>(DEFAULT);
  const [showShell, setShowShell] = useState(false);

  const StepIndicator = () => (
    <div className="flex items-center gap-0 px-8 py-4 border-b border-[#E2E8F0] shrink-0 bg-[#F8FAFC]">
      {OCI_STANDALONE_STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
              i < step ? "bg-[#C74634] text-white" : i === step ? "bg-[#C74634] text-white ring-4 ring-[#C74634]/20" : "bg-[#E2E8F0] text-[#94A3B8]"
            }`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? "text-[#C74634]" : i < step ? "text-[#64748B]" : "text-[#94A3B8]"}`}>
              {label}
            </span>
          </div>
          {i < OCI_STANDALONE_STEPS.length - 1 && (
            <div className={`h-px w-8 mx-2 ${i < step ? "bg-[#C74634]" : "bg-[#E2E8F0]"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StepIndicator />
      {step === 0 && <OCIStandaloneStep1 data={data} onChange={setData} onNext={() => setStep(1)} onBack={onBack} />}
      {step === 1 && <OCIStandaloneStep2 data={data} onChange={setData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && (
        <OCIStandaloneStep3
          data={data}
          showShell={showShell}
          onOpenShell={() => setShowShell(true)}
          onShellDone={() => setShowShell(true)}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <OCIStandaloneStep4 data={data} onDashboard={() => onComplete(data)} />}
    </div>
  );
}
