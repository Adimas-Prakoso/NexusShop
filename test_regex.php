<?php

$paths = [
    'order/ORD-W8XXLDX0IS/payment',
    'order/ORD-VJ6QF2O0CB/payment',
    'order/ORD-123456ABCD/status',
    'order/ORD-XYZ9876543/check-status',
    'order/ORD-ABCDEFGH12/mark-as-paid',
    'order/ORD-ABCDEFGH12',
    'order/create',
    'order/store',
];

foreach ($paths as $path) {
    $result = preg_match('#^order/ORD-[A-Z0-9]+(/payment|/status|/check-status|/mark-as-paid)?$#', $path);
    echo "$path: " . ($result ? 'MATCH' : 'NO MATCH') . "\n";
}

// Also test our other safePaths pattern
$safePaths = [
    'order/create',
    'order/store',
    'profile',
    'login',
    'register',
    'logout',
    'products',
    'tos',
];

echo "\nTesting other safe paths:\n";
foreach ($paths as $path) {
    $matched = false;
    foreach ($safePaths as $safePath) {
        if (str_starts_with($path, $safePath)) {
            $matched = true;
            break;
        }
    }
    echo "$path: " . ($matched ? 'MATCH' : 'NO MATCH') . "\n";
} 