/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CenterStaff } from "../types";
import { Users, FileText, CheckCircle, Clock, Fingerprint, MapPin, Shovel as ShieldCheck } from "lucide-react";

interface StaffViewProps {
  staff: CenterStaff[];
  onToggleStaffPresence: (staffId: string) => void;
  onStaffBiometricVerify: (staffId: string) => void;
}

export default function StaffView({
  staff,
  onToggleStaffPresence,
  onStaffBiometricVerify
}: StaffViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Information Header Block */}
      <div className="bg-slate-100 border border-slate-350 p-4 rounded-sm">
        <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
          OFFICIAL CENTER STAFF ROSTER
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Active duty invigilators, observers, and superintendents are biometrically tracked. Dual-handshake paper releases are strictly restricted to staff profiles carrying security tokens and confirmed physically present inside center walls.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
            AUTHORIZED DUTY PERSONNEL LIST (VERIFIED)
          </span>
          <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-tight">
            PRESENCE TRACKING ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1E293B] text-slate-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Staff ID</th>
                <th className="px-4 py-3">Official Name</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">biometric Token</th>
                <th className="px-4 py-3">Duty Room Sector</th>
                <th className="px-4 py-3 text-center">Duty Status</th>
                <th className="px-4 py-3 text-right">Roster Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map(person => {
                const isPresent = person.status === "Present - Active";
                const isBiometricVerified = person.biometricVerified;

                return (
                  <tr key={person.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-700">{person.id}</td>
                    
                    <td className="px-4 py-3 font-sans font-bold text-slate-900">{person.name}</td>
                    
                    <td className="px-4 py-3 font-sans font-medium text-slate-655 text-[11px]">{person.role}</td>
                    
                    <td className="px-4 py-3 text-[#991B1B] font-bold">
                      {isBiometricVerified ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> {person.biometricCode}
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1 animate-pulse">
                          ⚠️ PENDING_SCAN
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-sans">{person.assignedRoom}</td>

                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPresent ? "bg-emerald-100 text-emerald-800 border border-emerald-350" : "bg-slate-150 text-slate-600"
                      }`}>
                        {person.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isBiometricVerified && (
                          <button
                            id={`verify-staff-bio-${person.id}`}
                            onClick={() => onStaffBiometricVerify(person.id)}
                            className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700"
                          >
                            RUN BIO MATCH
                          </button>
                        )}
                        <button
                          id={`toggle-staff-presence-${person.id}`}
                          onClick={() => onToggleStaffPresence(person.id)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] px-2 py-0.5 rounded"
                        >
                          {isPresent ? "MARK ABSENT" : "MARK PRESENT"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
