'use client';

import React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layout } from '@/src/components/Layout';
import { AdminLayout } from '@/src/components/AdminLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, loading, session } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !session) {
      router.push('/login');
    }
  }, [session, loading, mounted, router]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary-container/30 border-t-primary-container rounded-full animate-spin"></div>
      </div>
    );
  }

  const LayoutComponent = isAdmin ? AdminLayout : Layout;

  return <LayoutComponent>{children}</LayoutComponent>;
}
