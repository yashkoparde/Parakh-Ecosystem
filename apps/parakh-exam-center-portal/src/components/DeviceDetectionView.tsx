/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DeviceEvent } from "../types";
import { ShieldAlert, AlertTriangle, AlertCircle, Trash2, CheckCircle, Search, Sliders, Play, Edit, Filter } from "lucide-react";

interface DeviceDetectionViewProps {
  deviceEvents: DeviceEvent[];
  onTriageEvent: (eventId: string, status: DeviceEvent["status"], notes?: string) => void;
  onClearEvents: () => void;
}

export default function DeviceDetectionView({
  deviceEvents,
  onTriageEvent,
  onClearEvents
}: DeviceDetectionViewProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(deviceEvents[0]?.id || "");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [investigatorRemarks, setInvestigatorRemarks] = useState<string>("");

  const activeEvent = deviceEvents.find(e => e.id === selectedEventId);

  const filteredEvents = deviceEvents.filter(evt => {
    if (statusFilter === "All") return true;
    return evt.status === statusFilter;
  });

  const handleUpdateStatus = (status: DeviceEvent["status"]) => {
    if (!activeEvent) return;
    const notes = investigatorRemarks || `RF signal resolved as: ${status}. Physical corridor inspection conducted by patrol.`;
    onTriageEvent(activeEvent.id, status, notes);
    setInvestigatorRemarks("");
  };

  return (
    <div className="space-y-6">
      
      {/* Information Header */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#991B1B]" />
            SECURE RADIO FREQUENCY (RF) MONITOR
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Directional radio frequency sweepers operate on standard 800MHz to 2.4GHz bands inside room corridors. System triggers alert reports upon sudden high-power signals exceeding normal baseline levels.
          </p>
        </div>
        <button
          id="btn-clear-threats"
          onClick={onClearEvents}
          className="text-[#991B1B] border border-red-300 hover:bg-red-50 px-3 py-1 bg-white font-mono text-xs font-bold tracking-tight rounded-sm transition-colors"
        >
          Reset Signal History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (Col-span-7) RF Intrusion data ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
                DETECTION TELEMETRY LOG
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase mr-1">Triage Filter:</span>
                <select
                  id="select-rf-status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-305 text-[11px] font-mono px-1 py-0.5 rounded-sm"
                >
                  <option value="All">All Signals</option>
                  <option value="Under Investigation">Under Inquest</option>
                  <option value="Confiscated">Confiscated</option>
                  <option value="False Positive">False Positive</option>
                  <option value="Flagged">Flagged</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase font-mono tracking-wider">
                  <tr>
                    <th className="px-3 py-2.5">Device Type</th>
                    <th className="px-3 py-2.5">Location</th>
                    <th className="px-3 py-2.5">Freq & Db</th>
                    <th className="px-3 py-2.5 text-center">Severity</th>
                    <th className="px-3 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {filteredEvents.map(evt => {
                    const isSelected = evt.id === selectedEventId;
                    return (
                      <tr
                        key={evt.id}
                        id={`rf-row-${evt.id}`}
                        onClick={() => setSelectedEventId(evt.id)}
                        className={`hover:bg-slate-50 cursor-pointer ${
                          isSelected ? "bg-slate-100 font-semibold" : ""
                        }`}
                      >
                        <td className="px-3 py-3 text-slate-900 font-sans">
                          <span className="font-bold underline block text-xs">{evt.deviceType}</span>
                          <span className="text-[9px] text-[#991B1B] font-mono block">{evt.id}</span>
                        </td>
                        
                        <td className="px-3 py-3 text-slate-600 font-sans text-[11px]">{evt.location}</td>
                        
                        <td className="px-3 py-3">
                          <span className="font-mono block text-slate-800">{evt.freqMHz} MHz</span>
                          <span className="font-mono text-[10px] text-slate-450 block">{evt.dbmStrength} dBM</span>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span className={`px-1 rounded-sm text-[9px] font-bold ${
                            evt.severity === "Critical" ? "bg-red-100 text-red-800 border border-red-300" :
                            evt.severity === "Warning" ? "bg-amber-100 text-amber-800 border border-amber-300" :
                            "bg-slate-100 text-slate-650"
                          }`}>
                            {evt.severity.toUpperCase()}
                          </span>
                        </td>

                        <td className="px-3 py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            evt.status === "Confiscated" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                            evt.status === "Under Investigation" ? "bg-red-50 text-red-750 border border-red-200" :
                            "bg-slate-100 text-slate-600"
                          }`}>
                            {evt.status.replace("Under Investigation", "INQUEST").toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEvents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                        ✓ NO DETECTED RF THREATS RECORDED UNDER THIS FILTER.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Operational Baseline Stats */}
          <div className="bg-slate-900 text-slate-400 p-4 border border-slate-800 rounded-sm font-mono text-xs space-y-2">
            <span className="text-[10px] text-slate-450 font-bold tracking-widest block uppercase">SPECTRUM POWER BASELINES</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 text-[11px]">
              <div>
                <span>ROOM 101 NOISE:</span>
                <span className="block text-emerald-500 font-bold">-92 dBm (STABLE)</span>
              </div>
              <div>
                <span>ROOM 102 NOISE:</span>
                <span className="block text-emerald-500 font-bold">-90 dBm (STABLE)</span>
              </div>
              <div>
                <span>BIOMETRIC SCAN RF:</span>
                <span className="block text-amber-500">-78 dBm (TRANSIENT)</span>
              </div>
              <div>
                <span>IP PRINTER CHNL:</span>
                <span className="block text-slate-500">-110 dBm (ISOLATED)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side (Col-span-5) Spectrum Investigation Panel */}
        <div className="lg:col-span-5">
          {activeEvent ? (
            <div className="bg-white border-2 border-slate-800 rounded-sm p-4 space-y-4 flex flex-col h-full justify-between">
              
              <div className="space-y-3 font-mono">
                <div className="border-b border-slate-205 pb-2 text-xs">
                  <span className="text-[9px] text-slate-450 block uppercase font-bold">INVESTIGATION PANE</span>
                  <h3 className="font-bold text-[#0F172A] mt-0.5">TRIAGING SIGNAL: {activeEvent.id}</h3>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>RF Classification:</span>
                    <strong className="text-slate-850 font-sans">{activeEvent.deviceType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Identified Location:</span>
                    <strong className="text-slate-800 font-sans">{activeEvent.location}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Freq Response:</span>
                    <strong className="text-[#991B1B]">{activeEvent.freqMHz} MHz</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Directional Strength:</span>
                    <strong className="text-[#991B1B]">{activeEvent.dbmStrength} dBm (Critical Amplitude)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Recorded Sweep Time:</span>
                    <span>{new Date(activeEvent.detectionTime).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Secure instructions layout */}
                <div className="bg-red-50 p-3 rounded-sm border border-red-200 text-[11px] leading-relaxed text-red-800">
                  <strong>DISPATCH CORRIDOR INSTRUCTORS:</strong> Immediate physical sweep of seating sector in <strong>{activeEvent.location}</strong> is required. Inspect candidate spectacles, smartwatches, sleeves, and ear canals.
                </div>

                {/* Remarks Input */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs font-bold text-slate-700">ADD ACTIONABLE INVESTIGATION LOG NOTES</label>
                  <textarea
                    id="rf-investigation-notes"
                    value={investigatorRemarks}
                    onChange={(e) => setInvestigatorRemarks(e.target.value)}
                    placeholder="e.g. Conducted physical sweep. Bluetooth wristband confiscated from roll DL-xx. Logged report."
                    rows={3}
                    className="bg-white border border-slate-300 p-2 text-xs font-sans rounded-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Triage Decision Buttons */}
              <div className="pt-4 border-t border-slate-105 font-mono text-xs space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block">ISSUE INVESTIGATION RULING</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="rf-triage-confiscate"
                    onClick={() => handleUpdateStatus("Confiscated")}
                    className="bg-[#166534] hover:bg-[#12532a] text-white py-1.5 rounded-sm font-bold tracking-tight uppercase"
                  >
                    CONFISCATE DEVICE
                  </button>
                  <button
                    id="rf-triage-flagged"
                    onClick={() => handleUpdateStatus("Flagged")}
                    className="bg-amber-700 hover:bg-amber-850 text-white py-1.5 rounded-sm font-bold tracking-tight uppercase"
                  >
                    FLAG CANDIDATE ID
                  </button>
                  <button
                    id="rf-triage-false-positive"
                    onClick={() => handleUpdateStatus("False Positive")}
                    className="bg-slate-700 hover:bg-slate-800 text-white py-1.5 rounded-sm font-bold tracking-tight uppercase col-span-2"
                  >
                    DISMISS AS FALSE POSITIVE
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 font-mono text-xs border border-slate-200 bg-white h-full flex flex-col justify-center">
              ✓ SPECTRUM IS STABLE. SELECT AN ALREADY COMMITTED SIGNAL THREAT FOR DRILL-DOWN REMARKS.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
