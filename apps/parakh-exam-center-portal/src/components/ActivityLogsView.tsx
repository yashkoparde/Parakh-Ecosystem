/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ActivityLog } from "../types";
import { Search, Database, FileText, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

interface ActivityLogsViewProps {
  activityLogs: ActivityLog[];
}

export default function ActivityLogsView({
  activityLogs
}: ActivityLogsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.systemReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && log.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      
      {/* Overview Block */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
            PARAKH CRYPTOGRAPHIC AUDIT RAIL PROTOCOLS
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Every transaction, dual key authorization, biometric matchup result, and hardware spool state is traced. This archive ledger is synced to NTA databases over write-once logs to prevent alteration.
          </p>
        </div>
      </div>

      {/* Main Grid Log list */}
      <div className="bg-white border border-slate-200 rounded-sm">
        
        {/* Table Filter/Search header */}
        <div className="p-4 border-b border-slate-205 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 max-w-md relative text-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-audit-input"
              type="text"
              placeholder="Search Action, User, System Ref, Details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-sm pl-9 pr-3 py-1.5"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase">SEVERITY LEVEL:</span>
            <select
              id="select-audit-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 px-2 py-1 rounded-sm text-xs font-mono font-medium"
            >
              <option value="All">All Actions</option>
              <option value="Success">Success (Trace Core)</option>
              <option value="Audit Info">Audit Info</option>
              <option value="Warning">Warning Level</option>
              <option value="Critical">Critical Breach</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase font-mono tracking-wider">
              <tr>
                <th className="px-4 py-3">REF Code</th>
                <th className="px-4 py-3">Audit Action</th>
                <th className="px-4 py-3">User Node</th>
                <th className="px-4 py-3">Detailed Audit Summary</th>
                <th className="px-4 py-3 text-center">Severity</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.slice().reverse().map(log => {
                const isCritical = log.status === "Critical";
                const isWarning = log.status === "Warning";
                
                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 text-[11px]">
                    <td className="px-4 py-3 text-slate-500 font-semibold text-[10px]">{log.systemReference}</td>
                    
                    <td className="px-4 py-3">
                      <span className="font-sans font-bold text-slate-900 block">{log.action}</span>
                      <span className="text-[9px] text-[#991B1B]">{log.id}</span>
                    </td>

                    <td className="px-4 py-3 py-2.5 font-sans">
                      <span className="font-semibold block text-slate-800">{log.user}</span>
                      <span className="text-[10px] text-zinc-500 block font-mono">{log.role}</span>
                    </td>

                    <td className="px-4 py-3 text-slate-650 font-sans max-w-sm whitespace-normal leading-normal">{log.details}</td>

                    <td className="px-4 py-3 text-center">
                      <span className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold ${
                        isCritical ? "bg-red-100 text-red-800 border border-red-300 animate-pulse" :
                        isWarning ? "bg-amber-100 text-amber-800 border border-amber-300" :
                        log.status === "Success" ? "bg-emerald-50 text-emerald-800 border border-emerald-300" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right text-slate-450">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-400 font-mono text-[10px] text-right">
          LOCK SIGNATURE RECORD SHIFT CODES APPROVED : {activityLogs.length} HANDLES RECORDED.
        </div>
      </div>
    </div>
  );
}
