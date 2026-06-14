/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  ShieldCheck, 
  ExternalLink,
  Award,
  Calendar,
  Layers,
  FileCheck2,
  Lock
} from 'lucide-react';
import { Result, Student } from '../types';

interface ResultDetailProps {
  result: Result;
  student: Student;
  onBack: () => void;
  onDownloadPDF: () => void;
}

export default function ResultDetail({ result, student, onBack, onDownloadPDF }: ResultDetailProps) {
  
  return (
    <div id="result-detail-view" className="space-y-6">
      
      {/* Navigation and Actions Row */}
      <div className="flex items-center justify-between no-print">
        <button
          id="btn-result-detail-back"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verified Records</span>
        </button>

        <button
          id="btn-result-detail-download-pdf"
          onClick={onDownloadPDF}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Certified PDF</span>
        </button>
      </div>

      {/* SECURE RECORD STATUS */}
      <div className="bg-slate-50 p-3 rounded border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-3 no-print">
        <div className="flex items-start gap-2 text-xs">
          <Lock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-950 font-mono">Registry Security Status: Signed & Verified (Record ID #581029)</span>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Reference Signature: <span className="text-slate-700 font-mono">{result.txHash.slice(0, 16)}...</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-250 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>AUTHENTICATED RECORD</span>
        </div>
      </div>

      {/* OFFICIAL MARKSHEET CARD (Styled like a credential with double-borders and official feel) */}
      <div className="bg-white p-6 md:p-8 rounded border-2 border-slate-800 shadow-sm print-card space-y-8 relative overflow-hidden">
        
        {/* Subtle Watermark or Seal Background layout */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
          <Award className="w-96 h-96 text-slate-900" />
        </div>

        {/* 1. INSTITUTIONAL INSTITUTION HEADER */}
        <div className="text-center space-y-2 border-b-2 border-slate-800 pb-5">
          <p className="text-xs uppercase font-bold tracking-widest text-slate-500 font-mono">National Repository of Verified Academic Credentials</p>
          <h1 className="text-md md:text-xl font-bold uppercase tracking-tight text-slate-900 font-sans">
            PARAKH EXAMINATION COMMISSION
          </h1>
          <p className="text-xs font-semibold text-slate-700 font-mono">Ministry of Education, Government of India</p>
          <div className="mt-2 text-center">
            <span className="inline-block bg-slate-900 text-white text-[11px] font-mono font-bold px-3 py-1 uppercase tracking-wider rounded">
              OFFICIAL STATEMENT OF MARKS
            </span>
          </div>
        </div>

        {/* 2. DEMOGRAPHICS AND EXAMINATION DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-800">
          
          {/* Student details */}
          <div className="space-y-2 border border-slate-200 p-4 bg-slate-50/50 rounded">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200 pb-1">
              Candidate Identification
            </h3>
            <table className="w-full text-left font-mono">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Candidate Name:</td>
                  <td className="py-1 text-slate-950 font-semibold">{student.name}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Roll Number:</td>
                  <td className="py-1 text-slate-950 font-semibold">{result.rollNumber}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Candidate ID:</td>
                  <td className="py-1 text-slate-950">{student.candidateId}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Date of Birth:</td>
                  <td className="py-1 text-slate-950">{student.dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Guardian Names:</td>
                  <td className="py-1 text-slate-950">{student.fatherName} (F) / {student.motherName} (M)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Exam Details */}
          <div className="space-y-2 border border-slate-200 p-4 bg-slate-50/50 rounded">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono border-b border-slate-200 pb-1">
              Examination Parameters
            </h3>
            <table className="w-full text-left font-mono">
              <tbody>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Examination Name:</td>
                  <td className="py-1 text-slate-950 font-semibold">{result.examinationName}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Examination Code:</td>
                  <td className="py-1 text-slate-950">{result.examinationCode}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Academic Year:</td>
                  <td className="py-1 text-slate-950">{result.academicYear}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Institution Name:</td>
                  <td className="py-1 text-slate-950 leading-tight">{student.registeredInstitution}</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500 pr-2">Published Timestamp:</td>
                  <td className="py-1 text-slate-950">{result.publishedDate} 11:00 AM (IST)</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        {/* 3. MARKS SCHEME TABLE */}
        <div className="space-y-2 border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-300 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase font-mono tracking-wider text-slate-800">
              Subject-wise Accomplishment Details
            </span>
            <span className="text-[10px] font-mono text-slate-500">Passing criteria status: 33% per unit</span>
          </div>

          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100/50 text-slate-700 font-semibold">
                <th className="py-2.5 px-4">Subject Code & Title</th>
                <th className="py-2.5 px-4 text-center">Max Marks</th>
                <th className="py-2.5 px-4 text-center">Passing Marks</th>
                <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                <th className="py-2.5 px-4 text-center">Grade Point</th>
                <th className="py-2.5 px-4 text-right">Result status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {result.subjectScores.map((score) => (
                <tr key={score.code} className="hover:bg-slate-50/20">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-950">({score.code})</span> {score.subject}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{score.maxMarks}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{score.passingMarks}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-950">{score.marksObtained}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900">{score.grade}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      score.status === 'Pass' ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'
                    }`}>
                      {score.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. TOTALS AND PERCENTAGES SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-slate-800 pt-5">
          <div className="flex flex-col space-y-1 justify-center align-middle font-mono">
            <div className="flex justify-between border-b border-slate-200 py-1 text-xs">
              <span className="text-slate-500">Combined Absolute Marks:</span>
              <span className="font-bold text-slate-950">{result.totalMarksObtained} out of {result.totalMaxMarks}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 py-1 text-xs">
              <span className="text-slate-500">Aggregate Percentage Calculation:</span>
              <span className="font-bold text-slate-950">{result.overallPercentage}%</span>
            </div>
            <div className="flex justify-between py-1 text-xs">
              <span className="text-slate-500">Result Standing Grade:</span>
              <span className="font-bold text-slate-950">{result.overallGrade} (Distinction Division)</span>
            </div>
          </div>

          {/* Validation Seal and Signature Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50/50 rounded border border-slate-200 relative">
            <div className="text-center font-mono space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Central Register Office</span>
              <div className="w-16 h-16 border-2 border-slate-600 bg-white/80 rounded-full flex items-center justify-center mx-auto text-[10px] text-slate-700 font-bold border-dashed relative">
                <FileCheck2 className="w-8 h-8 text-slate-400 absolute opacity-[0.25]" />
                SEALED
              </div>
              <p className="text-[11px] font-semibold text-slate-700 mt-2">D. G. Examination Controller</p>
              <p className="text-[9px] text-slate-500">Signed with secure institutional key</p>
            </div>
          </div>
        </div>

        {/* 5. METADATA STATEMENT */}
        <div className="text-center text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-4 space-y-1">
          <p>
            This statement of marks is digitally signed and verified against official central scholastic registry records.
          </p>
          <p className="text-[9px]">
            Document Identifier Code: <span className="text-slate-500 font-bold">{result.id}-{result.rollNumber}</span> | Verification Sign-off Hash: {result.txHash.slice(0, 24)}...
          </p>
        </div>

      </div>

    </div>
  );
}
