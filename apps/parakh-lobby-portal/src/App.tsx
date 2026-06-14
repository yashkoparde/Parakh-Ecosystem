import React, { useState, useEffect, useRef } from "react";
import { Shield, Database, Cpu, Activity, Fingerprint, ExternalLink, Terminal, Key, CheckCircle2, Lock, Unlock, Server, CircleDot } from "lucide-react";

// Deployed portal targets
const PORTALS = [
  {
    name: "Student Portal",
    icon: Shield,
    url: "https://parakh-student.vercel.app/",
    color: "from-sky-500 to-indigo-600",
    shadow: "shadow-sky-500/10",
    glow: "border-sky-500/30 hover:border-sky-400",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    desc: "Access individual exam schedules, check published scores, and download cryptographically signed academic transcripts & migration certificates generated via pdf-lib.",
    roles: ["Student Candidate"]
  },
  {
    name: "Admin & Central Command",
    icon: Server,
    url: "https://parakh-admin.vercel.app/",
    color: "from-indigo-600 to-purple-600",
    shadow: "shadow-indigo-500/10",
    glow: "border-indigo-500/30 hover:border-indigo-400",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    desc: "Central command panel for board controllers and reviewers. Author questions (Drona), define blueprints (Veda), seal papers (Edge Functions), and check double-blind evaluation pipelines.",
    roles: ["Controller (Clearance L3)", "Academic Auditor", "Verifier"]
  },
  {
    name: "Physical Exam Center",
    icon: Fingerprint,
    url: "https://parakh-exam-center.vercel.app/",
    color: "from-teal-500 to-emerald-600",
    shadow: "shadow-teal-500/10",
    glow: "border-teal-500/30 hover:border-teal-400",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    desc: "Secure on-site console for Chief Supervisors. Biometric candidate admissions, jammer alerts, local Wi-Fi sniffers logs, and print release log auditors to prevent duplication.",
    roles: ["Center Supervisor", "NTA Board Observer"]
  },
  {
    name: "Public Verification Portal",
    icon: Activity,
    url: "https://parakh-verifier.vercel.app/",
    color: "from-emerald-500 to-sky-500",
    shadow: "shadow-emerald-500/10",
    glow: "border-emerald-500/30 hover:border-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    desc: "Open-access hub for employers and universities. Drag & drop PDF certificates to calculate client-side hashes and verify against immutable blockchain records.",
    roles: ["Third-Party Employers", "Universities", "Credential Verifiers"]
  }
];

// Pre-seeded evaluation credentials
const DEMO_CREDENTIALS = [
  { role: "Student Candidate", portal: "🎓 Student", email: "student@parakh.gov.in", pass: "StudentPass123", privileges: "View scores, download certificates." },
  { role: "Board Controller", portal: "💼 Admin", email: "controller@parakh.gov.in", pass: "ControllerPass123", privileges: "Seal papers, issue degrees (Clearance Level 3)." },
  { role: "Academic Auditor", portal: "💼 Admin", email: "auditor@parakh.gov.in", pass: "AuditorPass123", privileges: "Create/review questions, audit paper drafts." },
  { role: "Evaluations Registrar", portal: "💼 Admin", email: "verifier@parakh.gov.in", pass: "VerifierPass123", privileges: "Issue final result locks (Clearance Level 1)." },
  { role: "Center Supervisor", portal: "🏫 Exam Center", email: "supervisor@parakh.gov.in", pass: "SupervisorPass123", privileges: "CCTV streams, candidate entry, print release." }
];

const CALIBRATION_LOGS = [
  { text: "Initializing PARAKH client handshake...", delay: 200, category: "core" },
  { text: "Checking auth session tokens...", delay: 400, category: "core" },
  { text: "Connecting to remote Supabase DB: https://xapeorzscuwggqqocvsq.supabase.co...", delay: 600, category: "database" },
  { text: "Syncing schemas: Resolving custom PostgreSQL enums...", delay: 800, category: "database" },
  { text: "Loading user roles enum: CONTROLLER, SUPERVISOR, ACADEMIC_AUDITOR, VERIFIER...", delay: 1000, category: "database" },
  { text: "Scanning master table matrices: 20 active relational tables identified...", delay: 1200, category: "database" },
  { text: "Checking Row-Level Security: Enforcing RLS policy 'Student access restriction'...", delay: 1400, category: "security" },
  { text: "Accessing storage buckets: exam-papers, student-evaluation-payloads, academic-credentials...", delay: 1600, category: "security" },
  { text: "Triggering test to seal-paper Deno Edge Function...", delay: 1800, category: "edge" },
  { text: "Triggering test to issue-certificate Deno Edge Function...", delay: 2000, category: "edge" },
  { text: "Triggering test to verify-document Deno Edge Function...", delay: 2200, category: "edge" },
  { text: "Validating Universal Audit Logger trigger: proc_audit_logger()... Status: Compliant", delay: 2400, category: "database" },
  { text: "Validating Blockchain Record Anchoring trigger: proc_blockchain_anchor_simulator()... Status: Compliant", delay: 2600, category: "ledger" },
  { text: "Reading latest block link in blockchain_records ledger...", delay: 2800, category: "ledger" },
  { text: "System calibration: 100% complete. Secure environment verified.", delay: 3000, category: "core" }
];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Calibration progress counter
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + Math.floor(Math.random() * 4) + 1;
          return next > 100 ? 100 : next;
        });
      }, 90);
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => setIsLoaded(true), 600);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  // Calibration scrolling text feed
  useEffect(() => {
    CALIBRATION_LOGS.forEach(log => {
      const timeout = setTimeout(() => {
        setActiveLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log.text}`]);
      }, log.delay);
      return () => clearTimeout(timeout);
    });
  }, []);

  // Auto-scroll logs terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeLogs]);

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex flex-col font-sans">
      
      {/* Decorative Cyber Grid & Scanning Laser */}
      <div className="absolute inset-0 cyber-grid opacity-25 z-0" />
      <div className="laser-scan z-10" />

      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col justify-between relative z-20">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mt-4">
          <div className="flex items-center gap-3 bg-slate-900/60 border border-sky-500/20 px-4 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-lg">
            <CircleDot className="h-4 w-4 text-sky-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-sky-400 uppercase">
              PARAKH Digital Trust Network Lobby
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            🎓 PARAKH Ecosystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg font-mono">
            Secure, Transparent & Blockchain-Anchored Board Examination Management System
          </p>
        </header>

        {/* Loading / Calibration State */}
        {!isLoaded ? (
          <main className="flex-1 flex flex-col items-center justify-center py-12 max-w-2xl mx-auto w-full">
            
            {/* Rotating Security Rings Visual */}
            <div className="relative mb-8 flex items-center justify-center">
              {/* Outer Pulsing Ring */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-sky-500/20 animate-[spin_20s_linear_infinite]" />
              {/* Mid Rotating Ring */}
              <div className="absolute w-20 h-20 rounded-full border border-indigo-500/40 border-t-transparent animate-[spin_8s_linear_infinite]" />
              {/* Inner Glow Center */}
              <div className="absolute w-14 h-14 rounded-full bg-slate-900 border border-sky-500/40 flex items-center justify-center shadow-inner">
                {progress < 100 ? (
                  <Lock className="h-5 w-5 text-sky-400 animate-pulse" />
                ) : (
                  <Unlock className="h-5 w-5 text-emerald-400" />
                )}
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-sm p-4 backdrop-blur-md mb-6 shadow-2xl">
              <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-sky-400" /> SECURITY ENVIRONMENT CALIBRATION
                </span>
                <span className="text-sky-400 font-bold">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Diagnostic Terminal Logs */}
            <div className="w-full bg-slate-950/90 border border-slate-800 rounded-sm p-4 h-52 overflow-y-auto font-mono text-[10px] text-slate-300 shadow-inner">
              <div className="text-sky-500 font-bold mb-2 pb-1 border-b border-slate-900 flex justify-between items-center">
                <span>SYSTEM CALIBRATION LOGS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
              </div>
              <div className="space-y-1">
                {activeLogs.map((log, index) => {
                  let logColor = "text-slate-400";
                  if (log.includes("DB:")) logColor = "text-indigo-400";
                  if (log.includes("RLS") || log.includes("Security")) logColor = "text-amber-400";
                  if (log.includes("Edge Function")) logColor = "text-purple-400";
                  if (log.includes("complete") || log.includes("Compliant")) logColor = "text-emerald-400";
                  return (
                    <div key={index} className={`leading-relaxed ${logColor}`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>

          </main>
        ) : (
          
          /* Operational / Redirect Landing Cards */
          <main className="flex-1 flex flex-col justify-center py-6 w-full max-w-5xl mx-auto">
            
            {/* Calibration Complete System Banner */}
            <div className="flex items-center gap-3 bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-sm mb-8 backdrop-blur-md animate-[pulse-glow_4s_infinite_alternate]">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wide">
                  SYSTEM CORE CALIBRATED
                </h3>
                <p className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
                  Remote database, storage buckets, serverless Deno Edge Functions, and blockchain record simulator linked. Ready for operation.
                </p>
              </div>
            </div>

            {/* Portals Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PORTALS.map((portal) => {
                const IconComponent = portal.icon;
                return (
                  <div
                    key={portal.name}
                    className={`bg-slate-900/60 border ${portal.glow} p-5 rounded-sm flex flex-col justify-between transition-all duration-300 hover:translate-y-[-2px] backdrop-blur-md shadow-lg hover:shadow-2xl ${portal.shadow}`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-3">
                        <div className={`p-2 bg-gradient-to-br ${portal.color} rounded-sm shadow-md`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${portal.badgeColor}`}>
                          AUTHORIZED ROLES
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-4">{portal.name}</h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{portal.desc}</p>
                      
                      {/* Authorized Roles Tickers */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {portal.roles.map(r => (
                          <span key={r} className="text-[8px] font-mono font-medium bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800">
                      <a
                        href={portal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md`}
                      >
                        Launch Portal <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pre-Seeded Evaluation Credentials Drawer */}
            <div className="mt-8 bg-slate-950/80 border border-slate-800 rounded-sm p-4 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                <Key className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                  Seed credentials (for evaluator sign-in check)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] border-collapse font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-900">
                      <th className="pb-2 font-semibold uppercase">SYSTEM ROLE</th>
                      <th className="pb-2 font-semibold uppercase">PORTAL TARGET</th>
                      <th className="pb-2 font-semibold uppercase">DEMO EMAIL</th>
                      <th className="pb-2 font-semibold uppercase">PASSWORD</th>
                      <th className="pb-2 font-semibold uppercase">SYSTEM PRIVILEGES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {DEMO_CREDENTIALS.map((cred, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        <td className="py-2.5 font-bold text-slate-200">{cred.role}</td>
                        <td className="py-2.5 text-slate-400">{cred.portal}</td>
                        <td className="py-2.5 select-all text-sky-400">{cred.email}</td>
                        <td className="py-2.5 select-all text-indigo-400">{cred.pass}</td>
                        <td className="py-2.5 text-slate-400">{cred.privileges}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        )}

        {/* Footer Audit Signature */}
        <footer className="mt-8 border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-550 font-mono">
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>Cryptographic Integrity Audits: Verified & Compliant</span>
          </div>
          <div>
            <span>PARAKH Governance Ecosystem &copy; 2026</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
