/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Bell, 
  Check, 
  Trash2, 
  FileCheck2, 
  Award, 
  CheckCircle,
  Clock,
  CircleDot
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationsViewProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationsView({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}: NotificationsViewProps) {
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div id="notifications-view" className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-4 rounded border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xs font-semibold uppercase text-slate-900 font-mono tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-slate-700" />
            Official Communications Log
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            This log preserves secure announcements dispatched by the Board Registrars. No promotional or marketing notifications are allowed.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            id="btn-notif-mark-all"
            onClick={onMarkAllAsRead}
            className="text-xs text-slate-900 hover:text-slate-950 underline font-semibold font-mono cursor-pointer shrink-0"
          >
            Mark all read [✓]
          </button>
        )}
      </div>

      {/* NOTIFICATIONS LOG */}
      <div className="bg-white border rounded border-slate-200 overflow-hidden divide-y divide-slate-200">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            // Pick left styling color representing notification category
            let borderStyle = 'border-l-4 border-slate-700';
            if (notif.type === 'Result Published') borderStyle = 'border-l-4 border-emerald-700';
            else if (notif.type === 'Certificate Issued') borderStyle = 'border-l-4 border-amber-600';
            else if (notif.type === 'Verification Completed') borderStyle = 'border-l-4 border-blue-700';

            return (
              <div 
                key={notif.id} 
                className={`p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-colors ${borderStyle} ${
                  notif.isRead ? 'bg-white opacity-80' : 'bg-slate-50/50'
                }`}
              >
                {/* Content Side */}
                <div className="space-y-1.5 flex-1 select-text">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-600">
                      {notif.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notif.date} 09:00:00 UTC
                    </span>
                    {!notif.isRead && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1 rounded uppercase tracking-wider flex items-center gap-1 animate-pulse border border-amber-200">
                        <CircleDot className="w-2.5 h-2.5" /> Direct Attention Required
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-950 font-sans leading-snug">
                    {notif.title}
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans max-w-4xl">
                    {notif.content}
                  </p>
                </div>

                {/* Actions Side */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start no-print">
                  {!notif.isRead && (
                    <button
                      id={`btn-notif-read-${notif.id}`}
                      onClick={() => onMarkAsRead(notif.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 text-[10px] font-semibold px-2 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                      title="Mark as Read"
                    >
                      <Check className="w-3 h-3" />
                      <span>De-escalate Alert</span>
                    </button>
                  )}

                  <button
                    id={`btn-notif-delete-${notif.id}`}
                    onClick={() => onDeleteNotification(notif.id)}
                    className="text-slate-400 hover:text-red-800 p-1.5 rounded hover:bg-slate-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                    title="Dismiss alert log"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-slate-500 font-mono">
            <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Official Communication feed is empty.</p>
            <p className="text-xs mt-1 text-slate-400">Database node lists no standard archives.</p>
          </div>
        )}
      </div>

    </div>
  );
}
