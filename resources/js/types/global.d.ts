import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export {};
