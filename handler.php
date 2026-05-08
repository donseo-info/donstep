<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$TG_TOKEN   = '7829202060:AAE-m0M-m0YzwjMm9-jaBtzs8KPO02ilLFI';
$TG_CHAT_ID = '-4271766800';
$TG_URL     = "https://api.telegram.org/bot{$TG_TOKEN}/sendMessage";
$LOG_FILE   = __DIR__ . '/uploads/leads.log';

function tg(string $text): void {
    global $TG_URL, $TG_CHAT_ID;
    $payload = json_encode(['chat_id' => $TG_CHAT_ID, 'text' => $text, 'parse_mode' => 'HTML']);
    $ch = curl_init($TG_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
    ]);
    curl_exec($ch);
    curl_close($ch);
}

function log_lead(array $data): void {
    global $LOG_FILE;
    $line = date('Y-m-d H:i:s') . ' | ' . json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    @file_put_contents($LOG_FILE, $line, FILE_APPEND);
}

function clean(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) $data = $_POST;

$type  = clean($data['type']  ?? 'unknown');
$phone = clean($data['phone'] ?? '');
$name  = clean($data['name']  ?? '');
$email = clean($data['email'] ?? '');

$lead = array_merge(['type' => $type, 'time' => date('Y-m-d H:i:s')], $data);
log_lead($lead);

// Формируем сообщение для TG
$lines = ["🔔 <b>Новая заявка</b> — {$type}"];
if ($name)  $lines[] = "👤 Имя: {$name}";
if ($phone) $lines[] = "📞 Телефон: {$phone}";
if ($email) $lines[] = "✉️ Email: {$email}";

// Доп. поля из квиза
$fields = ['age' => 'Возраст', 'level' => 'Уровень', 'directions' => 'Направления', 'time' => 'Время', 'messengers' => 'Мессенджер'];
foreach ($fields as $key => $label) {
    if (!empty($data[$key])) {
        $val = is_array($data[$key]) ? implode(', ', $data[$key]) : $data[$key];
        $lines[] = "📌 {$label}: " . clean($val);
    }
}

tg(implode("\n", $lines));

echo json_encode(['ok' => true]);
