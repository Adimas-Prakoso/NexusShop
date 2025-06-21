import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

interface GoogleAnalyticsProps {
    measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
    useEffect(() => {
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', measurementId, {
            page_title: document.title,
            page_location: window.location.href,
        });

        return () => {
            // Cleanup
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [measurementId]);

    return (
        <Head>
            {/* Google Analytics Global Site Tag */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${measurementId}', {
                            page_title: document.title,
                            page_location: window.location.href,
                        });
                    `
                }}
            />
        </Head>
    );
};

export default GoogleAnalytics; 