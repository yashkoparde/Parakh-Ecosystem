import React, { useState, useEffect } from "react";
import { GraduationCap, ShieldAlert, Monitor, Search, Key } from "lucide-react";

// Deployed portal targets mapped to circular profile selectors
const PROFILES = [
  {
    name: "Student Candidate",
    icon: GraduationCap,
    url: "https://parakh-student.vercel.app/",
    bgClass: "bg-sky-650 bg-sky-600 hover:bg-sky-500",
    color: "text-sky-400",
    ringClass: "group-hover:ring-sky-500/40 group-hover:border-sky-400",
    clearance: "STUDENT ACCESS"
  },
  {
    name: "Board Command",
    icon: ShieldAlert,
    url: "https://parakh-admin.vercel.app/",
    bgClass: "bg-indigo-650 bg-indigo-600 hover:bg-indigo-500",
    color: "text-indigo-400",
    ringClass: "group-hover:ring-indigo-500/40 group-hover:border-indigo-400",
    clearance: "LEVEL 3 (CONTROLLER)"
  },
  {
    name: "Exam Center",
    icon: Monitor,
    url: "https://parakh-exam-center.vercel.app/",
    bgClass: "bg-teal-650 bg-teal-600 hover:bg-teal-500",
    color: "text-teal-400",
    ringClass: "group-hover:ring-teal-500/40 group-hover:border-teal-400",
    clearance: "LEVEL 2 (SUPERVISOR)"
  },
  {
    name: "Public Verifier",
    icon: Search,
    url: "https://parakh-verifier.vercel.app/",
    bgClass: "bg-neutral-750 bg-neutral-700 hover:bg-neutral-600",
    color: "text-neutral-300",
    ringClass: "group-hover:ring-neutral-400/40 group-hover:border-neutral-450",
    clearance: "LEVEL 1 (VERIFIER)"
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

type IntroStep = "hbo-loading" | "student-run" | "gateways";

export default function App() {
  const [currentStep, setCurrentStep] = useState<IntroStep>("hbo-loading");
  const [runningProgress, setRunningProgress] = useState(0);
  const [showCredentials, setShowCredentials] = useState(false);

  // 1. HBO Loader Duration matching HBOLoader.tsx
  useEffect(() => {
    if (currentStep === "hbo-loading") {
      const timer = setTimeout(() => {
        setCurrentStep("student-run");
      }, 4600);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 2. Student Platform Running animation
  useEffect(() => {
    if (currentStep === "student-run") {
      const interval = setInterval(() => {
        setRunningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep("gateways");
            }, 1000); // Transition to role selector after success settles
            return 100;
          }
          return prev + 2.5;
        });
      }, 50); // Runs for ~2.0 seconds
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative font-sans select-none overflow-hidden">
      
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

            {/* Secondary subtitle "ECOSYSTEM HUB" */}
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

      {/* ----------------- STEP 2: MINIMAL RUNNER PLATFORM ----------------- */}
      {currentStep === "student-run" && (
        <div className="flex flex-col items-center justify-center fade-in">
          {/* Horizontal platform line */}
          <div className="w-[280px] sm:w-[360px] h-1 bg-neutral-900 border border-neutral-800/80 rounded-full relative overflow-visible">
            
            {/* Travel progress fill */}
            <div 
              className="absolute left-0 top-0 h-full bg-slate-500 rounded-full" 
              style={{ width: `${runningProgress}%` }}
            />
            
            {/* Animated CSS Walking Mini-Character */}
            <div 
              className="absolute top-0 -translate-x-1/2 transition-all duration-75 ease-out" 
              style={{ left: `${runningProgress}%` }}
            >
              <div className="relative w-8 h-12">
                {/* Graduation Cap */}
                <div className="absolute top-[-15px] left-[6px] w-[14px] h-[5px] bg-sky-500 rounded-xs -rotate-12 shadow-sm" />
                <div className="absolute top-[-10px] left-[12px] w-[1px] h-[4px] bg-sky-500/80" />
                {/* Head */}
                <div className="absolute top-[-10px] left-[8px] w-[9px] h-[9px] bg-white rounded-full" />
                {/* Torso */}
                <div className="absolute top-[-1px] left-[12px] w-[1px] h-[10px] bg-white" />
                
                {/* Swinging Arms (Only animate when moving) */}
                {runningProgress < 100 ? (
                  <>
                    <div className="absolute top-[0px] left-[10px] w-[1px] h-[8px] bg-white origin-top animate-swing-arm" />
                    <div className="absolute top-[0px] left-[14px] w-[1px] h-[8px] bg-white origin-top animate-swing-arm-reverse" />
                  </>
                ) : (
                  <>
                    <div className="absolute top-[0px] left-[10px] w-[1px] h-[8px] bg-white origin-top rotate-[-10deg]" />
                    <div className="absolute top-[0px] left-[14px] w-[1px] h-[8px] bg-white origin-top rotate-[10deg]" />
                  </>
                )}

                {/* Swinging Legs (Only animate when moving) */}
                {runningProgress < 100 ? (
                  <>
                    <div className="absolute top-[9px] left-[11px] w-[1px] h-[9px] bg-white origin-top animate-swing-leg" />
                    <div className="absolute top-[9px] left-[13px] w-[1px] h-[9px] bg-white origin-top animate-swing-leg-reverse" />
                  </>
                ) : (
                  <>
                    <div className="absolute top-[9px] left-[11px] w-[1px] h-[9px] bg-white origin-top rotate-0" />
                    <div className="absolute top-[9px] left-[13px] w-[1px] h-[9px] bg-white origin-top rotate-0" />
                  </>
                )}
              </div>
            </div>

            {/* Right milestone flag */}
            <div className="absolute right-[-45px] top-1/2 -translate-y-1/2">
              {runningProgress >= 100 ? (
                <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider">
                  🎓 SUCCESS
                </span>
              ) : (
                <span className="text-[9px] font-mono text-neutral-500 tracking-wider">
                  EXAM
                </span>
              )}
            </div>
          </div>
          
          <div className="text-[9px] font-mono text-neutral-600 tracking-widest uppercase mt-8">
            Calibrating student academic path...
          </div>
        </div>
      )}

      {/* ----------------- STEP 3: NETFLIX-STYLE ROLE SELECTOR ----------------- */}
      {currentStep === "gateways" && (
        <div className="w-full max-w-5xl px-6 py-10 flex flex-col justify-between items-center min-h-[90vh] fade-in">
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Netflix-style Header Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-150 tracking-wide mb-3 text-center">
              Who is accessing PARAKH?
            </h2>
            <p className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-widest font-mono mb-12 text-center">
              Select your profile to redirect to the secure command portal
            </p>

            {/* Circular Profile Grid */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 max-w-4xl">
              {PROFILES.map((profile) => {
                const IconComponent = profile.icon;
                return (
                  <a
                    key={profile.name}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center text-center focus:outline-none"
                  >
                    {/* Circle Avatar Block with Rotating Ring shadow */}
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 border border-neutral-900 group-hover:scale-105 shadow-xl group-hover:ring-4 group-hover:ring-offset-4 group-hover:ring-offset-black ${profile.bgClass} ${profile.ringClass}`}>
                      <IconComponent className="h-9 w-9 text-white opacity-85 group-hover:opacity-100 transition-all duration-200" />
                    </div>
                    {/* Role Label */}
                    <span className="text-xs sm:text-sm text-neutral-400 group-hover:text-neutral-100 mt-4 transition-colors font-medium tracking-wide">
                      {profile.name}
                    </span>
                    {/* Role Clearance level pill */}
                    <span className="text-[7.5px] font-mono tracking-wider text-neutral-600 group-hover:text-neutral-500 mt-1 uppercase">
                      {profile.clearance}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Minimalist Demo Accounts Drawer at the Bottom */}
          <div className="w-full flex flex-col items-center mt-16">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="px-6 py-2 border border-neutral-800 hover:border-neutral-500 bg-black hover:bg-neutral-900 text-neutral-500 hover:text-neutral-300 text-[9px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer"
            >
              {showCredentials ? "Hide Credentials" : "View Demo Credentials"}
            </button>

            {showCredentials && (
              <div className="mt-6 w-full max-w-3xl bg-neutral-950 border border-neutral-900/60 rounded-sm p-4 fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[9px] border-collapse font-mono text-neutral-400">
                    <thead>
                      <tr className="text-neutral-600 border-b border-neutral-900 uppercase">
                        <th className="pb-2 font-semibold">User Role</th>
                        <th className="pb-2 font-semibold">Portal Destination</th>
                        <th className="pb-2 font-semibold">Demo Email</th>
                        <th className="pb-2 font-semibold">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900/80">
                      {DEMO_CREDENTIALS.map((c, i) => (
                        <tr key={i} className="hover:bg-neutral-900/20">
                          <td className="py-2.5 font-bold text-neutral-300">{c.role}</td>
                          <td className="py-2.5 text-neutral-500">{c.portal}</td>
                          <td className="py-2.5 text-sky-500/80 select-all">{c.email}</td>
                          <td className="py-2.5 text-indigo-400/80 select-all">{c.pass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
