/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CenterConfig } from "../types";
import { Sliders, ShieldX, Key, Server, Database, CheckCircle2, Lock } from "lucide-react";

interface SettingsViewProps {
  centerConfig: CenterConfig;
  onUpdateConfig: (newConfig: Partial<CenterConfig>) => void;
  onLockDownCenter: () => void;
}

export default function SettingsView({
  centerConfig,
  onUpdateConfig,
  onLockDownCenter
}: SettingsViewProps) {
  const [centerName, setCenterName] = useState(centerConfig.centerName);
  const [chiefSuper, setChiefSuper] = useState(centerConfig.chiefSuperintendent);
  const [observer, setObserver] = useState(centerConfig.observerName);
  const [serverIp, setServerIp] = useState(centerConfig.prahariServerIp);
  const [secureKey, setSecureKey] = useState(centerConfig.secureKey);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      centerName,
      chiefSuperintendent: chiefSuper,
      observerName: observer,
      prahariServerIp: serverIp,
      secureKey
    });
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
    }, 3050);
  };

  return (
    <div className="space-y-6">
      
      {/* Information Header Block */}
      <div className="bg-slate-105 border border-slate-350 p-4 rounded-sm">
        <h2 className="text-xs font-bold font-mono text-[#0F172A] uppercase tracking-wider">
          PARAKH OPERATIONAL CENTER LOCAL SETTINGS
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Adjust parameters allocated to local terminals. Modifying coordinate keys or Observer biopass settings requires local storage handshake reload, and triggers a system-wide audit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side (Col-span-7): Administrative Setup Config Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white border border-slate-200 rounded-sm divide-y divide-slate-100 font-sans text-xs">
          
          <div className="px-4 py-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
            <span className="text-xs font-bold text-[#0F172A] tracking-wider uppercase font-mono">
              SECURE SECTOR TERMINAL SCHEMATICS
            </span>
            <span className="text-[10px] text-slate-455 font-mono">STATION REF: PKH-DL-SS1</span>
          </div>

          <div className="p-4 space-y-4">
            
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[11px] font-bold text-slate-700">OFFICIAL REGISTERED CENTER INSTITUTION NAME</label>
              <input
                id="settings-center-name"
                type="text"
                required
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">CHIEF SUPERINTENDENT IN-CHARGE</label>
                <input
                  id="settings-chief-super"
                  type="text"
                  required
                  value={chiefSuper}
                  onChange={(e) => setChiefSuper(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">CENTRAL OBSERVER (NTA EXPEDITIONARY)</label>
                <input
                  id="settings-observer"
                  type="text"
                  required
                  value={observer}
                  onChange={(e) => setObserver(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">PRAHARI DECRYPTION SERVER IP</label>
                <input
                  id="settings-server-ip"
                  type="text"
                  required
                  value={serverIp}
                  onChange={(e) => setServerIp(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[11px] font-bold text-slate-700">CENTER SECRET CUSTODY COMPLIANCE KEY</label>
                <input
                  id="settings-secure-key"
                  type="text"
                  required
                  value={secureKey}
                  onChange={(e) => setSecureKey(e.target.value)}
                  className="bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 rounded-sm font-mono"
                />
              </div>
            </div>

            {showSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs font-bold rounded flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TERMINAL LOCAL CONFIGURATIONS UPDATED AND HANDSHAKED WITH PORTAL DIRECTORY.</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50 flex justify-end gap-2 text-xs font-mono">
            <button
              id="btn-settings-save"
              type="submit"
              className="bg-[#1E293B] hover:bg-slate-800 text-white font-bold py-1.5 px-4 rounded-sm border border-slate-750 flex items-center gap-1 uppercase"
            >
              <Database className="w-3.5 h-3.5" />
              Save schematics
            </button>
          </div>

        </form>

        {/* Right Side (Col-span-5): Extreme Security Actions (Lock Down Center) */}
        <div className="lg:col-span-5 border-2 border-red-800 rounded-sm bg-red-50/20 p-4 flex flex-col justify-between h-auto gap-4">
          
          <div className="space-y-3 font-mono text-xs">
            <div className="border-b border-red-300 pb-2 text-red-900 flex items-center gap-1.5">
              <ShieldX className="w-4 h-4 text-red-850 animate-pulse" />
              <span className="font-bold uppercase tracking-wider">CRITICAL INCIDENT OVERRIDE</span>
            </div>
            
            <p className="text-[11px] leading-relaxed text-red-800 font-sans">
              Engaging the Emergency Center Lockdown blocks decrypted paper releases across all printers, deactivates active e-KYC biometric readers, and broadcasts a <strong>Level-Red Threat Signal</strong> to national monitoring platforms.
            </p>

            <div className="p-2.5 bg-red-900 text-white leading-normal border border-red-950 font-bold text-[10px] rounded">
              WARNING: This action is irreversible without physical security keys entered locally by a Regional Representative.
            </div>
          </div>

          {!centerConfig.isLockedDown ? (
            <button
              id="btn-lockdown-trigger"
              onClick={onLockDownCenter}
              className="w-full bg-[#991B1B] hover:bg-red-900 text-white font-mono font-bold py-2.5 rounded-sm border border-red-950 flex items-center justify-center gap-1.5 uppercase transition-colors"
            >
              <Lock className="w-4 h-4" />
              ACTIVATE EMERGENCY LOCKDOWN
            </button>
          ) : (
            <div className="p-3 bg-red-950 text-white text-center font-bold font-mono tracking-widest text-[10px] border border-red-950 rounded uppercase animate-pulse">
              ☢️ EMERGENCY LOCKDOWN ENGAGED ☢️
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
