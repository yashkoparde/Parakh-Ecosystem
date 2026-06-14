/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  LogIn, 
  ShieldAlert, 
  KeyRound, 
  User, 
  CheckCircle,
  FileCheck2,
  Printer,
  X,
  XCircle,
  Award,
  BookOpen,
  ClipboardCheck,
  FileBadge,
  Database,
  HelpCircle,
  LogOut,
  Bell
} from 'lucide-react';

import { 
  mockStudent, 
  mockResults, 
  mockCertificates, 
  mockVerificationRecords, 
  mockNotifications, 
  mockExaminationSchedules 
} from './data/mockStudentData';

import { Student, Result, Certificate, VerificationRecord, Notification, ExaminationSchedule } from './types';

// Importing modules
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ResultsModule from './components/ResultsModule';
import ResultDetail from './components/ResultDetail';
import CertificatesModule from './components/CertificatesModule';
import CertificateDetail from './components/CertificateDetail';
import VerificationModule from './components/VerificationModule';
import ProfileView from './components/ProfileView';
import SupportView from './components/SupportView';
import NotificationsView from './components/NotificationsView';
import ExaminationsModule from './components/ExaminationsModule';
import { generateMarksheetPDF, generateCertificatePDF } from './lib/pdfGenerator';

export default function App() {
  // Loading Screen State (HBO Cinematic intro)
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Session State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loginRollNumber, setLoginRollNumber] = useState('2212093845');
  const [loginPasscode, setLoginPasscode] = useState('••••••••');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loginError, setLoginError] = useState('');

  // Active views state
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'results' | 'certificates' | 'verification' | 'profile' | 'support' | 'notifications' | 'examinations'
  const [activeResult, setActiveResult] = useState<Result | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  
  // Roster Domain States
  const [student, setStudent] = useState<Student>(mockStudent);
  const [results, setResults] = useState<Result[]>(mockResults);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [verifications, setVerifications] = useState<VerificationRecord[]>(mockVerificationRecords);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [schedules, setSchedules] = useState<ExaminationSchedule[]>(mockExaminationSchedules);

  // Responsive layout state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // System Operation alerts logs (Simulated OS notifications / Toast queue)
  const [toast, setToast] = useState<{
    status: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);

  const showSystemToast = (message: string, status: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, status });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 3300);
    return () => clearTimeout(timer);
  }, []);

  // Actions
  const handleViewResultDetail = (result: Result) => {
    setActiveResult(result);
    setCurrentView('result-detail');
    setIsMobileMenuOpen(false);
  };

  const handleViewCertificateDetail = (cert: Certificate) => {
    setActiveCertificate(cert);
    setCurrentView('certificate-detail');
    setIsMobileMenuOpen(false);
  };

  const handleDownloadMarksheet = (result: Result) => {
    showSystemToast(`Compiling and downloading statement of marks for ${result.examinationCode} as PDF...`, 'success');
    try {
      generateMarksheetPDF(result, student);
    } catch (err) {
      console.error(err);
      showSystemToast("Failed to compile marksheet PDF.", "error");
    }
  };

  const handleDownloadCertificate = (cert: Certificate) => {
    showSystemToast(`Compiling and downloading digital certificate for ${cert.documentNumber} as PDF...`, 'success');
    try {
      generateCertificatePDF(cert, student);
    } catch (err) {
      console.error(err);
      showSystemToast("Failed to compile certificate PDF.", "error");
    }
  };

  const handleVerifyCertificateAuthenticity = (cert: Certificate) => {
    setCurrentView('verification');
    showSystemToast(`Verification request initiated for record ${cert.documentNumber}. Searching central registry.`, 'info');
    setIsMobileMenuOpen(false);
  };

  const handleUpdateContactInfo = (email: string, phone: string) => {
    setStudent(prev => ({
      ...prev,
      contactEmail: email,
      contactPhone: phone
    }));
    showSystemToast(`Profile contact information updated successfully in central records.`, 'success');
  };

  const handleDownloadHallTicket = (sched: ExaminationSchedule) => {
    showSystemToast(`Generating Hall Admission Ticket for ${sched.code} at center: ${sched.centerName}. Preparing printable copy.`, 'success');
    setTimeout(() => {
      window.print();
    }, 1500);
  };

  // Notification Operations
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    showSystemToast(`Notification alert marked as processed.`, 'info');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showSystemToast(`All active announcement logs have been marked read.`, 'success');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showSystemToast(`Announcement row cleared from temporary logs.`, 'info');
  };

  // Login action
  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      setLoginError('You must formally accept the secure authorization terms to log in.');
      return;
    }

    if (loginRollNumber.trim() === student.rollNumber) {
      setIsAuthenticated(true);
      setLoginError('');
      setCurrentView('home');
      showSystemToast(`Secure Identity verified. session initiated successfully for Candidate ${student.name}.`, 'success');
    } else {
      setLoginError('Authentication match failed. The specified candidate roll number is not registered on this node.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    showSystemToast(`Secured session cleared. Candidate files locked successfully.`, 'info');
  };

  // Map route names to printable title
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'home': return 'Student Workspace Overview';
      case 'examinations': return 'Examination Schedules & Hall Tickets';
      case 'results': return 'Verified Statement of Marks';
      case 'certificates': return 'Digital Certificate Repository';
      case 'verification': return 'Verification Logs';
      case 'profile': return 'Registrar Profile Metadata';
      case 'support': return 'Helpdesk Support & FAQS';
      case 'notifications': return 'Official System Announcements';
      case 'result-detail': return 'Statement of Marks Specimen';
      case 'certificate-detail': return 'Official Digital Certificate Credential';
      default: return 'Student Registry Portal';
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // View Router Render Picker
  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <Dashboard 
            student={student}
            results={results}
            certificates={certificates}
            verifications={verifications}
            notifications={notifications}
            schedules={schedules}
            onViewChange={setCurrentView}
            onViewResultDetail={handleViewResultDetail}
            onViewCertificateDetail={handleViewCertificateDetail}
          />
        );
      case 'examinations':
        return (
          <ExaminationsModule 
            schedules={schedules}
            student={student}
            onDownloadHallTicket={handleDownloadHallTicket}
          />
        );
      case 'results':
        return (
          <ResultsModule 
            results={results}
            onViewResultDetail={handleViewResultDetail}
            onDownloadMarkSheet={handleDownloadMarksheet}
          />
        );
      case 'result-detail':
        return activeResult ? (
          <ResultDetail 
            result={activeResult}
            student={student}
            onBack={() => setCurrentView('results')}
            onDownloadPDF={() => handleDownloadMarksheet(activeResult)}
          />
        ) : (
          <div className="text-center p-12 text-slate-500 font-mono">No active marksheet selected.</div>
        );
      case 'certificates':
        return (
          <CertificatesModule 
            certificates={certificates}
            onViewCertificateDetail={handleViewCertificateDetail}
            onDownloadCertificate={handleDownloadCertificate}
            onVerifyAuthenticity={handleVerifyCertificateAuthenticity}
          />
        );
      case 'certificate-detail':
        return activeCertificate ? (
          <CertificateDetail 
            certificate={activeCertificate}
            student={student}
            onBack={() => setCurrentView('certificates')}
            onDownload={() => handleDownloadCertificate(activeCertificate)}
          />
        ) : (
          <div className="text-center p-12 text-slate-500 font-mono">No active certificate selected.</div>
        );
      case 'verification':
        return (
          <VerificationModule 
            verifications={verifications}
            certificates={certificates}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            student={student}
            onUpdateContactInfo={handleUpdateContactInfo}
            results={results}
          />
        );
      case 'support':
        return (
          <SupportView />
        );
      case 'notifications':
        return (
          <NotificationsView 
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      default:
        return (
          <div className="text-center p-12 text-slate-500 font-mono">Invalid view index requested.</div>
        );
    }
  };

  // Standard Mobile Menu Navigation Items
  const mobileMenuItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'results', label: 'Results', icon: ClipboardCheck },
    { id: 'certificates', label: 'Certs', icon: FileBadge },
    { id: 'verification', label: 'Verify', icon: Database },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  /* -------------------------------------------------------------------------- */
  /*                  CINEMATIC INTRO: HBO GRADE LAUNCH                        */
  /* -------------------------------------------------------------------------- */
  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 select-none overflow-hidden text-white font-sans animate-hbo-glow">
        <div className="text-center space-y-6 px-4 max-w-lg z-10">
          
          {/* Main Title - tracked wide, utilizing the hbo-text animation */}
          <h1 className="text-3xl md:text-4xl font-extralight text-slate-100 uppercase tracking-widest animate-hbo-text">
            PARAKH
          </h1>
          
          {/* Horizontal Divider - animated using hbo-line */}
          <div className="h-[1px] bg-slate-400/40 mx-auto animate-hbo-line" style={{ width: '80%' }} />

          {/* Subtitle - animated using hbo-subtitle */}
          <p className="text-[10px] md:text-xs text-slate-300 font-mono uppercase tracking-widest leading-relaxed animate-hbo-subtitle">
            STUDENT PORTAL
          </p>
        </div>

        {/* Cinematic ambient background glow vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.98)_100%)] pointer-events-none" />
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                  AUTHENTICATION ROUTE: SECURED GATEWAY                     */
  /* -------------------------------------------------------------------------- */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-slate-800 rounded shadow-sm p-6 space-y-6">
          
          {/* Main Title Badge */}
          <div className="text-center space-y-2 border-b border-slate-200 pb-5">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-slate-900 text-white rounded flex items-center justify-center">
                <Building2 className="w-6 h-6 text-slate-200" />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase font-mono">
              Central Board Registry System
            </span>
            <h1 className="text-lg font-bold text-slate-950 uppercase tracking-tight">
              PARAKH Entry Gateway
            </h1>
            <p className="text-xs text-slate-650 leading-relaxed font-mono">
              Access module for verified student academic profiles.
            </p>
          </div>

          {loginError && (
            <div id="login-error-alert" className="bg-red-50 text-red-950 p-2.5 rounded border border-red-350 text-xs font-mono flex items-start gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-800 shrink-0 mt-0.5" />
              <span className="leading-tight">{loginError}</span>
            </div>
          )}

          {/* Secure Fields form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500" htmlFor="login-roll-input">
                Candidate Roll Number
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="login-roll-input"
                  type="text"
                  required
                  placeholder="e.g. 2212093845"
                  value={loginRollNumber}
                  onChange={(e) => setLoginRollNumber(e.target.value)}
                  className="w-full text-xs font-mono pl-8 border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none text-slate-950 font-bold"
                />
              </div>
              <p className="text-[9px] text-slate-400 leading-none">
                Default sandbox candidate roll number is <strong className="text-slate-600">2212093845</strong>
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500" htmlFor="login-pass-input">
                Access Code / Key Check
              </label>
              <div className="relative">
                <KeyRound className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  id="login-pass-input"
                  type="password"
                  required
                  value={loginPasscode}
                  onChange={(e) => setLoginPasscode(e.target.value)}
                  className="w-full text-xs font-mono pl-8 border border-slate-300 rounded p-2 focus:border-slate-500 focus:outline-none text-slate-950 font-bold"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
              <input
                id="login-terms-check"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="login-terms-check" className="text-[10px] text-slate-600 font-sans leading-relaxed cursor-pointer select-none">
                I hereby declare that I am the authorized student candidate. I authorize PARAKH to verify my credentials with the central national registry index.
              </label>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Verify Identity & Authenticate</span>
            </button>
          </form>

          {/* Legal Warning Footer */}
          <div className="p-3 bg-slate-100 text-slate-500 rounded border border-slate-200 text-[10px] font-mono leading-tight space-y-1">
            <span className="font-bold text-slate-700 uppercase">Authentication Notice:</span>
            <p>Unauthorized access to this official portal is strictly prohibited and subject to administrative and legal action. All registry queries are logged for audit purposes.</p>
          </div>

        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                  AUTHENTIC PORTAL: SECURE MAIN SCREEN                      */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* DESKTOP SIDEBAR NAVIGATION (Hidden on Print) */}
      <Sidebar 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }}
        onLogoutClick={handleLogout}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* MOBILE COLLAPSED DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex md:hidden no-print">
          <div className="w-64 bg-slate-900 text-slate-100 border-r border-slate-800 h-full p-4 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-300" />
                  <span className="font-semibold text-xs tracking-wider text-white">PARAKH PLATFORM</span>
                </div>
                <button 
                  id="btn-mobile-menu-close"
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-1.5 rounded text-slate-400 hover:bg-slate-800 border border-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Roster Items */}
              <nav className="space-y-1.5">
                {[
                  { id: 'home', label: 'Home', icon: BookOpen },
                  { id: 'examinations', label: 'My Examinations', icon: BookOpen },
                  { id: 'results', label: 'Results', icon: ClipboardCheck },
                  { id: 'certificates', label: 'Certificates', icon: FileBadge },
                  { id: 'verification', label: 'Verification Records', icon: Database },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'support', label: 'Support & Helpdesk', icon: HelpCircle },
                  { id: 'notifications', label: 'Notifications Log', icon: Bell }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-link-${item.id}`}
                      onClick={() => {
                        setCurrentView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-450 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.id === 'notifications' && unreadNotificationsCount > 0 && (
                        <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                id="btn-mobile-sidebar-logout"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 text-xs font-medium transition-colors justify-center border border-slate-800 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT MAIN CONTAINER FLOOR */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP COMPONENT HEADER */}
        <Header 
          student={student}
          unreadNotifications={unreadNotificationsCount}
          onViewChange={setCurrentView}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          activeViewTitle={getHeaderTitle()}
        />

        {/* SECURE POPUP ALERTS / TOASTER (Floating on Top but administrative layout) */}
        {toast && (
          <div 
            id="system-notification-toast"
            className="fixed top-16 right-4 z-50 bg-slate-900 border border-slate-700 text-white text-xs p-3.5 rounded shadow-lg max-w-sm font-mono space-y-1.5 flex flex-col transition-all duration-300 no-print"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                toast.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-blue-950 text-blue-400 border border-blue-900'
              }`}>
                SYSTEM MESSAGE: {toast.status.toUpperCase()}
              </span>
              <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white cursor-pointer select-none font-bold">[X]</button>
            </div>
            <p className="leading-snug text-slate-300 select-text">{toast.message}</p>
          </div>
        )}

        {/* WORKSPACE MIDDLE SHEET (Main View Render) */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {renderMainContent()}
        </main>

        {/* PERSISTENT ADMINISTRATIVE INDUSTRIAL FOOTER STATUS BAR (No-Print) */}
        <footer id="system-status-indicator-footer" className="bg-white border-t border-slate-200 py-2.5 px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono no-print gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 bg-emerald-700 h-2 rounded-full border border-emerald-600 animate-pulse"></span>
            <span>System status: Securely connected to Central Database (Synced)</span>
          </div>
          <p>© 2026 Central Examinations Authority Depository (PARAKH Systems). Real-time Verification Active.</p>
        </footer>

        {/* MOBILE BOTTOM NAVIGATION BAR (No-Print) */}
        <div id="mobile-bottom-navigation-dock" className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 h-14 flex items-center justify-around z-45 no-print">
          {mobileMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`btn-bottom-nav-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-12 rounded cursor-pointer ${
                  isActive ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-mono mt-0.5 leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Extra margin on mobile bottom due to sticky bottom dock */}
        <div className="md:hidden h-14 shrink-0 no-print" />

      </div>

    </div>
  );
}
