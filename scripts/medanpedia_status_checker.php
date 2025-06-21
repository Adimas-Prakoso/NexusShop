<?php

/**
 * Script untuk mengecek status pesanan di Medanpedia API
 * Berdasarkan dokumentasi di check.html
 * 
 * Endpoint: https://api.medanpedia.co.id/status
 * Method: POST
 * Response: JSON
 */

class MedanpediaStatusChecker
{
    private $apiId;
    private $apiKey;
    private $baseUrl = 'https://api.medanpedia.co.id';

    public function __construct()
    {
        // Ambil credentials dari .env (sesuai dengan file .env yang ada)
        $this->apiId = '37141';
        $this->apiKey = '1irmkz-yjlbdw-oqjzvr-6v2urj-g3lj7d';
    }

    /**
     * Cek status satu pesanan
     * 
     * @param string $orderId ID pesanan yang akan dicek
     * @return array Response dari API
     */
    public function checkSingleOrder($orderId)
    {
        $url = $this->baseUrl . '/status';
        
        $data = [
            'api_id' => $this->apiId,
            'api_key' => $this->apiKey,
            'id' => $orderId
        ];

        return $this->makeRequest($url, $data);
    }

    /**
     * Cek status multiple pesanan (maksimal 50 ID)
     * 
     * @param array $orderIds Array ID pesanan yang akan dicek
     * @return array Response dari API
     */
    public function checkMultipleOrders($orderIds)
    {
        if (count($orderIds) > 50) {
            throw new Exception('Maksimal 50 ID pesanan yang bisa dicek sekaligus');
        }

        $url = $this->baseUrl . '/status';
        
        // Gabungkan ID dengan koma
        $idsString = implode(',', $orderIds);
        
        $data = [
            'api_id' => $this->apiId,
            'api_key' => $this->apiKey,
            'id' => $idsString
        ];

        return $this->makeRequest($url, $data);
    }

    /**
     * Melakukan HTTP request ke API
     */
    private function makeRequest($url, $data)
    {
        $ch = curl_init();

        curl_setopt_array($ch, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Accept: application/json'
            ],
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_FOLLOWLOCATION => true
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        
        curl_close($ch);

        if ($error) {
            throw new Exception("cURL Error: $error");
        }

        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: $httpCode - Response: $response");
        }

        $jsonResponse = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON response: ' . json_last_error_msg());
        }

        return $jsonResponse;
    }

    /**
     * Format dan tampilkan hasil status
     */
    public function displayStatus($response, $type = 'single')
    {
        echo "=== Medanpedia Order Status Check ===\n";
        echo "Time: " . date('Y-m-d H:i:s') . "\n\n";

        if ($type === 'single') {
            $this->displaySingleStatus($response);
        } else {
            $this->displayMultipleStatus($response);
        }
    }

    /**
     * Tampilkan status untuk satu pesanan
     */
    private function displaySingleStatus($response)
    {
        if ($response['status']) {
            echo "✅ Status: SUCCESS\n";
            echo "Message: " . $response['msg'] . "\n\n";
            
            if (isset($response['data'])) {
                $data = $response['data'];
                echo "📋 Order Details:\n";
                echo "   ID: " . $data['id'] . "\n";
                echo "   Status: " . $this->getStatusIcon($data['status']) . " " . $data['status'] . "\n";
                echo "   Charge: Rp " . number_format($data['charge'], 0, ',', '.') . "\n";
                echo "   Start Count: " . number_format($data['start_count'], 0, ',', '.') . "\n";
                echo "   Remains: " . number_format($data['remains'], 0, ',', '.') . "\n";
            }
        } else {
            echo "❌ Status: FAILED\n";
            echo "Message: " . $response['msg'] . "\n";
        }
    }

    /**
     * Tampilkan status untuk multiple pesanan
     */
    private function displayMultipleStatus($response)
    {
        if ($response['status']) {
            echo "✅ Status: SUCCESS\n";
            echo "Message: " . $response['msg'] . "\n\n";
            
            if (isset($response['orders'])) {
                echo "📋 Orders Status:\n";
                foreach ($response['orders'] as $orderId => $orderData) {
                    echo "\n🔹 Order ID: $orderId\n";
                    
                    if (isset($orderData['status'])) {
                        echo "   Message: " . $orderData['msg'] . "\n";
                        echo "   Status: " . $this->getStatusIcon($orderData['status']) . " " . $orderData['status'] . "\n";
                        echo "   Charge: Rp " . number_format($orderData['charge'], 0, ',', '.') . "\n";
                        echo "   Start Count: " . number_format($orderData['start_count'], 0, ',', '.') . "\n";
                        echo "   Remains: " . number_format($orderData['remains'], 0, ',', '.') . "\n";
                    } else {
                        echo "   Message: " . $orderData['msg'] . "\n";
                        echo "   Status: ❓ Not Found\n";
                    }
                }
            }
        } else {
            echo "❌ Status: FAILED\n";
            echo "Message: " . $response['msg'] . "\n";
        }
    }

    /**
     * Get icon untuk status
     */
    private function getStatusIcon($status)
    {
        $icons = [
            'Pending' => '⏳',
            'Processing' => '🔄',
            'Success' => '✅',
            'Error' => '❌',
            'Partial' => '⚠️'
        ];

        return $icons[$status] ?? '❓';
    }

    /**
     * Save response ke file JSON
     */
    public function saveResponse($response, $orderId = null)
    {
        $timestamp = date('Y-m-d_H-i-s');
        $filename = $orderId 
            ? "medanpedia_status_{$orderId}_{$timestamp}.json"
            : "medanpedia_status_multiple_{$timestamp}.json";
        
        $filepath = __DIR__ . '/' . $filename;
        
        $formatted = json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        if (file_put_contents($filepath, $formatted)) {
            echo "\n💾 Response saved to: $filename\n";
            return $filepath;
        } else {
            echo "\n❌ Failed to save response to file\n";
            return false;
        }
    }
}

// ==================== USAGE EXAMPLES ====================

function showUsage()
{
    echo "=== Medanpedia Status Checker Usage ===\n\n";
    echo "Usage:\n";
    echo "  php medanpedia_status_checker.php single <order_id>\n";
    echo "  php medanpedia_status_checker.php multiple <order_id1,order_id2,order_id3>\n";
    echo "  php medanpedia_status_checker.php test\n\n";
    echo "Examples:\n";
    echo "  php medanpedia_status_checker.php single 1107\n";
    echo "  php medanpedia_status_checker.php multiple 1107,1234,5678\n";
    echo "  php medanpedia_status_checker.php test\n\n";
}

// Main execution
if (php_sapi_name() === 'cli') {
    // Command line execution
    if ($argc < 2) {
        showUsage();
        exit(1);
    }

    $command = $argv[1];
    
    try {
        $checker = new MedanpediaStatusChecker();
        
        switch ($command) {
            case 'single':
                if (!isset($argv[2])) {
                    echo "❌ Error: Order ID required for single check\n";
                    showUsage();
                    exit(1);
                }
                
                $orderId = $argv[2];
                echo "Checking single order: $orderId\n\n";
                
                $response = $checker->checkSingleOrder($orderId);
                $checker->displayStatus($response, 'single');
                $checker->saveResponse($response, $orderId);
                break;
                
            case 'multiple':
                if (!isset($argv[2])) {
                    echo "❌ Error: Order IDs required for multiple check\n";
                    showUsage();
                    exit(1);
                }
                
                $orderIds = explode(',', $argv[2]);
                $orderIds = array_map('trim', $orderIds);
                
                echo "Checking multiple orders: " . implode(', ', $orderIds) . "\n\n";
                
                $response = $checker->checkMultipleOrders($orderIds);
                $checker->displayStatus($response, 'multiple');
                $checker->saveResponse($response);
                break;
                
            case 'test':
                echo "Running test with sample order ID...\n\n";
                
                // Test dengan ID contoh dari dokumentasi
                $response = $checker->checkSingleOrder('1107');
                $checker->displayStatus($response, 'single');
                $checker->saveResponse($response, '1107');
                break;
                
            default:
                echo "❌ Error: Unknown command '$command'\n";
                showUsage();
                exit(1);
        }
        
    } catch (Exception $e) {
        echo "❌ Error: " . $e->getMessage() . "\n";
        exit(1);
    }
} else {
    // Web execution - simple example
    try {
        $checker = new MedanpediaStatusChecker();
        
        // Contoh penggunaan di web
        if (isset($_GET['id'])) {
            $orderId = $_GET['id'];
            $response = $checker->checkSingleOrder($orderId);
            
            header('Content-Type: application/json');
            echo json_encode($response, JSON_PRETTY_PRINT);
        } else {
            echo "<h1>Medanpedia Status Checker</h1>";
            echo "<p>Add ?id=ORDER_ID to URL to check order status</p>";
            echo "<p>Example: ?id=1107</p>";
        }
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

?>
