<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'medanpedia' => [
        'api_key' => env('MEDANPEDIA_APIKEY'),
        'api_id' => env('MEDANPEDIA_API_ID'),
    ],

    'midtrans' => [
        'server_key' => env('MIDTRANS_SANDBOX', true) 
            ? env('SANDBOX_MIDTRANS_SERVER_KEY') 
            : env('MIDTRANS_SERVER_KEY'),
        'client_key' => env('MIDTRANS_SANDBOX', true) 
            ? env('SANDBOX_MIDTRANS_CLIENT_KEY') 
            : env('MIDTRANS_CLIENT_KEY'),
        'sandbox_server_key' => env('SANDBOX_MIDTRANS_SERVER_KEY'),
        'sandbox_client_key' => env('SANDBOX_MIDTRANS_CLIENT_KEY'),
        'production_server_key' => env('MIDTRANS_SERVER_KEY'),
        'production_client_key' => env('MIDTRANS_CLIENT_KEY'),
        'sandbox' => env('MIDTRANS_SANDBOX', true),
        'base_url' => env('MIDTRANS_SANDBOX', true)
            ? 'https://api.sandbox.midtrans.com/v2'
            : 'https://api.midtrans.com/v2',
    ],

];
