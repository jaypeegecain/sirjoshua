'use client';

import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#FF6B4A]/10 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-[#FF6B4A]" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Oops!</h1>
        <h2 className="text-xl font-bold text-gray-300 mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-8 text-sm">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-[#FF6B4A] text-white rounded-lg font-medium hover:bg-[#FF5A33] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
