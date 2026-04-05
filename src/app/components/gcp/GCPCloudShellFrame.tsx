import { useState } from "react";
import { Copy, Check, X, Terminal, Play } from "lucide-react";
import { GCP_AUTO_GENERATED } from "../../types";

interface GCPCloudShellFrameProps {
  mode: "standalone" | "org";
  projectId?: string;
  projectNumber?: string;
  orgId?: string;
  orchestratorProjectId?: string;
  orchestratorProjectNumber?: string;
  onComplete: () => void;
  onCancel: () => void;
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-[#9AA0A6] hover:text-white transition-colors"
    >
      {copied ? <Check size={12} className="text-[#34A853]" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

type Phase = "command" | "running" | "done";

export function GCPCloudShellFrame({
  mode,
  projectId,
  projectNumber,
  orgId,
  orchestratorProjectId,
  orchestratorProjectNumber,
  onComplete,
  onCancel,
}: GCPCloudShellFrameProps) {
  const [phase, setPhase] = useState<Phase>("command");
  const [tick, setTick] = useState(0);

  const isOrg = mode === "org";
  const pid = isOrg ? orchestratorProjectId : projectId;
  const pnum = isOrg ? orchestratorProjectNumber : projectNumber;

  const command = isOrg
    ? `curl -sSL ${GCP_AUTO_GENERATED.scriptOrgUrl} \\
  | bash -s -- \\
    --org-id=${orgId || "YOUR_ORG_ID"} \\
    --orchestrator-project=${orchestratorProjectId || "YOUR_PROJECT_ID"} \\
    --integration-id=${GCP_AUTO_GENERATED.integrationId} \\
    --oidc-issuer=${GCP_AUTO_GENERATED.accuknoxOidcIssuer}`
    : `curl -sSL ${GCP_AUTO_GENERATED.scriptStandaloneUrl} \\
  | bash -s -- \\
    --project-id=${projectId || "YOUR_PROJECT_ID"} \\
    --integration-id=${GCP_AUTO_GENERATED.integrationId} \\
    --oidc-issuer=${GCP_AUTO_GENERATED.accuknoxOidcIssuer}`;

  const handleRun = () => {
    setPhase("running");
    // Simulate multi-step output with ticks
    let t = 0;
    const interval = setInterval(() => {
      t++;
      setTick(t);
      if (t >= 6) {
        clearInterval(interval);
        setPhase("done");
      }
    }, 600);
  };

  const RUNNING_LINES = [
    "Enabling required APIs...",
    "Creating Workload Identity Pool...",
    "Creating OIDC Provider...",
    "Creating Service Account...",
    "Binding IAM roles...",
    isOrg ? "Configuring org-level bindings..." : "Creating Pub/Sub topic and log sink...",
  ];

  const wifPoolPath = `projects/${pnum || "PROJECT_NUMBER"}/locations/global/workloadIdentityPools/${GCP_AUTO_GENERATED.workloadPoolId}`;
  const wifProviderPath = `${wifPoolPath}/providers/${GCP_AUTO_GENERATED.workloadProviderId}`;
  const saEmail = `${GCP_AUTO_GENERATED.serviceAccountName}@${pid || "PROJECT_ID"}.iam.gserviceaccount.com`;

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#202124" }}>
      {/* GCP Console top bar */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: "#1a1c1e" }}>
        <div className="flex items-center gap-3">
          {/* GCP logo colors */}
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-full bg-[#4285F4]" />
            <div className="w-2 h-2 rounded-full bg-[#EA4335]" />
            <div className="w-2 h-2 rounded-full bg-[#FBBC05]" />
            <div className="w-2 h-2 rounded-full bg-[#34A853]" />
          </div>
          <span className="text-white text-sm font-medium">Google Cloud Shell</span>
          <span className="text-[#5F6368] text-xs">|</span>
          <span className="text-[#9AA0A6] text-xs">{pid || "your-project"}</span>
        </div>
        <button onClick={onCancel} className="text-[#9AA0A6] hover:text-white transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Terminal area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 font-mono text-sm" style={{ color: "#E8EAED" }}>
        {/* Welcome line */}
        <p style={{ color: "#9AA0A6" }} className="mb-3 text-xs">
          Welcome to Cloud Shell! Type "help" to get started.
        </p>

        {/* Command display */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2" style={{ color: "#34A853" }}>
            <Terminal size={13} />
            <span className="text-xs">AccuKnox provisioning command</span>
          </div>
          <div className="rounded-lg p-3 mb-2" style={{ background: "#2D2F31" }}>
            <div className="flex items-start justify-between gap-3">
              <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all" style={{ color: "#E8EAED" }}>
                {command}
              </pre>
              <CopyBtn text={command} />
            </div>
          </div>
          <p className="text-xs" style={{ color: "#9AA0A6" }}>
            Review the command above, then click Run to execute it in this session.
          </p>
        </div>

        {/* Prompt + run output */}
        {phase === "command" && (
          <div className="flex items-center gap-2">
            <span style={{ color: "#34A853" }}>$</span>
            <span style={{ color: "#9AA0A6" }} className="text-xs italic">
              Click "Run Command" below to execute…
            </span>
          </div>
        )}

        {(phase === "running" || phase === "done") && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: "#34A853" }}>$</span>
              <span className="text-xs" style={{ color: "#E8EAED" }}>
                {command.split("\n")[0].replace("  | bash -s -- \\", "")}
              </span>
            </div>
            <div className="pl-4 space-y-1 mb-3">
              {RUNNING_LINES.slice(0, phase === "done" ? RUNNING_LINES.length : tick).map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span style={{ color: phase === "done" || i < tick ? "#34A853" : "#FBBC05" }}>
                    {phase === "done" || i < tick - 1 ? "✓" : "›"}
                  </span>
                  <span style={{ color: "#9AA0A6" }}>{line}</span>
                </div>
              ))}
              {phase === "running" && tick < RUNNING_LINES.length && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="animate-pulse" style={{ color: "#FBBC05" }}>›</span>
                  <span style={{ color: "#E8EAED" }}>{RUNNING_LINES[tick]}</span>
                </div>
              )}
            </div>

            {phase === "done" && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: "#34A853" }}>✓</span>
                  <span className="text-xs font-medium" style={{ color: "#34A853" }}>
                    AccuKnox provisioning complete. Save the values below.
                  </span>
                </div>
                <div className="rounded-lg p-4 space-y-2.5" style={{ background: "#2D2F31" }}>
                  {[
                    { label: "WIF Pool ID", value: wifPoolPath },
                    { label: "WIF Provider ID", value: wifProviderPath },
                    { label: "Service Account Email", value: saEmail },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs mb-0.5" style={{ color: "#9AA0A6" }}>{label}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs break-all flex-1" style={{ color: "#8AB4F8" }}>{value}</code>
                        <CopyBtn text={value} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-3" style={{ color: "#9AA0A6" }}>
                  Copy these values and paste them into the AccuKnox setup form.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-5 py-3 shrink-0 border-t" style={{ background: "#1a1c1e", borderColor: "#3C4043" }}>
        {phase === "command" && (
          <button
            onClick={handleRun}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
            style={{ background: "#4285F4" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#3367D6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#4285F4")}
          >
            <Play size={14} />
            Run Command
          </button>
        )}
        {phase === "running" && (
          <button disabled className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white opacity-60 cursor-not-allowed" style={{ background: "#4285F4" }}>
            <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Running…
          </button>
        )}
        {phase === "done" && (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium text-white transition-colors"
            style={{ background: "#34A853" }}
          >
            <Check size={14} />
            Done — Back to AccuKnox
          </button>
        )}
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded text-sm transition-colors"
          style={{ color: "#9AA0A6", background: "transparent" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#E8EAED")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9AA0A6")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
