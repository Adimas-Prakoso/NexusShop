import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';

const appName = import.meta.env.VITE_APP_NAME || 'NexusShop';

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
    },
    progress: {
        color: '#4B5563',
    },
});
