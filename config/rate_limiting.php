<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains rate limiting configurations for different routes
    | and IP addresses to prevent abuse and bot scanning.
    |
    */

    'defaults' => [
        'attempts' => 60,
        'decay_minutes' => 1,
    ],

    'routes' => [
        // General web routes
        'web' => [
            'attempts' => 60,
            'decay_minutes' => 1,
        ],

        // API routes
        'api' => [
            'attempts' => 30,
            'decay_minutes' => 1,
        ],

        // Authentication routes
        'auth' => [
            'attempts' => 5,
            'decay_minutes' => 15,
        ],

        // Admin routes
        'admin' => [
            'attempts' => 10,
            'decay_minutes' => 5,
        ],

        // Order creation
        'order' => [
            'attempts' => 10,
            'decay_minutes' => 1,
        ],

        // Payment webhooks
        'webhook' => [
            'attempts' => 100,
            'decay_minutes' => 1,
        ],
    ],

    'suspicious_patterns' => [
        // IP addresses that show suspicious behavior
        'blocked_ips' => [
            // Add IPs here if needed
        ],

        // User agents to block
        'blocked_user_agents' => [
            'bot', 'crawler', 'spider', 'scanner', 'probe',
            'masscan', 'nmap', 'sqlmap', 'nikto', 'dirb',
            'gobuster', 'wfuzz', 'dirbuster', 'wpscan',
            'w3af', 'nessus', 'openvas', 'acunetix',
            'burp', 'zap', 'skipfish', 'arachni'
        ],

        // Paths that indicate scanning
        'suspicious_paths' => [
            'wp-admin', 'wp-login', 'wp-content', 'wp-includes',
            'admin', 'administrator', 'filemanager', 'info.php',
            'shell.php', 'backdoor.php', 'cgi-bin', 'phpmyadmin'
        ],
    ],

    'response_codes' => [
        'too_many_requests' => 429,
        'forbidden' => 403,
        'not_found' => 404,
    ],

    'logging' => [
        'enabled' => true,
        'level' => 'warning',
        'channel' => 'security',
    ],
]; 