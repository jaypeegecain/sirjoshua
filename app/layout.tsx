'use client';

import React from 'react';
import { AuthProvider } from '@/src/context/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { ToastProvider } from '@/src/components/ToastProvider';
import { ConfirmProvider } from '@/src/components/ConfirmationDialog';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { DynamicTitle } from '@/src/components/DynamicTitle';
import '@/src/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>GECAIN MOTOR SHOP & ACCESORIES</title>
        <meta name="description" content="Motor parts management system" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B4A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GECAIN" />
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
                <ToastProvider>
                  <ConfirmProvider>
                    <React.Suspense fallback={null}>
                      <DynamicTitle />
                    </React.Suspense>
                    {children}
                  </ConfirmProvider>
                </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
