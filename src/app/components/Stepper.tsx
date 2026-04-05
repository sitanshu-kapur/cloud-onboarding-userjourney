import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-start justify-center px-10 pt-7 pb-6 border-b border-[#E2E8F0] bg-white">
      {steps.map((label, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;

        return (
          <div key={idx} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 transition-colors ${
                  isCompleted
                    ? "bg-[#16A34A] text-white"
                    : isActive
                    ? "bg-[#2563EB] text-white"
                    : "bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]"
                }`}
              >
                {isCompleted ? <Check size={15} strokeWidth={2.5} /> : <span>{idx + 1}</span>}
              </div>
              <span
                className={`text-xs whitespace-nowrap font-medium ${
                  isActive
                    ? "text-[#2563EB]"
                    : isCompleted
                    ? "text-[#16A34A]"
                    : "text-[#94A3B8]"
                }`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={`h-px w-20 mx-4 mb-5 shrink-0 transition-colors ${
                  idx < currentStep ? "bg-[#16A34A]" : "bg-[#E2E8F0]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
