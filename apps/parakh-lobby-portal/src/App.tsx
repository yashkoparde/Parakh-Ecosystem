import React, { useState, useEffect } from "react";
import { ArrowRight, User, ShieldCheck, Landmark, Settings, CheckCircle } from "lucide-react";

// Deployed portal endpoints
const PORTALS = [
  {
    name: "Student Portal",
    icon: User,
    url: "https://parakh-student.vercel.app/",
    description: "Enables candidates to review published scores, check examination schedules, and export certified academic marksheets & migration records.",
    accessRoles: ["Student Candidate"]
  },
  {
    name: "Admin & Central Command",
    icon: Settings,
    url: "https://parakh-admin.vercel.app/",
    description: "Central administrative dashboard for creating syllabus blueprints, reviewing question catalogs, sealing papers, and auditing grading queues.",
    accessRoles: ["Board Controller", "Academic Auditor", "Evaluations Registrar"]
  },
  {
    name: "Physical Exam Center",
    icon: Landmark,
    url: "https://parakh-exam-center.vercel.app/",
    description: "On-site command panel for biometric gate check-in registration, jammer event detection, and dual-key secure exam paper printing.",
    accessRoles: ["Center Supervisor", "NTA Board Observer"]
  },
  {
    name: "Public Verification Portal",
    icon: ShieldCheck,
    url: "https://parakh-verifier.vercel.app/",
    description: "Open-access registry verification service. Calculates document SHA-256 hashes locally to validate authenticity against blockchain records.",
    accessRoles: ["Universities", "Employers", "Public Evaluators"]
  }
];

// Pre-seeded credentials table
const DEMO_CREDENTIALS = [
  { role: "Student Candidate", portal: "Student Portal", email: "student@parakh.gov.in", pass: "StudentPass123" },
  { role: "Board Controller", portal: "Admin Portal (L3)", email: "controller@parakh.gov.in", pass: "ControllerPass123" },
  { role: "Academic Auditor", portal: "Admin Portal (L2)", email: "auditor@parakh.gov.in", pass: "AuditorPass123" },
  { role: "Evaluations Registrar", portal: "Admin Portal (L1)", email: "verifier@parakh.gov.in", pass: "VerifierPass123" },
  { role: "Center Supervisor", portal: "Exam Center Portal", email: "supervisor@parakh.gov.in", pass: "SupervisorPass123" }
];

type IntroStep = "hbo-loading" | "student-run" | "parakh-intro" | "gateways";

export default function App() {
  const [currentStep, setCurrentStep] = useState<IntroStep>("hbo-loading");
  const [runningProgress, setRunningProgress] = useState(0);

  // 1. HBO Loading Sequence duration matching HBOLoader.tsx
  useEffect(() => {
    if (currentStep === "hbo-loading") {
      const timer = setTimeout(() => {
        setCurrentStep("student-run");
      }, 4600); // 4.6 seconds standard
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 2. Student Platform Running sequence
  useEffect(() => {
    if (currentStep === "student-run") {
      const interval = setInterval(() => {
        setRunningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep("parakh-intro");
            }, 1000); // Wait on success
            return 100;
          }
          return prev + 2;
        });
      }, 45); // Takes ~2.2 seconds
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // 3. PARAKH Intro title screen duration
  useEffect(() => {
    if (currentStep === "parakh-intro") {
      const timer = setTimeout(() => {
        setCurrentStep("gateways");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative font-sans select-none">
      
      {/* ----------------- STEP 1: HBO CINEMATIC INTRO ----------------- */}
      {currentStep === "hbo-loading" && (
        <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 overflow-hidden font-sans select-none">
          <div className="relative flex flex-col items-center justify-center animate-hbo-glow">
            {/* Cinematic subtle dark background grain/texture overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

            {/* Main Title: PARAKH with cinematic text letter-spacing expansions */}
            <div className="overflow-hidden py-2">
              <h1 className="text-4xl md:text-6xl font-light tracking-[0.25em] text-white font-sans uppercase relative select-none animate-hbo-text">
                PARAKH
              </h1>
            </div>

            {/* Secondary subtitle "LOBBY GATEWAY" */}
            <div className="mt-5 flex items-center gap-4 animate-hbo-subtitle">
              <div className="h-[1px] w-5 bg-slate-800" />
              <span className="text-xs font-mono font-medium text-slate-400">
                ECOSYSTEM HUB
              </span>
              <div className="h-[1px] w-5 bg-slate-800" />
            </div>

            {/* Horizontal precise separation line */}
            <div className="mt-8 h-[1px] bg-gradient-to-r from-transparent via-slate-500 to-transparent animate-hbo-line" />
          </div>

          {/* Footer system status log line */}
          <div className="absolute bottom-12 font-mono text-[9px] text-slate-600 tracking-[0.25em] uppercase opacity-50">
            System Core Boot Session Initiated • Compliant
          </div>
        </div>
      )}

      {/* ----------------- STEP 2: MINIMAL PLATFORM RUNNER ----------------- */}
      {currentStep === "student-run" && (
        <div className="flex flex-col items-center justify-center fade-in">
          {/* Horizontal platform line */}
          <div className="w-[280px] sm:w-[360px] h-1.5 bg-neutral-900 border border-neutral-800 rounded-full relative overflow-visible">
            
            {/* Travel indicator */}
            <div 
              className="absolute left-0 top-0 h-full bg-slate-400 rounded-full" 
              style={{ width: `${runningProgress}%` }}
            />
            
            {/* Student avatar (emoji runner) */}
            <div 
              className="absolute top-[-26px] -translate-x-1/2 text-lg" 
              style={{ left: `${runningProgress}%` }}
            >
              🏃
            </div>

            {/* Milestones */}
            <div className="absolute right-[-45px] top-1/2 -translate-y-1/2">
              {runningProgress >= 100 ? (
                <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider">
                  🎓 SUCCESS
                </span>
              ) : (
                <span className="text-[9px] font-mono text-neutral-650 text-neutral-500 tracking-wider">
                  EXAM
                </span>
              )}
            </div>
          </div>
          
          <div className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase mt-6">
            Calibrating student academic path...
          </div>
        </div>
      )}

      {/* ----------------- STEP 3: BRAND TITLE FADE-IN ----------------- */}
      {currentStep === "parakh-intro" && (
        <div className="text-center space-y-4 fade-in px-6">
          <h2 className="text-xl sm:text-2xl font-light tracking-[0.3em] font-sans text-white uppercase">
            PARAKH
          </h2>
          <div className="h-[1px] bg-neutral-900 w-16 mx-auto" />
          <p className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-mono">
            Performance Assessment, Review, and Analysis of Knowledge for Holistic Development
          </p>
          <p className="text-[9px] text-neutral-500 font-mono tracking-widest uppercase mt-2">
            National Examination Governance Ecosystem
          </p>
        </div>
      )}

      {/* ----------------- STEP 4: GOVERNMENT-GRADE REDIRECTION HUB ----------------- */}
      {currentStep === "gateways" && (
        <div className="w-full max-w-5xl px-6 py-8 flex flex-col justify-between min-h-screen fade-in">
          
          {/* Official Header Band */}
          <header className="border-b border-neutral-900 pb-5 mb-8 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase block">
                MINISTRY OF EDUCATION • GOVERNMENT OF INDIA
              </span>
              <h2 className="text-lg font-bold tracking-widest font-mono text-white uppercase">
                PARAKH DIGITAL TRUST NETWORK
              </h2>
              <span className="text-[9px] font-mono text-neutral-400 block uppercase">
                Central Examination Lifecycle Management Portals
              </span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-900 px-3 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                System Status: OPERATIONAL
              </span>
            </div>
          </header>

          {/* Central Portal Gateways Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <div
                  key={portal.name}
                  className="bg-neutral-950/60 border border-neutral-900 p-6 rounded flex flex-col justify-between transition-colors duration-200 hover:border-neutral-800"
                >
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-neutral-400 p-1.5 border border-neutral-900 rounded bg-neutral-950">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex gap-1.5">
                        {portal.accessRoles.map(role => (
                          <span key={role} className="text-[7.5px] font-mono tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800 px-1.5 py-0.5 rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-white font-mono mt-4 tracking-wide uppercase">
                      {portal.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      {portal.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-950">
                    <a
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 py-2 rounded text-xs font-medium text-neutral-300 hover:text-white transition-colors"
                    >
                      Access Portal <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Secure Audit Credentials Panel */}
          <div className="mt-8 bg-neutral-950 border border-neutral-900 rounded p-5">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-900">
              <CheckCircle className="h-4 w-4 text-slate-400" />
              <span className="text-[9px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                Official Seed Verification Accounts (Evaluator Testing Keys)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[9px] border-collapse font-mono text-neutral-400">
                <thead>
                  <tr className="text-neutral-600 border-b border-neutral-900 uppercase">
                    <th className="pb-2 font-semibold">Verification Role</th>
                    <th className="pb-2 font-semibold">Portal Destination</th>
                    <th className="pb-2 font-semibold">Email Identifier</th>
                    <th className="pb-2 font-semibold">Access Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {DEMO_CREDENTIALS.map((c, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40">
                      <td className="py-2.5 font-bold text-neutral-300">{c.role}</td>
                      <td className="py-2.5 text-neutral-500">{c.portal}</td>
                      <td className="py-2.5 text-sky-500 select-all">{c.email}</td>
                      <td className="py-2.5 text-indigo-400 select-all">{c.pass}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Footer */}
          <footer className="mt-10 border-t border-neutral-950 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[8.5px] text-neutral-500 font-mono tracking-widest uppercase">
            <span>© 2026 MINISTRY OF EDUCATION, GOVERNMENT OF INDIA. ALL RIGHTS RESERVED.</span>
            <span>Cryptographic Integrity Assured</span>
          </footer>

        </div>
      )}

    </div>
  );
}
