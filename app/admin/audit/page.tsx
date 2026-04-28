'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { Clock, User, FileText } from 'lucide-react';

import { supabase } from '@/src/lib/supabase';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner fullScreen message="Loading audit logs..." />;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Audit', href: '#', active: true }]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Audit Logs</h1>
        <p className="opacity-90">System activity and changes</p>
      </div>

      {logs.length === 0 ? (
        <EmptyState title="No logs" description="Activity logs will appear here" icon="FileText" />
      ) : (
        <div className="bg-white dark:bg-[#1A1A1C] border border-gray-300 dark:border-[#2A2A2E] rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-[#2A2A2E]">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-[#121213] transition-colors flex items-start gap-4">
                <div className={`p-2 rounded-lg ${
                  log.action?.includes('delete') ? 'bg-rose-500/10 text-rose-500' :
                  log.action?.includes('create') || log.action?.includes('add') ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {log.action || 'System Action'}
                    </p>
                    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {log.details || 'No additional details provided.'}
                  </p>
                  {log.user_email && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-[10px] text-gray-400 font-semibold">{log.user_email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
