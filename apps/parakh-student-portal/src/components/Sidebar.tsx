/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Home, 
  BookOpen, 
  ClipboardCheck, 
  FileBadge, 
  Database, 
  User, 
  HelpCircle, 
  LogOut, 
  Building2, 
  ShieldAlert 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onLogoutClick: () => void;
  unreadNotificationsCount: number;
}

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  onLogoutClick,
  unreadNotificationsCount 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'examinations', label: 'My Examinations', icon: BookOpen },
    { id: 'results', label: 'Results', icon: ClipboardCheck },
    { id: 'certificates', label: 'Certificates', icon: FileBadge },
    { id: 'verification', label: 'Verification Records', icon: Database },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support & Helpdesk', icon: HelpCircle },
  ];

  return (
    <aside id="sidebar-navigation" className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 border-r border-slate-800 h-screen sticky top-0 no-print">
      {/* Institutional Branding Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-slate-300" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-widest text-white">PARAKH</span>
            <span className="text-xs text-slate-400 font-mono tracking-tight">NATIONAL REGISTRY</span>
          </div>
        </div>
        <div className="text-[10px] uppercase font-mono bg-slate-800 text-slate-300 text-center py-1 px-2 rounded border border-slate-700 font-semibold tracking-wider">
          Student Portal
        </div>
      </div>

      {/* Main Administrative Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider px-2 mb-2 font-mono">
          Services Portfolio
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-slate-800 text-white border-l-2 border-emerald-600' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.id === 'home' && unreadNotificationsCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Authorization Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-500 space-y-3">
        <div className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="leading-tight text-[10px] font-mono">
            Official certified depository for national academic records.
          </span>
        </div>
        
        <button
          id="btn-sidebar-logout"
          onClick={onLogoutClick}
          className="w-full flex items-center gap-2 px-3 py-2 rounded text-slate-400 hover:bg-red-950/40 hover:text-red-300 text-xs font-medium transition-colors justify-center border border-slate-800 hover:border-red-900/50 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit System Session</span>
        </button>
      </div>
    </aside>
  );
}
