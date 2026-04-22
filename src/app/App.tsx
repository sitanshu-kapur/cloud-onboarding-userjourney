import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { CloudPlatformSelection } from "./components/CloudPlatformSelection";
import { OnboardingLanding } from "./components/OnboardingLanding";
import { StandaloneFlow } from "./components/standalone/StandaloneFlow";
import { OrgFlow } from "./components/org/OrgFlow";
import { AzureFlow } from "./components/azure/AzureFlow";
import { GCPFlow } from "./components/gcp/GCPFlow";
import { OCIFlow } from "./components/oci/OCIFlow";
import { PostOnboardingOverview } from "./components/PostOnboardingOverview";
import { StandaloneFormData, OrgFormData, AzureStandaloneFormData, AzureOrgFormData, GCPStandaloneFormData, GCPOrgFormData, OCIStandaloneFormData, OCIOrgFormData } from "./types";

type AppView = "platform" | "landing" | "standalone" | "org" | "azure" | "gcp" | "oci" | "complete";
type CompletedData =
  | { flowType: "standalone"; data: StandaloneFormData }
  | { flowType: "org"; data: OrgFormData }
  | { flowType: "azure-standalone"; data: AzureStandaloneFormData }
  | { flowType: "azure-org"; data: AzureOrgFormData }
  | { flowType: "gcp-standalone"; data: GCPStandaloneFormData }
  | { flowType: "gcp-org"; data: GCPOrgFormData }
  | { flowType: "oci-standalone"; data: OCIStandaloneFormData }
  | { flowType: "oci-org"; data: OCIOrgFormData }
  | null;

const BASE_CRUMBS = [{ label: "Settings" }, { label: "Cloud accounts" }];

export default function App() {
  const [view, setView] = useState<AppView>("platform");
  const [completedData, setCompletedData] = useState<CompletedData>(null);

  const breadcrumbs = [
    ...BASE_CRUMBS,
    { label: view === "complete" ? "Overview" : "Add account" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Left sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navigation */}
        <TopNav breadcrumbs={breadcrumbs} />

        {/* Page content */}
        <main className="flex flex-col flex-1 overflow-auto p-6">
          <div className="flex flex-col flex-1 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
            {view === "platform" && (
              <CloudPlatformSelection
                onContinue={(platform) => {
                  if (platform === "aws") setView("landing");
                  if (platform === "azure") setView("azure");
                  if (platform === "gcp") setView("gcp");
                  if (platform === "oci") setView("oci");
                }}
              />
            )}

            {view === "landing" && (
              <OnboardingLanding
                existingStandaloneAccounts={1}
                onCancel={() => setView("platform")}
                onContinue={(type) => {
                  if (type === "standalone") setView("standalone");
                  if (type === "organization") setView("org");
                }}
              />
            )}

            {view === "standalone" && (
              <StandaloneFlow
                onBack={() => setView("landing")}
                onComplete={(data) => {
                  setCompletedData({ flowType: "standalone", data });
                  setView("complete");
                }}
              />
            )}

            {view === "org" && (
              <OrgFlow
                onBack={() => setView("landing")}
                onComplete={(data) => {
                  setCompletedData({ flowType: "org", data });
                  setView("complete");
                }}
              />
            )}

            {view === "azure" && (
              <AzureFlow
                onBack={() => setView("platform")}
                onComplete={(result) => {
                  setCompletedData(result);
                  setView("complete");
                }}
              />
            )}

            {view === "gcp" && (
              <GCPFlow
                onBack={() => setView("platform")}
                onComplete={(result) => {
                  setCompletedData(result);
                  setView("complete");
                }}
              />
            )}

            {view === "oci" && (
              <OCIFlow
                onBack={() => setView("platform")}
                onComplete={(result) => {
                  setCompletedData(result);
                  setView("complete");
                }}
              />
            )}

            {view === "complete" && completedData && (
              <PostOnboardingOverview
                {...completedData}
                onDashboard={() => setView("platform")}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
