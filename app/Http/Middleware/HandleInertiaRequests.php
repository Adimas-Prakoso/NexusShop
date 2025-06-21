<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            // 'quote' => fn() => $this->getFormattedQuote(), // Temporarily disabled for production
            'auth' => [
                'user' => fn() => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                ] : null,
                'admin' => fn() => $request->user('admin'),
                'isAdmin' => fn() => Auth::guard('admin')->check(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ]);
    }

    public function getRandomQuote(): string
    {
        return Inspiring::quotes()->random();
    }

    public function getFormattedQuote(): array
    {
        try {
            $quote = $this->getRandomQuote();
            \Log::info('Random quote: ' . $quote);
            
            $parts = explode('-', $quote, 2);
            \Log::info('Parts count: ' . count($parts));
            \Log::info('Parts: ' . json_encode($parts));
            
            if (count($parts) === 2) {
                return [
                    'message' => trim($parts[0]),
                    'author' => trim($parts[1])
                ];
            } else {
                // If no dash found, treat the entire quote as the message
                return [
                    'message' => trim($quote),
                    'author' => 'Unknown'
                ];
            }
        } catch (\Exception $e) {
            \Log::error('Error in getFormattedQuote: ' . $e->getMessage());
            // Fallback quote in case of any error
            return [
                'message' => 'The only way to do great work is to love what you do.',
                'author' => 'Steve Jobs'
            ];
        }
    }
}
