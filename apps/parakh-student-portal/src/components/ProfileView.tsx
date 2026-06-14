/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  User, 
  Lock, 
  Edit2, 
  Check, 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Calendar,
  Layers,
  FileCheck2,
  Info
} from 'lucide-react';
import { Student, Result } from '../types';

interface ProfileViewProps {
  student: Student;
  onUpdateContactInfo: (email: string, phone: string) => void;
  results: Result[];
}

export default function ProfileView({ student, onUpdateContactInfo, results }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(student.contactEmail);
  const [phone, setPhone] = useState(student.contactPhone);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onUpdateContactInfo(email, phone);
    setIsEditing(false);
    setSuccessMsg('Contact communication channels updated successfully.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReset = () => {
    setEmail(student.contactEmail);
    setPhone(student.contactPhone);
    setIsEditing(false);
  };

  return (
    <div id="profile-view" className="space-y-6">
      
      {/* Official State Registrar Banner */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider">
          Official Candidate Registration Record
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          The records listed below conform to original demographic index credentials verified by your registered school authority. These parameters cannot be manually updated unless requested formally via authorized registrars. Student contact communication channels can be adjusted to receive dispatch signals.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-950 p-3 rounded border border-emerald-300 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-700 font-bold shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TWO COLUMN GRID PROFILE STRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Authority Demographic Summary Card */}
        <div className="bg-white p-6 rounded border border-slate-200 space-y-6 flex flex-col items-center text-center">
          
          {/* Passport Portrait Simulation */}
          <div className="relative">
            <div className="w-24 h-24 rounded bg-slate-100 border-2 border-slate-800 flex items-center justify-center font-bold text-slate-800 text-3xl font-mono">
              AS
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1 rounded-sm border border-slate-100" title="Institution Registrar Certified">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-950 uppercase">{student.name}</h3>
            <p className="text-xs text-slate-500 font-mono">Roll Number: {student.rollNumber}</p>
            <p className="text-[10px] uppercase font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 block mt-1 py-1 px-3">
              Candidate status: ACTIVE
            </p>
          </div>

          <div className="w-full text-left space-y-3.5 border-t border-slate-200 pt-5 text-xs">
            
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold font-mono">AFFILIATION:</span>
                <p className="text-slate-950 leading-tight">{student.registeredInstitution}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold font-mono">PROGRAM STUDY:</span>
                <p className="text-slate-950 leading-tight">{student.program}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold font-mono">ACADEMIC TIMEFRAME:</span>
                <p className="text-slate-950 font-mono">Academic Session {student.academicYear}</p>
              </div>
            </div>

          </div>

        </div>

        {/* REGISTRY PARAMS COLUMN (AUTHORITATIVE RECORD - LOCKED VS EDITABLE) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200">
            <div className="px-1.5 py-1.5 border-b border-slate-150 flex justify-between items-center mb-4">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-700" />
                Registrar Profile Metadata
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Data origin: Central Ministry servers</span>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Candidate ID (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>CANDIDATE REGISTERED ID</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.candidateId}
                    disabled
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded p-2 text-slate-600 cursor-not-allowed uppercase"
                  />
                </div>

                {/* 2. Aadhaar Reference (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>SECURE IDENTIFICATION INDEX</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.aadhaarReference}
                    disabled
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded p-2 text-slate-600 cursor-not-allowed"
                  />
                </div>

                {/* 3. Name (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>CANDIDATE FULL NAME</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.name}
                    disabled
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-600 cursor-not-allowed font-semibold text-slate-900"
                  />
                </div>

                {/* 4. Date of Birth (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>DATE OF BIRTH</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.dateOfBirth}
                    disabled
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded p-2 text-slate-600 cursor-not-allowed"
                  />
                </div>

                {/* 5. Father Name (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>FATHER / GUARDIAN NAME</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.fatherName}
                    disabled
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* 6. Mother Name (Locked) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono tracking-tight">
                    <span>MOTHER NAME</span>
                    <Lock className="w-3 h-3 text-slate-450" />
                  </div>
                  <input
                    type="text"
                    value={student.motherName}
                    disabled
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded p-2 text-slate-400 cursor-not-allowed"
                  />
                </div>

                {/* 7. PHONE (Editable) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 font-mono tracking-tight" htmlFor="profile-phone-input">
                    COMMUNICATION CONTACT PHONE
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="profile-phone-input"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full text-xs font-mono border rounded pl-8 p-2 focus:outline-none focus:border-slate-500 select-text ${
                        isEditing ? 'bg-white border-slate-450 text-slate-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    />
                  </div>
                </div>

                {/* 8. EMAIL (Editable) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 font-mono tracking-tight" htmlFor="profile-email-input">
                    OFFICIAL CORRESPONDENCE EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      id="profile-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                      className={`w-full text-xs font-mono border rounded pl-8 p-2 focus:outline-none focus:border-slate-500 select-text ${
                        isEditing ? 'bg-white border-slate-450 text-slate-950 font-semibold' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    />
                  </div>
                </div>

              </div>

              {/* ACTION COMMAND TIER */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 text-xs no-print">
                {!isEditing ? (
                  <button
                    id="btn-profile-edit-trigger"
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Adjust Communication Channels</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-profile-edit-cancel"
                      type="button"
                      onClick={handleReset}
                      className="bg-white hover:bg-slate-100 text-slate-700 border border-slate-350 font-medium px-4 py-2 rounded cursor-pointer"
                    >
                      Undo
                    </button>
                    <button
                      id="btn-profile-edit-save"
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Records Change</span>
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* EXAMINATION HISTORY SUMMARY MODULE */}
          <div className="bg-white p-5 rounded border border-slate-200">
            <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider border-b border-slate-150 pb-2 mb-3">
              Examinations Index Log
            </h3>
            
            <div className="overflow-x-auto text-[11px] font-mono">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 pb-1.5 font-bold uppercase">
                    <th className="py-2">Exam Code</th>
                    <th className="py-2">Division Program Name</th>
                    <th className="py-2 text-center">Score Result</th>
                    <th className="py-2 text-right">Verification Stamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((res) => (
                    <tr key={res.id}>
                      <td className="py-2 font-semibold text-slate-950">{res.examinationCode}</td>
                      <td className="py-2 text-slate-700 font-sans">{res.examinationName}</td>
                      <td className="py-2 text-center font-bold text-slate-900">
                        {res.overallPercentage}% ({res.overallGrade})
                      </td>
                      <td className="py-2 text-right text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                        {res.verificationStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
