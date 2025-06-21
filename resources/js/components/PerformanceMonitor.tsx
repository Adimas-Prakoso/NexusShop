import React, { useEffect } from 'react';

interface PerformanceMonitorProps {
    pageName: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ pageName }) => {
    useEffect(() => {
        // Wait for page to load completely
        const handleLoad = () => {
            // Get performance metrics
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            
            if (navigation) {
                const metrics = {
                    pageName,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    
                    // Core Web Vitals
                    fcp: 0, // First Contentful Paint
                    lcp: 0, // Largest Contentful Paint
                    fid: 0, // First Input Delay
                    cls: 0, // Cumulative Layout Shift
                    ttfb: navigation.responseStart - navigation.requestStart, // Time to First Byte
                    
                    // Navigation timing
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
                    
                    // User agent
                    userAgent: navigator.userAgent,
                    viewport: `${window.innerWidth}x${window.innerHeight}`,
                };

                // Measure Core Web Vitals
                if ('PerformanceObserver' in window) {
                    // First Contentful Paint
                    const fcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const fcpEntry = entries[entries.length - 1];
                        metrics.fcp = fcpEntry.startTime;
                    });
                    fcpObserver.observe({ entryTypes: ['paint'] });

                    // Largest Contentful Paint
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lcpEntry = entries[entries.length - 1];
                        metrics.lcp = lcpEntry.startTime;
                    });
                    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                    // First Input Delay
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const fidEntry = entries[entries.length - 1] as any;
                        metrics.fid = fidEntry.processingStart - fidEntry.startTime;
                    });
                    fidObserver.observe({ entryTypes: ['first-input'] });

                    // Cumulative Layout Shift
                    const clsObserver = new PerformanceObserver((list) => {
                        let clsValue = 0;
                        for (const entry of list.getEntries()) {
                            const layoutShiftEntry = entry as any;
                            if (!layoutShiftEntry.hadRecentInput) {
                                clsValue += layoutShiftEntry.value;
                            }
                        }
                        metrics.cls = clsValue;
                    });
                    clsObserver.observe({ entryTypes: ['layout-shift'] });
                }

                // Send metrics to analytics (you can replace this with your analytics service)
                console.log('Performance Metrics:', metrics);
                
                // Example: Send to Google Analytics
                if (typeof window.gtag !== 'undefined') {
                    window.gtag('event', 'performance_metrics', {
                        page_name: metrics.pageName,
                        fcp: metrics.fcp,
                        lcp: metrics.lcp,
                        fid: metrics.fid,
                        cls: metrics.cls,
                        ttfb: metrics.ttfb,
                        total_load_time: metrics.totalLoadTime
                    });
                }

                // Example: Send to custom endpoint
                // fetch('/api/performance-metrics', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(metrics)
                // });
            }
        };

        // If page is already loaded
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, [pageName]);

    return null; // This component doesn't render anything
};

export default PerformanceMonitor; 