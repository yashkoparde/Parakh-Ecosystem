/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  initialCenterConfig, 
  initialSessions, 
  initialStaff, 
  initialCandidates, 
  initialPaperReleases, 
  initialPrintBatches, 
  initialDeviceEvents, 
  initialIncidentReports, 
  initialActivityLogs 
} from "./data/mockData";
import { 
  Candidate, 
  PaperRelease, 
  PrintBatch, 
  DeviceEvent, 
  IncidentReport, 
  ActivityLog, 
  CenterStaff, 
  ExamSession, 
  CenterConfig 
} from "./types";

import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import PaperReleaseView from "./components/PaperReleaseView";
import PrintControlView from "./components/PrintControlView";
import CandidateVerificationView from "./components/CandidateVerificationView";
import AttendanceView from "./components/AttendanceView";
import DeviceDetectionView from "./components/DeviceDetectionView";
import IntegrityMonitoringView from "./components/IntegrityMonitoringView";
import IncidentReportingView from "./components/IncidentReportingView";
import SessionsView from "./components/SessionsView";
import StaffView from "./components/StaffView";
import ReportsView from "./components/ReportsView";
import ActivityLogsView from "./components/ActivityLogsView";
import SettingsView from "./components/SettingsView";

import { Shield, Clock, HardDrive, Key, UserCheck, HelpCircle, Lock, Server } from "lucide-react";

function LoadingScreen() {
  return (
    <div id="hbo-loader" className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-center text-white z-50 select-none overflow-hidden font-sans">
      <div className="flex flex-col items-center text-center max-w-lg w-full px-8 animate-hbo-glow">
        {/* Main Brand Wordmark */}
        <h1 className="text-4xl sm:text-5xl font-light tracking-[0.25em] text-white uppercase font-sans animate-hbo-text">
          PARAKH
        </h1>
        
        {/* Sleek Line Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent my-6 w-0 animate-hbo-line" />
        
        {/* Subtle Cinematic Subtitle */}
        <p className="text-[10px] sm:text-xs font-light tracking-[0.4em] text-zinc-400 uppercase font-mono animate-hbo-subtitle">
          EXAM CENTRE PORTAL
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [localTime, setLocalTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // States with direct local storage initialization
  const [centerConfig, setCenterConfig] = useState<CenterConfig>(() => {
    const saved = localStorage.getItem("parakh_config");
    return saved ? JSON.parse(saved) : initialCenterConfig;
  });

  const [sessions, setSessions] = useState<ExamSession[]>(() => {
    const saved = localStorage.getItem("parakh_sessions");
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [staff, setStaff] = useState<CenterStaff[]>(() => {
    const saved = localStorage.getItem("parakh_staff");
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("parakh_candidates");
    return saved ? JSON.parse(saved) : initialCandidates;
  });

  const [paperReleases, setPaperReleases] = useState<PaperRelease[]>(() => {
    const saved = localStorage.getItem("parakh_releases");
    return saved ? JSON.parse(saved) : initialPaperReleases;
  });

  const [printBatches, setPrintBatches] = useState<PrintBatch[]>(() => {
    const saved = localStorage.getItem("parakh_print_batches");
    return saved ? JSON.parse(saved) : initialPrintBatches;
  });

  const [deviceEvents, setDeviceEvents] = useState<DeviceEvent[]>(() => {
    const saved = localStorage.getItem("parakh_device_events");
    return saved ? JSON.parse(saved) : initialDeviceEvents;
  });

  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem("parakh_incidents");
    return saved ? JSON.parse(saved) : initialIncidentReports;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem("parakh_activity_logs");
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  // Additional state specifically for distribution logs (sealed security bags dispatched to rooms)
  const [distributionLogs, setDistributionLogs] = useState<Array<{
    id: string;
    room: string;
    batchId: string;
    subject: string;
    copiesDistributed: number;
    custodyOfficer: string;
    handoverTime: string;
    handoverStatus: "Sealed Bag Dispatched" | "Handover Confirmed" | "Audit Cleared";
  }>>(() => {
    return [
      {
        id: "DIST-001",
        room: "Hall 101 Sector A",
        batchId: "PB-001",
        subject: "Advanced Mathematics & Paper II Analytical Section",
        copiesDistributed: 120,
        custodyOfficer: "Smt. Sunita Deshmukh (Invigilator)",
        handoverTime: "2026-06-12T08:24:10Z",
        handoverStatus: "Handover Confirmed"
      },
      {
        id: "DIST-002",
        room: "Hall 101 Sector B",
        batchId: "PB-001",
        subject: "Advanced Mathematics & Paper II Analytical Section",
        copiesDistributed: 120,
        custodyOfficer: "Rajesh Soni (Technical)",
        handoverTime: "2026-06-12T08:25:05Z",
        handoverStatus: "Handover Confirmed"
      },
      {
        id: "DIST-003",
        room: "Room 102 (Reserved Stock)",
        batchId: "PB-002",
        subject: "Advanced Mathematics & Paper II Analytical Section (Reserved)",
        copiesDistributed: 15,
        custodyOfficer: "Shyam Lal Sharma (Security)",
        handoverTime: "2026-06-12T08:35:45Z",
        handoverStatus: "Sealed Bag Dispatched"
      }
    ];
  });

  // Keep state matching in LocalStorage
  useEffect(() => {
    localStorage.setItem("parakh_config", JSON.stringify(centerConfig));
  }, [centerConfig]);

  useEffect(() => {
    localStorage.setItem("parakh_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("parakh_staff", JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem("parakh_candidates", JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem("parakh_releases", JSON.stringify(paperReleases));
  }, [paperReleases]);

  useEffect(() => {
    localStorage.setItem("parakh_print_batches", JSON.stringify(printBatches));
  }, [printBatches]);

  useEffect(() => {
    localStorage.setItem("parakh_device_events", JSON.stringify(deviceEvents));
  }, [deviceEvents]);

  useEffect(() => {
    localStorage.setItem("parakh_incidents", JSON.stringify(incidentReports));
  }, [incidentReports]);

  useEffect(() => {
    localStorage.setItem("parakh_activity_logs", JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Secure clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short"
      };
      setLocalTime(now.toLocaleTimeString("en-GB", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Logger helper
  const addActivityLog = (
    action: string, 
    user: string, 
    role: string, 
    details: string, 
    status: ActivityLog["status"] = "Success",
    sysRef = `SYS-TRC-${Math.floor(Math.random() * 900) + 100}`
  ) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      action,
      user,
      role,
      timestamp: new Date().toISOString(),
      systemReference: sysRef,
      status,
      details
    };
    setActivityLogs(prev => [...prev, newLog]);
  };

  // Callback handler: Paper Release approval dual keys
  const handleAuthorizeRelease = (releaseId: string, officerRole: "Chief" | "Observer") => {
    setPaperReleases(prev => prev.map(release => {
      if (release.id !== releaseId) return release;
      
      const officerTag = officerRole === "Chief" 
        ? "Chief Superintendent DR-01" 
        : "NTA Observer AS-02";
      
      const currentApprovals = release.approvedBy || [];
      if (currentApprovals.includes(officerTag)) return release;

      const updatedApprovals = [...currentApprovals, officerTag];
      const isComplete = updatedApprovals.length === 2;

      // Log this transaction
      addActivityLog(
        `Biometric Override approval entered (${officerRole})`,
        officerRole === "Chief" ? centerConfig.chiefSuperintendent : centerConfig.observerName,
        officerRole === "Chief" ? "Chief Superintendent" : "Central Observer (NTA)",
        `Secured local credential hash linked to de-escrow handshake for physical paper #${releaseId}.`,
        "Success",
        "PRH-AUT-01"
      );

      return {
        ...release,
        approvedBy: updatedApprovals,
        authorizationStatus: isComplete ? "Dual Authorized" : "First Officer Approved"
      };
    }));
  };

  // Callback handler: Final decryption and output of secure keys
  const handleFinalDecryptRelease = (releaseId: string, securePin: string) => {
    setPaperReleases(prev => prev.map(release => {
      if (release.id !== releaseId) return release;

      addActivityLog(
        "Handshake Decryption Handled Successfully",
        centerConfig.chiefSuperintendent,
        "Chief Superintendent",
        `Secured payload unlocked. Encryption keys exported locally. Temporary Download Tag: SEC-KEY-772x-AA9-FF2.`,
        "Success",
        "PRH-DEC-02"
      );

      // Mutate active session state timing lock
      setSessions(s => s.map(sess => {
        if (sess.id === release.examId) {
          return { ...sess, prahariKeyStatus: "Keys Released" };
        }
        return sess;
      }));

      return {
        ...release,
        status: "Released",
        secureDownloadKey: `SEC-KEY-${Math.floor(Math.random() * 9000) + 1000}-PKH-NTA`
      };
    }));
  };

  // Callback handler: Initiate Spool Print Batch on physical printer
  const handleInitiatePrintBatch = (releaseId: string, printerIp: string, copies: number) => {
    const parentRelease = paperReleases.find(p => p.id === releaseId);
    if (!parentRelease) return;

    const newBatchId = `PB-${Math.floor(Math.random() * 900) + 100}`;
    const newBatch: PrintBatch = {
      id: newBatchId,
      paperId: releaseId,
      examName: parentRelease.examName,
      subject: parentRelease.subject,
      printerIp,
      printerName: printerIp === "10.12.89.51" ? "HPCenterLine High-Output printer-01" : "HPCenterLine High-Output printer-02",
      totalRequired: copies,
      printed: 0,
      status: "Printing",
      timestamp: new Date().toISOString(),
      operatorName: "Rajesh Kumar Soni"
    };

    setPrintBatches(prev => [...prev, newBatch]);

    // Update parent release status
    setPaperReleases(prev => prev.map(p => {
      if (p.id === releaseId) {
        return { ...p, printBatchInitiated: true, printBatchId: newBatchId };
      }
      return p;
    }));

    // Spawn Room Distribution logs (50% block partition to room 101 Sector A, etc.)
    const dist1Copies = Math.floor(copies / 2);
    const dist2Copies = copies - dist1Copies;

    setDistributionLogs(prev => [
      ...prev,
      {
        id: `DIST-${Math.floor(Math.random() * 900) + 100}`,
        room: "Hall 101 Sector C",
        batchId: newBatchId,
        subject: parentRelease.subject,
        copiesDistributed: dist1Copies,
        custodyOfficer: "Smt. Sunita Deshmukh (Invigilator)",
        handoverTime: new Date().toISOString(),
        handoverStatus: "Sealed Bag Dispatched"
      },
      {
        id: `DIST-${Math.floor(Math.random() * 900) + 100}`,
        room: "Hall 102 Sector A",
        batchId: newBatchId,
        subject: parentRelease.subject,
        copiesDistributed: dist2Copies,
        custodyOfficer: "Rajesh Soni (Technical)",
        handoverTime: new Date().toISOString(),
        handoverStatus: "Sealed Bag Dispatched"
      }
    ]);

    addActivityLog(
      "Printer spool batch initiated",
      "Rajesh Kumar Soni",
      "Technical Support",
      `Dynamic print command dispatched to ${printerIp} target spooler for ${copies} watermarked copies. Distribution Logs initialized.`,
      "Success",
      "PRH-PRN-05"
    );
  };

  // Helper printer advance simulator
  const handleAddPrinterLog = (batchId: string, printedCount: number) => {
    setPrintBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return { ...b, printed: printedCount };
      }
      return b;
    }));
  };

  const handleUpdateBatchStatus = (batchId: string, status: PrintBatch["status"]) => {
    setPrintBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        if (status === "Completed") {
          // Update Candidate count verification representing actual physical copy allocation
          setSessions(s => s.map(sess => {
            if (b.examName.includes(sess.examName) || sess.status === "Active") {
              return { ...sess, totalCandidates: b.totalRequired };
            }
            return sess;
          }));
          addActivityLog(
            "Print spool completed & certified",
            centerConfig.chiefSuperintendent,
            "Chief Superintendent",
            `Print volume of ${b.totalRequired} certified physically. Secondary Tray mechanical lock clamped.`,
            "Success",
            "PRH-PRN-FIN"
          );
        }
        return { ...b, status };
      }
      return b;
    }));
  };

  // Callback handler: Candidate Verification outcome
  const handleVerifyCandidate = (
    candidateId: string, 
    status: Candidate["verificationStatus"], 
    method?: Candidate["verificationMethod"],
    score?: number,
    remarks?: string
  ) => {
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;

      if (status !== "Pending") {
        addActivityLog(
          `Identity Verification Checked`,
          "Invigilator ID-STN-B",
          "Invigilator",
          `Candidate: ${cand.name} (${cand.rollNo}) verified output: ${status} [Method: ${method || "Manual Override"}].`,
          status === "Rejected" || status === "Duplicate" ? "Warning" : "Success",
          "DRS-VFY-20"
        );
      }

      return {
        ...cand,
        verificationStatus: status,
        verificationMethod: method,
        biometricScore: score,
        remarks,
        timestamp: status !== "Pending" ? new Date().toISOString() : undefined
      };
    }));

    // Recalculate session verified totals on-the-fly
    setSessions(s => s.map(sess => {
      if (sess.status === "Active") {
        const afterVerified = candidates.filter(c => c.id !== candidateId ? c.verificationStatus === "Verified" : status === "Verified").length;
        const afterAbsent = candidates.filter(c => c.id !== candidateId ? c.verificationStatus === "Absent" : status === "Absent").length;
        return { 
          ...sess, 
          verifiedCandidates: afterVerified,
          absentCandidates: afterAbsent
        };
      }
      return sess;
    }));
  };

  // Callback handler: Single attendance marker
  const handleUpdateCandidateAttendance = (candidateId: string, status: Candidate["verificationStatus"]) => {
    handleVerifyCandidate(
      candidateId, 
      status, 
      status === "Verified" ? "Biometric (Thumbprint)" : undefined,
      status === "Verified" ? 94.2 : undefined,
      status === "Verified" ? "Verified via fast-track attendee check-in desk." : "Marked absent physically by examiner desk."
    );
  };

  // Callback handler: Bulk attendance markings
  const handleBulkUpdateAttendance = (candidateIds: string[], status: Candidate["verificationStatus"]) => {
    candidateIds.forEach(id => {
      handleVerifyCandidate(
        id, 
        status, 
        status === "Verified" ? "Biometric (Thumbprint)" : undefined,
        status === "Verified" ? 95.0 : undefined,
        status === "Verified" ? "Bulk checked: verified present." : "Bulk checked: marked absent."
      );
    });

    addActivityLog(
      "Bulk attendance synchronized",
      "Dr. Rameshwar Prasad",
      "Chief Superintendent",
      `Bulk register status of ${candidateIds.length} candidate IDs modified to ${status.toUpperCase()}. Synchronous VPN upload complete.`,
      "Success",
      "DRS-ATT-BL"
    );
  };

  // Callback handler: Live spectrum signal resolution
  const handleTriageEvent = (eventId: string, status: DeviceEvent["status"], notes?: string) => {
    setDeviceEvents(prev => prev.map(evt => {
      if (evt.id !== eventId) return evt;

      addActivityLog(
        `Wireless signal threat triaged`,
        "Security Sweep Patrol",
        "Security Officer",
        `Threat alert ${eventId} classified as: ${status.toUpperCase()}. Notes: ${notes}.`,
        status === "Confiscated" ? "Critical" : "Success",
        "DRS-RF-99"
      );

      return { ...evt, status };
    }));
  };

  const handleClearEvents = () => {
    setDeviceEvents(initialDeviceEvents);
    addActivityLog("Triage buffers reset", "System Console", "Technical Operations", "Sensors baseline auto-adjusted.");
  };

  // Callback handler: Submit active Incident Docket form
  const handleRaiseIncident = (report: Omit<IncidentReport, "id" | "timestamp">) => {
    const newReport: IncidentReport = {
      ...report,
      id: `INC-2026-${Math.floor(Math.random() * 90) + 10}`,
      timestamp: new Date().toISOString()
    };

    setIncidentReports(prev => [newReport, ...prev]);

    addActivityLog(
      `Compliance Incident registered`,
      report.personnelInvolved.split(" ")[0] || "Command center Officer",
      "Examiner Staff",
      `Dossier filed: [${report.incidentType}] at ${report.location}. Severity Protocol: ${report.severity.toUpperCase()}. Escalated to NTA databases.`,
      report.severity === "Critical" ? "Critical" : "Warning",
      "DRS-INC-REG"
    );
  };

  // Callback handler: Staff physical presence check-in
  const handleToggleStaffPresence = (staffId: string) => {
    setStaff(prev => prev.map(person => {
      if (person.id !== staffId) return person;
      const isPresentAfter = person.status !== "Present - Active";
      
      addActivityLog(
        `Staff presence roster modified`,
        centerConfig.chiefSuperintendent,
        "Chief Superintendent",
        ` Roster status of ${person.name} (${person.role}) toggled to ${isPresentAfter ? "PRESENT" : "ABSENT"}.`,
        "Audit Info"
      );

      return {
        ...person,
        status: isPresentAfter ? "Present - Active" : "Absent",
        biometricVerified: isPresentAfter ? person.biometricVerified : false
      };
    }));
  };

  const handleStaffBiometricVerify = (staffId: string) => {
    setStaff(prev => prev.map(person => {
      if (person.id !== staffId) return person;
      
      addActivityLog(
        `Staff physical biometrics checked`,
        centerConfig.chiefSuperintendent,
        "Chief Superintendent",
        `Credencial thumb signature verified present for ${person.name} (${person.role}). Station assigned: ${person.assignedRoom}.`,
        "Success",
        "SYS-STF-BIO"
      );

      return {
        ...person,
        status: "Present - Active",
        biometricVerified: true,
        biometricCode: `BIO-INV-${Math.floor(Math.random()*90)+10}`
      };
    }));
  };

  // Callback handler: Session schedule status mutator
  const handleSetSessionStatus = (sessionId: string, status: ExamSession["status"]) => {
    setSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;

      addActivityLog(
        "Examination shift status advanced",
        centerConfig.chiefSuperintendent,
        "Chief Superintendent",
        `Shift ${sessionId} (${session.subject}) state transitioned to ${status.toUpperCase()}. Local terminal pipelines restricted.`,
        "Audit Info"
      );

      return { ...session, status };
    }));
  };

  // Callback: institutional configurations modification
  const handleUpdateConfig = (newConfig: Partial<CenterConfig>) => {
    setCenterConfig(prev => {
      const config = { ...prev, ...newConfig };
      addActivityLog(
        "Institutional configuration modified",
        centerConfig.chiefSuperintendent,
        "Chief Superintendent",
        "Adjusted local administrative parameters. Coordinates verified."
      );
      return config;
    });
  };

  // EMERGENCY LOCK DOWN SYSTEM INITIATOR
  const handleLockDownCenter = () => {
    setCenterConfig(prev => ({ ...prev, isLockedDown: true }));
    
    // Transmit lockdown codes to sessions and papers override
    setSessions(prev => prev.map(s => {
      if (s.status === "Active") return { ...s, status: "Suspended", prahariKeyStatus: "Locked" };
      return s;
    }));

    // Log the disaster flag
    addActivityLog(
      "☢️ CATASTROPHIC CENTER LOCKDOWN ENGAGED ☢️",
      centerConfig.chiefSuperintendent,
      "CRITICAL TERMINAL SHIELD",
      "EMERGENCY OVERRIDE ENGAGED. LOCAL DECRYPTION TERMINALS DISABLED, DE-ESCROW TRIPPED. BROADCAST RECEIVED BY BROAD CENTRAL NTA MONITORS.",
      "Critical",
      "SYS-LOCKDOWN"
    );
  };

  // Room distribution confirmation logs trigger
  const handleDispatchRoomStatus = (distId: string) => {
    setDistributionLogs(prev => prev.map(d => {
      if (d.id === distId) {
        addActivityLog(
          "Custody Handover confirmed",
          d.custodyOfficer,
          "Custody Officer",
          `Invigilator certified physical receipt of ${d.copiesDistributed} copies inside sealed envelop bag inside Room: ${d.room}.`,
          "Success"
        );
        return { ...d, handoverStatus: "Handover Confirmed" };
      }
      return d;
    }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden antialiased font-sans">
      
      {/* 250px Persistent Left Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab}
        pendingVerificationsCount={candidates.filter(c => c.verificationStatus === "Pending").length}
        criticalDeviceCount={deviceEvents.filter(d => d.severity === "Critical" && d.status === "Under Investigation").length}
        pendingIncidentsCount={incidentReports.filter(i => i.status === "Pending Investigation").length}
        drishtiVpnStatus={centerConfig.drishtiVpnStatus}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Persistent Top Header bar */}
        <header className="h-14 bg-slate-900 border-b border-slate-800 shrink-0 px-6 flex items-center justify-between z-10 select-none">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-xs leading-tight">
              <span className="text-slate-100 font-bold">{centerConfig.centerName}</span>
              <span className="text-[10px] text-slate-400 font-sans mt-0.5">{centerConfig.city}, {centerConfig.state}</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs">
            {/* Real-time Ticker */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-mono">{localTime || "19:55:09 UTC"}</span>
            </div>

            {/* Officer details */}
            <div className="hidden lg:flex flex-col text-right text-[10px] leading-tight">
              <span className="text-slate-100 font-bold font-sans">{centerConfig.chiefSuperintendent}</span>
              <span className="text-slate-400 text-[9px] mt-0.5">Center Chief</span>
            </div>
          </div>
        </header>

        {/* Action / View Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] relative">
          
          {centerConfig.isLockedDown && (
            <div className="mb-6 p-4 bg-red-950 border-2 border-red-800 text-white font-mono rounded-sm text-xs space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                ALERT: LOCAL TERMINAL COMPLIANCE FROZEN
              </div>
              <p className="text-[11px] leading-relaxed text-red-200">
                A LEVEL-RED Lock down command has been executed locally. Digital keys, decryptions, candidate rosters, and printing services are disabled. Security forces are dispatched locally. Synchronise offline logs with observer key.
              </p>
            </div>
          )}

          {/* Tab Routing Mapping */}
          {currentTab === "dashboard" && (
            <DashboardView 
              candidates={candidates}
              paperReleases={paperReleases}
              printBatches={printBatches}
              deviceEvents={deviceEvents}
              incidentReports={incidentReports}
              sessions={sessions}
              centerConfig={centerConfig}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === "release-schedule" && (
            <div className="space-y-6">
              <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm">
                <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
                  PRAHARI SECURE DECRYPTION RELEASING TIMELINE
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  National examination decrypt payloads are time-locked. Hands of Superintendents and local Observer profiles can only unlock decryption handshake keys within precisely allocated standard hour boxes.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                    CHIEF CUSTODY PAPER DE-ESCROW HOURS
                  </span>
                </div>
                <div className="overflow-x-auto text-xs font-mono">
                  <table className="w-full text-left">
                    <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Decryption ID</th>
                        <th className="px-4 py-3">Subject / Paper Name</th>
                        <th className="px-4 py-3">Lock release window</th>
                        <th className="px-4 py-3">Staff Auth Cleared</th>
                        <th className="px-4 py-3 text-right">Handshake action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paperReleases.map(paper => (
                        <tr key={paper.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-bold text-slate-700">{paper.id}</td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold font-sans text-slate-900 block">{paper.subject}</span>
                            <span className="text-[10px] font-sans text-slate-550 block">{paper.examName}</span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-500">{paper.releaseTime} AM HRS</td>
                          <td className="px-4 py-3.5 font-bold text-slate-75 *">
                            {paper.approvedBy?.length || 0} / 2 Verified
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              id={`go-decrypt-${paper.id}`}
                              onClick={() => setCurrentTab("paper-release")}
                              className="bg-[#1E293B] hover:bg-slate-800 text-white text-[10px] font-mono px-2.5 py-1 rounded-sm border border-slate-700 uppercase"
                            >
                              Launch decryptor
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === "paper-release" && (
            <PaperReleaseView 
              paperReleases={paperReleases}
              staff={staff}
              sessions={sessions}
              onAuthorizeRelease={handleAuthorizeRelease}
              onFinalDecryptRelease={handleFinalDecryptRelease}
              onInitiatePrintBatch={handleInitiatePrintBatch}
              activityLogsCount={activityLogs.length}
            />
          )}

          {currentTab === "print-control" && (
            <PrintControlView 
              printBatches={printBatches}
              paperReleases={paperReleases}
              onAddPrinterLog={handleAddPrinterLog}
              onUpdateBatchStatus={handleUpdateBatchStatus}
            />
          )}

          {currentTab === "distribution-logs" && (
            <div className="space-y-6">
              <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm">
                <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
                  PRAHARI SECURED CUSTODY ROOM DISPATCH LEDGER
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Once printed, copies are sealed inside physical, serialized Security Bags equipped with tamper-evident stickers. Room invigilators must verify seal integrity and log delivery handovers digitally.
                </p>
              </div>

              {/* Roster of room distribution logs */}
              <div className="bg-white border border-slate-200 rounded-sm">
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                    PHYSICAL HANDOVER LOG RECORD ({distributionLogs.length})
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Dispatch Code</th>
                        <th className="px-4 py-3">Assigned Room</th>
                        <th className="px-4 py-3">Target Paper Description</th>
                        <th className="px-4 py-3 text-center">Copies</th>
                        <th className="px-4 py-3">Custody officer in-charge</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Command Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {distributionLogs.map((dist, idx) => (
                        <tr key={dist.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3.5 font-bold text-slate-705">{dist.id}</td>
                          
                          <td className="px-4 py-3.5 font-sans font-bold text-[#0F172A]">{dist.room}</td>
                          
                          <td className="px-4 py-3.5">
                            <span className="font-sans block text-slate-800 text-[11px]">{dist.subject}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">Batch: {dist.batchId}</span>
                          </td>

                          <td className="px-4 py-3.5 text-center font-bold text-slate-800">{dist.copiesDistributed}</td>

                          <td className="px-4 py-3.5 font-sans text-slate-655 font-medium">{dist.custodyOfficer}</td>

                          <td className="px-4 py-3.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              dist.handoverStatus === "Handover Confirmed" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                              "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse"
                            }`}>
                              {dist.handoverStatus.toUpperCase()}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            {dist.handoverStatus === "Sealed Bag Dispatched" && (
                              <button
                                id={`confirm-handover-${dist.id}`}
                                onClick={() => handleDispatchRoomStatus(dist.id)}
                                className="bg-emerald-800 hover:bg-emerald-905 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold"
                              >
                                CONFIRM DELIVERY
                              </button>
                            )}
                            {dist.handoverStatus !== "Sealed Bag Dispatched" && (
                              <span className="text-[9px] text-slate-400 font-bold uppercase">SECURED BY ROOM SEAL</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {currentTab === "candidate-verification" && (
            <CandidateVerificationView 
              candidates={candidates}
              sessions={sessions}
              onVerifyCandidate={handleVerifyCandidate}
            />
          )}

          {currentTab === "attendance" && (
            <AttendanceView 
              candidates={candidates}
              onUpdateCandidateAttendance={handleUpdateCandidateAttendance}
              onBulkUpdateAttendance={handleBulkUpdateAttendance}
            />
          )}

          {currentTab === "device-detection" && (
            <DeviceDetectionView 
              deviceEvents={deviceEvents}
              onTriageEvent={handleTriageEvent}
              onClearEvents={handleClearEvents}
            />
          )}

          {currentTab === "integrity-monitoring" && (
            <IntegrityMonitoringView 
              candidates={candidates}
              deviceEvents={deviceEvents}
              incidentReports={incidentReports}
              activityLogs={activityLogs}
            />
          )}

          {currentTab === "incident-reporting" && (
            <IncidentReportingView 
              incidentReports={incidentReports}
              candidates={candidates}
              onSubmitIncident={handleRaiseIncident}
            />
          )}

          {currentTab === "sessions" && (
            <SessionsView 
              sessions={sessions}
              onSetSessionStatus={handleSetSessionStatus}
            />
          )}

          {currentTab === "staff" && (
            <StaffView 
              staff={staff}
              onToggleStaffPresence={handleToggleStaffPresence}
              onStaffBiometricVerify={handleStaffBiometricVerify}
            />
          )}

          {currentTab === "reports" && (
            <ReportsView 
              candidates={candidates}
              paperReleases={paperReleases}
              printBatches={printBatches}
              incidentReports={incidentReports}
              centerConfig={centerConfig}
            />
          )}

          {currentTab === "activity-logs" && (
            <ActivityLogsView 
              activityLogs={activityLogs}
            />
          )}

          {currentTab === "settings" && (
            <SettingsView 
              centerConfig={centerConfig}
              onUpdateConfig={handleUpdateConfig}
              onLockDownCenter={handleLockDownCenter}
            />
          )}

        </main>
      </div>
    </div>
  );
}
