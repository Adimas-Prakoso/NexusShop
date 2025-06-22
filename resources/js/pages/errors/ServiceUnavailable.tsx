import React from 'react';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Shield, Clock, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ServiceUnavailableProps {
  error?: {
    message?: string;
    code?: string;
    details?: string;
  };
  retryAfter?: number;
  isDdos?: boolean;
}

export default function ServiceUnavailable({ 
  error, 
  retryAfter = 30,
  isDdos = false 
}: ServiceUnavailableProps) {
  const [countdown, setCountdown] = React.useState(retryAfter);
  const [canRetry, setCanRetry] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanRetry(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <>
      <Head>
        <title>Service Temporarily Unavailable - NexusShop</title>
        <meta name="description" content="Our service is temporarily unavailable. Please try again in a few moments." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Service Temporarily Unavailable</h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                  </div>
                  {isDdos && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {isDdos ? 'Security Protection Active' : 'We\'re experiencing high traffic'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isDdos 
                    ? 'Our security system has detected unusual activity and is protecting our servers. This is a temporary measure to ensure service stability.'
                    : 'Our servers are currently experiencing high traffic. We\'re working to restore normal service as quickly as possible.'
                  }
                </p>
              </div>

              {/* Status Info */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Estimated wait time: {countdown}s</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Auto-retry available</span>
                  </div>
                </div>
              </div>

              {/* Error Details (if available) */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="text-sm">
                    <div className="font-medium text-red-800 dark:text-red-200 mb-1">
                      Error Details:
                    </div>
                    <div className="text-red-700 dark:text-red-300 font-mono text-xs">
                      {error.code && <div>Code: {error.code}</div>}
                      {error.message && <div>Message: {error.message}</div>}
                      {error.details && <div>Details: {error.details}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRetry}
                  disabled={!canRetry}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    canRetry
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {canRetry ? (
                    <RefreshCw className="w-4 h-4" />
                  ) : (
                    <LoadingSpinner size="sm" color="blue" />
                  )}
                  <span>{canRetry ? 'Try Again' : `Wait ${countdown}s`}</span>
                </button>
                
                <button
                  onClick={handleGoHome}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-all duration-200"
                >
                  Go Home
                </button>
              </div>

              {/* Helpful Information */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                  <p className="mb-2">
                    If this problem persists, please contact our support team.
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <a 
                      href="mailto:support@nexusshop.store" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      support@nexusshop.store
                    </a>
                    <span>•</span>
                    <a 
                      href="/contact" 
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Contact Form
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            <p>NexusShop • Error 503 • Service Temporarily Unavailable</p>
            <p className="mt-1">
              {new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
} 