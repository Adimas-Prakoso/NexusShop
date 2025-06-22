<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- SEO Meta Tags --}}
        <title inertia>{{ config('app.name', 'NexusShop') }} - @yield('title', 'Digital Top-Up Platform')</title>
        <meta name="description" content="@yield('description', 'NexusShop is your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers. Fast, secure, and reliable service 24/7.')">
        <meta name="keywords" content="@yield('keywords', 'digital top-up, game credits, mobile credit, internet packages, Mobile Legends, PUBG, Free Fire, Genshin Impact, digital vouchers, online payment, gaming top-up')">
        <meta name="author" content="NexusShop">
        <meta name="robots" content="index, follow">
        <meta name="googlebot" content="index, follow">
        
        {{-- Open Graph Meta Tags --}}
        <meta property="og:type" content="website">
        <meta property="og:title" content="@yield('og_title', 'NexusShop - Digital Top-Up Platform')">
        <meta property="og:description" content="@yield('og_description', 'Top-up games, mobile credit, and internet packages instantly. Trusted by 2M+ customers with 24/7 support.')">
        <meta property="og:url" content="{{ request()->url() }}">
        <meta property="og:site_name" content="NexusShop">
        <meta property="og:image" content="@yield('og_image', url('/logo.png'))">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="{{ str_replace('_', '-', app()->getLocale()) }}">
        
        {{-- Twitter Card Meta Tags --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="@yield('twitter_title', 'NexusShop - Digital Top-Up Platform')">
        <meta name="twitter:description" content="@yield('twitter_description', 'Instant top-up for games, mobile credit & internet. Join 2M+ satisfied customers. Fast, secure, reliable.')">
        <meta name="twitter:image" content="@yield('twitter_image', url('/logo.png'))">
        
        {{-- Additional SEO Meta Tags --}}
        <meta name="theme-color" content="#10b981">
        <meta name="msapplication-TileColor" content="#10b981">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="NexusShop">
        
        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ request()->url() }}">
        
        {{-- Preconnect to font server --}}
        <link rel="dns-prefetch" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Critical CSS inline for immediate rendering --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
            
            .loading-spinner {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 9999;
            }
            
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        {{-- Load fonts with display=swap for better performance --}}
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600&display=swap" rel="stylesheet" />
 
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- Loading spinner that will be removed when app loads --}}
        <div id="loading-spinner" class="loading-spinner"></div>
        
        @inertia
        
        {{-- Script to remove loading spinner when app is ready --}}
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // Remove loading spinner after a short delay
                setTimeout(function() {
                    const spinner = document.getElementById('loading-spinner');
                    if (spinner) {
                        spinner.style.opacity = '0';
                        setTimeout(() => spinner.remove(), 300);
                    }
                }, 100);
            });
        </script>
    </body>
</html>
