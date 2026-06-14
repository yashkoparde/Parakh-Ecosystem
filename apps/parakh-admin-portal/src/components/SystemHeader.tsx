/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AdminUser } from "../types";
import { Shield, Clock, Database, Radio, RefreshCw, KeyRound } from "lucide-react";

interface SystemHeaderProps {
  currentUser: AdminUser;
  availableUsers: AdminUser[];
  onUserChange: (user: AdminUser) => void;
  systemIntegrityScore: number;
  blockchainHeight: number;
}

export default function SystemHeader({
  currentUser,
  availableUsers,
  onUserChange,
  systemIntegrityScore,
  blockchainHeight
}: SystemHeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format with accurate UTC offset per administrative guidelines
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-4 no-print select-none">
      {/* Institutional Branding */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-800 p-2 border border-slate-700 rounded-sm">
          <Shield className="h-6 w-6 text-slate-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 font-mono">PARAKH</h1>
          </div>
          <p className="text-[11px] text-slate-400 font-sans tracking-wide">National Assessment Administration Portal</p>
        </div>
      </div>

      {/* Real-time System Metrics */}
      <div className="hidden lg:flex items-center gap-6 text-xs border-x border-slate-800 px-6">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-400" />
          <div>
            <div className="text-[10px] text-slate-500 font-mono">PORTAL STATUS</div>
            <div className="font-semibold text-slate-200">
              {systemIntegrityScore === 100 ? "Online" : "Issues Detected"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <div>
            <div className="text-[10px] text-slate-500 font-mono">CURRENT TIME</div>
            <div className="font-semibold text-slate-300 font-mono">{currentTime || "Loading time..."}</div>
          </div>
        </div>
      </div>

      {/* User Session & Role Controller Switcher */}
      <div className="flex items-center gap-3">
        <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-sm flex items-center gap-2">
          <KeyRound className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <label htmlFor="user-role-switcher" className="sr-only">Change active credential</label>
            <select
              id="user-role-switcher"
              className="bg-transparent text-xs font-semibold text-slate-200 outline-none border-none cursor-pointer pr-1"
              value={currentUser.id}
              onChange={(e) => {
                const found = availableUsers.find(u => u.id === e.target.value);
                if (found) onUserChange(found);
              }}
            >
              {availableUsers.map(user => (
                <option key={user.id} value={user.id} className="bg-slate-800 text-white text-xs">
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Level Banner */}
        <div className="flex flex-col items-end hidden sm:flex">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${
              currentUser.clearanceLevel === "LEVEL_3" ? "bg-red-500" :
              currentUser.clearanceLevel === "LEVEL_2" ? "bg-amber-500" : "bg-blue-500"
            }`} />
            <span className="text-[10px] font-mono font-bold text-slate-300">{currentUser.clearanceLevel} CLEARANCE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
