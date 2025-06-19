import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginProps {
    errors?: {
        email?: string;
        password?: string;
        login?: string;
    };
}

export default function Login({ errors = {} }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic client-side validation
        if (!data.email || !data.password) {
            return;
        }
        
        post('/control-panel/login', {
            preserveState: false,
            preserveScroll: false,
            replace: true,
            onSuccess: () => {
                // Form submission successful, redirect will be handled by server
                console.log('Login successful');
            },
            onError: (errors) => {
                console.log('Login errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title="Control Panel - Command Center">
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <link rel="shortcut icon" href="/favicon.ico" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-950 relative overflow-hidden">
                {/* Animated Stars Background */}
                <div className="absolute inset-0">
                    <div className="stars"></div>
                    <div className="stars2"></div>
                    <div className="stars3"></div>
                </div>
                
                {/* Animated Cosmic Nebula */}
                <div className="absolute inset-0">
                    <div className="nebula nebula-1"></div>
                    <div className="nebula nebula-2"></div>
                    <div className="nebula nebula-3"></div>
                    <div className="nebula nebula-4"></div>
                    <div className="nebula nebula-5"></div>
                </div>
                
                {/* Floating Planets - More scattered across screen */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-sm animate-float-slow" />
                <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-sm animate-float-reverse" />
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-500/25 to-orange-500/25 rounded-full blur-sm animate-float-fast" />
                <div className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-sm animate-float-medium" />
                <div className="absolute bottom-32 left-1/4 w-28 h-28 bg-gradient-to-br from-red-500/25 to-orange-500/25 rounded-full blur-sm animate-float-slow-reverse" />
                <div className="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-sm animate-float-fast-reverse" />
                
                {/* Cosmic Rays - Enhanced */}
                <div className="absolute inset-0">
                    <div className="cosmic-ray cosmic-ray-1"></div>
                    <div className="cosmic-ray cosmic-ray-2"></div>
                    <div className="cosmic-ray cosmic-ray-3"></div>
                    <div className="cosmic-ray cosmic-ray-4"></div>
                    <div className="cosmic-ray cosmic-ray-5"></div>
                </div>

                {/* Shooting Stars */}
                <div className="absolute inset-0">
                    <div className="shooting-star shooting-star-1"></div>
                    <div className="shooting-star shooting-star-2"></div>
                    <div className="shooting-star shooting-star-3"></div>
                </div>

                {/* Matrix Rain Effect */}
                <div className="absolute inset-0 opacity-10">
                    <div className="matrix-rain"></div>
                </div>

                {/* Split Screen Layout */}
                <div className="flex min-h-screen lg:flex-row flex-col">
                    {/* Left Side - Branding and Visual Effects */}
                    <div className="flex-1 hidden lg:flex flex-col justify-center items-center p-4 lg:p-8 relative min-h-[50vh] lg:min-h-screen">
                        {/* Logo/Header with Enhanced Holographic Effect */}
                        <div className="text-center mb-12 animate-fade-in-up relative z-10">
                            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-110 transition-all duration-500 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 via-blue-400/50 to-cyan-400/50 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                                <img 
                                    src="/logo.png" 
                                    alt="Nexus Logo" 
                                    className="w-16 h-16 relative z-10 drop-shadow-2xl object-contain filter brightness-0 invert" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                            </div>
                            <h1 className="text-4xl lg:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
                                NEXUS
                            </h1>
                            <h2 className="text-xl lg:text-3xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
                                COMMAND CENTER
                            </h2>
                            <p className="text-base lg:text-xl text-cyan-300 font-light tracking-wide mb-6">
                                ◦ QUANTUM ADMIN ACCESS ◦
                            </p>
                            <div className="flex justify-center space-x-3 mb-8">
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-300"></div>
                                <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-700"></div>
                            </div>

                            {/* System Status Display */}
                            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/30 max-w-md mx-auto">
                                <div className="space-y-4 text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-mono text-sm">SYSTEM STATUS</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-green-400 font-mono text-xs">ONLINE</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-mono text-sm">SECURITY LEVEL</span>
                                        <span className="text-yellow-400 font-mono text-xs">MAXIMUM</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-cyan-300 font-mono text-sm">QUANTUM SHIELD</span>
                                        <span className="text-cyan-400 font-mono text-xs">ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Holographic Earth */}
                        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-green-500/20 animate-spin-slow border border-cyan-400/30 backdrop-blur-sm">
                            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600/30 to-green-600/30 animate-spin-reverse-slow">
                                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-700/40 to-green-700/40"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
                        <div className="w-full max-w-lg relative z-10">
                            {/* Login Form */}
                            <div className="bg-black/20 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 lg:p-10 border border-cyan-400/30 animate-slide-up-delayed relative overflow-hidden group">
                                {/* Holographic Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                                
                                {/* Scan Lines Effect */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="scan-line"></div>
                                </div>

                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                                        AUTHORIZATION REQUIRED
                                    </h3>
                                    <p className="text-cyan-300/70 font-mono text-sm">Enter quantum credentials to proceed</p>
                                </div>

                                {errors.login && (
                                    <div className="mb-8 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm animate-shake">
                                        <p className="text-red-300 text-sm flex items-center">
                                            <Lock className="w-4 h-4 mr-2" />
                                            {errors.login}
                                        </p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Email Field */}
                                    <div className="group">
                                        <label htmlFor="email" className="block text-sm font-semibold text-cyan-200 mb-3 tracking-wide">
                                            EMAIL ADDRESS
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full pl-12 pr-4 py-4 bg-black/20 border-2 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition-all duration-300 text-white placeholder-cyan-400/50 backdrop-blur-sm font-mono ${
                                                    errors.email 
                                                        ? 'border-red-400/50 bg-red-500/10' 
                                                        : 'border-cyan-400/30 hover:border-cyan-300/50 focus:bg-black/30'
                                                }`}
                                                placeholder="quantum.admin@nexus.space"
                                                required
                                            />
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="group">
                                        <label htmlFor="password" className="block text-sm font-semibold text-cyan-200 mb-3 tracking-wide">
                                            QUANTUM PASSWORD
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full pl-12 pr-14 py-4 bg-black/20 border-2 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-300 transition-all duration-300 text-white placeholder-cyan-400/50 backdrop-blur-sm font-mono ${
                                                    errors.password 
                                                        ? 'border-red-400/50 bg-red-500/10' 
                                                        : 'border-cyan-400/30 hover:border-cyan-300/50 focus:bg-black/30'
                                                }`}
                                                placeholder="Enter quantum security code"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-cyan-400/5 rounded-r-xl transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5 text-cyan-400/70 hover:text-cyan-300 transition-colors" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-cyan-400/70 hover:text-cyan-300 transition-colors" />
                                                )}
                                            </button>
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-300 animate-fade-in">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Remember Me */}
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-cyan-400/30 rounded bg-black/20 backdrop-blur-sm"
                                            />
                                            <label htmlFor="remember" className="ml-3 block text-sm text-cyan-200 hover:text-cyan-100 transition-colors cursor-pointer font-light">
                                                Remember quantum signature for 24 hours
                                            </label>
                                        </div>
                                        
                                        {/* Session Duration Info */}
                                        <div className="bg-black/20 rounded-xl p-4 border border-cyan-400/20">
                                            <div className="flex items-center space-x-2 text-xs text-cyan-300">
                                                <div className={`w-2 h-2 rounded-full ${data.remember ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                                                <span className="font-mono">
                                                    SESSION MODE: {data.remember ? 'EXTENDED' : 'SECURE'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-cyan-400/70 mt-2 font-mono">
                                                {data.remember 
                                                    ? 'Extended quantum session with automatic neural protection' 
                                                    : 'Secure session with enhanced temporal security barriers'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-bold py-5 px-6 rounded-xl transition-all duration-300 focus:ring-4 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-cyan-400/25 transform hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden text-lg"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                                        {processing ? (
                                            <div className="flex items-center justify-center relative z-10">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                QUANTUM VERIFICATION...
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center relative z-10">
                                                <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
                                                INITIATE QUANTUM ACCESS
                                            </div>
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="my-8 flex items-center">
                                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-400/40 to-transparent"></div>
                                    <span className="mx-4 text-xs text-cyan-300 uppercase tracking-widest font-mono">NEXUS SECURE</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"></div>
                                </div>

                                {/* Admin Info */}
                                <div className="text-center text-xs text-cyan-400/70 space-y-2 font-mono">
                                    <div className="bg-black/20 rounded-lg p-3 border border-cyan-400/20">
                                        <p className="text-cyan-300 font-semibold mb-1">DEFAULT CREDENTIALS</p>
                                        <p>Email: admin@nexusshop.com</p>
                                        <p>Password: password123</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                /* Base Animations */
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                
                /* Enhanced Floating Planets Animations */
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                
                @keyframes float-slow-reverse {
                    0%, 100% { transform: translateY(0) rotate(360deg); }
                    50% { transform: translateY(-30px) rotate(180deg); }
                }
                
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(270deg); }
                }
                
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(360deg); }
                }
                
                @keyframes float-fast-reverse {
                    0%, 100% { transform: translateY(0) rotate(180deg); }
                    50% { transform: translateY(-12px) rotate(0deg); }
                }
                
                @keyframes float-reverse {
                    0%, 100% { transform: translateY(0) rotate(360deg); }
                    50% { transform: translateY(-25px) rotate(180deg); }
                }
                
                /* Enhanced Spinning Animations */
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                @keyframes spin-reverse-slow {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                
                /* Stars Animations */
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                /* Nebula Animation */
                @keyframes nebula-drift {
                    0%, 100% { transform: translateX(0) translateY(0) scale(1); }
                    25% { transform: translateX(10px) translateY(-5px) scale(1.1); }
                    50% { transform: translateX(-5px) translateY(10px) scale(0.9); }
                    75% { transform: translateX(-10px) translateY(-10px) scale(1.05); }
                }
                
                /* Enhanced Cosmic Rays Animation */
                @keyframes cosmic-pulse {
                    0%, 100% { opacity: 0.1; transform: scaleY(1); }
                    50% { opacity: 0.3; transform: scaleY(1.5); }
                }
                
                /* Shooting Stars Animation */
                @keyframes shooting {
                    0% { 
                        transform: translateX(-100px) translateY(-100px) rotate(45deg);
                        opacity: 0;
                    }
                    50% { opacity: 1; }
                    100% { 
                        transform: translateX(1000px) translateY(1000px) rotate(45deg);
                        opacity: 0;
                    }
                }
                
                /* Matrix Rain Animation */
                @keyframes matrix-fall {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
                
                /* Scan Lines Animation */
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                
                /* Apply Animations */
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out;
                }
                
                .animate-fade-in-up {
                    animation: fade-in 1.2s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out;
                }
                
                .animate-slide-up-delayed {
                    animation: slide-up 0.8s ease-out 0.3s both;
                }
                
                .animate-fade-in-delayed {
                    animation: fade-in 1s ease-out 0.6s both;
                }
                
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
                
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
                
                .animate-float-slow-reverse {
                    animation: float-slow-reverse 12s ease-in-out infinite;
                }
                
                .animate-float-medium {
                    animation: float-medium 6s ease-in-out infinite;
                }
                
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                
                .animate-float-fast-reverse {
                    animation: float-fast-reverse 5s ease-in-out infinite;
                }
                
                .animate-float-reverse {
                    animation: float-reverse 10s ease-in-out infinite;
                }
                
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                
                .animate-spin-reverse-slow {
                    animation: spin-reverse-slow 15s linear infinite;
                }
                
                /* Stars Background */
                .stars, .stars2, .stars3 {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                
                .stars::before, .stars2::before, .stars3::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                        radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                        radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
                    background-repeat: repeat;
                    background-size: 200px 100px;
                    animation: twinkle 4s ease-in-out infinite;
                }
                
                .stars2::before {
                    background-image: 
                        radial-gradient(1px 1px at 40px 50px, #fff, transparent),
                        radial-gradient(1px 1px at 90px 20px, rgba(255,255,255,0.9), transparent),
                        radial-gradient(1px 1px at 130px 50px, #eee, transparent),
                        radial-gradient(2px 2px at 160px 70px, rgba(255,255,255,0.7), transparent);
                    background-size: 250px 120px;
                    animation: twinkle 6s ease-in-out infinite reverse;
                }
                
                .stars3::before {
                    background-image: 
                        radial-gradient(1px 1px at 60px 20px, rgba(255,255,255,0.8), transparent),
                        radial-gradient(2px 2px at 120px 60px, #fff, transparent),
                        radial-gradient(1px 1px at 180px 10px, rgba(255,255,255,0.9), transparent);
                    background-size: 300px 150px;
                    animation: twinkle 3s ease-in-out infinite;
                }
                
                /* Enhanced Nebula Effects */
                .nebula {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                    pointer-events: none;
                }
                
                .nebula-1 {
                    top: 10%;
                    left: 20%;
                    width: 300px;
                    height: 200px;
                    background: radial-gradient(ellipse, rgba(138, 43, 226, 0.3) 0%, transparent 70%);
                    animation: nebula-drift 20s ease-in-out infinite;
                }
                
                .nebula-2 {
                    top: 60%;
                    right: 10%;
                    width: 250px;
                    height: 180px;
                    background: radial-gradient(ellipse, rgba(0, 191, 255, 0.2) 0%, transparent 70%);
                    animation: nebula-drift 25s ease-in-out infinite reverse;
                }
                
                .nebula-3 {
                    bottom: 20%;
                    left: 10%;
                    width: 200px;
                    height: 150px;
                    background: radial-gradient(ellipse, rgba(255, 20, 147, 0.2) 0%, transparent 70%);
                    animation: nebula-drift 18s ease-in-out infinite;
                }
                
                .nebula-4 {
                    top: 30%;
                    left: 60%;
                    width: 180px;
                    height: 120px;
                    background: radial-gradient(ellipse, rgba(255, 140, 0, 0.15) 0%, transparent 70%);
                    animation: nebula-drift 22s ease-in-out infinite;
                }
                
                .nebula-5 {
                    bottom: 40%;
                    right: 30%;
                    width: 220px;
                    height: 140px;
                    background: radial-gradient(ellipse, rgba(50, 205, 50, 0.18) 0%, transparent 70%);
                    animation: nebula-drift 28s ease-in-out infinite reverse;
                }
                
                /* Enhanced Cosmic Rays */
                .cosmic-ray {
                    position: absolute;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.3), transparent);
                    pointer-events: none;
                }
                
                .cosmic-ray-1 {
                    left: 15%;
                    animation: cosmic-pulse 3s ease-in-out infinite;
                }
                
                .cosmic-ray-2 {
                    left: 40%;
                    animation: cosmic-pulse 4s ease-in-out infinite 1s;
                }
                
                .cosmic-ray-3 {
                    right: 25%;
                    animation: cosmic-pulse 5s ease-in-out infinite 2s;
                }
                
                .cosmic-ray-4 {
                    left: 70%;
                    animation: cosmic-pulse 3.5s ease-in-out infinite 0.5s;
                }
                
                .cosmic-ray-5 {
                    right: 45%;
                    animation: cosmic-pulse 4.5s ease-in-out infinite 1.5s;
                }
                
                /* Shooting Stars */
                .shooting-star {
                    position: absolute;
                    width: 100px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
                    pointer-events: none;
                }
                
                .shooting-star-1 {
                    top: 20%;
                    animation: shooting 8s ease-in-out infinite;
                }
                
                .shooting-star-2 {
                    top: 60%;
                    animation: shooting 12s ease-in-out infinite 4s;
                }
                
                .shooting-star-3 {
                    top: 40%;
                    animation: shooting 10s ease-in-out infinite 2s;
                }
                
                /* Matrix Rain Effect */
                .matrix-rain::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        linear-gradient(180deg, transparent 70%, rgba(0, 255, 0, 0.1) 100%);
                    background-size: 20px 100px;
                    animation: matrix-fall 3s linear infinite;
                }
                
                /* Scan Lines Effect */
                .scan-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent, 
                        rgba(0, 255, 255, 0.8), 
                        rgba(0, 255, 255, 0.4), 
                        rgba(0, 255, 255, 0.8), 
                        transparent
                    );
                    animation: scan 3s linear infinite;
                    opacity: 0.6;
                }
                
                /* Additional Glow Effects */
                .group:hover .scan-line {
                    opacity: 1;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
                }
                
                /* Responsive adjustments */
                @media (max-width: 1024px) {
                    .lg\\:flex-row {
                        flex-direction: column;
                    }
                    
                    .lg\\:min-h-screen {
                        min-height: 50vh;
                    }
                    
                    .lg\\:text-8xl {
                        font-size: 4rem;
                    }
                    
                    .lg\\:text-3xl {
                        font-size: 1.5rem;
                    }
                    
                    .lg\\:p-8 {
                        padding: 1rem;
                    }
                    
                    .lg\\:p-10 {
                        padding: 1.5rem;
                    }
                }
                
                @media (max-width: 768px) {
                    .text-4xl {
                        font-size: 2.5rem;
                    }
                    
                    .text-xl {
                        font-size: 1.125rem;
                    }
                    
                    .text-base {
                        font-size: 0.875rem;
                    }
                    
                    .p-4 {
                        padding: 0.75rem;
                    }
                    
                    .space-y-8 > * + * {
                        margin-top: 1.5rem;
                    }
                    
                    .py-4 {
                        padding-top: 0.75rem;
                        padding-bottom: 0.75rem;
                    }
                    
                    .py-5 {
                        padding-top: 1rem;
                        padding-bottom: 1rem;
                    }
                }
                
                @media (max-width: 640px) {
                    .stars::before, .stars2::before, .stars3::before {
                        background-size: 150px 75px;
                    }
                    
                    .nebula-1, .nebula-2, .nebula-3, .nebula-4, .nebula-5 {
                        width: 120px;
                        height: 80px;
                    }
                    
                    .w-32 {
                        width: 6rem;
                        height: 6rem;
                    }
                    
                    .w-48 {
                        width: 8rem;
                        height: 8rem;
                    }
                    
                    .text-4xl {
                        font-size: 2rem;
                    }
                    
                    .text-xl {
                        font-size: 1rem;
                    }
                    
                    .text-2xl {
                        font-size: 1.25rem;
                    }
                    
                    .space-y-8 > * + * {
                        margin-top: 1rem;
                    }
                    
                    .mb-8 {
                        margin-bottom: 1rem;
                    }
                    
                    .mb-12 {
                        margin-bottom: 2rem;
                    }
                    
                    .floating-planets {
                        display: none;
                    }
                }
                `
            }} />
        </>
    );
}
