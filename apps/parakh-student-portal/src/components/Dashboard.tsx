/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Award, 
  CalendarDays, 
  FileCheck2, 
  SearchCode, 
  ArrowRight, 
  Bell, 
  ChevronRight, 
  BookMarked,
  ShieldCheck,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Student, Result, Certificate, VerificationRecord, Notification, ExaminationSchedule } from '../types';

interface DashboardProps {
  student: Student;
  results: Result[];
  certificates: Certificate[];
  verifications: VerificationRecord[];
  notifications: Notification[];
  schedules: ExaminationSchedule[];
  onViewChange: (view: string) => void;
  onViewResultDetail: (result: Result) => void;
  onViewCertificateDetail: (cert: Certificate) => void;
}

export default function Dashboard({
  student,
  results,
  certificates,
  verifications,
  notifications,
  schedules,
  onViewChange,
  onViewResultDetail,
  onViewCertificateDetail
}: DashboardProps) {

  // Computed counters
  const totalCompletedExams = results.length;
  const pendingCertificatesCount = certificates.filter(c => c.status === 'Pending').length;
  const verifiedDocumentsCount = certificates.filter(c => c.verificationStatus === 'Verified').length;
  const recentNotifs = notifications.slice(0, 3);

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Official State Notice Banner */}
      <div className="bg-slate-900 text-white p-5 rounded border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Candidate Dashboard</span>
          <h2 className="text-lg font-bold">National Student Academic Repository & Verified Credentials</h2>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <span className="text-white font-medium">{student.name}</span> ({student.program}). Records are directly anchored to official central servers.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            id="btn-dash-to-results"
            onClick={() => onViewChange('results')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Access All Marksheets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* COMPACT ADMINISTRATIVE METRICS (No flashy KPI cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded text-slate-700 shrink-0">
            <BookMarked className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Academic Year</span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{student.academicYear}</p>
            <p className="text-[10px] text-slate-500">Registered Code: KV-541</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded text-slate-700 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Completed Exams</span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{totalCompletedExams} Verified Records</p>
            <p className="text-[10px] text-slate-500">Class X & Class XII records</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded text-emerald-800 shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Verified Creds</span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{verifiedDocumentsCount} Sealed Docs</p>
            <p className="text-[10px] text-emerald-700 font-mono font-medium">Secured Status Active</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded border border-slate-200 flex items-start gap-3">
          <div className="p-2 bg-slate-100 rounded text-amber-800 shrink-0">
            <SearchCode className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">Pending Audits</span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">{pendingCertificatesCount} Under Process</p>
            <p className="text-[10px] text-slate-500">Scheduled verification queue</p>
          </div>
        </div>
      </div>

      {/* MAIN TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT & CENTER PANEL (Results & Certificates Registry) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Sub-section: Recent Published Results */}
          <div className="bg-white rounded border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Recent Available Results
              </h3>
              <button 
                id="btn-quick-results-more"
                onClick={() => onViewChange('results')} 
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono transition-colors cursor-pointer"
              >
                <span>View All Records</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-200">
              {results.slice(0, 3).map((result) => (
                <div key={result.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                  <div className="space-y-1">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-mono font-semibold px-2 py-0.5 border border-emerald-200 rounded">
                      {result.examinationCode}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-950 mt-1">{result.examinationName}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Published: {result.publishedDate} | Grade: <span className="font-semibold text-slate-950">{result.overallGrade}</span> | Absolute score: {result.totalMarksObtained}/{result.totalMaxMarks} ({result.overallPercentage}%)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                      ● Status: Verified
                    </span>
                    <button
                      id={`btn-dash-result-view-${result.id}`}
                      onClick={() => onViewResultDetail(result)}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-medium px-2.5 py-1.5 rounded transition-all cursor-pointer"
                    >
                      Inspect Marksheet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-section: Digital Certificate Repository */}
          <div className="bg-white rounded border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-900 rounded-full"></span>
                Official Certificates Status
              </h3>
              <button 
                id="btn-quick-certs-more"
                onClick={() => onViewChange('certificates')} 
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-mono transition-colors cursor-pointer"
              >
                <span>Repo Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] text-slate-600 font-mono uppercase">
                      <th className="py-2 px-3 font-semibold">Document Name</th>
                      <th className="py-2 px-3 font-semibold">Credential Code</th>
                      <th className="py-2 px-3 font-semibold text-center">Verification</th>
                      <th className="py-2 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {certificates.slice(0, 3).map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/40">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-950">{cert.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{cert.issuingAuthority}</div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                          {cert.documentNumber}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {cert.verificationStatus === 'Verified' ? (
                            <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider font-mono rounded">
                              Verified
                            </span>
                          ) : (
                            <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider font-mono rounded">
                              Under Review
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            id={`btn-dash-cert-inspect-${cert.id}`}
                            onClick={() => onViewCertificateDetail(cert)}
                            className="text-slate-500 hover:text-slate-900 font-medium font-mono text-[11px] underline cursor-pointer"
                          >
                            Inspect Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL (Upcoming Exams, Verification & Administrative Notifications) */}
        <div className="space-y-6">
          
          {/* Sub-section: Upcoming Examination Schedule */}
          <div className="bg-white rounded border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-600" />
                Examination Schedules
              </h3>
            </div>
            
            <div className="p-4 space-y-3.5">
              {schedules.map((sched) => (
                <div key={sched.id} className="border-l-2 border-slate-300 pl-3 space-y-1 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-medium text-slate-500">{sched.code}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold border ${
                      sched.status === 'Completed' 
                        ? 'bg-slate-100 text-slate-600 border-slate-200' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {sched.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-950 leading-tight">{sched.name}</h4>
                  <div className="text-[10px] text-slate-500 font-mono flex flex-col space-y-0.5">
                    <span>Date: {sched.date}</span>
                    <span>Time: {sched.timeSlot}</span>
                    <span>Venue: {sched.centerName}</span>
                  </div>
                </div>
              ))}
              <button
                id="btn-dash-to-exams"
                onClick={() => onViewChange('examinations')}
                className="w-full text-center text-xs text-slate-600 hover:text-slate-950 font-medium py-1.5 border border-dashed border-slate-300 rounded hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Go to Examination Module
              </button>
            </div>
          </div>

          {/* Sub-section: Third-Party Verification Audits Summary */}
          <div className="bg-white rounded border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                <SearchCode className="w-4 h-4 text-slate-600" />
                Verification Clearances
              </h3>
            </div>
            
            <div className="p-4 space-y-3 divide-y divide-slate-100">
              {verifications.slice(0, 3).map((record, idx) => (
                <div key={record.id} className={`space-y-1 ${idx > 0 ? 'pt-3' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 font-semibold">{record.referenceNumber}</span>
                    {record.status === 'Verified' ? (
                      <span className="text-emerald-800 text-[9px] font-mono uppercase bg-emerald-50 px-1 hover:cursor-default rounded border border-emerald-200 font-bold">
                        PASS
                      </span>
                    ) : (
                      <span className="text-amber-800 text-[9px] font-mono uppercase bg-amber-50 px-1 hover:cursor-default rounded border border-amber-200 font-bold">
                        PENDING
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-950 leading-tight">By: {record.requestedBy}</h4>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">
                    Type: {record.documentType}
                  </p>
                </div>
              ))}
              <div className="pt-3">
                <button
                  id="btn-dash-to-verifications"
                  onClick={() => onViewChange('verification')}
                  className="w-full text-center text-xs text-slate-600 hover:text-slate-950 font-mono font-medium underline py-0.5 cursor-pointer"
                >
                  Inspect Auditor Logs
                </button>
              </div>
            </div>
          </div>

          {/* Sub-section: Live Official Administrative Notification Feed */}
          <div className="bg-white rounded border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-200">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-600" />
                Official Announcements
              </h3>
            </div>
            
            <div className="p-4 space-y-3 divide-y divide-slate-100">
              {recentNotifs.map((notif, idx) => (
                <div key={notif.id} className={`space-y-1 ${idx > 0 ? 'pt-3' : ''}`}>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{notif.type}</span>
                    <span>{notif.date}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-950 leading-snug">{notif.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-2">{notif.content}</p>
                </div>
              ))}
              <div className="pt-3">
                <button
                  id="btn-dash-to-notifs"
                  onClick={() => onViewChange('notifications')}
                  className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 py-1.5 text-xs text-center font-semibold rounded cursor-pointer"
                >
                  Open Communications Log
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
