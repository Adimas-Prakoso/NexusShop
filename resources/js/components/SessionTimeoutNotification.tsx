import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, X } from 'lucide-react';

interface SessionTimeoutNotificationProps {
    show: boolean;
    onClose: () => void;
    onExtend?: () => void;
    timeRemaining: number; // in minutes
    rememberMe: boolean;
}

export function SessionTimeoutNotification({ 
    show, 
    onClose, 
    onExtend, 
    timeRemaining, 
    rememberMe 
}: SessionTimeoutNotificationProps) {
    const [countdown, setCountdown] = useState(timeRemaining);

    useEffect(() => {
        if (!show) return;

        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-red-900/90 via-orange-900/90 to-red-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-red-400/30 max-w-md w-full p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500/20 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Session Warning</h3>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-white/70" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="bg-black/20 rounded-xl p-4 border border-red-400/20">
                        <div className="flex items-center space-x-3 mb-2">
                            <Clock className="w-5 h-5 text-red-400" />
                            <span className="text-white font-semibold">
                                Session Expiring Soon
                            </span>
                        </div>
                        <p className="text-red-200 text-sm">
                            Your session will expire in{' '}
                            <span className="font-bold text-red-300 font-mono">
                                {countdown} minute{countdown !== 1 ? 's' : ''}
                            </span>
                        </p>
                        <p className="text-red-300/70 text-xs mt-1">
                            {rememberMe 
                                ? 'Extended session timeout (24 hours)'
                                : 'Standard session timeout (10 minutes)'
                            }
                        </p>
                    </div>

                    <div className="text-sm text-white/80">
                        You will be automatically logged out when the session expires. 
                        Any unsaved changes will be lost.
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3 pt-2">
                        {onExtend && (
                            <button
                                onClick={onExtend}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-green-400/50"
                            >
                                Stay Logged In
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-gray-400/50"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="bg-black/20 rounded-full h-2 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-1000 ease-linear"
                            style={{ 
                                width: `${Math.max(0, (countdown / timeRemaining) * 100)}%` 
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>Time Remaining</span>
                        <span className="font-mono">{countdown}m</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
