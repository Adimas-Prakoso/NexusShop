import { Head, useForm } from '@inertiajs/react';
import { LogOut, Settings, Users, Package, BarChart3, Activity, DollarSign, ShoppingCart, TrendingUp, Sparkles, Zap, Rocket, Star, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAdminSessionTimeout } from '@/hooks/useSessionTimeout';
import { SessionNotification } from '@/components/SessionNotification';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import { SidebarProvider, SpaceSidebar, MobileMenuButton } from '@/components/SpaceSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { formatDistanceToNow } from 'date-fns';

declare global {
    interface Window {
        Pusher: any;
        Echo: any;
    }
}

interface RecentActivity {
    id: number;
    description: string;
    created_at: string;
    type: string;
}

interface DashboardProps {
    admin?: {
        name: string;
        email: string;
        role: string;
    };
    remember_me?: boolean;
    stats?: {
        totalUsers: number;
        totalOrders: number;
        totalSales: number;
    };
    recentActivities?: RecentActivity[];
}

function DashboardContent({ admin, remember_me, stats, recentActivities: initialActivities }: DashboardProps) {
    const { post, processing } = useForm();
    const [rememberMe, setRememberMe] = useState(remember_me || false);
    const [recentActivities, setRecentActivities] = useState(initialActivities || []);
    const { t } = useLanguage();

    useEffect(() => {
        setRecentActivities(initialActivities || []);
    }, [initialActivities]);

    useEffect(() => {
        if (window.Echo) {
            window.Echo.private('dashboard')
                .listen('RecentActivityCreated', (e: { activity: RecentActivity }) => {
                    setRecentActivities(prevActivities => [e.activity, ...prevActivities]);
                });
        }

        return () => {
            if (window.Echo) {
                window.Echo.leave('dashboard');
            }
        };
    }, []);

    // Check if user used remember me from props first, then fallback to cookie or session storage
    useEffect(() => {
        // First use the prop from backend if available
        if (remember_me !== undefined) {
            setRememberMe(remember_me);
            console.log('Remember Me Status from backend:', remember_me);
            console.log('Session display should show:', remember_me ? '24H' : '10M');
            return;
        }

        // Fallback to checking cookie or session storage
        const rememberCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('admin_remember='))
            ?.split('=')[1];
        
        const rememberSession = sessionStorage.getItem('admin_remember');
        
        const isRememberMe = rememberCookie === 'true' || rememberSession === 'true';
        setRememberMe(isRememberMe);
        
        console.log('Remember Me Status from cookie/session:', isRememberMe, { cookie: rememberCookie, session: rememberSession });
        console.log('Session display should show:', isRememberMe ? '24H' : '10M');
    }, [remember_me]);

    // Initialize session timeout hook with the correct rememberMe value
    const sessionTimeout = useAdminSessionTimeout(rememberMe);

    const handleLogout = () => {
        post('/control-panel/logout', {
            preserveState: false,
            preserveScroll: false,
            replace: true,
            onSuccess: () => {
                console.log('Logout successful');
            },
            onError: () => {
                console.log('Logout failed');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
            <Head title="Control Panel - Dashboard">
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            
            {/* Session Timeout Notification */}
            <SessionNotification
                isVisible={sessionTimeout.showWarning}
                timeRemaining={sessionTimeout.timeRemaining}
                onDismiss={() => sessionTimeout.setShowWarning(false)}
                sessionType={rememberMe ? '24H' : '10M'}
            />
            
            {/* Enhanced Cosmic Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Animated grid pattern */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] animate-pulse" />
                
                {/* Floating cosmic nebulae with enhanced animations */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl animate-pulse" 
                     style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/12 rounded-full blur-3xl animate-bounce" 
                     style={{ animationDuration: '6s' }} />
                <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" 
                     style={{ animationDuration: '5s', animationDelay: '2s' }} />
                <div className="absolute top-10 right-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl animate-ping" 
                     style={{ animationDuration: '8s' }} />
                
                {/* Enhanced shooting stars with trails */}
                <div className="absolute top-10 right-1/4 w-3 h-3 bg-white rounded-full opacity-80 shadow-lg shadow-white/50">
                    <div className="absolute inset-0 bg-white rounded-full animate-ping" />
                    <div className="absolute -right-8 top-1/2 w-8 h-0.5 bg-gradient-to-r from-white to-transparent animate-pulse" />
                </div>
                <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-70 shadow-lg shadow-blue-400/50 animate-pulse" 
                     style={{ animationDelay: '1s' }}>
                    <div className="absolute -right-6 top-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent animate-pulse" />
                </div>
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-purple-400 rounded-full opacity-60 shadow-lg shadow-purple-400/50 animate-pulse" 
                     style={{ animationDelay: '2s' }}>
                    <div className="absolute -right-6 top-1/2 w-6 h-0.5 bg-gradient-to-r from-purple-400 to-transparent animate-pulse" />
                </div>
                
                {/* Enhanced starfield with twinkling effect */}
                {[...Array(80)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute rounded-full animate-pulse ${
                            i % 3 === 0 ? 'w-1 h-1 bg-white opacity-40' :
                            i % 3 === 1 ? 'w-0.5 h-0.5 bg-blue-300 opacity-30' :
                            'w-0.5 h-0.5 bg-purple-300 opacity-25'
                        }`}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 4}s`,
                            animationDuration: `${1.5 + Math.random() * 3}s`,
                            boxShadow: i % 5 === 0 ? '0 0 4px currentColor' : 'none'
                        }}
                    />
                ))}
                
                {/* Floating cosmic particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-bounce"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            <div className="flex h-screen relative z-10">
                {/* Sidebar */}
                <SpaceSidebar />
                
                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Enhanced Header with floating effect */}
                    <header className="bg-black/20 backdrop-blur-xl border-b border-purple-500/20 relative animate-fade-in">
                        {/* Floating header particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-2 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" 
                                 style={{ animationDelay: '0s', animationDuration: '3s' }} />
                            <div className="absolute top-4 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce" 
                                 style={{ animationDelay: '1s', animationDuration: '4s' }} />
                        </div>
                        
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <div className="flex items-center space-x-4 animate-slide-in-left">
                                    <MobileMenuButton />
                                    <div className="relative">
                                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                                            {t('dashboard.welcome')}
                                        </h1>
                                        <p className="text-sm text-slate-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                            NexusShop Admin
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4 animate-slide-in-right">
                                    {/* Enhanced Language Switcher */}
                                    <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                                        <LanguageSwitcher />
                                    </div>
                                    
                                    {/* Enhanced Session Status Indicator */}
                                    <div className="flex items-center space-x-2 px-3 py-1 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 animate-pulse-glow">
                                        <div className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${
                                            rememberMe ? 'bg-green-400 shadow-green-400/50' : 'bg-yellow-400 shadow-yellow-400/50'
                                        }`} />
                                        <span className="text-xs text-white font-mono">
                                            {rememberMe ? t('session.24h') : t('session.10m')}
                                        </span>
                                    </div>
                                    
                                    {admin && (
                                        <div className="text-right animate-fade-in" style={{ animationDelay: '0.7s' }}>
                                            <p className="text-sm font-medium text-white">{admin.name}</p>
                                            <p className="text-xs text-slate-300 capitalize">{admin.role}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300 backdrop-blur-sm disabled:opacity-50 group animate-float"
                                        style={{ animationDelay: '0.9s' }}
                                    >
                                        <LogOut className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                        {processing ? t('session.loggingOut') : t('session.logout')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Enhanced Stats Cards with better animations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-stagger-in">
                            {/* Total Sales Card */}
                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-green-500/40 transition-all duration-500 overflow-hidden hover:scale-105 hover:rotate-1 animate-float-in" style={{ animationDelay: '0.1s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-20 animate-pulse" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-300 text-sm font-medium animate-fade-in">{t('dashboard.totalSales')}</p>
                                            <p className="text-3xl font-bold text-white mt-2 animate-count-up">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats?.totalSales ?? 0)}
                                            </p>
                                            <p className="text-green-400 text-sm mt-1 flex items-center animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                                                <TrendingUp className="w-4 h-4 mr-1 animate-bounce" />
                                                +12.5%
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center border border-green-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow">
                                            <DollarSign className="w-7 h-7 text-green-400 group-hover:animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
                                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Orders Card */}
                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-blue-500/40 transition-all duration-500 overflow-hidden hover:scale-105 hover:-rotate-1 animate-float-in" style={{ animationDelay: '0.2s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-300 text-sm font-medium animate-fade-in">{t('dashboard.orders')}</p>
                                            <p className="text-3xl font-bold text-white mt-2 animate-count-up">{stats?.totalOrders ?? 0}</p>
                                            <p className="text-blue-400 text-sm mt-1 flex items-center animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                                                <TrendingUp className="w-4 h-4 mr-1 animate-bounce" />
                                                +8.2%
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow">
                                            <ShoppingCart className="w-7 h-7 text-blue-400 group-hover:animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
                                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Products Card */}
                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 overflow-hidden hover:scale-105 hover:rotate-1 animate-float-in" style={{ animationDelay: '0.3s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-300 text-sm font-medium animate-fade-in">{t('dashboard.products')}</p>
                                            <p className="text-3xl font-bold text-white mt-2 animate-count-up">156</p>
                                            <p className="text-purple-400 text-sm mt-1 flex items-center animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                                                <Package className="w-4 h-4 mr-1 animate-bounce" />
                                                {t('dashboard.active')}
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow">
                                            <Package className="w-7 h-7 text-purple-400 group-hover:animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
                                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-ping" />
                                </div>
                            </div>

                            {/* Customers Card */}
                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-orange-500/40 transition-all duration-500 overflow-hidden hover:scale-105 hover:-rotate-1 animate-float-in" style={{ animationDelay: '0.4s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-300 text-sm font-medium animate-fade-in">{t('dashboard.customers')}</p>
                                            <p className="text-3xl font-bold text-white mt-2 animate-count-up">{stats?.totalUsers ?? 0}</p>
                                            <p className="text-orange-400 text-sm mt-1 flex items-center animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                                                <Users className="w-4 h-4 mr-1 animate-bounce" />
                                                +15.3%
                                            </p>
                                        </div>
                                        <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 animate-pulse-glow">
                                            <Users className="w-7 h-7 text-orange-400 group-hover:animate-bounce" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
                                <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Quick Actions with 3D effects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger-in" style={{ animationDelay: '0.5s' }}>
                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 cursor-pointer overflow-hidden hover:scale-105 hover:rotate-1 transform-gpu animate-float-in" style={{ animationDelay: '0.6s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-30 transition-all duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-purple-500/30 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40">
                                            <Package className="w-7 h-7 text-purple-400 group-hover:animate-bounce" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{t('actions.manageProducts')}</h3>
                                            <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">{t('actions.manageProductsDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12">
                                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 left-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
                                    <div className="absolute bottom-2 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>

                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-green-500/40 transition-all duration-500 cursor-pointer overflow-hidden hover:scale-105 hover:-rotate-1 transform-gpu animate-float-in" style={{ animationDelay: '0.7s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-30 transition-all duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-green-500/30 shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40">
                                            <BarChart3 className="w-7 h-7 text-green-400 group-hover:animate-bounce" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors duration-300">{t('actions.analytics')}</h3>
                                            <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">{t('actions.analyticsDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12">
                                    <Zap className="w-5 h-5 text-green-400 animate-pulse" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 left-2 w-1 h-1 bg-green-400 rounded-full animate-ping" />
                                    <div className="absolute bottom-2 right-8 w-1 h-1 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>

                            <div className="group relative bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-orange-500/40 transition-all duration-500 cursor-pointer overflow-hidden hover:scale-105 hover:rotate-1 transform-gpu animate-float-in" style={{ animationDelay: '0.8s' }}>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-30 transition-all duration-700" />
                                <div className="relative z-10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-orange-500/30 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40">
                                            <Settings className="w-7 h-7 text-orange-400 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">{t('actions.settings')}</h3>
                                            <p className="text-slate-300 text-sm group-hover:text-slate-200 transition-colors duration-300">{t('actions.settingsDesc')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12">
                                    <Rocket className="w-5 h-5 text-orange-400 animate-pulse" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute top-2 left-2 w-1 h-1 bg-orange-400 rounded-full animate-ping" />
                                    <div className="absolute bottom-2 right-8 w-1 h-1 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity Section */}
                        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                                <Activity className="w-6 h-6 mr-3 text-cyan-400" />
                                {t('dashboard.recentActivity')}
                            </h2>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                                            <Zap className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200">{activity.description}</p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center">
                                                <Clock className="w-3 h-3 mr-1.5" />
                                                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!recentActivities || recentActivities.length === 0) && (
                                    <div className="text-center py-8 text-slate-400">
                                        No recent activity.
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ admin, remember_me, stats, recentActivities }: DashboardProps) {
    return (
        <LanguageProvider>
            <SidebarProvider>
                <DashboardContent admin={admin} remember_me={remember_me} stats={stats} recentActivities={recentActivities} />
            </SidebarProvider>
        </LanguageProvider>
    );
}
