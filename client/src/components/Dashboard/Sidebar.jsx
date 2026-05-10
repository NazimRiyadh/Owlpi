import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Globe,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
  Terminal,
  MoreHorizontal,
  Box,
  Shield,
  User,
  Fingerprint,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Zap,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({
  profile,
  currentView,
  setCurrentView,
  onLogout,
  onBackHome,
  range,
  setRange,
}) {
  const [showProfileCard, setShowProfileCard] = useState(false);

  const isSuperAdmin = profile?.role === "super_admin";
  const isSystemAdmin = profile?.role === "system_admin";
  const hasFullAccess = isSuperAdmin || isSystemAdmin;
  const canManageUsers = hasFullAccess || profile?.permissions?.canManageUsers;

  const sections = [
    {
      title: "Navigation",
      items: [
        { id: "metrics", label: "Dashboard", icon: Activity },
        { id: "live", label: "Live Traffic", icon: Zap },
        { id: "docs", label: "Documentation", icon: BookOpen },
        { id: "settings", label: "Organizations", icon: Layers },
        {
          id: "team",
          label: "Team Members",
          icon: Users,
          hidden: !canManageUsers,
        },
        {
          id: "system",
          label: "System Settings",
          icon: Shield,
          hidden: !isSuperAdmin,
        },
      ],
    },
  ];

  const userInitial = profile?.username?.substring(0, 2).toUpperCase() || "OP";
  const userDisplayName = profile?.username || "Operator";
  const userRoleName =
    profile?.role?.replace("_", " ").toUpperCase() || "AUTHORIZED PERSONNEL";

  return (
    <aside className="w-64 border-r border-[#c5c0b1] bg-[#fffefb] flex flex-col h-full py-6 px-4 relative">
      {/* Brand Section */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div
          className="flex items-center gap-3.5 group cursor-pointer"
          onClick={onBackHome}
        >
          <div>
            <h2 className="text-[26px] font-bold tracking-tighter text-[#201515] leading-none uppercase">
              Owlpi<span className="text-[#ff4f00]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[11px] font-bold text-[#201515] uppercase tracking-[0.2em] mb-4 border-b border-[#eceae3] pb-2">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-[13px] font-bold transition-all group",
                      currentView === item.id
                        ? "text-[#201515] bg-transparent shadow-[inset_0_-2px_0_0_#ff4f00]"
                        : "text-[#939084] hover:text-[#201515] hover:shadow-[inset_0_-2px_0_0_#c5c0b1]",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={16}
                        className={cn(
                          "transition-colors",
                          currentView === item.id
                            ? "text-[#ff4f00]"
                            : "text-[#939084] group-hover:text-[#201515]",
                        )}
                      />
                      <span className="tracking-tight">{item.label}</span>
                    </div>
                  </button>
                ))}
            </nav>
          </div>
        ))}

        {/* Time Protocol Selector (NEW) */}
        <div className="mt-8">
          <h3 className="text-[11px] font-bold text-[#201515] uppercase tracking-[0.2em] mb-4 border-b border-[#eceae3] pb-2 flex items-center gap-2">
            Time Window <Terminal size={12} className="text-[#ff4f00]" />
          </h3>
          <div className="flex gap-1 p-1 bg-[#eceae3]/50 rounded-[4px] border border-[#c5c0b1]">
            {["1h", "24h", "7d"].map((t) => (
              <button
                key={t}
                onClick={() => setRange(t)}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-bold uppercase transition-all rounded-[2px]",
                  range === t
                    ? "bg-[#fffefb] text-[#ff4f00] shadow-sm border border-[#c5c0b1]"
                    : "text-[#939084] hover:text-[#201515]",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Detail Card (Overlay) */}
      {showProfileCard && (
        <div className="absolute bottom-32 left-4 right-4 bg-[#fffefb] border border-[#ff4f00] rounded-[4px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff4f00]">
              Identity Verified
            </span>
            <button
              onClick={() => setShowProfileCard(false)}
              className="text-[#939084] hover:text-[#201515]"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#eceae3]">
              <div className="h-10 w-10 rounded-[4px] bg-[#201515] flex items-center justify-center text-white text-sm font-bold">
                {userInitial}
              </div>
              <div>
                <p className="text-[12px] font-bold text-[#201515] leading-tight">
                  {userDisplayName}
                </p>
                <p className="text-[9px] text-[#939084] font-bold uppercase tracking-widest">
                  {userRoleName}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#939084] font-bold uppercase">
                  Org Context
                </span>
                <span
                  className={cn(
                    "font-bold uppercase tracking-tight",
                    isSuperAdmin
                      ? "text-[#ff4f00]"
                      : "text-[#201515] font-mono",
                  )}
                >
                  {isSuperAdmin
                    ? "Global Infrastructure"
                    : profile?.clientId?.substring(0, 8) || "Unknown"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#939084] font-bold uppercase">
                  System Link
                </span>
                <span className="text-emerald-600 font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Verified
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap gap-1">
                {isSuperAdmin && (
                  <Badge className="bg-[#ff4f00]/5 text-[#ff4f00] border-[#ff4f00]/20 rounded-[2px] text-[7px] uppercase font-bold">
                    Root Access
                  </Badge>
                )}
                <Badge className="bg-[#eceae3] text-[#201515] border-none rounded-[2px] text-[7px] uppercase font-bold px-1.5">
                  Secure
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer / System Profile */}
      <div className="mt-auto pt-6 border-t border-[#c5c0b1]">
        <button
          onClick={() => setShowProfileCard(!showProfileCard)}
          className={cn(
            "w-full bg-[#fffefb] border rounded-[4px] p-3 flex items-center gap-3 group transition-all mb-4 text-left",
            showProfileCard
              ? "border-[#ff4f00] shadow-[0_4px_12px_rgba(255,79,0,0.1)]"
              : "border-[#c5c0b1] hover:border-[#ff4f00]",
          )}
        >
          <div className="relative">
            <div className="h-9 w-9 rounded-[4px] bg-[#201515] flex items-center justify-center text-white font-bold text-xs uppercase group-hover:bg-[#ff4f00] transition-colors">
              {userInitial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#fffefb] rounded-full animate-pulse" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-[#201515] truncate">
              {userDisplayName}
            </p>
            <p className="text-[9px] text-[#939084] font-bold uppercase tracking-widest truncate">
              {userRoleName}
            </p>
          </div>
          <ChevronRight
            size={14}
            className={cn(
              "text-[#939084] transition-transform",
              showProfileCard && "rotate-90 text-[#ff4f00]",
            )}
          />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 h-10 rounded-[4px] text-[12px] font-bold transition-all text-[#201515] border border-[#c5c0b1] hover:bg-[#201515] hover:text-[#fffefb] hover:border-[#201515]"
        >
          <LogOut size={14} />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}

function Badge({ children, className }) {
  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded-[2px] border text-[7px] font-bold uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}
