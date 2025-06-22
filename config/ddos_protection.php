<?php

return [
    /*
    |--------------------------------------------------------------------------
    | DDoS Protection Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains DDoS protection configurations to prevent
    | various types of DDoS attacks on your Laravel application.
    |
    */

    'enabled' => env('DDOS_PROTECTION_ENABLED', true),

    'limits' => [
        // General request limits
        'requests_per_minute' => env('DDOS_REQUESTS_PER_MINUTE', 100),
        'requests_per_hour' => env('DDOS_REQUESTS_PER_HOUR', 1000),
        
        // Specific method limits
        'post_requests_per_minute' => env('DDOS_POST_REQUESTS_PER_MINUTE', 50),
        'get_requests_per_minute' => env('DDOS_GET_REQUESTS_PER_MINUTE', 200),
        
        // Path-specific limits
        'same_path_requests_per_minute' => env('DDOS_SAME_PATH_REQUESTS_PER_MINUTE', 30),
        
        // Concurrent connections
        'max_concurrent_connections' => env('DDOS_MAX_CONCURRENT_CONNECTIONS', 10),
    ],

    'blocking' => [
        // Block duration in seconds
        'block_duration' => env('DDOS_BLOCK_DURATION', 3600), // 1 hour
        
        // Auto-unblock after duration
        'auto_unblock' => env('DDOS_AUTO_UNBLOCK', true),
        
        // Whitelist IPs (never blocked)
        'whitelist_ips' => [
            // Add trusted IPs here
            '127.0.0.1',
            '::1',
        ],
        
        // Blacklist IPs (always blocked)
        'blacklist_ips' => [
            // Add known malicious IPs here
        ],
    ],

    'detection' => [
        // Suspicious patterns to detect
        'suspicious_headers' => [
            'X-Forwarded-For' => ['127.0.0.1', 'localhost', '::1'],
            'X-Real-IP' => ['127.0.0.1', 'localhost', '::1'],
            'X-Originating-IP' => ['127.0.0.1', 'localhost', '::1'],
            'CF-Connecting-IP' => ['127.0.0.1', 'localhost', '::1'],
        ],
        
        'suspicious_payloads' => [
            'eval(', 'exec(', 'system(', 'shell_exec(',
            'base64_decode(', 'gzinflate(', 'str_rot13(',
            'javascript:', 'vbscript:', 'onload=',
            'union select', 'drop table', 'insert into',
            'script>', '<iframe', 'javascript:alert(',
        ],
        
        'suspicious_user_agents' => [
            'bot', 'crawler', 'spider', 'scanner', 'probe',
            'masscan', 'nmap', 'sqlmap', 'nikto', 'dirb',
            'gobuster', 'wfuzz', 'dirbuster', 'wpscan',
            'w3af', 'nessus', 'openvas', 'acunetix',
            'burp', 'zap', 'skipfish', 'arachni',
            'ddos', 'flood', 'attack', 'hack'
        ],
    ],

    'logging' => [
        'enabled' => env('DDOS_LOGGING_ENABLED', true),
        'level' => env('DDOS_LOG_LEVEL', 'critical'),
        'channel' => env('DDOS_LOG_CHANNEL', 'security'),
        
        // Log events
        'log_events' => [
            'ddos_detected' => true,
            'ip_blocked' => true,
            'rate_limit_exceeded' => true,
            'suspicious_request' => true,
        ],
    ],

    'cloudflare_integration' => [
        'enabled' => env('CLOUDFLARE_INTEGRATION_ENABLED', true),
        
        // Trust Cloudflare headers
        'trust_cloudflare_headers' => [
            'CF-Connecting-IP',
            'CF-IPCountry',
            'CF-Ray',
            'CF-Visitor',
        ],
        
        // Use Cloudflare IP ranges
        'cloudflare_ip_ranges' => [
            '173.245.48.0/20',
            '103.21.244.0/22',
            '103.22.200.0/22',
            '103.31.4.0/22',
            '141.101.64.0/18',
            '108.162.192.0/18',
            '190.93.240.0/20',
            '188.114.96.0/20',
            '197.234.240.0/22',
            '198.41.128.0/17',
            '162.158.0.0/15',
            '104.16.0.0/13',
            '104.24.0.0/14',
            '172.64.0.0/13',
            '131.0.72.0/22',
        ],
    ],

    'response_codes' => [
        'ddos_detected' => 503, // Service Unavailable
        'rate_limit_exceeded' => 429, // Too Many Requests
        'ip_blocked' => 403, // Forbidden
        'suspicious_request' => 400, // Bad Request
    ],

    'cache' => [
        'driver' => env('DDOS_CACHE_DRIVER', 'redis'),
        'prefix' => env('DDOS_CACHE_PREFIX', 'ddos_protection:'),
        'ttl' => env('DDOS_CACHE_TTL', 3600), // 1 hour
    ],
]; 