import { ChevronRight, Search, Bell, HelpCircle, Sparkles } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopNavProps {
  breadcrumbs: BreadcrumbItem[];
}

export function TopNav({ breadcrumbs }: TopNavProps) {
  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-[#E2E8F0] shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            {idx < breadcrumbs.length - 1 ? (
              <>
                <span className="text-[#94A3B8] text-sm cursor-pointer hover:text-[#2563EB] transition-colors">
                  {crumb.label}
                </span>
                <ChevronRight size={14} className="text-[#CBD5E1]" />
              </>
            ) : (
              <span className="text-[#1E293B] text-sm font-medium">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 w-56">
          <Search size={14} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none w-full"
          />
        </div>

        {/* AI button */}
        <button
          title="AI Assistant"
          className="flex items-center gap-1.5 bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] rounded-lg px-3 py-1.5 text-sm hover:bg-[#DBEAFE] transition-colors"
        >
          <Sparkles size={14} />
          <span>Ask AI</span>
        </button>

        {/* Notification */}
        <button
          title="Notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>

        {/* Help */}
        <button
          title="Help"
          className="flex items-center justify-center w-8 h-8 rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          <HelpCircle size={16} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer">
          <span className="text-white text-xs font-semibold">AK</span>
        </div>
      </div>
    </header>
  );
}
