/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Candidate } from "../types";
import { Search, CheckCircle, XCircle, FileSpreadsheet, Layers, HelpCircle, CheckSquare, Square, DownloadCloud } from "lucide-react";

interface AttendanceViewProps {
  candidates: Candidate[];
  onUpdateCandidateAttendance: (candidateId: string, status: Candidate["verificationStatus"]) => void;
  onBulkUpdateAttendance: (candidateIds: string[], status: Candidate["verificationStatus"]) => void;
}

export default function AttendanceView({
  candidates,
  onUpdateCandidateAttendance,
  onBulkUpdateAttendance
}: AttendanceViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // Filter candidates
  const filtered = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.rollNo.includes(searchQuery) ||
                          cand.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    if (statusFilter === "Present") {
      return matchesSearch && cand.verificationStatus === "Verified";
    }
    if (statusFilter === "Absent") {
      return matchesSearch && cand.verificationStatus === "Absent";
    }
    if (statusFilter === "Pending/Rejected") {
      return matchesSearch && (cand.verificationStatus === "Pending" || cand.verificationStatus === "Rejected" || cand.verificationStatus === "Duplicate");
    }
    return matchesSearch;
  });

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(f => f.id));
    }
  };

  const handleBulkAction = (status: Candidate["verificationStatus"]) => {
    if (selectedIds.length === 0) return;
    onBulkUpdateAttendance(selectedIds, status);
    setSelectedIds([]);
  };

  const simulateExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      
      // Dynamic CSV content matching PARAKH schema
      const csvHeaders = "CandidateID,RollNo,Name,SeatNumber,VerificationStatus,Timestamp\r\n";
      const csvRows = candidates.map(c => 
        `"${c.id}","${c.rollNo}","${c.name}","${c.seatNumber}","${c.verificationStatus}","${c.timestamp || ''}"`
      ).join("\r\n");
      
      const blob = new Blob([csvHeaders + csvRows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `PARAKH_ATTENDANCE_LEDGER_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Context Panel */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            SECURE EXAM ATTENDANCE LEDGER
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            This grid tracks official entry, verification, and roll-call status. Candidates marked "Verified" are automatically logged in the National Testing Agency's live synchronous portal.
          </p>
        </div>
        <button
          id="btn-export-attendance"
          onClick={simulateExport}
          disabled={exporting}
          className="bg-[#1E293B] hover:bg-slate-800 text-slate-100 border border-slate-700 hover:border-slate-850 px-3 py-1.5 rounded-sm font-mono text-xs font-bold tracking-wider flex items-center gap-1.5 uppercase transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          {exporting ? "Compiling Export..." : "Export NTA Ledger"}
        </button>
      </div>

      {/* Main Grid Card */}
      <div className="bg-white border border-slate-200 rounded-sm">
        
        {/* Table Filters Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-attendance-input"
              type="text"
              placeholder="Search Candidate Roll, ID, or Surname..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-sm pl-9 pr-3 py-1.5"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">FILTER:</span>
              <select
                id="select-attendance-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 px-2 py-1 rounded-sm text-xs font-mono font-medium"
              >
                <option value="All">All Candidates</option>
                <option value="Present">Present (Verified)</option>
                <option value="Absent">Absent</option>
                <option value="Pending/Rejected">Anomalous (Pend/Rej)</option>
              </select>
            </div>

            {/* Bulk Actions dropdown */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 bg-amber-55 border border-amber-250 p-1.5 rounded-sm">
                <span className="text-[10px] text-amber-900 font-mono font-bold tracking-tight">
                  {selectedIds.length} SELECTED:
                </span>
                <button
                  id="bulk-mark-present"
                  onClick={() => handleBulkAction("Verified")}
                  className="bg-[#166534] text-white text-[10px] px-2 py-0.5 rounded-xs font-mono font-bold hover:bg-emerald-800"
                >
                  SET PRESENT
                </button>
                <button
                  id="bulk-mark-absent"
                  onClick={() => handleBulkAction("Absent")}
                  className="bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded-xs font-mono font-bold hover:bg-slate-700"
                >
                  SET ABSENT
                </button>
                <button
                  id="bulk-reset-pending"
                  onClick={() => handleBulkAction("Pending")}
                  className="bg-[#1E293B] text-white text-[10px] px-2 py-0.5 rounded-xs font-mono font-bold hover:bg-slate-800"
                >
                  RESET
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider font-mono">
              <tr>
                <th className="px-4 py-3 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-200 hover:text-white" title="Select all filtered">
                    {selectedIds.length === filtered.length && filtered.length > 0 ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3">Candidate ID</th>
                <th className="px-4 py-3">Name & Roll</th>
                <th className="px-4 py-3">Assigned Seat</th>
                <th className="px-4 py-3">Roster Verification</th>
                <th className="px-4 py-3 text-center">Attendance Log</th>
                <th className="px-4 py-3">Sync Timestamp</th>
                <th className="px-4 py-3 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filtered.map(cand => {
                const isChecked = selectedIds.includes(cand.id);
                const isVerified = cand.verificationStatus === "Verified";
                const isAbsent = cand.verificationStatus === "Absent";
                
                return (
                  <tr key={cand.id} className={`hover:bg-slate-50/80 ${isChecked ? "bg-slate-100/50" : ""}`}>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(cand.id)} className="text-slate-400 hover:text-slate-650">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-slate-800" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-700">{cand.id}</td>
                    
                    <td className="px-4 py-3">
                      <span className="font-sans font-bold text-slate-900 block text-xs">{cand.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block">Roll: {cand.rollNo}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-sans font-medium">{cand.seatNumber}</td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold ${
                        isVerified ? "bg-emerald-100 text-emerald-800" :
                        cand.verificationStatus === "Pending" ? "bg-amber-100 text-amber-800" :
                        cand.verificationStatus === "Rejected" ? "bg-red-100 text-red-800" :
                        cand.verificationStatus === "Duplicate" ? "bg-purple-100 text-purple-800" :
                        "bg-slate-200 text-slate-600"
                      }`}>
                        {cand.verificationStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold font-sans ${
                        isVerified ? "text-emerald-700" :
                        isAbsent ? "text-slate-500" : "text-amber-850"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isVerified ? "bg-emerald-600" : isAbsent ? "bg-slate-400" : "bg-amber-500"}`}></span>
                        {isVerified ? "PRESENT" : isAbsent ? "ABSENT" : "PRE-MATCH"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {cand.timestamp ? new Date(cand.timestamp).toLocaleTimeString() : "--:--:--"}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isVerified && (
                          <button
                            id={`attendance-present-${cand.id}`}
                            onClick={() => onUpdateCandidateAttendance(cand.id, "Verified")}
                            className="bg-[#166534] text-white hover:bg-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-3xs"
                            title="Mark candidate verified physically"
                          >
                            PRESENT
                          </button>
                        )}
                        {!isAbsent && (
                          <button
                            id={`attendance-absent-${cand.id}`}
                            onClick={() => onUpdateCandidateAttendance(cand.id, "Absent")}
                            className="bg-slate-700 text-white hover:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-3xs"
                            title="Mark candidate absent"
                          >
                            ABSENT
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Roster representation showing {filtered.length} of {candidates.length} candidates.</span>
          <span>SYSTEM ACCELERATOR KEY ENGAGED</span>
        </div>
      </div>
    </div>
  );
}
