/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  HelpCircle, 
  Send, 
  CheckCircle, 
  PhoneCall, 
  Building, 
  Mail,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function SupportView() {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      q: "What is PARAKH and how are scholastic results secured?",
      a: "PARAKH is the National Assessment Centre, acting as an administrative repository. Results listed inside the portal are verified directly against official central scholastic registry databases. This ensures records are authoritative, accurate, and protected against unauthorized modification.",
      open: true
    },
    {
      id: 2,
      q: "There is a spelling discrepancy in my Guardian's name or Birth Date. How do I fix this?",
      a: "Demographic credentials originate from the authorized school board registries. Local students cannot edit these authoritative indices directly. You must formally file a corrigendum application through your School Principal to the Central board registrar.",
      open: false
    },
    {
      id: 3,
      q: "How can a prospective university verify my digital certificates?",
      a: "Universities can search using your unique Credential ID (e.g. HSC-2026-99384501) on the central verification panel. Each certificate contains an official registry signature reference code which matches the central verified database records exactly.",
      open: false
    },
    {
      id: 4,
      q: "What should I do if my cumulative marksheet status displays 'Under Review'?",
      a: "This occurs during manual audits of multi-school transfers or curricular equivalencies checks. The process takes up to 7 standard working days. No action is required from you unless designated officials dispatch an email query.",
      open: false
    }
  ]);

  const toggleFaq = (id: number) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, open: !f.open } : f));
  };

  // Ticketing state
  const [ticketType, setTicketType] = useState('Marksheet Correction');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [submittedTickets, setSubmittedTickets] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  const handleSubmitTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;

    const newTicket = {
      id: `TICK-2026-${Math.floor(Math.random() * 90000 + 10000)}`,
      type: ticketType,
      subject: ticketSubject,
      desc: ticketDesc,
      date: new Date().toISOString().split('T')[0],
      status: 'AWAITING REGISTRAR RESPONSE'
    };

    setSubmittedTickets([newTicket, ...submittedTickets]);
    setTicketSubject('');
    setTicketDesc('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div id="support-view" className="space-y-6">
      
      {/* Intro */}
      <div className="bg-white p-4 rounded border border-slate-200">
        <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-700" />
          Registrar Helpdesk & Support Center
        </h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          For technical discrepancies, credential clearance inquiries, or equivalent documentation procedures, consult the standard queries list below. If you encounter an operational mismatch, you can file an official Ticket to register an administrative review.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT TWO COLUMNS: FAQ AND FILE REVIEW TICKTEING */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* FAQ Accordion Section */}
          <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider border-b border-slate-150 pb-2">
              Frequently Queried Scholastic Directives
            </h3>

            <div className="space-y-2.5">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-slate-200 rounded overflow-hidden">
                  <button
                    id={`btn-faq-toggle-${faq.id}`}
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left bg-slate-50 hover:bg-slate-100/50 p-3 flex justify-between items-center text-xs font-semibold text-slate-900 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {faq.open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {faq.open && (
                    <div className="p-3 bg-white text-xs text-slate-600 border-t border-slate-250 leading-relaxed font-sans select-text">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket form */}
          <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider border-b border-slate-150 pb-2">
              File Official Review Request (Discrepancy Reporting)
            </h3>

            {success && (
              <div id="ticket-success-alert" className="bg-emerald-50 text-emerald-950 p-3 rounded border border-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 font-bold" />
                <span>Enquiry Dispatch Completed. Ticket added to central registrar audit queue.</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-tight" htmlFor="ticket-type-select">
                    Review Category
                  </label>
                  <select
                    id="ticket-type-select"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none bg-white font-mono text-slate-950"
                  >
                    <option value="Marksheet Correction">Marksheet Spelling Correction</option>
                    <option value="Certificate Release Query">Certificate Release Query</option>
                    <option value="Verification Audit Failure">Verification Mismatch Appeal</option>
                    <option value="Portal Access Failure">Portal Technical Service Mismatch</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-tight" htmlFor="ticket-subject-input">
                    Enquiry Subject Line
                  </label>
                  <input
                    id="ticket-subject-input"
                    type="text"
                    required
                    placeholder="Brief objective summary of problem"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none font-mono text-slate-950"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-tight" htmlFor="ticket-desc-textarea">
                  Factual Context Description
                </label>
                <textarea
                  id="ticket-desc-textarea"
                  rows={4}
                  required
                  placeholder="Detail exactly the matching discrepancies (dates, schools, scores, names). Refer to credential IDs if any exist."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none font-mono text-slate-950"
                />
              </div>

              <button
                id="btn-ticket-submit"
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer justify-center"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Ticket to Registrar</span>
              </button>
            </form>
          </div>

          {/* Active Ticket List */}
          {submittedTickets.length > 0 && (
            <div className="bg-white p-5 rounded border border-slate-200 space-y-4">
              <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider border-b border-slate-150 pb-2">
                Active Desk Enquiries Overview
              </h3>

              <div className="divide-y divide-slate-100">
                {submittedTickets.map((t) => (
                  <div key={t.id} className="py-3 flex flex-col sm:flex-row justify-between items-start gap-3 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950">{t.id}</span>
                        <span className="bg-slate-100 text-slate-600 px-1 rounded text-[10px] font-bold uppercase">{t.type}</span>
                      </div>
                      <p className="font-semibold text-slate-900 leading-tight font-sans mt-1">{t.subject}</p>
                      <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{t.desc}</p>
                      <span className="text-[10px] text-slate-400">Filed on: {t.date}</span>
                    </div>

                    <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CONTACT REGULAR DIRECTIVES HELP LINES */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded border border-slate-200 space-y-5">
            <h3 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-700" />
              Central Contact Reference
            </h3>

            <div className="space-y-4 text-xs font-mono text-slate-700">
              
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">HQ POSTAL ADDRESS:</span>
                <p className="font-sans leading-relaxed font-medium text-slate-900">
                  PARAKH Commission Registrar Division,<br />
                  Shastri Bhawan, Dr. Rajendra Prasad Road,<br />
                  New Delhi - 110001
                </p>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200 flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">REGISTRY TOLL-FREE HELPDESK:</span>
                  <p className="font-bold text-slate-900 mt-0.5">1800-11-2042 / 011-23381112</p>
                  <p className="text-[10px] text-slate-500">Operation: Weekdays 09:30 AM - 05:30 PM (IST)</p>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-200 flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">OFFICIAL HELPDESK INBOX:</span>
                  <p className="font-bold text-slate-900 mt-0.5 select-all">registrar.support@parakh.gov.in</p>
                  <p className="text-[10px] text-slate-500">Expect replies inside 48 operational hours.</p>
                </div>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-emerald-800 font-mono font-semibold bg-emerald-50 py-2 rounded">
              <ShieldCheck className="w-4 h-4 text-emerald-700 font-bold" />
              <span>OFFICIAL GOVERNMENT INSTANCE</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
