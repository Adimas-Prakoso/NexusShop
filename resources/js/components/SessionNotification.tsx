import { AlertTriangle, Clock, X } from 'lucide-react';

interface SessionNotificationProps {
    isVisible: boolean;
    timeRemaining: number;
    onDismiss: () => void;
    sessionType: '10M' | '24H';
}

export function SessionNotification({ 
    isVisible, 
    timeRemaining, 
    onDismiss, 
    sessionType 
}: SessionNotificationProps) {
    if (!isVisible) return null;

    const formatTime = (minutes: number): string => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const getUrgencyStyle = (minutes: number) => {
        if (minutes <= 2) return 'from-red-500 to-red-600';
        if (minutes <= 5) return 'from-orange-500 to-red-500';
        return 'from-amber-500 to-orange-500';
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${getUrgencyStyle(timeRemaining)} text-white shadow-lg transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 animate-pulse flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">
                                {timeRemaining <= 2 ? '🚨 Session Expiring Very Soon!' : 'Session Expiring Soon!'}
                            </p>
                            <p className="text-xs opacity-90">
                                Your {sessionType === '10M' ? '10-minute' : '24-hour'} session will expire in {formatTime(timeRemaining)}. 
                                {timeRemaining <= 2 ? ' Save your work now!' : ' Any activity will extend your session.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-mono">
                                {formatTime(timeRemaining)} remaining
                            </span>
                        </div>
                        <button
                            onClick={onDismiss}
                            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                            aria-label="Dismiss notification"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
