<?php
$requestUri = $_SERVER['REQUEST_URI'];
$filePath = parse_url($requestUri, PHP_URL_PATH);
$file = __DIR__ . $filePath;

// If accessing /api/leads.php or any api script
if (strpos($filePath, '/api/') === 0 && file_exists($file)) {
    require $file;
    exit;
}

// Serve static assets with strict, accurate MIME types
if (file_exists($file) && is_file($file)) {
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    
    switch ($extension) {
        case 'js':
        case 'mjs':
            header('Content-Type: application/javascript; charset=UTF-8');
            break;
        case 'css':
            header('Content-Type: text/css; charset=UTF-8');
            break;
        case 'html':
            header('Content-Type: text/html; charset=UTF-8');
            break;
        case 'json':
            header('Content-Type: application/json; charset=UTF-8');
            break;
        case 'svg':
            header('Content-Type: image/svg+xml');
            break;
        case 'png':
            header('Content-Type: image/png');
            break;
        case 'jpg':
        case 'jpeg':
            header('Content-Type: image/jpeg');
            break;
        case 'ico':
            header('Content-Type: image/x-icon');
            break;
        case 'woff2':
            header('Content-Type: font/woff2');
            break;
        case 'woff':
            header('Content-Type: font/woff');
            break;
        case 'ttf':
            header('Content-Type: font/ttf');
            break;
        case 'xml':
            header('Content-Type: application/xml');
            break;
        case 'txt':
            header('Content-Type: text/plain');
            break;
        case 'zip':
            header('Content-Type: application/zip');
            break;
        default:
            header('Content-Type: application/octet-stream');
            break;
    }
    
    header('Access-Control-Allow-Origin: *');
    header('Cache-Control: public, max-age=31536000, immutable');
    readfile($file);
    exit;
}

// Single Page Application Fallback: Serve app.html
header('Content-Type: text/html; charset=UTF-8');
if (file_exists(__DIR__ . '/app.html')) {
    readfile(__DIR__ . '/app.html');
} elseif (file_exists(__DIR__ . '/index.html')) {
    readfile(__DIR__ . '/index.html');
} else {
    echo "Website đang khởi động...";
}
exit;
