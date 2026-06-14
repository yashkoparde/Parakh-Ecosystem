import React, { useState, useEffect } from "react";
import { ArrowRight, Lock, Key, Server, User, Landmark, ShieldCheck } from "lucide-react";

// 4 Portal gate details
const PORTALS = [
  {
    name: "Student Portal",
    icon: User,
    url: "https://parakh-student.vercel.app/",
    description: "Access personal grades, exam schedules, and download certified academic transcripts signed cryptographically.",
    badge: "Student Access"
  },
  {
    name: "Admin & Central Command",
    icon: Server,
    url: "https://parakh-admin.vercel.app/",
    description: "Author questions, configure blueprints, seal exam papers, and manage double-blind evaluation grading workflows.",
    badge: "Admin & Auditors"
  },
  {
    name: "Physical Exam Center",
    icon: Landmark,
    url: "https://parakh-exam-center.vercel.app/",
    description: "Manage candidate biometric check-in registers, jammer sensor logs, and dual-key secure printing releases.",
    badge: "Exam Supervisors"
  },
  {
    name: "Public Verification Portal",
    icon: ShieldCheck,
    url: "https://parakh-verifier.vercel.app/",
    description: "Verify certificate hashes against the simulated blockchain records in a zero-knowledge drag-and-drop validation interface.",
    badge: "Public Access"
  }
];

// Pre-seeded evaluation credentials
const DEMO_CREDENTIALS = [
  { role: "Student Candidate", portal: "🎓 Student Portal", email: "student@parakh.gov.in", pass: "StudentPass123" },
  { role: "Board Controller", portal: "💼 Admin Portal", email: "controller@parakh.gov.in", pass: "ControllerPass123" },
  { role: "Academic Auditor", portal: "💼 Admin Portal", email: "auditor@parakh.gov.in", pass: "AuditorPass123" },
  { role: "Evaluations Registrar", portal: "💼 Admin Portal", email: "verifier@parakh.gov.in", pass: "VerifierPass123" },
  { role: "Center Supervisor", portal: "🏫 Exam Center Portal", email: "supervisor@parakh.gov.in", pass: "SupervisorPass123" }
];

type IntroStep = "hbo-loading" | "student-run" | "parakh-intro" | "gateways";

export default function App() {
  const [currentStep, setCurrentStep] = useState<IntroStep>("hbo-loading");
  const [runningProgress, setRunningProgress] = useState(0);
  const [showCredentials, setShowCredentials] = useState(false);

  // 1. HBO Loading Step duration
  useEffect(() => {
    if (currentStep === "hbo-loading") {
      const timer = setTimeout(() => {
        setCurrentStep("student-run");
      }, 4000); // 4 seconds total
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // 2. Student Running sequence progress increment
  useEffect(() => {
    if (currentStep === "student-run") {
      const interval = setInterval(() => {
        setRunningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Wait 1 second on success, then transition to intro
            setTimeout(() => {
              setCurrentStep("parakh-intro");
            }, 1000);
            return 100;
          }
          return prev + 2; // Increments to 100 over ~2.5 seconds
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // 3. PARAKH Intro Step duration
  useEffect(() => {
    if (currentStep === "parakh-intro") {
      const timer = setTimeout(() => {
        setCurrentStep("gateways");
      }, 3000); // 3 seconds intro screen
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative font-sans select-none">
      
      {/* ----------------- STEP 1: HBO CINEMATIC INTRO ----------------- */}
      {currentStep === "hbo-loading" && (
        <div className="flex flex-col items-center justify-center z-50">
          {/* Simulated cinematic grain overlay */}
          <div className="hbo-static" />
          
          {/* HBO-style logo animation */}
          <div className="hbo-text-glow font-mono tracking-widest text-center">
            PARAKH
          </div>
          
          {/* HBO-style expanding thin progress line */}
          <div className="mt-8 w-screen flex justify-center">
            <div className="hbo-progress-line" />
          </div>
        </div>
      )}

      {/* ----------------- STEP 2: STUDENT RUN SEQUENCE ----------------- */}
      {currentStep === "student-run" && (
        <div className="flex flex-col items-center justify-center fade-in">
          {/* Platform Platform */}
          <div className="w-[300px] sm:w-[400px] h-2 bg-neutral-900 border border-neutral-800 rounded-full relative overflow-visible">
            
            {/* Filled Progress Line representing path traveled */}
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-75 ease-out" 
              style={{ width: `${runningProgress}%` }}
            />
            
            {/* Student avatar (emoji runner) sliding on top of platform */}
            <div 
              className="absolute top-[-26px] -translate-x-1/2 transition-all duration-75 ease-out text-xl" 
              style={{ left: `${runningProgress}%` }}
            >
              🏃
            </div>

            {/* Success milestone label */}
            <div className="absolute right-[-45px] top-1/2 -translate-y-1/2 flex items-center justify-center">
              {runningProgress >= 100 ? (
                <span className="text-[10px] font-mono font-bold text-emerald-400 animate-bounce tracking-widest">
                  🎓 SUCCESS
                </span>
              ) : (
                <span className="text-[10px] font-mono text-neutral-600 tracking-wider">
                  EXAM
                </span>
              )}
            </div>
          </div>
          
          <div className="text-[10px] font-mono text-neutral-600 tracking-widest uppercase mt-6">
            Calibrating student academic path...
          </div>
        </div>
      )}

      {/* ----------------- STEP 3: PARAKH BRAND INTRO ----------------- */}
      {currentStep === "parakh-intro" && (
        <div className="text-center space-y-4 fade-in max-w-lg px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest font-mono text-white">
            PARAKH
          </h2>
          <div className="h-[1px] bg-neutral-800 w-24 mx-auto" />
          <p className="text-[11px] sm:text-xs text-neutral-400 uppercase tracking-widest font-mono leading-relaxed">
            Digital Trust Network
          </p>
          <p className="text-[10px] text-neutral-500 font-mono italic">
            Secure, Transparent & Blockchain-Anchored
          </p>
        </div>
      )}

      {/* ----------------- STEP 4: PORTAL GATEWAYS HUB ----------------- */}
      {currentStep === "gateways" && (
        <div className="w-full max-w-4xl px-6 py-10 flex flex-col justify-between min-h-[85vh] fade-in">
          
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-widest font-mono uppercase text-white">
              PARAKH GATEWAY
            </h2>
            <div className="h-[1px] bg-neutral-900 w-32 mx-auto" />
            <p className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
              Select portal access point
            </p>
          </div>

          {/* Gateways Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 flex items-center">
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              return (
                <a
                  key={portal.name}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-neutral-950 border border-neutral-900 hover:border-neutral-700 p-6 rounded-sm transition-all duration-300 hover:translate-y-[-2px] relative overflow-hidden"
                >
                  {/* Subtle hover background shift */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/10 to-neutral-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="p-2 border border-neutral-800 group-hover:border-neutral-600 rounded-sm text-neutral-400 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[8px] font-mono tracking-wider font-semibold border border-neutral-800/80 px-2 py-0.5 rounded text-neutral-500 group-hover:text-neutral-300 uppercase">
                      {portal.badge}
                    </span>
                  </div>

                  <div className="mt-5 relative z-10">
                    <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5 font-mono">
                      {portal.name} 
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-2 leading-relaxed font-sans">
                      {portal.description}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Credentials Toggle Drawer */}
          <div className="mt-10 border-t border-neutral-950 pt-6 flex flex-col items-center">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="px-4 py-2 border border-neutral-900 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white text-[10px] font-mono uppercase tracking-widest rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="h-3.5 w-3.5" /> 
              {showCredentials ? "Hide Demo Credentials" : "Show Demo Credentials"}
            </button>

            {showCredentials && (
              <div className="mt-4 w-full bg-neutral-950 border border-neutral-900 rounded-sm p-4 animate-hbo-glow">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[9px] border-collapse font-mono text-neutral-400">
                    <thead>
                      <tr className="text-neutral-600 border-b border-neutral-900 uppercase">
                        <th className="pb-2 font-semibold">System Role</th>
                        <th className="pb-2 font-semibold">Portal Destination</th>
                        <th className="pb-2 font-semibold">Evaluation Email</th>
                        <th className="pb-2 font-semibold">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                      {DEMO_CREDENTIALS.map((c, i) => (
                        <tr key={i} className="hover:bg-neutral-900/40">
                          <td className="py-2 font-bold text-neutral-300">{c.role}</td>
                          <td className="py-2 text-neutral-500">{c.portal}</td>
                          <td className="py-2 text-sky-500/80 select-all">{c.email}</td>
                          <td className="py-2 text-indigo-400/80 select-all">{c.pass}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-[9px] text-neutral-600 font-mono tracking-widest uppercase">
            PARAKH GOVERNANCE ECOSYSTEM &copy; 2026
          </footer>

        </div>
      )}

    </div>
  );
}
