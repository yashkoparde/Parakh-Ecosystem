/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ExamSession } from "../types";
import { Database, Clock, Calendar, CheckSquare, Users, Lock, ChevronRight } from "lucide-react";

interface SessionsViewProps {
  sessions: ExamSession[];
  onSetSessionStatus: (sessionId: string, status: ExamSession["status"]) => void;
}

export default function SessionsView({
  sessions,
  onSetSessionStatus
}: SessionsViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Informative Header */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm">
        <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
          EXAMINATION SESSIONS MANAGEMENT
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          This panel controls national examination sessions allocated to this specific center code. Activating a session unlocks local biometrics terminals and synchronises candidate registration tables with central NTA secure directories.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
            ALLOCATED EXAMINATION SHIFTS (NTA-2026 GENERAL LIST)
          </span>
          <span className="text-[10px] font-mono text-slate-500 font-bold">TOTAL ALLOCATED SHIFTS: {sessions.length}</span>
        </div>
        
        <div className="divide-y divide-slate-200">
          {sessions.map(session => {
            const isActive = session.status === "Active";
            const isCompleted = session.status === "Completed";
            
            return (
              <div key={session.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                      {session.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      isActive ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                      isCompleted ? "bg-slate-200 text-slate-700" :
                      "bg-amber-100 text-amber-800 border-amber-300"
                    }`}>
                      {session.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm font-sans">{session.subject}</h3>
                  <p className="text-xs text-slate-500 font-sans">{session.examName}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 font-mono text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.startTime} - {session.endTime} HRS</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.totalCandidates} Candidates</span>
                    </div>
                    <div>
                      <span>Verified: <strong className="text-slate-800">{session.verifiedCandidates}</strong></span>
                    </div>
                    <div>
                      <span>Decryption Key: <strong className="text-slate-850">{session.prahariKeyStatus.toUpperCase()}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Operations Session Transition Buttons */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  {session.status === "Scheduled" && (
                    <button
                      id={`session-activate-${session.id}`}
                      onClick={() => onSetSessionStatus(session.id, "Active")}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-1 px-2.5 rounded-sm flex items-center gap-0.5"
                    >
                      ACTIVATE SHIFT
                    </button>
                  )}
                  {session.status === "Active" && (
                    <button
                      id={`session-complete-${session.id}`}
                      onClick={() => onSetSessionStatus(session.id, "Completed")}
                      className="bg-slate-850 hover:bg-slate-900 text-white font-bold py-1 px-2.5 rounded-sm flex items-center gap-0.5"
                    >
                      MARK AS CLOSED
                    </button>
                  )}
                  {session.status === "Completed" && (
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Shift finalized. Locked.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
