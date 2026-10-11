<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$adminEmail = "phamduchai6991@gmail.com";
$dataFile = __DIR__ . "/leads_database.json";

// Handle GET request to read all leads (for Admin CRM)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $jsonContent = file_get_contents($dataFile);
        $leads = json_decode($jsonContent, true);
        echo json_encode(["success" => true, "leads" => $leads ?: []]);
    } else {
        echo json_encode(["success" => true, "leads" => []]);
    }
    exit;
}

// Handle POST request to receive new lead
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents("php://input");
    $data = json_decode($rawInput, true);

    $lead = isset($data['lead']) ? $data['lead'] : $data;

    if (empty($lead) || empty($lead['fullName']) || empty($lead['phone'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu thông tin bắt buộc (Họ tên, SĐT)"]);
        exit;
    }

    // Format amounts
    $formattedAmount = number_format(floatval($lead['loanAmount'] ?? 0), 0, ',', '.') . " VNĐ";
    $formattedIncome = !empty($lead['monthlyIncome']) ? number_format(floatval($lead['monthlyIncome']), 0, ',', '.') . " VNĐ" : "Không khai báo";
    $cleanPhone = preg_replace('/[^0-9]/', '', $lead['phone'] ?? '');

    // 1. Save lead to server JSON file
    $existingLeads = [];
    if (file_exists($dataFile)) {
        $existingLeads = json_decode(file_get_contents($dataFile), true) ?: [];
    }

    // Add unique ID and timestamp if not present
    if (empty($lead['id'])) {
        $lead['id'] = "LEAD-" . rand(1000, 9999);
    }
    if (empty($lead['createdAt'])) {
        $lead['createdAt'] = date("d/m/Y H:i:s");
    }
    if (empty($lead['status'])) {
        $lead['status'] = "new";
    }

    // Prepend to top of list
    array_unshift($existingLeads, $lead);
    file_put_contents($dataFile, json_encode($existingLeads, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    // 2. Send instant Email Notification to phamduchai6991@gmail.com
    $subject = "🔥 [VAY365] Khách mới: " . $lead['fullName'] . " (" . $cleanPhone . ") - Vay " . $formattedAmount;
    
    $message = "
    <html>
    <head>
      <title>{$subject}</title>
    </head>
    <body style='font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;'>
      <div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>
        <div style='background: #059669; color: #ffffff; padding: 20px; text-align: center;'>
          <h2 style='margin: 0; font-size: 20px;'>🔔 HỒ SƠ VAY TÍN CHẤP MỚI</h2>
          <p style='margin: 5px 0 0; font-size: 13px; opacity: 0.9;'>Website: Vay365.com - Đức Hải FE</p>
        </div>
        
        <div style='padding: 24px;'>
          <table style='width: 100%; border-collapse: collapse;'>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Họ và tên:</td>
              <td style='padding: 10px 0; font-weight: bold; color: #0f172a; font-size: 16px;'>{$lead['fullName']}</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Số điện thoại:</td>
              <td style='padding: 10px 0; font-weight: bold; color: #059669; font-size: 18px;'>
                <a href='tel:{$cleanPhone}' style='color: #059669; text-decoration: none;'>📞 {$cleanPhone}</a>
              </td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Số tiền cần vay:</td>
              <td style='padding: 10px 0; font-weight: bold; color: #0f172a; font-size: 16px;'>{$formattedAmount}</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Thời hạn vay:</td>
              <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>{$lead['loanTenure']} tháng</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Gói vay / Nhu cầu:</td>
              <td style='padding: 10px 0; color: #0f172a;'>" . ($lead['loanPurposeName'] ?? $lead['loanPurpose'] ?? '') . "</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Thu nhập khai báo:</td>
              <td style='padding: 10px 0; color: #0f172a;'>{$formattedIncome}</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Khu vực / Tỉnh thành:</td>
              <td style='padding: 10px 0; font-weight: bold; color: #0f172a;'>{$lead['province']}</td>
            </tr>
            <tr style='border-bottom: 1px solid #f1f5f9;'>
              <td style='padding: 10px 0; color: #64748b; font-size: 14px;'>Ghi chú của khách:</td>
              <td style='padding: 10px 0; color: #475569; font-style: italic;'>" . ($lead['notes'] ?? $lead['note'] ?? 'Không có') . "</td>
            </tr>
            <tr>
              <td style='padding: 10px 0; color: #64748b; font-size: 13px;'>Thời gian nhận:</td>
              <td style='padding: 10px 0; color: #64748b; font-size: 13px;'>{$lead['createdAt']}</td>
            </tr>
          </table>

          <div style='margin-top: 25px; text-align: center;'>
            <a href='tel:{$cleanPhone}' style='display: inline-block; background: #059669; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin: 4px; font-size: 14px;'>
              📞 Bấm Gọi Cho Khách
            </a>
            <a href='https://zalo.me/{$cleanPhone}' style='display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin: 4px; font-size: 14px;'>
              💬 Nhắn Zalo Khách
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Vay365 He Thong <no-reply@" . $_SERVER['SERVER_NAME'] . ">\r\n";
    $headers .= "Reply-To: phamduchai6991@gmail.com\r\n";

    @mail($adminEmail, $subject, $message, $headers);

    echo json_encode([
        "success" => true,
        "message" => "Đã tiếp nhận hồ sơ và gửi thông báo tới email thành công",
        "lead" => $lead
    ]);
    exit;
}
