import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Activity,
  Layers,
  MoreHorizontal,
  Shield,
  CheckCircle2,
  Zap,
  Database,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar({
  profile,
  currentView,
  setCurrentView,
  onLogout,
  onBackHome,
  isCollapsed,
  setIsCollapsed
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
        { id: "archive", label: "Archive", icon: Database },
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
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="border-r border-[#c5c0b1] bg-[#fffefb] flex flex-col h-full py-6 px-4 relative z-20 group/sidebar"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-24 h-6 w-6 bg-[#fffefb] border border-[#c5c0b1] rounded-full flex items-center justify-center text-[#939084] hover:text-[#ff4f00] hover:border-[#ff4f00] transition-all z-30 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Section */}
      <div className={cn(
        "flex items-center mb-10 px-2",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div
          className="flex items-center gap-3.5 group cursor-pointer overflow-hidden"
          onClick={onBackHome}
        >
          <div className="flex-shrink-0">
            <h2 className="text-[26px] font-bold tracking-tighter text-[#201515] leading-none uppercase">
              O<span className="text-[#ff4f00]">.</span>
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    wlpi
                  </motion.span>
                )}
              </AnimatePresence>
            </h2>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide overflow-x-hidden">
        {sections.map((section) => (
          <div key={section.title}>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-bold text-[#201515] uppercase tracking-[0.2em] mb-4 border-b border-[#eceae3] pb-2 whitespace-nowrap"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>
            <nav className="space-y-1.5">
              {section.items
                .filter((item) => !item.hidden)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={cn(
                      "w-full flex items-center px-3 py-2.5 rounded-[4px] text-[13px] font-bold transition-all group/item",
                      currentView === item.id
                        ? "text-[#201515] bg-[#eceae3]/50 shadow-[inset_0_-2px_0_0_#ff4f00]"
                        : "text-[#939084] hover:text-[#201515] hover:bg-[#eceae3]/30",
                      isCollapsed ? "justify-center" : "justify-between"
                    )}
                    title={isCollapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        size={18}
                        className={cn(
                          "transition-colors flex-shrink-0",
                          currentView === item.id
                            ? "text-[#ff4f00]"
                            : "text-[#939084] group-hover/item:text-[#201515]",
                        )}
                      />
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="tracking-tight whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </div>
                  </button>
                ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Profile Detail Card (Overlay) */}
      <AnimatePresence>
        {showProfileCard && !isCollapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-32 left-4 right-4 bg-[#fffefb] border border-[#ff4f00] rounded-[4px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-50"
          >
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
                <div className="overflow-hidden">
                  <p className="text-[12px] font-bold text-[#201515] leading-tight truncate">
                    {userDisplayName}
                  </p>
                  <p className="text-[9px] text-[#939084] font-bold uppercase tracking-widest truncate">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / System Profile */}
      <div className="mt-auto pt-6 border-t border-[#c5c0b1] overflow-hidden">
        <button
          onClick={() => !isCollapsed && setShowProfileCard(!showProfileCard)}
          className={cn(
            "w-full bg-[#fffefb] border rounded-[4px] p-2.5 flex items-center gap-3 group transition-all mb-4 text-left",
            showProfileCard && !isCollapsed
              ? "border-[#ff4f00] shadow-[0_4px_12px_rgba(255,79,0,0.1)]"
              : "border-[#c5c0b1] hover:border-[#ff4f00]",
            isCollapsed && "justify-center px-0 border-transparent hover:border-transparent"
          )}
        >
          <div className="relative flex-shrink-0">
            <div className={cn(
              "h-9 w-9 rounded-[4px] bg-[#201515] flex items-center justify-center text-white font-bold text-xs uppercase group-hover:bg-[#ff4f00] transition-colors",
              isCollapsed && "h-10 w-10"
            )}>
              {userInitial}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-emerald-500 border-2 border-[#fffefb] rounded-full animate-pulse" />
          </div>
          {!isCollapsed && (
            <>
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
            </>
          )}
        </button>

        <button
          onClick={onLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 h-10 rounded-[4px] text-[12px] font-bold transition-all text-[#201515] border border-[#c5c0b1] hover:bg-[#201515] hover:text-[#fffefb] hover:border-[#201515]",
            isCollapsed && "justify-center border-transparent hover:bg-transparent hover:text-[#ff4f00]"
          )}
          title={isCollapsed ? "Terminate Session" : ""}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Terminate Session</span>}
        </button>
      </div>
    </motion.aside>
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
