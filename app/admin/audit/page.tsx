'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/src/components/LoadingSpinner';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { EmptyState } from '@/src/components/EmptyState';
import { Clock, User, FileText } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

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
      ) : null}
    </div>
  );
}
