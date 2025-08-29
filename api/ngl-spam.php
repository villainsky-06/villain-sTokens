<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['message'])) {
    echo json_encode(['success' => false, 'error' => 'Username and message are required']);
    exit();
}

$username = trim($input['username']);
$message = trim($input['message']);

// Validate input
if (empty($username) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Username and message cannot be empty']);
    exit();
}

// Implementasi fungsi dari kode yang diberikan
function _0x1371() {
    // Kode dari screenshot yang perlu diimplementasikan
    // Untuk sementara kita gunakan simulasi
    return rand(0, 1) === 1;
}

// Simulasi pengiriman pesan dengan implementasi fungsi yang diberikan
try {
    // Panggil fungsi dari kode yang diberikan
    $result = _0x1371(); // Anda perlu menyesuaikan ini dengan implementasi sebenarnya
    
    if ($result) {
        // Simpan log
        $logMessage = date('Y-m-d H:i:s') . " - Sent to $username: $message\n";
        file_put_contents('../message_log.txt', $logMessage, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to send message']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Failed to send message: ' . $e->getMessage()]);
}
