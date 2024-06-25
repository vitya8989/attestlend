<?php

// Включаем отображение ошибок для отладки
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Получение данных формы
$contactName = $_POST['name'] ?? '';
$contactPhone = $_POST['phone'];

// Отправка данных на email
$email_to = "vitya898989@gmail.com";
$subject = "Новая заявка с сайта";
$message = "Имя: $contactName\nТелефон: $contactPhone";

// Настройка заголовков письма
$headers = "From: no-reply@{$_SERVER['SERVER_NAME']}\r\n";
$headers .= "Reply-To: no-reply@{$_SERVER['SERVER_NAME']}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
// Отправка письма
$r = mail($email_to, $subject, $message, $headers);

// Настройки AmoCRM
$subdomain = 'pteamo'; // Замените на ваше поддоменное имя
$access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImYwYjI4ZjEwZjBjZDQ2ZmM5ZjgwODhiMmRlZTI3NjBhMTY3N2I0Y2ZkYWYyYTgyYTI4N2Y3OGFkMWVjNGMxMDRkYzQxODdjZTI5ZmIxNTUzIn0.eyJhdWQiOiIxMDZiZTBjOC05NTU0LTQ5OWMtOWFjNy0yMTZiNDI0OWZjYWUiLCJqdGkiOiJmMGIyOGYxMGYwY2Q0NmZjOWY4MDg4YjJkZWUyNzYwYTE2NzdiNGNmZGFmMmE4MmEyODdmNzhhZDFlYzRjMTA0ZGM0MTg3Y2UyOWZiMTU1MyIsImlhdCI6MTcxOTMzODMyNSwibmJmIjoxNzE5MzM4MzI1LCJleHAiOjE3MzM2MTYwMDAsInN1YiI6IjEwNzAxNDQ1IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNzQ1ODMwLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNjRiMDRkNmYtMDEwMS00N2QwLTk5NzctMmUwMTYwNDllMzhmIn0.fzYcX5g2Yb5ngIKAZB_tReV8xmlfMoPy5X0qIcLc9H2t27OytmcekcnNaB10j3AA8AjpdSnsTO9ibfXG-tQdnItCiG8iEwTtgpoORHqhXwlJcMOMjp3TQoct-sG3cHlbid0lZt6eSPm06w5gp__agZx7h5gMiV47E-_F7kKiMKjQadyzf82LFInfDitmrDe4G8EUKAbL7S1oA1pHLZa9PAZAekYMjUkroGbjjsT_l1Z6noDGbyhDrsK3vL5KsaozAZsIPYGIqRdQnvsfrsu97P3jYaQwaE7MKQtR98qjUdf4DNZHC2T9oP8NmuQ14lLkVPKpi_zCLOJy7i9nRq7xyg'; // Замените на ваш access token

$statusId = 123456;
$responsibleUserId = 78910;

// Данные с лендинга
function addLead($subdomain, $access_token, $leadName, $contactName, $leadPhone)
{
    $url = "https://$subdomain.amocrm.ru/api/v4/leads/unsorted/forms";

    $leadData = [
        [
            'source_uid' => md5(microtime(true)),
            'source_name' => 'Заявка с сайта',

            "_embedded" => [
                'leads' => [
                    [
                        'name' => $leadName,
                    ],
                ],
                "contacts" => [
                    [
                        "name" => $contactName,
                        "custom_fields_values" => [
                            [

                                "field_code" => "PHONE",
                                "values" => [
                                    "value" => [
                                        'value' => $leadPhone
                                    ]
                                ]

                            ]
                        ]
                    ]
                ]
            ],

            "metadata" => [
                "ip" => $_SERVER['REMOTE_ADDR'],
                "form_id" => md5(microtime(true)),
                "form_sent_at" => time(),
                "form_name" => "Форма заявки с сайта",
                "form_page" => $_SERVER['SERVER_NAME'],
                "referer" => $_SERVER['HTTP_REFERER'] ?? $_SERVER['SERVER_NAME']
            ]

        ]
    ];

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $access_token,
        'Content-Type: application/json'
    ]);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($leadData));

    $response = curl_exec($curl);
    if ($response === false) {
        echo 'Ошибка CURL: ' . curl_error($curl);
        curl_close($curl);
        return false;
    }

    curl_close($curl);
    return json_decode($response, true);
}

$response = addLead($subdomain, $access_token, $subject, $contactName, $contactPhone);

if ($response && isset($response['_embedded']['unsorted'])) {
    echo json_encode([
        'result' => true
    ]);
} else {
    echo json_encode([
        'result' => false
    ]);
    http_response_code(400);
}
