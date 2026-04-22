import { useState } from "react";
import { OCIOrgFormData, OCI_ORG_STEPS } from "../../../types";
import { OCIOrgStep1 } from "./OCIOrgStep1";
import { OCIOrgStep2 } from "./OCIOrgStep2";
import { OCIOrgStep3 } from "./OCIOrgStep3";
import { OCIOrgStep4 } from "./OCIOrgStep4";
import { OCIOrgStep5 } from "./OCIOrgStep5";

interface Props {
  onBack: () => void;
  onComplete: (data: OCIOrgFormData) => void;
}

const DEFAULT: OCIOrgFormData = {
  displayName: "",
  adminTenancyOcid: "",
  homeRegion: "",
  permissions: {
    monitoring: true,
    remediation: false,
    dataScanning: false,
    workloadVMs: false,
    workloadContainers: false,
  },
  autoSyncTenancies: true,
  compartmentScope: "all",
  compartmentIds: "",
  scope: "all",
  rootTenancyOcid: "",
  scopeIds: "",
};

export function OCIOrgFlow({ onBack, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OCIOrgFormData>(DEFAULT);
  const [showShell, setShowShell] = useState(false);

  const StepIndicator = () => (
    <div className="flex items-center gap-0 px-8 py-4 border-b border-[#E2E8F0] shrink-0 bg-[#F8FAFC]">
      {OCI_ORG_STEPS.map((label, i) => (
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
          {i < OCI_ORG_STEPS.length - 1 && (
            <div className={`h-px w-8 mx-2 ${i < step ? "bg-[#C74634]" : "bg-[#E2E8F0]"}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <StepIndicator />
      {step === 0 && <OCIOrgStep1 data={data} onChange={setData} onNext={() => setStep(1)} onBack={onBack} />}
      {step === 1 && <OCIOrgStep2 data={data} onChange={setData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && (
        <OCIOrgStep3
          data={data}
          showShell={showShell}
          onOpenShell={() => setShowShell(true)}
          onShellDone={() => { setShowShell(true); setStep(3); }}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <OCIOrgStep4 data={data} onChange={setData} onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <OCIOrgStep5 data={data} onDashboard={() => onComplete(data)} />}
    </div>
  );
}
