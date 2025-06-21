import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'NexusShop';

// Register service worker for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name: string) => {
        // Use dynamic imports for code splitting instead of eager loading
        const pages = import.meta.glob('./pages/**/*.tsx');
        
        // Try to find the exact match first
        if (pages[`./pages/${name}.tsx`]) {
            return pages[`./pages/${name}.tsx`]();
        }
        
        // As a fallback, try case-insensitive matching
        const normalizedName = name.toLowerCase();
        const keys = Object.keys(pages);
        const key = keys.find(key => key.toLowerCase() === `./pages/${normalizedName}.tsx`);
        return key ? pages[key]() : Promise.reject(new Error(`Page not found: ${name}`));
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
        
        // Remove loading spinner when app is ready
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.opacity = '0';
            setTimeout(() => spinner.remove(), 300);
        }
    },
    progress: {
        color: '#4B5563',
        showSpinner: false, // Disable default spinner since we have custom one
    },
});
