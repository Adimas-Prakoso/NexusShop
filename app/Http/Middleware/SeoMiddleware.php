<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\View;

class SeoMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only process HTML responses
        if (!$response->headers->has('Content-Type') || 
            !str_contains($response->headers->get('Content-Type'), 'text/html')) {
            return $response;
        }

        // Get current route and page info
        $route = $request->route();
        $path = $request->path();
        
        // Define SEO data for different pages
        $seoData = $this->getSeoData($path, $route);
        
        // Share SEO data with the view
        View::share('pageSeo', $seoData);

        return $response;
    }

    /**
     * Get SEO data based on current page
     */
    private function getSeoData(string $path, $route): array
    {
        $baseUrl = config('app.url');
        
        $seoData = [
            'title' => 'NexusShop - Digital Top-Up Platform',
            'description' => 'NexusShop is your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers. Fast, secure, and reliable service 24/7.',
            'keywords' => 'digital top-up, game credits, mobile credit, internet packages, Mobile Legends, PUBG, Free Fire, Genshin Impact, digital vouchers, online payment, gaming top-up',
            'og_title' => 'NexusShop - Fast & Secure Digital Top-Up Services',
            'og_description' => 'Top-up games, mobile credit, and internet packages instantly. Trusted by 2M+ customers with 24/7 support.',
            'og_image' => $baseUrl . '/logo.png',
            'og_url' => $baseUrl . '/' . $path,
            'twitter_title' => 'NexusShop - Your Digital Top-Up Solution',
            'twitter_description' => 'Instant top-up for games, mobile credit & internet. Join 2M+ satisfied customers. Fast, secure, reliable.',
            'twitter_image' => $baseUrl . '/logo.png',
            'canonical' => $baseUrl . '/' . $path,
            'structured_data' => null,
        ];

        // Page-specific SEO data
        switch ($path) {
            case '':
            case '/':
                $seoData['title'] = 'NexusShop - Digital Top-Up Platform for Games, Mobile Credit & Internet';
                $seoData['description'] = 'NexusShop is your ultimate digital top-up platform for games like Mobile Legends, PUBG, Free Fire, mobile credit for all operators, internet packages, and digital vouchers. Fast, secure, and reliable service 24/7.';
                $seoData['keywords'] = 'digital top-up, game credits, mobile credit, internet packages, Mobile Legends, PUBG, Free Fire, Genshin Impact, digital vouchers, online payment, gaming top-up, top-up platform';
                $seoData['structured_data'] = $this->getOrganizationStructuredData();
                break;

            case 'products':
                $seoData['title'] = 'Digital Top-Up Services - Game Credits, Mobile Credit & Internet Packages';
                $seoData['description'] = 'Browse our comprehensive range of digital top-up services including game credits for Mobile Legends, PUBG, Free Fire, mobile credit for all operators, and internet packages. Instant delivery guaranteed.';
                $seoData['keywords'] = 'game top-up, mobile credit top-up, internet packages, digital vouchers, Mobile Legends diamonds, PUBG UC, Free Fire diamonds, gaming credits';
                $seoData['structured_data'] = $this->getProductStructuredData();
                break;

            case 'products/social/instagram':
                $seoData['title'] = 'Instagram Followers, Likes & Views - Buy Instagram Services';
                $seoData['description'] = 'Buy Instagram followers, likes, views, and comments at the best prices. Instant delivery, real accounts, and 24/7 support. Boost your Instagram presence today.';
                $seoData['keywords'] = 'Instagram followers, Instagram likes, Instagram views, Instagram comments, buy Instagram services, Instagram growth';
                break;

            case 'products/social/facebook':
                $seoData['title'] = 'Facebook Likes, Followers & Page Services - Buy Facebook Services';
                $seoData['description'] = 'Buy Facebook likes, followers, page likes, and comments. Real accounts, instant delivery, and affordable prices. Grow your Facebook presence with our services.';
                $seoData['keywords'] = 'Facebook likes, Facebook followers, Facebook page likes, Facebook comments, buy Facebook services';
                break;

            case 'products/social/tiktok':
                $seoData['title'] = 'TikTok Followers, Likes & Views - Buy TikTok Services';
                $seoData['description'] = 'Buy TikTok followers, likes, views, and shares. Real accounts, instant delivery, and competitive prices. Boost your TikTok presence and reach more viewers.';
                $seoData['keywords'] = 'TikTok followers, TikTok likes, TikTok views, TikTok shares, buy TikTok services, TikTok growth';
                break;

            case 'products/social/youtube':
                $seoData['title'] = 'YouTube Subscribers, Views & Likes - Buy YouTube Services';
                $seoData['description'] = 'Buy YouTube subscribers, views, likes, and comments. Real accounts, instant delivery, and affordable prices. Grow your YouTube channel with our services.';
                $seoData['keywords'] = 'YouTube subscribers, YouTube views, YouTube likes, YouTube comments, buy YouTube services';
                break;

            case 'login':
                $seoData['title'] = 'Login - NexusShop Digital Top-Up Platform';
                $seoData['description'] = 'Login to your NexusShop account to access digital top-up services, manage orders, and view your transaction history.';
                $seoData['keywords'] = 'login, sign in, account access, user login';
                break;

            case 'register':
                $seoData['title'] = 'Register - Join NexusShop Digital Top-Up Platform';
                $seoData['description'] = 'Create your NexusShop account to start using our digital top-up services. Fast registration, secure account, and instant access to all services.';
                $seoData['keywords'] = 'register, sign up, create account, new user registration';
                break;

            case 'tos':
                $seoData['title'] = 'Terms of Service - NexusShop';
                $seoData['description'] = 'Read NexusShop terms of service and user agreement. Learn about our policies, user rights, and service terms for digital top-up platform.';
                $seoData['keywords'] = 'terms of service, user agreement, terms and conditions, legal terms';
                break;

            case 'order/create':
                $seoData['title'] = 'Create Order - Digital Top-Up Services';
                $seoData['description'] = 'Create a new order for digital top-up services. Choose from our wide range of games, mobile credit, and internet packages. Secure payment processing.';
                $seoData['keywords'] = 'create order, digital top-up order, game top-up order, mobile credit order';
                break;
        }

        return $seoData;
    }

    /**
     * Get Organization structured data
     */
    private function getOrganizationStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'NexusShop',
            'url' => config('app.url'),
            'logo' => config('app.url') . '/logo.png',
            'description' => 'Your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers.',
            'foundingDate' => '2023',
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'telephone' => '+62-(812)-9141-0009',
                'contactType' => 'customer service',
                'availableLanguage' => ['English', 'Indonesian']
            ],
            'sameAs' => [
                'https://facebook.com/nexusshop',
                'https://twitter.com/nexusshop',
                'https://instagram.com/nexusshop'
            ]
        ];
    }

    /**
     * Get Product structured data
     */
    private function getProductStructuredData(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'ItemList',
            'name' => 'Digital Top-Up Services',
            'description' => 'Comprehensive range of digital top-up services',
            'itemListElement' => [
                [
                    '@type' => 'Service',
                    'name' => 'Game Credits',
                    'description' => 'Top-up credits for popular games like Mobile Legends, PUBG, Free Fire, Genshin Impact'
                ],
                [
                    '@type' => 'Service',
                    'name' => 'Mobile Credit',
                    'description' => 'Mobile credit top-up for all major operators in Indonesia'
                ],
                [
                    '@type' => 'Service',
                    'name' => 'Internet Packages',
                    'description' => 'Data packages for all major internet providers'
                ],
                [
                    '@type' => 'Service',
                    'name' => 'Digital Vouchers',
                    'description' => 'Digital vouchers for Google Play, App Store, Steam, Netflix and more'
                ]
            ]
        ];
    }
} 