/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  FileText, 
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { Result } from '../types';

interface ResultsModuleProps {
  results: Result[];
  onViewResultDetail: (result: Result) => void;
  onDownloadMarkSheet: (result: Result) => void;
}

export default function ResultsModule({ 
  results, 
  onViewResultDetail, 
  onDownloadMarkSheet 
}: ResultsModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<'date' | 'percentage'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Handle filter & search logic
  const filteredResults = results.filter((res) => {
    const matchesSearch = 
      res.examinationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.examinationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subjectScores.some(sub => sub.subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = 
      filterStatus === 'All' || 
      res.verificationStatus === filterStatus ||
      (filterStatus === 'Pass' && res.resultStatus === 'Pass') ||
      (filterStatus === 'Fail' && res.resultStatus === 'Fail');

    return matchesSearch && matchesStatus;
  });

  // Handle sorting logic
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortOrder === 'asc' 
        ? a.overallPercentage - b.overallPercentage 
        : b.overallPercentage - a.overallPercentage;
    }
  });

  const toggleSort = (field: 'date' | 'percentage') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('All');
    setSortField('date');
    setSortOrder('desc');
  };

  return (
    <div id="results-module-view" className="space-y-6">
      
      {/* Official Guidelines header */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider">
          Verified Results Guidelines
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          The records inside the database below correspond to verified national examinations archived inside the PARAKH registry network. Any student, certifying agency, or registered university registrar can search, filter, and authenticate these records securely. Select 'Inspect Marksheet' to view official performance metrics, digital certificates, and verified grade points.
        </p>
      </div>

      {/* FILTER & SEARCH CONTROL TIER */}
      <div className="bg-white p-4 rounded border border-slate-200 space-y-3.5 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              id="input-results-search"
              type="text"
              placeholder="Search by examination code, school board, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded focus:border-slate-500 focus:outline-none placeholder-slate-400 font-mono text-slate-950"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              <select
                id="select-results-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-slate-300 rounded p-1.5 focus:outline-none bg-white font-mono text-slate-950"
              >
                <option value="All">All Examinations</option>
                <option value="Verified">Verified Records</option>
                <option value="Under Review">Under Review</option>
                <option value="Pass">Pass Standing</option>
              </select>
            </div>

            {/* Sorting Toggles */}
            <div className="flex items-center gap-2">
              <button
                id="btn-sort-date"
                onClick={() => toggleSort('date')}
                className={`text-xs border border-slate-300 p-1.5 rounded flex items-center gap-1 font-mono transition-colors cursor-pointer ${sortField === 'date' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              >
                <span>Date</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
              <button
                id="btn-sort-percentage"
                onClick={() => toggleSort('percentage')}
                className={`text-xs border border-slate-300 p-1.5 rounded flex items-center gap-1 font-mono transition-colors cursor-pointer ${sortField === 'percentage' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
              >
                <span>Percentage</span>
                <ArrowUpDown className="w-3 h-3" />
              </button>
            </div>

            {/* Reset */}
            {(searchTerm || filterStatus !== 'All' || sortField !== 'date') && (
              <button
                id="btn-results-reset"
                onClick={resetFilters}
                className="text-xs text-red-700 hover:text-red-900 font-mono flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

        </div>

        {/* Counter */}
        <div className="text-[11px] text-slate-500 font-mono bg-slate-50 p-1.5 rounded border border-slate-150 flex justify-between items-center">
          <span>Found {sortedResults.length} index matches inside national archive db.</span>
          <span>Time: UTC +05:30 Registry Database Sync</span>
        </div>
      </div>

      {/* RESULTS LIST TABLE (No decoration charts dominating the page) */}
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-make border-slate-200 bg-slate-50/80 text-[10px] text-slate-600 font-mono uppercase">
                <th className="py-3 px-4 font-semibold">Examination & Code</th>
                <th className="py-3 px-4延 px-4 font-semibold">Subject Highlights</th>
                <th className="py-3 px-4 font-semibold">Record Year</th>
                <th className="py-3 px-4 font-semibold">Aggregate Marks</th>
                <th className="py-3 px-4 font-semibold text-center">Audit Status</th>
                <th className="py-3 px-4 font-semibold">Publication Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {sortedResults.length > 0 ? (
                sortedResults.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Column 1: Examination & Code */}
                    <td className="py-4.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-950">{result.examinationName}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Code: <span className="font-medium text-slate-700">{result.examinationCode}</span>
                      </div>
                    </td>

                    {/* Column 2: Subject */}
                    <td className="py-4.5 px-4">
                      <div className="text-slate-700 leading-tight">
                        {result.subjectScores.slice(0, 3).map(s => s.subject).join(', ')}
                        {result.subjectScores.length > 3 ? ` + ${result.subjectScores.length - 3} more` : ''}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Total Subjects: {result.subjectScores.length} units
                      </div>
                    </td>

                    {/* Column 3: Date/Year */}
                    <td className="py-4.5 px-4 font-mono text-slate-600">
                      {result.academicYear}
                    </td>

                    {/* Column 4: Marks */}
                    <td className="py-4.5 px-4">
                      <div className="font-mono font-semibold text-slate-900">
                        {result.totalMarksObtained} / {result.totalMaxMarks}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        ({result.overallPercentage}% | Grade: <span className="font-semibold text-slate-900">{result.overallGrade}</span>)
                      </div>
                    </td>

                    {/* Column 5: Status */}
                    <td className="py-4.5 px-4 text-center">
                      <div className="inline-flex flex-col gap-1 items-center">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                          result.resultStatus === 'Pass' 
                            ? 'bg-green-50 text-green-800 border-green-200' 
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}>
                          {result.resultStatus === 'Pass' ? 'PASSED' : 'FAILED'}
                        </span>
                        
                        {result.verificationStatus === 'Verified' ? (
                          <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1 border border-emerald-150 uppercase font-semibold">
                            VERIFIED MATCH
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-amber-800 bg-amber-50 px-1 border border-amber-150 uppercase font-semibold">
                            IN AUDIT
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 6: Publication Date */}
                    <td className="py-4.5 px-4 font-mono text-slate-500">
                      {result.publishedDate}
                    </td>

                    {/* Column 7: Actions */}
                    <td className="py-4.5 px-4 text-right">
                      <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1.5">
                        <button
                          id={`btn-tbl-inspect-marksheet-${result.id}`}
                          onClick={() => onViewResultDetail(result)}
                          className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] px-2.5 py-1.5 rounded transition-all cursor-pointer font-medium"
                          title="View Official Interactive Marksheet"
                        >
                          Inspect Marksheet
                        </button>
                        <button
                          id={`btn-tbl-download-marksheet-${result.id}`}
                          onClick={() => onDownloadMarkSheet(result)}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[11px] p-1.5 rounded transition-all cursor-pointer"
                          title="Download certified PDF marksheet"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 font-mono">
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-700">No official records conform to query parameters.</p>
                      <p className="text-xs">Adjust search terms or reset examination filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
