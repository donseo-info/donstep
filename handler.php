<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$TG_TOKEN   = '7829202060:AAE-m0M-m0YzwjMm9-jaBtzs8KPO02ilLFI';
$TG_CHAT_ID = '-4271766800';
$TG_URL     = "https://api.telegram.org/bot{$TG_TOKEN}/sendMessage";
$UPLOAD_DIR = __DIR__ . '/uploads';
$LOG_FILE   = $UPLOAD_DIR . '/leads.log';
$ERR_FILE   = $UPLOAD_DIR . '/errors.log';

if (!is_dir($UPLOAD_DIR)) {
    @mkdir($UPLOAD_DIR, 0755, true);
}

function tg(string $text): array {
    global $TG_URL, $TG_CHAT_ID;
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'error' => 'curl not available'];
    }
    $payload = json_encode(['chat_id' => $TG_CHAT_ID, 'text' => $text, 'parse_mode' => 'HTML']);
    $ch = curl_init($TG_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
    ]);
    $resp  = curl_exec($ch);
    $errno = curl_errno($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($errno) {
        return ['ok' => false, 'error' => "curl #{$errno}: {$error}"];
    }
    $decoded = json_decode($resp, true);
    if (!isset($decoded['ok']) || !$decoded['ok']) {
        return ['ok' => false, 'error' => $resp];
    }
    return ['ok' => true];
}

function log_lead(array $data): bool {
    global $LOG_FILE;
    $line = date('Y-m-d H:i:s') . ' | ' . json_encode($data, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    return @file_put_contents($LOG_FILE, $line, FILE_APPEND) !== false;
}

function log_error(string $msg): void {
    global $ERR_FILE;
    $line = date('Y-m-d H:i:s') . ' | ' . $msg . PHP_EOL;
    @file_put_contents($ERR_FILE, $line, FILE_APPEND);
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

// Лог — независимо от TG
$lead    = array_merge(['type' => $type, 'time' => date('Y-m-d H:i:s')], $data);
$logged  = log_lead($lead);
if (!$logged) {
    log_error("log_lead failed — check uploads/ permissions. data: " . json_encode($lead, JSON_UNESCAPED_UNICODE));
}

// TG — независимо от лога
$lines = ["🔔 <b>Новая заявка</b> — {$type}"];
if ($name)  $lines[] = "👤 Имя: {$name}";
if ($phone) $lines[] = "📞 Телефон: {$phone}";
if ($email) $lines[] = "✉️ Email: {$email}";

$fields = ['age' => 'Возраст', 'level' => 'Уровень', 'directions' => 'Направления', 'time' => 'Время', 'messengers' => 'Мессенджер'];
foreach ($fields as $key => $label) {
    if (!empty($data[$key])) {
        $val = is_array($data[$key]) ? implode(', ', $data[$key]) : $data[$key];
        $lines[] = "📌 {$label}: " . clean($val);
    }
}

$tg_result = tg(implode("\n", $lines));
if (!$tg_result['ok']) {
    log_error("tg failed: " . ($tg_result['error'] ?? 'unknown'));
}

echo json_encode(['ok' => true, 'logged' => $logged, 'tg' => $tg_result['ok']]);
