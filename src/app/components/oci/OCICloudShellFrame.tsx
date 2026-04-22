import { useState, useEffect } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { OCI_AUTO_GENERATED } from "../../types";

interface OCICloudShellFrameProps {
  command: string;
  onDone: () => void;
}

const EXECUTION_STEPS = [
  "[1/5] Creating IAM user: accuknox_security_audit_user ...",
  "[2/5] Creating group and assigning user ...",
  "[3/5] Creating IAM policy (24 permission statements) ...",
  "[4/5] Generating RSA-4096 API key pair ...",
  "[5/5] Transmitting credentials to AccuKnox ...",
];

const STEP_DELAYS = [1200, 900, 1400, 800, 1600];

type Phase = "command" | "running" | "done";

export function OCICloudShellFrame({ command, onDone }: OCICloudShellFrameProps) {
  const [phase, setPhase] = useState<Phase>("command");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (phase !== "running") return;
    let totalDelay = 0;
    STEP_DELAYS.forEach((delay, i) => {
      totalDelay += delay;
      const t = setTimeout(() => setVisibleSteps(i + 1), totalDelay);
      return () => clearTimeout(t);
    });
    const doneTimer = setTimeout(() => setPhase("done"), totalDelay + 600);
    return () => clearTimeout(doneTimer);
  }, [phase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(command).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#3C3C3C] shadow-xl">
      {/* Terminal top bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#C74634]" />
          <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-[#C74634] flex items-center justify-center">
            <span className="text-white font-bold" style={{ fontSize: "9px" }}>OCI</span>
          </div>
          <span className="text-[#94A3B8] text-xs font-mono">Oracle Cloud Shell</span>
        </div>
        <div className="w-16" />
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-sm" style={{ backgroundColor: "#0F0F1A", minHeight: "260px" }}>
        {/* Command display */}
        <div className="mb-4">
          <span className="text-[#C74634]">user@cloudshell:~$</span>
          <span className="text-[#E2E8F0] ml-2 text-xs break-all leading-relaxed">
            bash &lt;(curl -sL {OCI_AUTO_GENERATED.scriptStandaloneUrl}) \<br />
            {"  "}--verification-token "<span className="text-[#F97316]">{OCI_AUTO_GENERATED.verificationToken}</span>" \<br />
            {"  "}--callback-endpoint "<span className="text-[#F97316]">{OCI_AUTO_GENERATED.callbackEndpoint}</span>"
          </span>
        </div>

        {/* Execution output */}
        {phase !== "command" && (
          <div className="flex flex-col gap-1.5">
            {EXECUTION_STEPS.slice(0, visibleSteps).map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <CheckCircle2 size={13} className="text-[#22C55E] shrink-0" />
                <span className="text-[#86EFAC]">{step}</span>
              </div>
            ))}
            {phase === "running" && visibleSteps < EXECUTION_STEPS.length && (
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="w-3 h-3 rounded-full border-2 border-[#F97316] border-t-transparent animate-spin shrink-0" />
                <span className="text-[#E2E8F0]">{EXECUTION_STEPS[visibleSteps]}</span>
              </div>
            )}
          </div>
        )}

        {/* Done state */}
        {phase === "done" && (
          <div className="mt-3 pt-3 border-t border-[#2D2D3D]">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={16} className="text-[#22C55E]" />
              <span className="text-[#22C55E] font-semibold text-sm">Connection established!</span>
            </div>
            <p className="text-[#94A3B8] text-xs mb-3">
              Credentials received and verified by AccuKnox. No copy-paste required.
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs mb-4">
              <span className="text-[#64748B]">IAM User</span>
              <span className="text-[#E2E8F0]">{OCI_AUTO_GENERATED.iamUserName}</span>
              <span className="text-[#64748B]">Group</span>
              <span className="text-[#E2E8F0]">{OCI_AUTO_GENERATED.groupName}</span>
              <span className="text-[#64748B]">Policy</span>
              <span className="text-[#E2E8F0]">{OCI_AUTO_GENERATED.policyName}</span>
              <span className="text-[#64748B]">API Key Hash</span>
              <span className="text-[#E2E8F0] font-mono">SHA256:4c5OYkx...</span>
            </div>
            <button
              onClick={onDone}
              className="px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-medium transition-colors"
            >
              Done — Back to AccuKnox
            </button>
          </div>
        )}

        {/* Cursor blink when idle */}
        {phase === "command" && (
          <span className="inline-block w-2 h-4 bg-[#E2E8F0] animate-pulse ml-1" />
        )}
      </div>

      {/* Footer actions */}
      {phase === "command" && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#2D2D3D]" style={{ backgroundColor: "#0F0F1A" }}>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
          >
            {copied ? <CheckCircle2 size={13} className="text-[#22C55E]" /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy command"}
          </button>
          <button
            onClick={() => setPhase("running")}
            className="px-4 py-2 rounded-lg text-white text-xs font-medium transition-colors"
            style={{ backgroundColor: "#C74634" }}
          >
            Open Cloud Shell &amp; Run Script
          </button>
        </div>
      )}
    </div>
  );
}
