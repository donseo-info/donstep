<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$TG_TOKEN   = '7829202060:AAE-m0M-m0YzwjMm9-jaBtzs8KPO02ilLFI';
$TG_CHAT_ID = '-4271766800';
$TG_URL     = "https://api.telegram.org/bot{$TG_TOKEN}/sendMessage";

// >>> CRM: настройки интеграции
$CRM_BASE    = 'https://stat.donstep.com';            // без слэша на конце
$CRM_API_URL = $CRM_BASE . '/api/leads/create';
$CRM_API_KEY = '100001';                              // ВРЕМЕННО. После деплоя новой версии CRM — заменить на новый ключ
$CRM_SOURCE  = 3;                                     // Источник лида: 3 = Контекстная реклама
// <<< CRM

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

// >>> CRM: отправка лида в CRM. Возвращает ['ok'=>bool, 'lead_id'=>int|null, 'error'=>string|null]
function crm(array $data): array {
    global $CRM_API_URL, $CRM_API_KEY;
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'error' => 'curl not available'];
    }
    $payload = json_encode($data, JSON_UNESCAPED_UNICODE);
    $ch = curl_init($CRM_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'API-KEY: ' . $CRM_API_KEY],
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
    if (!is_array($decoded) || empty($decoded['success']) || empty($decoded['lead_id'])) {
        return ['ok' => false, 'error' => $resp];
    }
    return ['ok' => true, 'lead_id' => (int)$decoded['lead_id'], 'is_unique' => $decoded['is_unique'] ?? null];
}
// <<< CRM

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

// >>> CRM: «сырое» значение (в CRM шлём чистый текст, без HTML-сущностей)
function clean_raw(string $v): string {
    return strip_tags(trim($v));
}
// <<< CRM

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

// Лог — независимо от TG и CRM (включая трекинг — чтобы не терять при сбоях)
$lead    = array_merge(['type' => $type, 'time' => date('Y-m-d H:i:s')], $data);
$logged  = log_lead($lead);
if (!$logged) {
    log_error("log_lead failed — check uploads/ permissions. data: " . json_encode($lead, JSON_UNESCAPED_UNICODE));
}

// >>> CRM: формируем комментарий из доп. полей квиза
$extra_fields = ['age' => 'Возраст', 'level' => 'Уровень', 'directions' => 'Направления', 'time' => 'Время', 'messengers' => 'Мессенджер'];

$crm_comment_parts = ["Заявка с лендинга: {$type}"];
foreach ($extra_fields as $key => $label) {
    if (!empty($data[$key])) {
        $val = is_array($data[$key]) ? implode(', ', $data[$key]) : $data[$key];
        $crm_comment_parts[] = "{$label}: " . clean_raw((string)$val);
    }
}

// Метки трафика: то, что прислал лендинг + серверные ip/ua/referrer
$tracking = (isset($data['tracking']) && is_array($data['tracking'])) ? $data['tracking'] : [];
$tracking['ip']         = $_SERVER['REMOTE_ADDR'] ?? '';
$tracking['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
if (empty($tracking['referrer'])) {
    $tracking['referrer'] = $_SERVER['HTTP_REFERER'] ?? '';
}

$crm_payload = [
    'name'                     => clean_raw($data['name'] ?? '') ?: "Заявка с лендинга ({$type})",
    'phone'                    => clean_raw($data['phone'] ?? ''),
    'email'                    => clean_raw($data['email'] ?? ''),
    'lead_source_id'           => $CRM_SOURCE, // 3 = Контекстная реклама
    'communication_channel_id' => 2,           // Заявка
    'comment'                  => implode("\n", $crm_comment_parts),
    'tracking'                 => $tracking,
];

$crm_result = crm($crm_payload);
if (!$crm_result['ok']) {
    log_error("crm failed: " . ($crm_result['error'] ?? 'unknown'));
}
// <<< CRM

// TG — независимо от лога
$lines = ["🔔 <b>Новая заявка</b> — {$type}"];
if ($name)  $lines[] = "👤 Имя: {$name}";
if ($phone) $lines[] = "📞 Телефон: {$phone}";
if ($email) $lines[] = "✉️ Email: {$email}";

foreach ($extra_fields as $key => $label) {
    if (!empty($data[$key])) {
        $val = is_array($data[$key]) ? implode(', ', $data[$key]) : $data[$key];
        $lines[] = "📌 {$label}: " . clean($val);
    }
}

// >>> CRM: источник трафика в сообщение (если есть метки)
if (!empty($tracking['utm_source']) || !empty($tracking['utm_campaign'])) {
    $src = clean((string)($tracking['utm_source'] ?? ''));
    $camp = clean((string)($tracking['utm_campaign'] ?? ''));
    $lines[] = "📈 Источник: {$src}" . ($camp ? " / кампания {$camp}" : "");
}

// Ссылка на созданный лид в CRM либо пометка об ошибке
if ($crm_result['ok']) {
    $leadUrl = $CRM_BASE . '/leads/view/' . $crm_result['lead_id'];
    $lines[] = "🔗 <a href=\"{$leadUrl}\">Лид в CRM #{$crm_result['lead_id']}</a>";
} else {
    $lines[] = "⚠️ error connect crm";
}
// <<< CRM

$tg_result = tg(implode("\n", $lines));
if (!$tg_result['ok']) {
    log_error("tg failed: " . ($tg_result['error'] ?? 'unknown'));
}

echo json_encode([
    'ok'      => true,
    'logged'  => $logged,
    'tg'      => $tg_result['ok'],
    'crm'     => $crm_result['ok'],
    'lead_id' => $crm_result['lead_id'] ?? null,
]);
