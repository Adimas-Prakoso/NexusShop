import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    Wallet, 
    History, 
    Package, 
    BarChart3, 
    Settings, 
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Rocket,
    Shield
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';

interface SidebarContextType {
    isCollapsed: boolean;
    toggleCollapsed: () => void;
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
}

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved ? JSON.parse(saved) : false;
    });
    const [isMobileOpen, setMobileOpen] = useState(false);

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <SidebarContext.Provider value={{
            isCollapsed,
            toggleCollapsed,
            isMobileOpen,
            setMobileOpen
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

interface SidebarProps {
    className?: string;
}

export function SpaceSidebar({ className }: SidebarProps) {
    const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } = useSidebar();
    const { t } = useLanguage();

    const navigationItems = [
        {
            icon: LayoutDashboard,
            label: t('nav.overview'),
            href: '/control-panel',
            active: true
        },
        {
            icon: Users,
            label: t('nav.userManagement'),
            href: '/control-panel/users',
            active: false
        },
        {
            icon: Wallet,
            label: t('nav.balance'),
            href: '/control-panel/balance',
            active: false
        },
        {
            icon: History,
            label: t('nav.purchaseHistory'),
            href: '/control-panel/history',
            active: false
        },
        {
            icon: Package,
            label: t('nav.productList'),
            href: '/control-panel/products',
            active: false
        },
        {
            icon: BarChart3,
            label: t('nav.reports'),
            href: '/control-panel/reports',
            active: false
        },
        {
            icon: Settings,
            label: t('nav.settings'),
            href: '/control-panel/settings',
            active: false
        }
    ];

    const SidebarContent = () => (
        <div className={cn(
            "h-full bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl border-r border-purple-500/20 relative overflow-hidden",
            className
        )}>
            {/* Cosmic background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000" />
                
                {/* Starfield */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 h-full flex flex-col">
                {/* Enhanced Header with smooth animations */}
                <div className={cn(
                    "flex items-center border-b border-purple-500/20 bg-black/20 backdrop-blur-sm transition-all duration-500 ease-in-out relative overflow-hidden",
                    isCollapsed ? "p-4 justify-center" : "p-6 justify-between"
                )}>
                    {/* Animated background ripple effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Logo section with enhanced animations */}
                    <div className={cn(
                        "flex items-center transition-all duration-700 ease-in-out overflow-hidden relative",
                        isCollapsed ? "w-0 opacity-0 -translate-x-6 scale-75" : "w-auto opacity-100 translate-x-0 scale-100"
                    )}>
                        <div className={cn(
                            "flex items-center space-x-3 transition-all duration-600 ease-in-out",
                            isCollapsed ? "scale-0 opacity-0 rotate-180" : "scale-100 opacity-100 rotate-0"
                        )}>
                            <div className="relative group">
                                <img 
                                    src="/logo.png" 
                                    alt="NexusShop" 
                                    className={cn(
                                        "rounded-lg transition-all duration-500 ease-in-out group-hover:scale-110 animate-glow-pulse",
                                        isCollapsed ? "w-6 h-6" : "w-8 h-8"
                                    )}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg animate-pulse group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300" />
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Orbiting particles */}
                                <div className="absolute top-0 left-0 w-1 h-1 bg-blue-400 rounded-full animate-particle-orbit opacity-0 group-hover:opacity-100" />
                                <div className="absolute top-0 right-0 w-1 h-1 bg-purple-400 rounded-full animate-particle-orbit animate-delay-200 opacity-0 group-hover:opacity-100" />
                            </div>
                            <div className={cn(
                                "transition-all duration-600 ease-in-out transform",
                                isCollapsed ? "opacity-0 scale-75 -translate-x-4 rotate-12" : "opacity-100 scale-100 translate-x-0 rotate-0"
                            )}>
                                <h1 className={cn(
                                    "font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x whitespace-nowrap transition-all duration-500",
                                    !isCollapsed ? "animate-text-slide-in" : "animate-text-slide-out"
                                )}>
                                    NexusShop
                                </h1>
                                <p className={cn(
                                    "text-xs text-slate-400 transition-all duration-500 hover:text-slate-300 whitespace-nowrap",
                                    !isCollapsed ? "animate-text-slide-in animate-delay-100" : "animate-text-slide-out"
                                )}>
                                    Admin Panel
                                </p>
                            </div>
                        </div>
                    </div>


                    
                    {/* Enhanced toggle button with ripple effect */}
                    <button
                        onClick={toggleCollapsed}
                        className={cn(
                            "p-2 rounded-lg bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-300 border border-white/10 hover:border-white/20 group relative overflow-hidden animate-glow-pulse",
                            isCollapsed ? "ml-0" : "ml-4"
                        )}
                    >
                        {/* Button background glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Ripple effect on click */}
                        <div className="absolute inset-0 rounded-lg animate-ripple opacity-0 group-active:opacity-100 bg-white/20" />
                        
                        <div className="relative z-10">
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 text-white group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:scale-110" />
                            ) : (
                                <ChevronLeft className="w-4 h-4 text-white group-hover:text-blue-400 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:scale-110" />
                            )}
                        </div>
                        
                        {/* Enhanced floating particles around button on hover */}
                        <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
                        <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                        <div className="absolute top-0 left-1/2 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-orbit animate-delay-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 right-1/2 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-orbit animate-delay-300 transition-opacity duration-300" />
                    </button>
                </div>

                {/* Navigation with enhanced animations */}
                <nav className="flex-1 p-4 space-y-2">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-xl transition-all duration-300 relative overflow-hidden",
                                    isCollapsed ? "p-3 justify-center" : "p-3 space-x-3",
                                    item.active 
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/10 animate-glow-pulse" 
                                        : "hover:bg-white/10 border border-transparent hover:border-white/10"
                                )}
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                {/* Enhanced glow effect for active item */}
                                {item.active && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl animate-pulse" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full animate-pulse" />
                                    </>
                                )}
                                
                                {/* Hover ripple effect */}
                                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-ripple transition-opacity duration-300" />
                                
                                <div className="relative z-10 flex items-center space-x-3">
                                    <Icon className={cn(
                                        "w-5 h-5 transition-all duration-300",
                                        item.active 
                                            ? "text-blue-400 animate-glow-pulse" 
                                            : "text-slate-400 group-hover:text-white group-hover:scale-110 group-hover:rotate-12"
                                    )} />
                                    
                                    {!isCollapsed && (
                                        <span className={cn(
                                            "font-medium transition-all duration-500 transform",
                                            item.active 
                                                ? "text-white animate-text-slide-in" 
                                                : "text-slate-300 group-hover:text-white group-hover:translate-x-1",
                                            isCollapsed ? "animate-text-slide-out" : "animate-text-slide-in"
                                        )}
                                        style={{
                                            animationDelay: `${0.2 + index * 0.05}s`
                                        }}>
                                            {item.label}
                                        </span>
                                    )}
                                </div>

                                {/* Enhanced active indicator */}
                                {item.active && (
                                    <div className="absolute right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                                )}

                                {/* Hover particles */}
                                <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-orbit transition-opacity duration-300" />
                                <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-particle-orbit animate-delay-200 transition-opacity duration-300" />
                            </a>
                        );
                    })}
                </nav>

                {/* Enhanced Footer */}
                <div className="p-4 border-t border-purple-500/20 bg-black/20 backdrop-blur-sm relative overflow-hidden">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50 animate-pulse" />
                    
                    {!isCollapsed ? (
                        <div className="space-y-2 relative z-10">
                            <div className={cn(
                                "flex items-center space-x-2 text-xs text-slate-400 transition-all duration-500",
                                !isCollapsed ? "animate-text-slide-in animate-delay-300" : "animate-text-slide-out"
                            )}>
                                <Sparkles className="w-3 h-3 animate-pulse" />
                                <span className="hover:text-slate-300 transition-colors duration-300">Powered by NexusShop</span>
                            </div>
                            <div className={cn(
                                "flex items-center space-x-2 text-xs text-slate-500 transition-all duration-500",
                                !isCollapsed ? "animate-text-slide-in animate-delay-400" : "animate-text-slide-out"
                            )}>
                                <Shield className="w-3 h-3 animate-glow-pulse text-green-400" />
                                <span className="hover:text-slate-400 transition-colors duration-300">Secure Connection</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center relative z-10">
                            <div className="relative group">
                                <Rocket className="w-4 h-4 text-blue-400 animate-glow-pulse group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                                {/* Orbit particles around rocket */}
                                <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-particle-orbit opacity-60" />
                                <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-purple-300 rounded-full animate-particle-orbit animate-delay-200 opacity-60" />
                                <div className="absolute top-1/2 -left-2 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-particle-orbit animate-delay-300 opacity-60" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Enhanced Desktop Sidebar */}
            <div className={cn(
                "hidden md:block h-screen transition-all duration-500 ease-in-out relative z-30",
                isCollapsed ? "w-20" : "w-72",
                isCollapsed ? "animate-sidebar-collapse" : "animate-sidebar-expand"
            )}>
                <SidebarContent />
                
                {/* Glow effect on the edge when expanded */}
                <div className={cn(
                    "absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/30 to-transparent transition-opacity duration-500",
                    !isCollapsed ? "opacity-100" : "opacity-0"
                )} />
            </div>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={cn(
                "md:hidden fixed left-0 top-0 h-full w-72 transform transition-transform duration-300 ease-in-out z-50",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </div>
        </>
    );
}

// Mobile menu button component
export function MobileMenuButton() {
    const { isMobileOpen, setMobileOpen } = useSidebar();

    return (
        <button
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
        >
            {isMobileOpen ? (
                <X className="w-5 h-5 text-white" />
            ) : (
                <Menu className="w-5 h-5 text-white" />
            )}
        </button>
    );
}
