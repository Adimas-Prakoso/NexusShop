<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\URL;
use Carbon\Carbon;

class GenerateSitemap extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sitemap:generate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate sitemap.xml for the website';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Generating sitemap...');

        $sitemap = $this->generateSitemap();
        
        $path = public_path('sitemap.xml');
        File::put($path, $sitemap);

        $this->info('Sitemap generated successfully at: ' . $path);
        
        return Command::SUCCESS;
    }

    /**
     * Generate the sitemap XML content
     */
    private function generateSitemap(): string
    {
        $baseUrl = config('app.url');
        $now = Carbon::now()->toISOString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . "\n";
        $xml .= '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' . "\n";
        $xml .= '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . "\n\n";

        // Define pages with their SEO data
        $pages = [
            [
                'url' => '/',
                'lastmod' => $now,
                'changefreq' => 'daily',
                'priority' => '1.0',
                'image' => '/logo.png',
                'image_title' => 'NexusShop - Digital Top-Up Platform'
            ],
            [
                'url' => '/products',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.9',
                'image' => '/assets/images/mlbb.png',
                'image_title' => 'Game Top-Up Services'
            ],
            [
                'url' => '/products/social/instagram',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ],
            [
                'url' => '/products/social/facebook',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ],
            [
                'url' => '/products/social/tiktok',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ],
            [
                'url' => '/products/social/youtube',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ],
            [
                'url' => '/login',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.5'
            ],
            [
                'url' => '/register',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.5'
            ],
            [
                'url' => '/profile',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.4'
            ],
            [
                'url' => '/orders',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.4'
            ],
            [
                'url' => '/order/create',
                'lastmod' => $now,
                'changefreq' => 'weekly',
                'priority' => '0.6'
            ],
            [
                'url' => '/tos',
                'lastmod' => $now,
                'changefreq' => 'monthly',
                'priority' => '0.3'
            ]
        ];

        // Generate URL entries
        foreach ($pages as $page) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . $baseUrl . $page['url'] . '</loc>' . "\n";
            $xml .= '    <lastmod>' . $page['lastmod'] . '</lastmod>' . "\n";
            $xml .= '    <changefreq>' . $page['changefreq'] . '</changefreq>' . "\n";
            $xml .= '    <priority>' . $page['priority'] . '</priority>' . "\n";
            
            // Add image if specified
            if (isset($page['image'])) {
                $xml .= '    <image:image>' . "\n";
                $xml .= '      <image:loc>' . $baseUrl . $page['image'] . '</image:loc>' . "\n";
                $xml .= '      <image:title>' . $page['image_title'] . '</image:title>' . "\n";
                $xml .= '    </image:image>' . "\n";
            }
            
            $xml .= '  </url>' . "\n\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
} 