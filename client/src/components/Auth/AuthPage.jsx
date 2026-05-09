import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  User,
  Lock,
  Zap,
  Terminal,
  Activity,
  Shield,
  ArrowRight,
  Cpu,
  Fingerprint,
  ShieldAlert,
  Monitor,
  X,
  ChevronLeft,
  Command,
  Database,
  UserCheck,
  Key
} from "lucide-react";
import { apiRequest } from "../../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const IdentityCard = ({ title, subtitle, icon: Icon, active, onClick, color = "#ff4f00" }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex-1 p-6 border transition-all relative text-left group overflow-hidden",
      active ? "border-[#ff4f00] bg-[#ff4f00]/5 ring-1 ring-[#ff4f00]" : "border-[#c5c0b1] bg-white hover:border-[#201515]"
    )}
  >
     <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={60} />
     </div>
     <div className={cn(
       "h-8 w-8 rounded-full border flex items-center justify-center mb-4 transition-colors",
       active ? "bg-[#ff4f00] border-[#ff4f00] text-white" : "border-[#c5c0b1] text-[#939084] group-hover:border-[#201515]"
     )}>
        <Icon size={14} />
     </div>
     <h4 className={cn("text-[11px] font-bold uppercase tracking-widest mb-1", active ? "text-[#ff4f00]" : "text-[#201515]")}>
        {title}
     </h4>
     <p className="text-[8px] font-bold text-[#939084] uppercase tracking-widest leading-tight">
        {subtitle}
     </p>
     {active && (
       <motion.div 
         layoutId="active-indicator"
         className="absolute bottom-0 left-0 h-0.5 w-full bg-[#ff4f00]"
       />
     )}
  </button>
);

export default function AuthPage({ onAuthSuccess, onBack }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("standard"); // 'standard' or 'demo'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Smart Demo Bypass: If recruiter uses the demo credentials, let them in immediately
    // to guarantee the "Full Experience" even if the backend DB isn't seeded yet.
    if (formData.username === "admin_demo" && formData.password === "demo1234") {
      setTimeout(() => {
        onAuthSuccess({ 
          username: "Admin_Demo", 
          role: "super_admin",
          isDemo: true,
          permissions: { canManageUsers: true, canViewAnalytics: true }
        });
      }, 1000);
      return;
    }

    try {
      const res = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      onAuthSuccess(res.data);
    } catch (err) {
      setError(err.message || "Credential verification failed");
    } finally {
      setLoading(false);
    }
  };

  const selectDemo = () => {
    setMode("demo");
    setFormData({
      username: "admin_demo",
      password: "demo1234"
    });
  };

  const selectStandard = () => {
    setMode("standard");
    setFormData({
      username: "",
      password: ""
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#fffefb] flex flex-col items-center justify-center p-8 relative selection:bg-[#ff4f00]/10 overflow-hidden">
      <div className="absolute inset-0 bg-technical-grid opacity-5 pointer-events-none" />

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center cursor-pointer group mb-8 z-20"
        onClick={onBack}
      >
        <h2 className="text-[32px] font-bold tracking-tighter text-[#201515] uppercase leading-none group-hover:text-[#ff4f00] transition-colors">
          Owlpi<span className="text-[#ff4f00] group-hover:text-[#201515]">.</span>
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[500px] bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.06)] relative z-10"
      >
        <div className="border-b border-[#c5c0b1] bg-[#fcfcfc] p-4 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#ff4f00] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#201515]">System Identification</span>
           </div>
           <button onClick={onBack} className="text-[8px] font-bold text-[#939084] uppercase tracking-widest hover:text-[#ff4f00] transition-colors flex items-center gap-1.5">
              Protocol: Abort <X size={10} />
           </button>
        </div>

        <div className="p-8 lg:p-10">
           {/* Step 1: Identity Selection */}
           <div className="mb-10">
              <p className="text-[9px] font-bold text-[#939084] uppercase tracking-[0.4em] mb-4 text-center">Select Access Profile</p>
              <div className="flex gap-4">
                 <IdentityCard 
                    title="Standard"
                    subtitle="Existing Operators"
                    icon={User}
                    active={mode === "standard"}
                    onClick={selectStandard}
                 />
                 <IdentityCard 
                    title="Super Admin"
                    subtitle="Recruiter Demo"
                    icon={ShieldCheck}
                    active={mode === "demo"}
                    onClick={selectDemo}
                 />
              </div>
           </div>

           <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                 <form onSubmit={handleSubmit} className="space-y-6">
                   {error && (
                     <div className="p-3 bg-red-50 border border-red-100 rounded-[4px] flex items-center gap-3">
                        <ShieldAlert size={14} className="text-red-600" />
                        <span className="text-[10px] font-bold text-red-800 uppercase tracking-tight">{error}</span>
                     </div>
                   )}

                   <div className="space-y-5">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold uppercase tracking-widest text-[#939084] ml-1">Identity Handle</label>
                         <div className="relative group">
                            <User className="absolute left-3.5 top-2.5 h-4 w-4 text-[#c5c0b1] group-focus-within:text-[#ff4f00] transition-colors" />
                            <Input 
                              placeholder="operator_id"
                              required
                              className="pl-10 h-10 bg-transparent border-[#c5c0b1] focus:border-[#ff4f00] rounded-[4px] font-bold text-[12px] text-[#201515]"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                            />
                            {mode === 'demo' && (
                              <div className="absolute right-3 top-2.5 px-1.5 py-0.5 bg-[#ff4f00]/10 border border-[#ff4f00]/20 text-[7px] font-bold text-[#ff4f00] uppercase tracking-widest rounded-sm">
                                Pre-filled
                              </div>
                            )}
                         </div>
                      </div>

                      <div className="space-y-1.5">
                         <label className="text-[9px] font-bold uppercase tracking-widest text-[#939084] ml-1">Access Secret</label>
                         <div className="relative group">
                            <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-[#c5c0b1] group-focus-within:text-[#ff4f00] transition-colors" />
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              required
                              className="pl-10 h-10 bg-transparent border-[#c5c0b1] focus:border-[#ff4f00] rounded-[4px] font-bold text-[12px] text-[#201515]"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   <Button 
                      type="submit" 
                      disabled={loading}
                      variant="zapier"
                      className="w-full h-14 rounded-[4px] font-bold uppercase tracking-[0.3em] text-[11px] shadow-none mt-4 transition-all"
                   >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <span className="flex items-center gap-3">
                           {mode === 'demo' ? 'Initialize Super-Admin' : 'Establish Connection'} <ArrowRight size={14} />
                        </span>
                      )}
                   </Button>

                   {mode === 'standard' && (
                     <div className="text-center pt-4 border-t border-[#eceae3]">
                        <button 
                          type="button"
                          onClick={() => onAuthSuccess({ username: "Guest_Operator", role: "GUEST" })}
                          className="text-[9px] font-bold text-[#939084] uppercase tracking-widest hover:text-[#ff4f00] transition-colors"
                        >
                           Need a quick preview? Use Guest Mode
                        </button>
                     </div>
                   )}
                 </form>
              </motion.div>
           </AnimatePresence>

           <div className="mt-8 pt-6 border-t border-[#eceae3] flex flex-col items-center gap-4">
              <div className="flex items-center gap-6 opacity-20">
                 <Shield size={14} />
                 <Fingerprint size={14} />
                 <Cpu size={14} />
              </div>
              <p className="text-[7px] font-bold text-[#c5c0b1] uppercase tracking-[0.4em]">
                 Infrastructure Monitoring Node // Restricted Access
              </p>
             {/* Initial Provisioning Link */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">System_Status: Uninitialized?</p>
              <a 
                href="/setup-admin"
                className="text-[10px] font-bold text-black hover:text-[#FF4F00] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group"
              >
                Run Setup Sequence
                <div className="w-1 h-1 bg-[#FF4F00] rounded-full group-hover:animate-ping" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
