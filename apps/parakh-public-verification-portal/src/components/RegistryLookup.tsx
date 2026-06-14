/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Eye, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { ExamRecord } from '../types';
import { REGISTRY_RECORDS } from '../utils';

interface RegistryLookupProps {
  onSelectRecord: (record: ExamRecord) => void;
}

export default function RegistryLookup({ onSelectRecord }: RegistryLookupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredRecords = REGISTRY_RECORDS.filter(record => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    
    // Check match against multiple details
    const matchesQuery = 
      record.id.toLowerCase().includes(term) ||
      record.candidateID.toLowerCase().includes(term) ||
      record.candidateName.toLowerCase().includes(term) ||
      record.examination.toLowerCase().includes(term) ||
      record.rollNumber.toLowerCase().includes(term);

    if (filterType === 'ALL') return matchesQuery;
    return matchesQuery && record.institution.includes(filterType);
  });

  return (
    <div className="bg-white border border-[#CBD5E1] p-6 rounded-[4px] shadow-sm mt-8" id="national-registry-search-lookup">
      {/* Header and Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#E2E8F0] pb-4 mb-5 gap-3">
        <div>
          <h2 className="text-lg font-sans font-semibold text-[#0F172A]">
            National Records Reference Registry
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cross-reference and inspect pre-registered examination certifications directly from the official ledger archives.
          </p>
        </div>
      </div>

      {/* Query Search Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3 relative">
          <label className="sr-only">Search</label>
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Type Name, Roll Number, Candidate ID or Certificate ID (e.g. Arjun, CAN-99120, PRK-2025)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs text-[#0F172A] bg-white border border-[#CBD5E1] rounded-[4px] placeholder-[#64748B] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
          />
        </div>

        <div>
          <label className="sr-only">Authority Filters</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-[#CBD5E1] rounded-[4px] p-2.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
          >
            <option value="ALL">All Boards & Testing Bodies</option>
            <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
            <option value="CISCE">CISCE (ISC/ICSE Council)</option>
            <option value="NTA">National Testing Agency (NTA)</option>
            <option value="Ministry">Ministry of Education National Board</option>
          </select>
        </div>
      </div>

      {/* Table List of Records */}
      {filteredRecords.length === 0 ? (
        <div className="py-12 text-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-[4px] flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-[#B45309] mb-2" />
          <p className="text-xs font-medium text-[#0F172A]">No record indexes found matching search filters.</p>
          <p className="text-[11px] text-[#64748B] mt-1">Check credentials or try typing "Priya" or "Arjun" to inspect ready records.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#CBD5E1] rounded-[4px]">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[10px] text-[#334155] uppercase font-semibold tracking-wider">
                <th className="py-3.5 px-4 font-mono select-none">Certificate ID</th>
                <th className="py-3.5 px-4 select-none">Candidate / Roll</th>
                <th className="py-3.5 px-4 select-none">Course / Assessment Examination</th>
                <th className="py-3.5 px-4 select-none">Issuing Authority Authority Board</th>
                <th className="py-3.5 px-4 select-none text-center">Reference Audit status</th>
                <th className="py-3.5 px-4 select-none text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1] text-xs">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#0F172A] whitespace-nowrap">
                    {record.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#0F172A]">{record.candidateName}</div>
                    <div className="text-[11px] text-[#64748B] mt-0.5 font-mono">
                      Roll: {record.rollNumber} • ID: {record.candidateID}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#334155] font-medium max-w-sm truncate" title={record.examination}>
                      {record.examination}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">
                      Batch Year: {record.year}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-normal text-[#64748B] max-w-[200px] truncate" title={record.institution}>
                    {record.institution}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 bg-[#DCFCE7] text-[#166534] border border-[#CBD5E1]/20 rounded-[4px] text-[10px] font-mono uppercase font-semibold">
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectRecord(record)}
                      className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#334155] text-white text-[11px] font-medium rounded-[4px] inline-flex items-center space-x-1.5 transition-all focus:outline-none cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Record</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guide label */}
      <div className="mt-4 bg-[#F8FAFC] border border-[#CBD5E1] p-3 rounded-[4px] flex items-center space-x-2.5">
        <span className="bg-[#E2E8F0] px-2 py-0.5 text-[10px] font-mono uppercase text-[#0F172A] font-medium border border-[#CBD5E1]">Helpful Tip</span>
        <span className="text-[11px] text-[#64748B]">
          Direct lookup does not guarantee physical document possession. For strict digital integrity verification, upload the transcript file directly or provide the candidate ID.
        </span>
      </div>
    </div>
  );
}
