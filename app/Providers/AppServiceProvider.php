<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Share common SEO data with all views
        View::composer('*', function ($view) {
            $view->with('seo', [
                'site_name' => 'NexusShop',
                'site_description' => 'Your ultimate digital top-up platform for games, mobile credit, internet packages, and digital vouchers.',
                'site_url' => URL::to('/'),
                'site_image' => URL::to('/logo.png'),
                'twitter_handle' => '@nexusshop',
                'facebook_app_id' => env('FACEBOOK_APP_ID', ''),
            ]);
        });

        // SEO Blade directives
        Blade::directive('seoTitle', function ($expression) {
            return "<?php echo '<title>' . e($expression) . ' - ' . config('app.name', 'NexusShop') . '</title>'; ?>";
        });

        Blade::directive('seoDescription', function ($expression) {
            return "<?php echo '<meta name=\"description\" content=\"' . e($expression) . '\">'; ?>";
        });

        Blade::directive('seoKeywords', function ($expression) {
            return "<?php echo '<meta name=\"keywords\" content=\"' . e($expression) . '\">'; ?>";
        });

        Blade::directive('ogTag', function ($expression) {
            return "<?php echo '<meta property=\"og:' . e($expression) . '\">'; ?>";
        });

        Blade::directive('twitterCard', function ($expression) {
            return "<?php echo '<meta name=\"twitter:' . e($expression) . '\">'; ?>";
        });

        // Canonical URL helper
        Blade::directive('canonical', function ($expression) {
            return "<?php echo '<link rel=\"canonical\" href=\"' . URL::to($expression) . '\">'; ?>";
        });

        // JSON-LD structured data helper
        Blade::directive('jsonLd', function ($expression) {
            return "<?php echo '<script type=\"application/ld+json\">' . json_encode($expression) . '</script>'; ?>";
        });

        // Force HTTPS in production only
        if (config('app.force_https') && app()->environment('production')) {
            URL::forceScheme('https');
        }
        
        // For local development, ensure HTTP is used
        if (app()->environment('local') || app()->environment('development')) {
            URL::forceScheme('http');
        }
    }
}
