import { useState } from "react";
import { ChevronDown, ChevronRight, Info, ExternalLink } from "lucide-react";
import { AUTO_GENERATED } from "../../types";

interface AWSConsoleFrameProps {
  accountId: string;
  onCreateStack: () => void;
  onBack: () => void;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-[#16191F] mb-1 font-medium">{label}</label>
      <div className="w-full px-3 py-2 bg-[#F4F4F4] border border-[#AAAAAA] rounded text-sm text-[#16191F] font-mono break-all select-all cursor-text">
        {value}
      </div>
    </div>
  );
}

export function AWSConsoleFrame({ accountId, onCreateStack, onBack }: AWSConsoleFrameProps) {
  const [ackChecked, setAckChecked] = useState(false);
  const [stackCreated, setStackCreated] = useState(false);

  const handleCreateStack = () => {
    if (!ackChecked) return;
    setStackCreated(true);
    setTimeout(() => {
      onCreateStack();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAFAFA] overflow-auto">
      {/* AWS Top Navigation Bar */}
      <header className="bg-[#232F3E] flex items-center gap-4 px-4 py-0 h-12 shrink-0">
        {/* AWS Logo */}
        <div className="flex items-center gap-1 mr-3">
          <div className="flex flex-col gap-[3px] mr-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-5 h-[3px] bg-[#FF9900] rounded-sm" />
            ))}
          </div>
          <span className="text-white font-bold text-lg tracking-wide">aws</span>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-1 text-[#D5DBDB] text-sm">
          <button className="flex items-center gap-1 px-3 py-3 hover:bg-[#37475A] transition-colors">
            Services <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 px-3 py-3 hover:bg-[#37475A] transition-colors">
            Resource Groups <ChevronDown size={12} />
          </button>
        </div>

        <div className="flex-1" />

        {/* Right side */}
        <div className="flex items-center gap-2 text-[#D5DBDB] text-sm">
          <button className="flex items-center gap-1 px-3 py-3 hover:bg-[#37475A] transition-colors">
            us-east-1 <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 px-3 py-3 hover:bg-[#37475A] transition-colors">
            account-{accountId || "123456789012"} <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-1 px-3 py-3 hover:bg-[#37475A] transition-colors">
            Support <ChevronDown size={12} />
          </button>
        </div>
      </header>

      {/* Secondary nav / service bar */}
      <div className="bg-[#1A252F] px-6 py-2 flex items-center gap-4 text-[#D5DBDB] text-sm shrink-0">
        <span className="text-white font-medium">CloudFormation</span>
        <span className="text-[#546E7A]">›</span>
        <span className="text-[#FF9900] hover:underline cursor-pointer">Stacks</span>
        <span className="text-[#546E7A]">›</span>
        <span>Quick create stack</span>
      </div>

      {/* Info return banner */}
      <div className="bg-[#EBF5FB] border border-[#85C1E9] border-l-4 border-l-[#2E86C1] px-6 py-3 flex items-center gap-3 shrink-0">
        <Info size={16} className="text-[#2E86C1] shrink-0" />
        <p className="text-sm text-[#1A5276]">
          <span className="font-medium">Redirected from AccuKnox:</span> After stack creation
          completes, return to AccuKnox and paste the IAM Role ARN.
        </p>
        <button
          onClick={onBack}
          className="ml-auto flex items-center gap-1 text-[#2E86C1] text-sm hover:underline shrink-0"
        >
          ← Return to AccuKnox
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Content */}
        <div className="flex-1 px-8 py-6 max-w-4xl">
          <h1 className="text-[#16191F] mb-1" style={{ fontSize: "22px", fontWeight: 600 }}>
            Quick create stack
          </h1>
          <p className="text-sm text-[#546E7A] mb-6">
            The fields below have been pre-filled by AccuKnox. Review the values and click{" "}
            <strong>Create stack</strong>.
          </p>

          {/* Template section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#16191F] text-base font-semibold">Template</h3>
            </div>
            <div className="bg-[#F8F8F8] border border-[#D5D5D5] rounded p-4">
              <p className="text-xs text-[#546E7A] mb-1 uppercase tracking-wide font-medium">
                Amazon S3 URL
              </p>
              <p className="text-sm text-[#16191F] font-mono break-all">{AUTO_GENERATED.cftUrl}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-[#E2E2E2] mb-6" />

          {/* Stack details */}
          <div className="mb-6">
            <h3 className="text-[#16191F] text-base font-semibold mb-4">Stack details</h3>
            <ReadOnlyField label="Stack name" value={AUTO_GENERATED.stackName} />
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <h3 className="text-[#16191F] text-base font-semibold mb-4">Parameters</h3>
            <ReadOnlyField label="AccuKnoxAccountId" value={AUTO_GENERATED.accuknoxAccountId} />
            <ReadOnlyField label="ExternalId" value={AUTO_GENERATED.externalId} />
            <ReadOnlyField label="RoleName" value={AUTO_GENERATED.roleName} />
          </div>

          <hr className="border-[#E2E2E2] mb-6" />

          {/* Capabilities */}
          <div className="mb-8">
            <h3 className="text-[#16191F] text-base font-semibold mb-3">Capabilities</h3>
            <div className="bg-[#FEF9E7] border border-[#F9CA24] rounded p-4 mb-4">
              <p className="text-sm text-[#7D6608]">
                <strong>The following resource(s) require capabilities:</strong>{" "}
                <code className="text-xs bg-[#FCF3CF] px-1 py-0.5 rounded">CAPABILITY_NAMED_IAM</code>
              </p>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ackChecked}
                onChange={(e) => setAckChecked(e.target.checked)}
                className="mt-0.5 accent-[#0972D3] w-4 h-4"
              />
              <span className="text-sm text-[#16191F] leading-relaxed">
                I acknowledge that AWS CloudFormation might create IAM resources with custom names.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-[#AAAAAA] rounded bg-white text-sm text-[#16191F] hover:bg-[#F4F4F4] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateStack}
              disabled={!ackChecked || stackCreated}
              className={`flex items-center gap-2 px-6 py-2 rounded text-sm font-medium text-[#16191F] transition-all ${
                ackChecked && !stackCreated
                  ? "bg-[#FF9900] hover:bg-[#EC7211] shadow-sm cursor-pointer"
                  : "bg-[#E8C56D] cursor-not-allowed opacity-70"
              }`}
            >
              {stackCreated ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-[#16191F] border-t-transparent rounded-full animate-spin" />
                  Creating stack…
                </>
              ) : (
                <>
                  <ExternalLink size={14} />
                  Create stack
                </>
              )}
            </button>
          </div>

          {stackCreated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-[#1D8348]">
              <span className="inline-block w-4 h-4 rounded-full bg-[#1D8348] text-white flex items-center justify-center text-xs">✓</span>
              Stack creation initiated — redirecting back to AccuKnox…
            </div>
          )}
        </div>

        {/* Right sidebar (AWS style info panel) */}
        <div className="w-72 border-l border-[#E2E2E2] px-6 py-6 shrink-0">
          <h4 className="text-sm font-semibold text-[#16191F] mb-2">About this template</h4>
          <p className="text-xs text-[#546E7A] leading-relaxed mb-4">
            This template creates a cross-account IAM role that allows AccuKnox to read your AWS
            resources for security analysis via STS AssumeRole.
          </p>
          <div className="flex items-start gap-2 bg-[#EBF5FB] rounded p-3">
            <Info size={14} className="text-[#2E86C1] shrink-0 mt-0.5" />
            <p className="text-xs text-[#1A5276] leading-relaxed">
              No static credentials or access keys are created by this template.
            </p>
          </div>
          <hr className="border-[#E2E2E2] my-4" />
          <h4 className="text-sm font-semibold text-[#16191F] mb-2">Resources created</h4>
          <ul className="text-xs text-[#546E7A] space-y-1">
            <li className="flex items-center gap-1.5">
              <ChevronRight size={10} className="text-[#FF9900]" />
              IAM Role: AccuKnox-CrossAccount-Role
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight size={10} className="text-[#FF9900]" />
              IAM Policy: AccuKnox ReadOnly Access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
