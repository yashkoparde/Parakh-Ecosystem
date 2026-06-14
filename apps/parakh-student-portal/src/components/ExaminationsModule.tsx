/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  BookOpen, 
  CalendarDays, 
  Ticket, 
  MapPin, 
  Stamp, 
  AlertTriangle, 
  Printer, 
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { ExaminationSchedule, Student } from '../types';

interface ExaminationsModuleProps {
  schedules: ExaminationSchedule[];
  student: Student;
  onDownloadHallTicket: (sched: ExaminationSchedule) => void;
}

export default function ExaminationsModule({ 
  schedules, 
  student,
  onDownloadHallTicket 
}: ExaminationsModuleProps) {
  
  const [seatingQuery, setSeatingQuery] = useState('');
  const [seatingOutput, setSeatingOutput] = useState<string | null>(null);

  const handleSeatingCheck = (e: FormEvent) => {
    e.preventDefault();
    if (!seatingQuery.trim()) {
      setSeatingOutput('Please supply your roll number.');
      return;
    }

    if (seatingQuery.trim() === student.rollNumber) {
      setSeatingOutput(`ROOM ALLOCATION MATCH:\n• Block: Academic Building Alpha (East Wing)\n• Seating Hall: Exam Center Room 204\n• Row/Seat: Row D, Seat 15\n• Standard status: Fully Checked / ID Approved`);
    } else {
      setSeatingOutput('ERROR: Seating matrix lookup failed. Check if roll number corresponds to exam roster.');
    }
  };

  return (
    <div id="examinations-module-view" className="space-y-6">
      
      {/* Board Announcement Banner */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider">
          Examination Scheduling & Candidate Conduct Code
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Please consult active schedules inside the registry below. Hall ticket records are permanently linked to Candidate IDs and must be presented alongside government ID proofs. Candidates are commanded to reach respective halls exactly 45 minutes prior to evaluated schedules.
        </p>
      </div>

      {/* TOP GRID: SCHEDULES VS SEATING MATRIX */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Active Schedules Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white rounded border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-slate-700" />
                Active Examination Roaster
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Synced Central Board Servers</span>
            </div>

            <div className="divide-y divide-slate-200">
              {schedules.map((item) => (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Info block */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 border border-slate-250 text-slate-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {item.code}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold border ${
                        item.status === 'Completed' 
                          ? 'bg-slate-100 text-slate-600 border-slate-200' 
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-950 leading-snug">{item.name}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-600 font-mono">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Date: <span className="text-slate-900 font-medium">{item.date}</span></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Center: <span className="text-slate-900 leading-tight block truncate" title={item.centerName}>{item.centerName}</span></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[10px] font-bold">SLOT:</span>
                        <span>{item.timeSlot} ({item.session})</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[10px] font-bold">HALL TICKET NO:</span>
                        <span className="text-slate-900 select-all">{item.hallTicketNumber}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="shrink-0 flex items-center justify-end pt-2 md:pt-0 border-t border-slate-100 md:border-t-0 no-print">
                    {item.status !== 'Completed' ? (
                      <button
                        id={`btn-download-hall-ticket-${item.id}`}
                        onClick={() => onDownloadHallTicket(item)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Inspect Admission Ticket</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono font-medium flex items-center gap-1">
                        <Stamp className="w-3.5 h-3.5" />
                        Session Complete
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Seating Query Sandbox */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-700" />
              Seating Matric Finder
            </h3>
            <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
              Query active venue seating indices securely. Use your registered exam candidate credentials for validation.
            </p>

            <form onSubmit={handleSeatingCheck} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-tight" htmlFor="seating-roll-input">
                  Candidate Roll Number
                </label>
                <input
                  id="seating-roll-input"
                  type="text"
                  placeholder="e.g. 2212093845"
                  value={seatingQuery}
                  onChange={(e) => setSeatingQuery(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none font-mono text-slate-950"
                />
              </div>

              <button
                id="btn-seating-matrix-submit"
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Query Roster Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {seatingOutput && (
              <div id="seating-output-console" className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-xs text-slate-800 leading-normal whitespace-pre-line">
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">ALLOCATION ENQUIRY RESPONSE:</span>
                {seatingOutput}
              </div>
            )}

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[9px] text-slate-400 leading-normal font-mono">
              <span>Sandbox info: Verify seat map using correct sample roll <strong className="text-slate-605">2212093845</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* COMPLIANCE RULES PANEL */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            Rigorous Candidate Compliance Directives
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-950 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-800 rounded-full"></span>
              Prohibited Equipment & Malpractice
            </h4>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 p-3 rounded text-[11px] border border-slate-200 text-slate-600 list-none">
              <li>• Electronic calculators, communication pagers, smart wearables or phones of any standard are explicitly prohibited.</li>
              <li>• Impersonation or carrying handwritten scripts will lead to absolute debarment from the registry.</li>
              <li>• Any candidate found conversing during instructions receives immediate session cancellation.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-950 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-800 rounded-full"></span>
              Mandatory Roster Requirements
            </h4>
            <ul className="list-disc list-inside space-y-1 bg-slate-50 p-3 rounded text-[11px] border border-slate-200 text-slate-600 list-none">
              <li>• Signed official Admission Hall Ticket printed clearly on physical sheet.</li>
              <li>• Registered photo identity card (Aadhaar Card, Passport or School Student Card).</li>
              <li>• Standard blue or black ballpoint pens. No digital pens or styluses allowed.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
