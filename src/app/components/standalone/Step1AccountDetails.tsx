import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, Info } from "lucide-react";
import { Stepper } from "../Stepper";
import {
  StandaloneFormData,
  STANDALONE_STEPS,
  AWS_REGIONS,
  LABEL_OPTIONS,
  TAG_OPTIONS,
} from "../../types";

/* ─── helpers ─── */

function FieldLabel({
  label,
  required,
  tooltip,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
}) {
  return (
    <label className="flex items-center gap-1.5 text-sm text-[#1E293B] mb-1.5">
      {required && <span className="text-[#EF4444]">*</span>}
      {label}
      {tooltip && (
        <span title={tooltip}>
          <Info size={13} className="text-[#94A3B8] cursor-help" />
        </span>
      )}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 ${
          error ? "border-[#EF4444]" : "border-[#E2E8F0] hover:border-[#93C5FD]"
        }`}
      />
      {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
    </div>
  );
}

function SimpleSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-sm transition-colors ${
          open ? "border-[#2563EB] ring-2 ring-[#2563EB]/10" : "border-[#E2E8F0] hover:border-[#93C5FD]"
        }`}
      >
        <span className={value ? "text-[#1E293B]" : "text-[#94A3B8]"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-[#94A3B8] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 max-h-44 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-[#F8FAFC] ${
                value === opt ? "text-[#2563EB] bg-[#EFF6FF]" : "text-[#1E293B]"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (val: string) =>
    onChange(
      selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-sm transition-colors ${
          open ? "border-[#2563EB] ring-2 ring-[#2563EB]/10" : "border-[#E2E8F0] hover:border-[#93C5FD]"
        }`}
      >
        {selected.length > 0 ? (
          <span className="text-[#1E293B]">
            {selected.length === 1
              ? options.find((o) => o.value === selected[0])?.label
              : `${selected.length} regions selected`}
          </span>
        ) : (
          <span className="text-[#94A3B8]">{placeholder}</span>
        )}
        <ChevronDown
          size={15}
          className={`text-[#94A3B8] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 px-3 py-2 hover:bg-[#F8FAFC] cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-[#2563EB] w-4 h-4 rounded"
              />
              <span className="text-[#1E293B]">{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  helperText,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  helperText?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 mt-0.5 ${
          checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <div>
        <p className="text-sm text-[#1E293B]">{label}</p>
        {helperText && (
          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{helperText}</p>
        )}
      </div>
    </div>
  );
}

/* ─── main component ─── */

interface Step1Props {
  formData: StandaloneFormData;
  onUpdate: (updates: Partial<StandaloneFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}

export function Step1AccountDetails({ formData, onUpdate, onNext, onBack, onCancel }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.accountName.trim()) errs.accountName = "Account name is required";
    if (!formData.awsAccountId.trim()) errs.awsAccountId = "AWS Account ID is required";
    else if (!/^\d{12}$/.test(formData.awsAccountId.trim()))
      errs.awsAccountId = "Must be a 12-digit numeric AWS Account ID";
    return errs;
  };

  const handleNext = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col flex-1 bg-white min-h-0">
      {/* Stepper */}
      <Stepper steps={STANDALONE_STEPS} currentStep={0} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-8 py-7">
        <div className="max-w-xl">
          <h2 className="text-[#1E293B] mb-1">Account Details</h2>
          <p className="text-sm text-[#64748B] mb-7">
            Enter the details for the AWS account you want to connect.
          </p>

          <div className="flex flex-col gap-5">
            {/* Account Name */}
            <div>
              <FieldLabel label="Account Name" required />
              <TextInput
                value={formData.accountName}
                onChange={(v) => {
                  onUpdate({ accountName: v });
                  setErrors((e) => ({ ...e, accountName: "" }));
                }}
                placeholder="Display name in AccuKnox UI"
                error={errors.accountName}
              />
            </div>

            {/* AWS Account ID */}
            <div>
              <FieldLabel
                label="AWS Account ID"
                required
                tooltip="Your 12-digit AWS account identifier"
              />
              <TextInput
                value={formData.awsAccountId}
                onChange={(v) => {
                  onUpdate({ awsAccountId: v });
                  setErrors((e) => ({ ...e, awsAccountId: "" }));
                }}
                placeholder="123456789012"
                error={errors.awsAccountId}
              />
            </div>

            {/* Label & Tag — 2 col */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel label="Label" />
                <SimpleSelect
                  options={LABEL_OPTIONS}
                  value={formData.label}
                  onChange={(v) => onUpdate({ label: v })}
                  placeholder="Select the label"
                />
              </div>
              <div>
                <FieldLabel label="Tag" />
                <SimpleSelect
                  options={TAG_OPTIONS}
                  value={formData.tag}
                  onChange={(v) => onUpdate({ tag: v })}
                  placeholder="Select the tag"
                />
              </div>
            </div>

            {/* Mark as Management Account */}
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <Toggle
                checked={formData.isManagementAccount}
                onChange={(v) => onUpdate({ isManagementAccount: v })}
                label="Mark this account as the management account for org onboarding"
                helperText="You will need at least one management account before you can onboard an AWS Organization."
              />
            </div>

            {/* AWS Partition */}
            <div>
              <FieldLabel label="AWS Partition" required />
              <div className="flex items-center gap-6 flex-wrap mt-1">
                {(
                  [
                    { value: "global", label: "AWS Global" },
                    { value: "govcloud", label: "AWS GovCloud" },
                  ] as { value: StandaloneFormData["partition"]; label: string; helper?: string }[]
                ).map(({ value, label, helper }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div
                      onClick={() => onUpdate({ partition: value })}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        formData.partition === value
                          ? "border-[#2563EB] bg-[#2563EB]"
                          : "border-[#CBD5E1] group-hover:border-[#93C5FD]"
                      }`}
                    >
                      {formData.partition === value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span
                      onClick={() => onUpdate({ partition: value })}
                      className="text-sm text-[#1E293B]"
                    >
                      {label}
                    </span>
                    {helper && (
                      <span className="text-xs text-[#94A3B8]">({helper})</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Active Regions */}
            <div>
              <FieldLabel
                label="Active Regions"
                tooltip="Regions where you have deployed AWS resources"
              />
              <MultiSelectDropdown
                options={AWS_REGIONS}
                selected={formData.regions}
                onChange={(v) => onUpdate({ regions: v })}
                placeholder="Select regions"
              />
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Select only regions where you have deployed resources. You can add more later.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#E2E8F0] bg-white shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] bg-white text-sm hover:bg-[#EFF6FF] transition-colors"
          >
            Back
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] bg-white text-sm hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
        </div>
        <button
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-[#2563EB] text-white text-sm hover:bg-[#1D4ED8] shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          Next
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
