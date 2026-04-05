import {
  LayoutDashboard,
  ShieldCheck,
  Network,
  Cloud,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Users,
  BookOpen,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: false },
  { icon: ShieldCheck, label: "Security", active: false },
  { icon: Network, label: "Network", active: false },
  { icon: Cloud, label: "Cloud Accounts", active: true },
  { icon: FileText, label: "Policies", active: false },
  { icon: BarChart3, label: "Reports", active: false },
  { icon: BookOpen, label: "Compliance", active: false },
];

const bottomItems = [
  { icon: Bell, label: "Notifications" },
  { icon: Users, label: "Users" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="flex flex-col items-center w-14 min-h-screen bg-[#1E293B] py-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#2563EB] mb-6">
        <ShieldCheck size={20} className="text-white" />
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-[#334155] mb-4" />

      {/* Main nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
              active
                ? "bg-[#2563EB] text-white"
                : "text-[#94A3B8] hover:bg-[#334155] hover:text-white"
            }`}
          >
            <Icon size={18} />
          </button>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-1 mt-4">
        <div className="w-8 h-px bg-[#334155] mb-2" />
        {bottomItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-[#94A3B8] hover:bg-[#334155] hover:text-white transition-colors"
          >
            <Icon size={18} />
          </button>
        ))}
        {/* Avatar */}
        <div className="mt-2 w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
          <span className="text-white text-xs font-semibold">AK</span>
        </div>
      </div>
    </aside>
  );
}
