import { useEffect, useRef, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';

interface UseSessionTimeoutProps {
    timeoutMinutes: number;
    onTimeout?: () => void;
    warningMinutes?: number;
    onWarning?: () => void;
}

export function useSessionTimeout({
    timeoutMinutes,
    onTimeout,
    warningMinutes = 2, // Default warning 2 minutes before timeout
    onWarning
}: UseSessionTimeoutProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const warningRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const [showWarning, setShowWarning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes);

    const resetTimeout = useCallback(() => {
        lastActivityRef.current = Date.now();
        setShowWarning(false);
        setTimeRemaining(timeoutMinutes);
        
        // Clear existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (warningRef.current) {
            clearTimeout(warningRef.current);
        }

        // Set warning timeout
        if (onWarning && warningMinutes < timeoutMinutes) {
            const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
            warningRef.current = setTimeout(() => {
                setShowWarning(true);
                setTimeRemaining(warningMinutes);
                if (onWarning) {
                    onWarning();
                }
            }, warningTime);
        }

        // Set logout timeout
        const timeoutTime = timeoutMinutes * 60 * 1000;
        timeoutRef.current = setTimeout(() => {
            if (onTimeout) {
                onTimeout();
            } else {
                // Default logout behavior
                router.post('/control-panel/logout', {}, {
                    onSuccess: () => {
                        window.location.href = '/control-panel/login';
                    }
                });
            }
        }, timeoutTime);
    }, [timeoutMinutes, warningMinutes, onTimeout, onWarning]);

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const resetTimeoutHandler = () => {
            resetTimeout();
        };

        // Add event listeners for user activity
        events.forEach(event => {
            document.addEventListener(event, resetTimeoutHandler, true);
        });

        // Initialize timeout
        resetTimeout();

        // Cleanup
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimeoutHandler, true);
            });
            
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (warningRef.current) {
                clearTimeout(warningRef.current);
            }
        };
    }, [resetTimeout]);

    return {
        resetTimeout,
        showWarning,
        timeRemaining,
        setShowWarning,
        getLastActivity: () => lastActivityRef.current
    };
}

// Hook for admin session timeout
export function useAdminSessionTimeout(rememberMe: boolean = false) {
    const timeoutMinutes = rememberMe ? 1440 : 10; // 1 day or 10 minutes
    const warningMinutes = rememberMe ? 60 : 2; // 1 hour warning for remember me, 2 minutes for normal
    
    return useSessionTimeout({
        timeoutMinutes,
        warningMinutes,
        onWarning: () => {
            console.warn(`Session will expire in ${warningMinutes} minutes`);
        },
        onTimeout: () => {
            console.log('Session expired, logging out...');
            router.post('/control-panel/logout', {}, {
                onSuccess: () => {
                    window.location.href = '/control-panel/login';
                }
            });
        }
    });
}
