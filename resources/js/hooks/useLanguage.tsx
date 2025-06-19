import { useState, createContext, useContext, ReactNode } from 'react';

export type Language = 'en' | 'id';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
    en: {
        // Common
        'common.english': 'English',
        'common.indonesian': 'Indonesian',
        
        // Navigation
        'nav.overview': 'Overview',
        'nav.userManagement': 'User Management',
        'nav.balance': 'Balance',
        'nav.purchaseHistory': 'Purchase History',
        'nav.productList': 'Product List',
        'nav.reports': 'Reports',
        'nav.settings': 'Settings',
        
        // Dashboard
        'dashboard.welcome': 'Welcome to Dashboard',
        'dashboard.subtitle': 'Your central hub for managing NexusShop. All systems operational and ready for your commands.',
        'dashboard.totalSales': 'Total Sales',
        'dashboard.orders': 'Orders',
        'dashboard.products': 'Products',
        'dashboard.customers': 'Customers',
        'dashboard.active': 'Active',
        'dashboard.recentActivity': 'Recent Activity',
        'dashboard.viewAll': 'View All',
        'dashboard.newOrder': 'New order received',
        'dashboard.newCustomer': 'New customer registered',
        'dashboard.productUpdated': 'Product updated',
        'dashboard.minutesAgo': 'min ago',
        
        // Quick Actions
        'actions.manageProducts': 'Manage Products',
        'actions.manageProductsDesc': 'Add, edit, and organize your inventory',
        'actions.analytics': 'Analytics',
        'actions.analyticsDesc': 'View detailed sales and performance reports',
        'actions.settings': 'Settings',
        'actions.settingsDesc': 'Configure system preferences and options',
        
        // Session
        'session.24h': '24H SESSION',
        'session.10m': '10M SESSION',
        'session.logout': 'Logout',
        'session.loggingOut': 'Logging out...',
    },
    id: {
        // Common
        'common.english': 'English',
        'common.indonesian': 'Bahasa Indonesia',
        
        // Navigation
        'nav.overview': 'Ikhtisar',
        'nav.userManagement': 'Manajemen Pengguna',
        'nav.balance': 'Saldo',
        'nav.purchaseHistory': 'Riwayat Pembelian',
        'nav.productList': 'Daftar Produk',
        'nav.reports': 'Laporan',
        'nav.settings': 'Pengaturan',
        
        // Dashboard
        'dashboard.welcome': 'Selamat Datang di Dashboard',
        'dashboard.subtitle': 'Pusat kendali untuk mengelola NexusShop. Semua sistem operasional dan siap untuk perintah Anda.',
        'dashboard.totalSales': 'Total Penjualan',
        'dashboard.orders': 'Pesanan',
        'dashboard.products': 'Produk',
        'dashboard.customers': 'Pelanggan',
        'dashboard.active': 'Aktif',
        'dashboard.recentActivity': 'Aktivitas Terkini',
        'dashboard.viewAll': 'Lihat Semua',
        'dashboard.newOrder': 'Pesanan baru diterima',
        'dashboard.newCustomer': 'Pelanggan baru terdaftar',
        'dashboard.productUpdated': 'Produk diperbarui',
        'dashboard.minutesAgo': 'menit lalu',
        
        // Quick Actions
        'actions.manageProducts': 'Kelola Produk',
        'actions.manageProductsDesc': 'Tambah, edit, dan atur inventaris Anda',
        'actions.analytics': 'Analitik',
        'actions.analyticsDesc': 'Lihat laporan penjualan dan performa terperinci',
        'actions.settings': 'Pengaturan',
        'actions.settingsDesc': 'Konfigurasi preferensi dan opsi sistem',
        
        // Session
        'session.24h': 'SESI 24 JAM',
        'session.10m': 'SESI 10 MENIT',
        'session.logout': 'Keluar',
        'session.loggingOut': 'Sedang keluar...',
    }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('dashboard-language');
            return (saved as Language) || 'en';
        }
        return 'en';
    });

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem('dashboard-language', lang);
        }
    };

    const t = (key: string): string => {
        const translation = translations[language];
        
        if (!translation) {
            console.warn(`Language '${language}' not found, falling back to key: ${key}`);
            return key;
        }

        const value = translation[key as keyof typeof translation];
        
        if (value === undefined) {
            console.warn(`Translation key '${key}' not found for language '${language}'`);
            return key;
        }

        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
