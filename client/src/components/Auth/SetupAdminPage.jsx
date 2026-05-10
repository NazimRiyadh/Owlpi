import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  User,
  Mail,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { apiRequest } from "../../api";

export default function SetupAdminPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/auth/onboard-super-admin", {
        method: "POST",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.success) {
        setSuccess(true);
      }
    } catch (err) {
      const errorMsg =
        err.payload?.message ||
        err.message ||
        "Onboarding failed. A Super Admin might already exist.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6 font-mono">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 border-2 border-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">
            System Provisioned
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Master Administrator account has been successfully initialized. You
            can now access the full technical infrastructure.
          </p>
          <a
            href="/auth"
            className="block w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#FF4F00] transition-colors border-2 border-black"
          >
            Go to Login
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-6 font-mono selection:bg-[#FF4F00] selection:text-white">
      {/* Blueprint Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative z-10"
      >
        <div className="flex flex-col md:flex-row">
          {/* Sidebar - Technical Context */}
          <div className="md:w-1/3 bg-black text-white p-8 border-b-2 md:border-b-0 md:border-r-2 border-black">
            <div className="mb-8">
              <Shield className="w-12 h-12 text-[#FF4F00] mb-4" />
              <h1 className="text-xl font-bold uppercase tracking-tighter leading-none">
                Platform
                <br />
                Initialization
              </h1>
            </div>

            <div className="space-y-4 text-[10px] opacity-60 leading-tight uppercase tracking-widest">
              <p>Service: Owlpi_Core</p>
              <p>Module: AUTH_PROVISIONING</p>
              <p>Access_Level: ROOT_0</p>
              <div className="pt-4 border-t border-white/20">
                <p>Status: Initializing...</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold uppercase tracking-tighter mb-2">
                Master Onboarding
              </h2>
              <p className="text-gray-500 text-sm tracking-tight">
                Create the root administrator account to unlock infrastructure
                telemetry.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="root_admin"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    System Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="admin@owlpi.tech"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1 pb-4">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Confirm Master Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-black outline-none transition-colors"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#FF4F00] transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  "Initializing..."
                ) : (
                  <>
                    Initialize System
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
