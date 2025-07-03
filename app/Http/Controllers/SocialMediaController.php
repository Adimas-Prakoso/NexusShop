<?php

namespace App\Http\Controllers;

use App\Services\MedanpediaService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialMediaController extends Controller
{
    protected $medanpediaService;

    public function __construct(MedanpediaService $medanpediaService)
    {
        $this->medanpediaService = $medanpediaService;
    }

    /**
     * Show social media products by category
     */
    public function show($category)
    {
        // Add debug logging
        \Illuminate\Support\Facades\Log::info('SocialMediaController::show', [
            'category' => $category,
            'route' => request()->route()->getName(),
            'url' => request()->url(),
        ]);
        
        // Get services from API based on category
        $services = $this->medanpediaService->getServicesByCategory($category);
        
        // Add debug logging for services
        \Illuminate\Support\Facades\Log::info('SocialMediaController services result', [
            'services_count' => count($services),
        ]);
        
        // Convert dash-separated category to readable title
        $categoryTitle = ucwords(str_replace('-', ' ', $category)) . ' Services';
        
        // Generate SEO-friendly description
        $categoryName = ucwords(str_replace('-', ' ', $category));
        $servicesCount = count($services);
        $description = "Buy premium {$categoryName} services with instant delivery. Choose from {$servicesCount} high-quality social media marketing services at competitive prices. 24/7 support, money-back guarantee.";
        
        // Generate keywords
        $keywords = [
            $categoryName . ' services',
            'social media marketing',
            'SMM panel',
            'social media growth',
            'buy ' . strtolower($categoryName),
            'cheap ' . strtolower($categoryName),
            'instant ' . strtolower($categoryName),
            'social media boost'
        ];

        return Inertia::render('Products/SocialMedia', [
            'category' => $category,
            'services' => $services,
            'categoryTitle' => $categoryTitle,
            'seo' => [
                'title' => "Best {$categoryTitle} - Premium Social Media Marketing | NexusShop",
                'description' => $description,
                'keywords' => implode(', ', $keywords),
                'canonical' => url("/products/social/{$category}"),
                'ogTitle' => "Premium {$categoryTitle} - Start Growing Today",
                'ogDescription' => $description,
                'ogImage' => asset('assets/images/social-media-services.jpg'),
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type' => 'Product',
                    'name' => $categoryTitle,
                    'description' => $description,
                    'brand' => [
                        '@type' => 'Brand',
                        'name' => 'NexusShop'
                    ],
                    'category' => 'Social Media Marketing Services',
                    'offers' => [
                        '@type' => 'AggregateOffer',
                        'priceCurrency' => 'IDR',
                        'lowPrice' => $servicesCount > 0 ? min(array_column($services, 'price')) : 0,
                        'highPrice' => $servicesCount > 0 ? max(array_column($services, 'price')) : 0,
                        'offerCount' => $servicesCount
                    ]
                ]
            ]
        ]);
    }

    /**
     * Search services
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        $services = $this->medanpediaService->searchServices($query);

        return response()->json([
            'services' => $services
        ]);
    }
}
