<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class SecurityMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for suspicious paths that are commonly scanned by bots
        if ($this->isSuspiciousRequest($request)) {
            Log::warning('Suspicious request blocked', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'path' => $request->path(),
                'method' => $request->method()
            ]);
            
            return response('', 404);
        }

        return $next($request);
    }

    /**
     * Check if the request is suspicious
     */
    private function isSuspiciousRequest(Request $request): bool
    {
        $path = $request->path();
        $userAgent = $request->userAgent() ?? '';
        
        // Whitelist legitimate routes that might get falsely flagged
        $whitelistedPaths = [
            'products/social/instagram',
            'products/social/facebook',
            'products/social/twitter',
            'products/social/youtube',
            'products/social/tiktok',
            'products/social/telegram',
            'products/social/linkedin',
            'products/social/spotify',
            'products/social/soundcloud',
            'products/social/twitch',
            'products/social/discord',
            'products/social/reddit',
        ];

        // If path is in whitelist, it's not suspicious
        foreach ($whitelistedPaths as $whitelistedPath) {
            if (str_starts_with($path, $whitelistedPath)) {
                return false;
            }
        }
        
        // Whitelist order-related paths using regex pattern matching
        if (preg_match('#^order/ORD-[A-Z0-9]+(/payment|/status|/check-status|/mark-as-paid)?$#', $path)) {
            return false;
        }
        
        // Whitelist other application routes
        $otherSafePaths = [
            'order/create',
            'order/store',
            'profile',
            'login',
            'register',
            'logout',
            'products',
            'tos',
        ];
        
        foreach ($otherSafePaths as $safePath) {
            if (str_starts_with($path, $safePath)) {
                return false;
            }
        }
        
        // List of suspicious paths commonly scanned by bots
        $suspiciousPaths = [
            // WordPress related
            'wp-admin', 'wp-login', 'wp-content', 'wp-includes', 'wp-config',
            'wp-mail', 'wp-trackback', 'wp-cron', 'wp-links',
            
            // Common admin paths
            'admin', 'administrator', 'manage', 'management',
            
            // File manager paths
            'filemanager', 'fm', 'file', 'upload', 'uploads',
            
            // Common vulnerable files
            'info.php', 'phpinfo', 'test.php', 'shell.php', 'backdoor.php',
            'config.php', 'wp-config.php', 'configuration.php',
            
            // CMS specific
            'joomla', 'drupal', 'magento', 'opencart', 'prestashop',
            
            // Server info
            'server-status', 'server-info', 'status', 'info',
            
            // Common attack vectors
            'cgi-bin', 'cgi', 'bin', 'tmp', 'temp',
            
            // Backup files
            'backup', 'bak', 'old', 'backup-temp',
            
            // Well-known directories
            'well-known', 'acme-challenge', 'pki-validation',
            
            // Common plugin paths
            'plugins', 'modules', 'components', 'extensions',
            
            // Common theme paths
            'themes', 'templates', 'skins', 'layouts',
            
            // Database related
            'phpmyadmin', 'mysql', 'database', 'db',
            
            // Common shell files
            'shell', 'cmd', 'command', 'exec', 'system',
            
            // Common backdoor patterns
            'alfa-rex', 'xmrlpc', 'chosen', 'parx', 'muse',
            'wso112233', 'classwithtostring', 'mah', 'ty', 'ini',
            'default', 'manager', 'radio', 'moon', 'gecko',
            'cong', 'bs1', 'max', 'simple', '0x', 'fw', '13',
            'ok', 'user', 'edit', 'readme', 'doc', 'buy',
            'lock', 'browse', 'shell20211028', 'goat1', 'lmfi2',
            'gel4y', 'byp', '1', 'x', 'css', 'js', 'images',
            'assets', 'admin', 'cgi-bin', 'include', 'upload',
            'files', 'content', 'configs', 'wp-configs', 'wp-conflg',
            'atomlib', 'owlmailer', 'mini', 'blue', 'cloud',
            'packed', 'siteindex', 'pwnd', 'mar', 'rnEPv9',
            '3luaO', '423_index', 'vuln', 'rk2', 'taptap-null',
            'esyfvxgmdq', 'Core32', 'zmFM', 'DaoZM', 'alfanew',
            'lv', 'cc', 'jp', 'm', 'up', 'bak', 'json', 'link',
            'function', 'about', 'index', 'item', 'content',
            'network', 'chosen', 'parx', 'muse', 'wso112233',
            'classwithtostring', 'mah', 'ty', 'ini', 'default',
            'manager', 'radio', 'moon', 'gecko', 'cong', 'bs1',
            'max', 'simple', '0x', 'fw', '13', 'ok', 'user',
            'edit', 'readme', 'doc', 'buy', 'lock', 'browse',
            'shell20211028', 'goat1', 'lmfi2', 'gel4y', 'byp',
            '1', 'x', 'css', 'js', 'images', 'assets', 'admin',
            'cgi-bin', 'include', 'upload', 'files', 'content',
            'configs', 'wp-configs', 'wp-conflg', 'atomlib',
            'owlmailer', 'mini', 'blue', 'cloud', 'packed',
            'siteindex', 'pwnd', 'mar', 'rnEPv9', '3luaO',
            '423_index', 'vuln', 'rk2', 'taptap-null', 'esyfvxgmdq',
            'Core32', 'zmFM', 'DaoZM', 'alfanew', 'lv', 'cc',
            'jp', 'm', 'up', 'bak', 'json', 'link', 'function',
            'about', 'index', 'item', 'content', 'network'
        ];

        // Check if path contains any suspicious patterns
        foreach ($suspiciousPaths as $suspiciousPath) {
            if (str_contains(strtolower($path), strtolower($suspiciousPath))) {
                return true;
            }
        }

        // Check for suspicious User-Agent patterns
        $suspiciousUserAgents = [
            'bot', 'crawler', 'spider', 'scanner', 'probe',
            'masscan', 'nmap', 'sqlmap', 'nikto', 'dirb',
            'gobuster', 'wfuzz', 'dirbuster', 'wpscan',
            'w3af', 'nessus', 'openvas', 'acunetix',
            'burp', 'zap', 'skipfish', 'arachni'
        ];

        foreach ($suspiciousUserAgents as $suspiciousUA) {
            if (str_contains(strtolower($userAgent), strtolower($suspiciousUA))) {
                return true;
            }
        }

        // Check for requests with suspicious query parameters
        $suspiciousParams = ['eval', 'exec', 'system', 'shell', 'cmd', 'backdoor'];
        foreach ($suspiciousParams as $param) {
            if ($request->has($param)) {
                return true;
            }
        }

        return false;
    }
} 