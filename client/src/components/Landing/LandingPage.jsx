import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Zap,
  Activity,
  ArrowRight,
  Terminal,
  Shield,
  Cpu,
  Fingerprint,
  Database,
  Building2,
  Users,
  Key,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Triangle,
  Hexagon,
  Circle,
  Square,
  Shapes,
  Copy,
  Code,
  Network,
  Server,
  Workflow,
  Share2,
  Lock,
  Search,
  Settings,
  Monitor,
  User,
  Check,
  Mail,
  MessageSquare,
  X,
  Loader2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SectionLabel = ({ number, title }) => (
  <div className="flex items-center gap-4 mb-6">
    <div className="h-[1px] w-12 bg-[#ff4f00]" />
    <span className="text-[10px] font-bold text-[#ff4f00] uppercase tracking-[0.5em]">
      {number} // {title}
    </span>
  </div>
);

const ContactModal = ({ isOpen, onClose }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#201515]/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-[500px] bg-[#fffefb] border border-[#c5c0b1] shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-1.5 bg-[#201515] flex items-center justify-between">
               <div className="flex items-center gap-2 pl-4">
                  <div className="h-1.5 w-1.5 bg-[#ff4f00] rounded-full" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">Protocol: Inbound_Request</span>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-[#ff4f00] transition-colors text-white">
                  <X size={14} />
               </button>
            </div>

            <div className="p-10">
               {sent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                     <div className="h-20 w-20 border-2 border-[#ff4f00] flex items-center justify-center mx-auto mb-8 relative">
                        <Check size={32} className="text-[#ff4f00]" />
                        <motion.div 
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 border border-[#ff4f00]"
                        />
                     </div>
                     <h3 className="text-[24px] font-bold uppercase tracking-tighter text-[#201515] mb-4">Transmission Received</h3>
                     <p className="text-[14px] text-[#939084] font-medium leading-relaxed uppercase tracking-widest">
                        Our engineering team will contact you shortly for onboarding.
                     </p>
                  </motion.div>
               ) : (
                  <>
                    <div className="mb-10">
                       <h3 className="text-[32px] font-bold uppercase tracking-tighter text-[#201515] mb-2">Request Access</h3>
                       <p className="text-[12px] text-[#939084] font-medium uppercase tracking-[0.2em]">Enter your credentials for infrastructure deployment.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#939084]">Full Name</label>
                          <Input 
                            required
                            placeholder="OPERATOR_NAME"
                            className="h-12 bg-transparent border-[#c5c0b1] focus:border-[#ff4f00] rounded-none font-bold text-[12px] tracking-widest uppercase"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#939084]">Work Email</label>
                          <Input 
                            required
                            type="email"
                            placeholder="NODE_ENDPOINT@DOMAIN.COM"
                            className="h-12 bg-transparent border-[#c5c0b1] focus:border-[#ff4f00] rounded-none font-bold text-[12px] tracking-widest uppercase"
                          />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-[#939084]">Organization</label>
                          <Input 
                            required
                            placeholder="ENTITY_IDENTIFIER"
                            className="h-12 bg-transparent border-[#c5c0b1] focus:border-[#ff4f00] rounded-none font-bold text-[12px] tracking-widest uppercase"
                          />
                       </div>

                       <Button 
                         type="submit"
                         disabled={loading}
                         className="w-full h-14 bg-[#201515] text-white hover:bg-[#ff4f00] rounded-none text-[11px] font-bold uppercase tracking-[0.4em] mt-4 transition-all"
                       >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : (
                            <span className="flex items-center gap-3">
                               Initialize Connection <ArrowRight size={14} />
                            </span>
                          )}
                       </Button>
                    </form>
                  </>
               )}
            </div>
            
            <div className="p-4 bg-[#fcfcfc] border-t border-[#c5c0b1] flex items-center justify-between">
               <span className="text-[8px] font-bold text-[#c5c0b1] uppercase tracking-widest">System_ID: OWLPI_VAULT</span>
               <div className="flex gap-4 opacity-30">
                  <Shield size={10} />
                  <Lock size={10} />
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TechLogo = ({ name, className }) => {
  const logos = {
    rabbitmq: (
      <svg viewBox="-169 285.9 64 64" className={className}>
        <path d="M-109.242 311.496h-20.113a1.82 1.82 0 0 1-1.82-1.82v-20.963c0-1.56-1.253-2.812-2.812-2.812h-7.185c-1.56 0-2.812 1.253-2.812 2.812v20.822c0 1.087-.874 1.962-1.962 1.962l-6.594.024c-1.087 0-1.985-.874-1.962-1.962l.047-20.845c0-1.56-1.253-2.812-2.812-2.812h-7.185c-1.56 0-2.812 1.253-2.812 2.812v58.682c0 1.37 1.11 2.505 2.505 2.505h55.516c1.37 0 2.505-1.11 2.505-2.505V314a2.49 2.49 0 0 0-2.505-2.505zm-9.43 22.027a3.27 3.27 0 0 1-3.262 3.261h-5.672a3.27 3.27 0 0 1-3.261-3.261v-5.672a3.27 3.27 0 0 1 3.261-3.261h5.672a3.27 3.27 0 0 1 3.262 3.261z" fill="currentColor"/>
      </svg>
    ),
    postgres: (
      <svg viewBox="0 0 25.6 25.6" className={className}>
        <path d="M23.535 15.6c-2.89.596-3.1-.383-3.1-.383 3.053-4.53 4.33-10.28 3.228-11.687-3.004-3.84-8.205-2.023-8.292-1.976l-.028.005a10.31 10.31 0 0 0-1.929-.201c-1.308-.02-2.3.343-3.054.914 0 0-9.278-3.822-8.846 4.807.092 1.836 2.63 13.9 5.66 10.25C8.29 15.987 9.36 14.86 9.36 14.86c.53.353 1.167.533 1.834.468l.052-.044a2.02 2.02 0 0 0 .021.518c-.78.872-.55 1.025-2.11 1.346-1.578.325-.65.904-.046 1.056.734.184 2.432.444 3.58-1.162l-.046.183c.306.245.52 1.593.484 2.815s-.06 2.06.18 2.716.48 2.13 2.53 1.7c1.713-.367 2.6-1.32 2.725-2.906.088-1.128.286-.962.3-1.97l.16-.478c.183-1.53.03-2.023 1.085-1.793l.257.023c.777.035 1.794-.125 2.39-.402 1.285-.596 2.047-1.592.78-1.33z" fill="currentColor"/>
      </svg>
    ),
    mongodb: (
      <svg viewBox="0 0 32 32" className={className}>
        <path d="M15.9.087l.854 1.604c.192.296.4.558.645.802.715.715 1.394 1.464 2.004 2.266 1.447 1.9 2.423 4.01 3.12 6.292.418 1.394.645 2.824.662 4.27.07 4.323-1.412 8.035-4.4 11.12-.488.488-1.01.94-1.57 1.342-.296 0-.436-.227-.558-.436-.227-.383-.366-.82-.436-1.255-.105-.523-.174-1.046-.14-1.586v-.244C16.057 24.21 15.796.21 15.9.087z" fill="currentColor"/>
        <path d="M15.9.034c-.035-.07-.07-.017-.105.017.017.35-.105.662-.296.96-.21.296-.488.523-.767.767-1.55 1.342-2.77 2.963-3.747 4.776-1.3 2.44-1.97 5.055-2.16 7.808-.087.993.314 4.497.627 5.508.854 2.684 2.388 4.933 4.375 6.885.488.47 1.01.906 1.55 1.325.157 0 .174-.14.21-.244a4.78 4.78 0 0 0 .157-.68l.35-2.614L15.9.034z" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    nodejs: (
      <svg viewBox="0 0 32 32" className={className}>
        <path d="M14.656.427c.8-.453 1.82-.455 2.6 0L29.2 7.16c.747.42 1.247 1.253 1.24 2.114v13.5c.005.897-.544 1.748-1.332 2.16l-11.88 6.702a2.6 2.6 0 0 1-2.639-.073l-3.565-2.06c-.243-.145-.516-.26-.688-.495.152-.204.422-.23.642-.32.496-.158.95-.4 1.406-.656.115-.08.256-.05.366.022l3.04 1.758c.217.125.437-.04.623-.145l11.665-6.583c.144-.07.224-.222.212-.38V9.334c.016-.18-.087-.344-.25-.417L16.19 2.244a.41.41 0 0 0-.465-.001L3.892 8.93c-.16.073-.27.235-.25.415v13.37c-.014.158.07.307.215.375l3.162 1.785c.594.32 1.323.5 1.977.265a1.5 1.5 0 0 0 .971-1.409l.003-13.29c-.014-.197.172-.36.363-.34h1.52c.2-.005.357.207.33.405L12.18 23.88c.001 1.188-.487 2.48-1.586 3.063-1.354.7-3.028.553-4.366-.12l-3.4-1.88c-.8-.4-1.337-1.264-1.332-2.16v-13.5a2.46 2.46 0 0 1 1.282-2.141L14.656.427z" fill="currentColor"/>
      </svg>
    )
  };
  return logos[name] || <Globe className={className} />;
};

const TechnicalCard = ({ title, description, icon: Icon, tags = [] }) => (
  <motion.div 
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-[#fffefb] border border-[#c5c0b1] p-8 group hover:border-[#ff4f00] transition-all relative overflow-hidden flex flex-col h-full cursor-pointer"
  >
     <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={120} strokeWidth={1} />
     </div>
     <div className="flex items-start justify-between mb-8">
        <div className="h-12 w-12 border border-[#c5c0b1] flex items-center justify-center group-hover:border-[#ff4f00] group-hover:bg-[#ff4f00]/5 transition-all">
           <Icon className="text-[#201515] group-hover:text-[#ff4f00]" size={20} />
        </div>
        <ArrowUpRight size={18} className="text-[#c5c0b1] group-hover:text-[#ff4f00] transition-colors" />
     </div>
     <h3 className="text-[24px] font-bold tracking-tighter text-[#201515] mb-4 uppercase leading-none">{title}</h3>
     <p className="text-[14px] text-[#939084] font-medium leading-relaxed mb-8 flex-1">{description}</p>
     <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-[#fcfcfc] border border-[#eceae3] text-[8px] font-bold text-[#939084] uppercase tracking-[0.3em]">
            {tag}
          </span>
        ))}
     </div>
  </motion.div>
);

const PricingSection = ({ onRequestAccess }) => {
  const tiers = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for personal projects and small prototypes.",
      features: ["1 Active Client", "10,000 Events/mo", "24h Data Retention", "Basic Metrics"],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "49",
      description: "Scale your business with advanced analytics and security.",
      features: ["Unlimited Clients", "1M Events/mo", "30d Data Retention", "Advanced Security", "Custom Roles"],
      cta: "Upgrade to Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated infrastructure for massive throughput.",
      features: ["Unlimited Events", "Infinite Retention", "Dedicated Worker Nodes", "Custom SLA", "Priority Support"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div id="pricing" className="max-w-[1600px] mx-auto px-10 py-20 flex flex-col justify-center min-h-screen">
      <div className="text-center mb-16">
        <SectionLabel number="05" title="Pricing Tiers" />
        <h2 className="text-[40px] lg:text-[72px] font-bold tracking-tighter text-[#201515] uppercase leading-[0.85]">
          Built for <span className="text-[#ff4f00]">Velocity.</span><br />
          <span className="text-[#939084]">Scalable for Growth.</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={cn(
              "p-10 border transition-all relative flex flex-col h-full",
              tier.popular ? "border-[#ff4f00] bg-[#201515] text-white shadow-[0_15px_45px_rgba(255,79,0,0.1)]" : "border-[#c5c0b1] bg-[#fffefb] text-[#201515]"
            )}
          >
            {tier.popular && (
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#ff4f00] text-white px-4 py-1 text-[9px] font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <h3 className="text-[28px] font-bold uppercase tracking-tighter mb-4">{tier.name}</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-[40px] font-bold leading-none">{tier.price === "Custom" ? "" : "$"}</span>
              <span className="text-[56px] font-bold tracking-tighter leading-none">{tier.price}</span>
              {tier.price !== "Custom" && <span className={cn("text-[12px] font-bold uppercase tracking-widest", tier.popular ? "text-white/60" : "text-[#939084]")}>/mo</span>}
            </div>
            
            <p className={cn("text-[14px] font-medium leading-relaxed mb-10 flex-1", tier.popular ? "text-white/80" : "text-[#36342e]")}>
              {tier.description}
            </p>

            <div className="space-y-3 mb-12">
              {tier.features.map(feature => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", tier.popular ? "bg-[#ff4f00]/20" : "bg-emerald-50")}>
                    <Check size={10} className={tier.popular ? "text-[#ff4f00]" : "text-emerald-500"} />
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-tight opacity-90">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onRequestAccess}
              className={cn(
                "h-14 w-full rounded-none text-[10px] font-bold uppercase tracking-[0.3em] transition-all",
                tier.popular ? "bg-[#ff4f00] text-white hover:bg-white hover:text-[#201515]" : "bg-[#201515] text-white hover:bg-[#ff4f00]"
              )}
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemBlueprint = () => {
  const nodes = [
    { id: "NW", label: "RECEIVE", x: "15%", y: "15%", icon: Zap },
    { id: "NE", label: "PROCESS", x: "85%", y: "15%", icon: Cpu },
    { id: "SE", label: "STORAGE", x: "85%", y: "85%", icon: Database },
    { id: "SW", label: "SECURE", x: "15%", y: "85%", icon: Shield },
  ];

  return (
    <div className="relative w-full aspect-square max-w-[340px] bg-[#fffefb] border border-[#c5c0b1]/30 p-1 overflow-hidden mx-auto">
       <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-[0.05]">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border-r border-b border-[#201515]" />
          ))}
       </div>
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="#c5c0b1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="85%" y2="15%" stroke="#c5c0b1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#c5c0b1" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="50%" y1="50%" x2="15%" y2="85%" stroke="#c5c0b1" strokeWidth="1" strokeDasharray="4 4" />
       </svg>
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
         className="absolute inset-0 pointer-events-none z-30"
       >
          <div className="absolute top-1/2 left-1/2 w-full h-[2.5px] bg-gradient-to-r from-[#ff4f00]/50 to-transparent origin-left -translate-y-1/2 blur-[1.5px]" />
          <div className="absolute top-1/2 left-1/2 w-full h-[1.5px] bg-[#ff4f00]/80 origin-left -translate-y-1/2" />
       </motion.div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-20 w-20 bg-[#201515] rounded-full border-[3px] border-[#ff4f00] flex items-center justify-center relative shadow-[0_0_40px_rgba(255,79,0,0.3)]"
          >
             <div className="h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                <div className="h-2.5 w-2.5 bg-[#ff4f00] rounded-full shadow-[0_0_15px_#ff4f00]" />
             </div>
          </motion.div>
       </div>
       {nodes.map((node) => (
         <div key={node.id} className="absolute z-10" style={{ left: node.x, top: node.y }}>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1, borderColor: "#ff4f00", backgroundColor: "#fcfcfc" }}
              className="h-12 w-12 -translate-x-1/2 -translate-y-1/2 bg-white border border-[#c5c0b1] flex items-center justify-center transition-all shadow-md group"
            >
               <node.icon size={18} className="text-[#201515] group-hover:text-[#ff4f00] transition-colors" />
            </motion.div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#939084] uppercase tracking-[0.2em] whitespace-nowrap">
               {node.label}
            </div>
            <motion.div 
              animate={{ 
                left: [0, (node.id.includes("W") ? 1 : -1) * 140], 
                top: [0, (node.id.includes("N") ? 1 : -1) * 140],
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.2, 1.2, 0.5]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: Math.random() * 2.5, ease: "linear" }}
              className="absolute h-1.5 w-1.5 bg-[#ff4f00] rounded-full z-0 pointer-events-none shadow-[0_0_8px_#ff4f00]"
              style={{ left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
            />
         </div>
       ))}
    </div>
  );
};

const InfrastructureWalkthrough = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      id: "producer", 
      title: "Event Generation", 
      label: "STEP_01",
      tech: "nodejs",
      role: "PRODUCER",
      description: "The API Gateway acts as a Producer, intercepting every hit and instantly emitting a raw telemetry event.",
      meta: "Express_Producer // API_HIT"
    },
    { 
      id: "broker", 
      title: "Reliable Brokerage", 
      label: "STEP_02",
      tech: "rabbitmq",
      role: "MESSAGE_BROKER",
      description: "RabbitMQ manages the high-velocity event stream, holding hits securely in the queue until the worker is ready.",
      meta: "RabbitMQ_v3 // api_hits_queue"
    },
    { 
      id: "consumer", 
      title: "Distributed Worker", 
      label: "STEP_03",
      tech: "nodejs",
      role: "CONSUMER",
      description: "Our background consumer worker pulls events from the queue, performing context enrichment and validation.",
      meta: "consumer.js // Background_Task"
    },
    { 
      id: "persistence", 
      title: "Parallel Persistence", 
      label: "STEP_04",
      tech: "mongodb",
      role: "DATABASE_LAYER",
      description: "The consumer simultaneously writes the enriched data to MongoDB for raw logs and PostgreSQL for real-time analytics.",
      meta: "Mongo_Logs + Postgres_Stats"
    }
  ];

  return (
    <div id="how-it-works" className="max-w-[1600px] mx-auto px-10 py-20 flex flex-col justify-center min-h-screen">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
             <SectionLabel number="03" title="Data Lifecycle" />
             <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-[#201515] uppercase leading-[0.85] mb-8">
                Real-Time<br /> <span className="text-[#939084]">Event Architecture.</span>
             </h2>
             
             <div className="space-y-3">
                {steps.map((step, idx) => (
                  <button 
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "w-full text-left p-6 transition-all relative border border-transparent flex items-center justify-between group",
                      activeStep === idx ? "bg-[#201515] border-[#ff4f00]" : "hover:bg-[#fcfcfc] hover:border-[#c5c0b1]/30"
                    )}
                  >
                     <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-[9px] font-bold tracking-widest uppercase",
                          activeStep === idx ? "text-[#ff4f00]" : "text-[#c5c0b1]"
                        )}>
                          {step.role}
                        </span>
                        <h4 className={cn(
                          "text-[16px] font-bold uppercase tracking-tight",
                          activeStep === idx ? "text-white" : "text-[#201515]"
                        )}>
                          {step.title}
                        </h4>
                     </div>
                     <ChevronRight size={16} className={cn(
                       "transition-transform",
                       activeStep === idx ? "text-[#ff4f00] rotate-90" : "text-[#c5c0b1] group-hover:translate-x-1"
                     )} />
                  </button>
                ))}
             </div>
          </div>

          <div className="lg:col-span-7">
             <div className="bg-[#fffefb] border border-[#c5c0b1] p-10 min-h-[500px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 border-l border-b border-[#c5c0b1]/30">
                   <div className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">
                      Pipeline_Status: <span className="text-[#ff4f00]">OPERATIONAL</span>
                   </div>
                </div>

                <AnimatePresence mode="wait">
                   <motion.div 
                     key={activeStep}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.4 }}
                     className="flex-1 flex flex-col"
                   >
                      <div className="flex items-center gap-4 mb-8">
                         <div className="h-14 w-14 bg-[#201515] flex items-center justify-center">
                            {activeStep === 3 ? (
                               <div className="flex gap-1">
                                  <TechLogo name="mongodb" className="h-4 w-4 text-[#ff4f00]" />
                                  <TechLogo name="postgres" className="h-4 w-4 text-[#ff4f00]" />
                               </div>
                            ) : (
                               <TechLogo name={steps[activeStep].tech} className="h-6 w-6 text-[#ff4f00]" />
                            )}
                         </div>
                         <div>
                            <span className="text-[10px] font-bold text-[#ff4f00] uppercase tracking-[0.4em]">{steps[activeStep].label} // {steps[activeStep].role}</span>
                            <h3 className="text-[28px] font-bold text-[#201515] uppercase tracking-tighter">{steps[activeStep].title}</h3>
                         </div>
                      </div>

                      <p className="text-[18px] text-[#36342e] leading-relaxed mb-12 opacity-80 max-w-xl">
                         {steps[activeStep].description}
                      </p>

                      <div className="mt-auto p-8 bg-[#fcfcfc] border border-dashed border-[#c5c0b1] flex items-center justify-center relative">
                         <div className="absolute top-3 left-3 text-[7px] font-bold text-[#c5c0b1] uppercase tracking-widest">
                            {steps[activeStep].meta}
                         </div>
                         
                         <div className="h-40 w-full flex items-center justify-center">
                            <div className="relative flex items-center gap-10">
                               <div className="h-16 w-16 border border-[#c5c0b1] flex items-center justify-center relative bg-white p-3 overflow-hidden opacity-20 grayscale">
                                  {activeStep === 0 ? (
                                     <User size={28} className="text-[#c5c0b1]" />
                                  ) : (
                                     <TechLogo name={steps[activeStep - 1].tech} className="h-full w-full" />
                                  )}
                               </div>

                               <div className="h-[1px] w-16 bg-[#c5c0b1] relative">
                                  <motion.div 
                                    animate={{ left: ["0%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="h-1.5 w-1.5 bg-[#ff4f00] rounded-full absolute -top-[3px]"
                                  />
                               </div>

                               <div className={cn(
                                 "h-16 w-16 border border-[#ff4f00] flex items-center justify-center bg-white shadow-[0_0_20px_rgba(255,79,0,0.1)] p-3 overflow-hidden",
                                 activeStep === 3 && "flex flex-col gap-1.5 p-1.5"
                               )}>
                                  {activeStep === 3 ? (
                                     <>
                                        <TechLogo name="mongodb" className="h-5 w-5" />
                                        <TechLogo name="postgres" className="h-5 w-5" />
                                     </>
                                  ) : (
                                     <TechLogo name={steps[activeStep].tech} className="h-full w-full" />
                                  )}
                               </div>
                            </div>
                         </div>
                      </div>
                   </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between border-t border-[#eceae3] pt-6 text-[9px] font-bold uppercase tracking-widest text-[#939084]">
                   <span>Event_Driven: TRUE</span>
                   <span>Sync_Persistence: PARALLEL</span>
                   <span>Status: Online</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default function LandingPage({ onSignIn, onLiveDemo }) {
  const [scrolled, setScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeDocTab, setActiveDocTab] = useState('universal');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const partners = [
    { name: "Vercel", icon: Triangle, color: "#000000" },
    { name: "Stripe", icon: Zap, color: "#635bff" },
    { name: "GitHub", icon: Code, color: "#24292f" },
    { name: "Supabase", icon: Database, color: "#3ecf8e" },
    { name: "Railway", icon: Activity, color: "#000000" },
    { name: "Linear", icon: Layers, color: "#5e6ad2" }
  ];

  return (
    <div className="min-h-screen bg-[#fffefb] text-[#201515] selection:bg-[#ff4f00]/10 overflow-x-hidden font-sans">
      <div className="fixed inset-0 bg-technical-grid opacity-5 pointer-events-none" />
      <div className="fixed top-0 right-0 w-1/2 h-full border-l border-[#c5c0b1]/20 pointer-events-none" />

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      <nav className={cn(
        "fixed top-0 w-full z-[100] transition-all duration-500 px-10 border-b",
        scrolled ? "bg-[#fffefb]/95 backdrop-blur-md border-[#c5c0b1] py-4" : "bg-transparent border-transparent py-8"
      )}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-20">
            <div className="cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
               <h2 className="text-[20px] font-bold tracking-tighter text-[#201515] uppercase leading-none">
                 Owlpi<span className="text-[#ff4f00]">.</span>
               </h2>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              <button onClick={() => scrollToSection('features')} className="text-[9px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#ff4f00] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-[9px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all relative group">
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#ff4f00] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-[9px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#ff4f00] transition-all group-hover:w-full" />
              </button>
              <button onClick={() => setIsContactOpen(true)} className="text-[9px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#ff4f00] transition-all group-hover:w-full" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="text-[9px] font-bold text-[#201515] uppercase tracking-[0.3em] hover:text-[#ff4f00] transition-colors" onClick={onSignIn}>Login</button>
            <Button 
              className="bg-[#201515] text-white hover:bg-[#ff4f00] px-6 h-9 rounded-none text-[9px] font-bold uppercase tracking-[0.3em] transition-all shadow-none"
              onClick={() => setIsContactOpen(true)}
            >
              Request Access
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-10 z-10 min-h-screen flex items-center">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8 }}
               >
                  <SectionLabel number="01" title="API Monitoring" />
                  <h1 className="text-[54px] lg:text-[88px] font-bold leading-[0.85] tracking-tighter text-[#201515] mb-8 uppercase">
                     API Security<span className="text-[#ff4f00]">.</span> <br />
                     <span className="text-[#939084]">Simplified</span><br />
                     For Teams.
                  </h1>
                  <p className="text-[16px] font-medium text-[#36342e] max-w-xl leading-relaxed mb-10 opacity-70">
                     Track your API traffic, secure your data, and manage your team’s access in one simple, professional dashboard.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6">
                     <Button 
                       size="lg" 
                       className="bg-[#ff4f00] text-white hover:bg-[#201515] h-14 px-10 text-[11px] font-bold rounded-none uppercase tracking-[0.4em] transition-all shadow-[0_12px_40px_rgba(255,79,0,0.15)]"
                       onClick={() => setIsContactOpen(true)}
                     >
                       Request Access
                     </Button>
                     <Button 
                       variant="outline"
                       size="lg" 
                       className="border-[#c5c0b1] text-[#201515] hover:bg-[#201515] hover:text-white h-14 px-10 text-[11px] font-bold rounded-none uppercase tracking-[0.4em] transition-all"
                       onClick={onLiveDemo}
                     >
                       <span className="flex items-center gap-2">
                          <Play size={14} className="fill-current" /> Live Demo
                       </span>
                     </Button>
                  </div>
               </motion.div>
            </div>
            
            <div className="lg:col-span-5 hidden lg:block">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.2 }}
                 className="relative border border-[#c5c0b1] p-10 bg-[#fffefb] shadow-xl max-w-[440px] ml-auto"
               >
                  <div className="mt-4">
                     <SystemBlueprint />
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 border-y border-[#c5c0b1] bg-[#fffefb] overflow-hidden relative z-10">
         <div className="flex whitespace-nowrap">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-20 pr-20"
            >
               {partners.map((p, i) => (
                 <div key={`${p.name}-${i}`} className="flex items-center gap-4 group cursor-default">
                    <div className="h-8 w-8 border border-[#c5c0b1] flex items-center justify-center transition-all group-hover:border-[#ff4f00]/30 shadow-sm bg-white">
                       <p.icon size={14} style={{ color: p.color }} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[20px] font-bold tracking-tighter text-[#201515] uppercase opacity-40 group-hover:opacity-100 transition-opacity">{p.name}</span>
                 </div>
               ))}
            </motion.div>
         </div>
      </div>

      {/* Features Section */}
      <section id="features" className="px-10 relative z-10 min-h-screen flex items-center">
         <div className="max-w-[1600px] mx-auto w-full py-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16">
               <div className="max-w-2xl">
                  <SectionLabel number="02" title="Core Features" />
                  <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-[#201515] uppercase leading-[0.85]">
                     Everything You Need<br /> <span className="text-[#939084]">To Manage Your APIs.</span>
                  </h2>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#c5c0b1] border border-[#c5c0b1]">
               <TechnicalCard 
                 icon={Activity} 
                 title="Live Traffic Tracking" 
                 description="See exactly who is calling your APIs and how fast your system is responding in real-time."
                 tags={["Live Data", "Stats"]}
               />
               <TechnicalCard 
                 icon={Building2} 
                 title="Separate Client Data" 
                 description="Keep your different business clients or environments organized and securely separated."
                 tags={["SaaS", "Security"]}
               />
               <TechnicalCard 
                 icon={Key} 
                 title="Secure API Keys" 
                 description="Easily create and manage API keys. We handle the security and rotation automatically."
                 tags={["Keys", "Security"]}
               />
            </div>
         </div>
      </section>

      {/* Infrastructure Walkthrough */}
      <section className="bg-[#fffefb] relative z-10 border-t border-[#c5c0b1]/30">
         <InfrastructureWalkthrough />
      </section>

      {/* Technical Blueprint Portal (UPGRADED) */}
      <section id="docs" className="px-10 py-32 bg-[#fffefb] relative z-10 border-t border-[#c5c0b1]/30">
         <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col gap-4 mb-20 border-l-2 border-[#ff4f00] pl-6">
               <span className="text-[10px] font-black text-[#ff4f00] uppercase tracking-[0.4em]">Universal Ingestion Protocol v1.2</span>
               <h2 className="text-[40px] lg:text-[64px] font-bold tracking-tighter text-[#201515] uppercase leading-none">
                  Agnostic <span className="text-[#939084]">Integration.</span>
               </h2>
               <p className="text-[14px] text-[#939084] font-medium max-w-xl leading-relaxed">
                  Owlpi is language-independent. Whether your system is built in Node, Go, Python, or Rust, our protocol speaks the universal language of HTTP.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-[#fffefb] border border-[#c5c0b1] rounded-[4px] shadow-sm overflow-hidden min-h-[600px]">
               {/* Documentation Sidebar */}
               <div className="lg:col-span-3 border-r border-[#c5c0b1] bg-[#fcfcfc]/50 p-0">
                  <div className="p-6 border-b border-[#c5c0b1]">
                     <span className="text-[9px] font-bold text-[#939084] uppercase tracking-widest">Protocol Stacks</span>
                  </div>
                  <nav className="flex flex-col">
                     {[
                        { id: 'universal', t: 'Universal (REST API)', d: 'Any Language / Any Platform' },
                        { id: 'middleware', t: 'Node.js / Express', d: 'High-speed middleware pattern' },
                        { id: 'python', t: 'Python / Flask / Fast', d: 'Native library integration' },
                        { id: 'schema', t: 'Payload Schema', d: 'Standardized JSON structure' }
                     ].map((nav, i) => (
                        <button 
                           key={i}
                           onClick={() => setActiveDocTab(nav.id)}
                           className={cn(
                              "text-left p-6 border-b border-[#c5c0b1]/50 transition-all group",
                              activeDocTab === nav.id ? "bg-[#fffefb] border-r-4 border-r-[#ff4f00]" : "hover:bg-[#fffefb]"
                           )}
                        >
                           <p className={cn(
                              "text-[12px] font-bold uppercase tracking-tight mb-1",
                              activeDocTab === nav.id ? "text-[#ff4f00]" : "text-[#201515]"
                           )}>{nav.t}</p>
                           <p className="text-[10px] text-[#939084] font-medium">{nav.d}</p>
                        </button>
                     ))}
                  </nav>
               </div>

               {/* Documentation Content */}
               <div className="lg:col-span-9 p-0 flex flex-col">
                  {/* Top Header */}
                  <div className="px-10 py-6 border-b border-[#c5c0b1] bg-[#fcfcfc] flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Globe size={14} className="text-[#ff4f00]" />
                        <span className="text-[11px] font-bold text-[#201515] uppercase tracking-widest">
                           {activeDocTab === 'universal' && 'Protocol: universal_rest_v1.json'}
                           {activeDocTab === 'middleware' && 'Implementation: express_middleware.js'}
                           {activeDocTab === 'python' && 'Implementation: flask_telemetry.py'}
                           {activeDocTab === 'schema' && 'Specification: payload_v1.2.json'}
                        </span>
                     </div>
                     <div className="flex items-center gap-6">
                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Language Agnostic
                        </span>
                     </div>
                  </div>

                  {/* Main Display Area */}
                  <div className="flex-1 grid grid-cols-1 xl:grid-cols-2">
                     <div className="p-10 border-r border-[#c5c0b1]">
                        <h3 className="text-[11px] font-black text-[#201515] uppercase tracking-widest mb-6">
                           {activeDocTab === 'universal' && 'How it Works'}
                           {activeDocTab === 'middleware' && 'Execution Logic'}
                           {activeDocTab === 'python' && 'Background Shipping'}
                           {activeDocTab === 'schema' && 'Data Structure'}
                        </h3>
                        <div className="space-y-6">
                           <p className="text-[13px] text-[#939084] font-medium leading-relaxed">
                              {activeDocTab === 'universal' && 'Owlpi treats all data sources equally. As long as your application can send a Standard HTTP POST request, you are ready to monitor.'}
                              {activeDocTab === 'middleware' && 'Our Node.js middleware captures performance telemetry using the finish event. This ensures data ingestion only occurs after the client has received their response.'}
                              {activeDocTab === 'python' && 'Python applications can use standard decorators or background threads to ship telemetry without blocking the main execution loop.'}
                              {activeDocTab === 'schema' && 'The Owlpi protocol requires a standardized set of keys to ensure your charts and metrics are aggregated with high precision.'}
                           </p>
                           
                           <div className="bg-[#fcfcfc] border border-[#c5c0b1] p-6 rounded-[2px] space-y-4">
                              <h4 className="text-[9px] font-bold text-[#201515] uppercase tracking-[0.2em]">
                                 {activeDocTab === 'schema' ? 'Core Properties' : 'The Ingestion Rule'}
                              </h4>
                              {activeDocTab === 'schema' ? (
                                <div className="space-y-2">
                                   <p className="text-[10px] font-mono text-[#201515]">serviceName: string</p>
                                   <p className="text-[10px] font-mono text-[#201515]">latencyMs: number</p>
                                </div>
                              ) : (
                                <p className="text-[11px] text-[#939084] leading-relaxed italic">
                                   "If it speaks HTTP, it speaks Owlpi."
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                 <div>
                                    <p className="text-[10px] font-bold text-[#939084] uppercase mb-1">Method</p>
                                    <p className="text-[12px] font-mono text-[#ff4f00] font-bold">POST</p>
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-[#939084] uppercase mb-1">Payload</p>
                                    <p className="text-[12px] font-mono text-[#201515]">JSON</p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-2 p-3 bg-[#201515] text-white rounded-[2px]">
                              <Terminal size={14} className="text-[#ff4f00]" />
                              <span className="text-[10px] font-bold uppercase tracking-tight">Works with: Go, Rust, Ruby, PHP, Java & more.</span>
                           </div>
                        </div>
                     </div>

                     <div className="bg-[#1a1a1a] p-10 font-mono text-[13px] leading-relaxed relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded transition-colors">
                              <Copy size={14} />
                           </button>
                        </div>
                        
                        {activeDocTab === 'universal' && (
                           <>
                              <pre className="text-white/40 italic mb-6">// Universal Integration (Any Language)</pre>
                              <pre className="text-white">POST <span className="text-emerald-400">https://owlpi.app/api/hit</span></pre>
                              <pre className="text-white">Headers: {"{"}</pre>
                              <pre className="text-white">  <span className="text-emerald-400">"x-api-key"</span>: <span className="text-white">"YOUR_KEY"</span>,</pre>
                              <pre className="text-white">  <span className="text-emerald-400">"Content-Type"</span>: <span className="text-emerald-400">"application/json"</span></pre>
                              <pre className="text-white">{"}"}</pre>
                              <br />
                              <pre className="text-white">Body: {"{"}</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"serviceName"</span>: <span className="text-emerald-400">"api-gateway"</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"endpoint"</span>: <span className="text-emerald-400">"/v1/users"</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"statusCode"</span>: <span className="text-white">200</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"latencyMs"</span>: <span className="text-white">45</span></pre>
                              <pre className="text-white">{"}"}</pre>
                           </>
                        )}

                        {activeDocTab === 'middleware' && (
                           <>
                              <pre className="text-white/40 italic mb-6">// Express Middleware Pattern</pre>
                              <pre className="text-[#ff4f00]">app.use(<span className="text-white">async</span> (req, res, next) =&gt; {"{"}</pre>
                              <pre className="text-white">  <span className="text-[#939084]">const</span> start = Date.now();</pre>
                              <pre className="text-white">  res.on(<span className="text-emerald-400">'finish'</span>, () =&gt; {"{"}</pre>
                              <pre className="text-white">    owlpi.logHit({"{"}</pre>
                              <pre className="text-white">      endpoint: req.path,</pre>
                              <pre className="text-white">      latency: Date.now() - start</pre>
                              <pre className="text-white">    {"}"});</pre>
                              <pre className="text-white">  {"}"});</pre>
                              <pre className="text-white">  next();</pre>
                              <pre className="text-[#ff4f00]">{"}"});</pre>
                           </>
                        )}

                        {activeDocTab === 'python' && (
                           <>
                              <pre className="text-white/40 italic mb-6"># Flask After-Request Hook</pre>
                              <pre className="text-white"><span className="text-[#ff4f00]">@app.after_request</span></pre>
                              <pre className="text-white"><span className="text-[#939084]">def</span> <span className="text-emerald-400">owlpi_telemetry</span>(response):</pre>
                              <pre className="text-white">    owlpi.log_hit(</pre>
                              <pre className="text-white">        endpoint=request.path,</pre>
                              <pre className="text-white">        status=response.status_code,</pre>
                              <pre className="text-white">        latency=get_latency()</pre>
                              <pre className="text-white">    )</pre>
                              <pre className="text-white">    <span className="text-[#939084]">return</span> response</pre>
                           </>
                        )}

                        {activeDocTab === 'schema' && (
                           <>
                              <pre className="text-white/40 italic mb-6">// Ingestion Schema Definition</pre>
                              <pre className="text-white">{"{"}</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"serviceName"</span>: <span className="text-emerald-400">"string"</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"endpoint"</span>: <span className="text-emerald-400">"string"</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"method"</span>: <span className="text-emerald-400">"GET | POST | etc"</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"statusCode"</span>: <span className="text-white">number</span>,</pre>
                              <pre className="text-white">  <span className="text-[#939084]">"latencyMs"</span>: <span className="text-white">number</span></pre>
                              <pre className="text-white">{"}"}</pre>
                           </>
                        )}
                        <br />
                        <pre className="text-white/40 italic">// 202 Accepted</pre>
                     </div>
                  </div>

                  {/* Bottom Footer */}
                  <div className="px-10 py-6 border-t border-[#c5c0b1] bg-[#fcfcfc] flex items-center justify-between">
                     <div className="flex gap-10">
                        <div className="flex items-center gap-2">
                           <ShieldCheck size={14} className="text-[#939084]" />
                           <span className="text-[10px] font-bold text-[#201515] uppercase tracking-widest">Secure Ingestion</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Cpu size={14} className="text-[#939084]" />
                           <span className="text-[10px] font-bold text-[#201515] uppercase tracking-widest">Any Architecture</span>
                        </div>
                     </div>
                     <button className="text-[11px] font-black text-[#ff4f00] uppercase tracking-widest hover:underline flex items-center gap-2">
                        View Full API Spec <ArrowUpRight size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-[#fcfcfc] border-y border-[#c5c0b1]/30 relative z-10">
         <PricingSection onRequestAccess={() => setIsContactOpen(true)} />
      </section>

      <footer className="py-20 px-10 bg-[#fffefb] relative z-10">
         <div className="max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
               <h2 className="text-[24px] font-bold tracking-tighter text-[#201515] uppercase leading-none">
                  Owlpi<span className="text-[#ff4f00]">.</span>
               </h2>
               <div className="flex items-center gap-10">
                  <button onClick={() => setIsContactOpen(true)} className="text-[8px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all">
                    Contact
                  </button>
                  {["Twitter", "GitHub", "Discord", "Docs"].map(item => (
                    <a key={item} href="#" className="text-[8px] font-bold text-[#939084] hover:text-[#201515] uppercase tracking-[0.4em] transition-all">
                      {item}
                    </a>
                  ))}
               </div>
               <p className="text-[9px] text-[#939084] font-bold uppercase tracking-widest opacity-60">
                  © 2026 Owlpi Infrastructure // All Rights Reserved
               </p>
            </div>
         </div>
      </footer>
    </div>
  );
}
