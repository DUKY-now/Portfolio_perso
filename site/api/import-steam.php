<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://media.local");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$apiKey = "783A99D50004151DF6ABA2F762EE91D9";
$steamId = $_SESSION["steam_id"];

$conn = new mysqli("localhost", "root", "", "media_tracker");

$url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=$apiKey&steamid=$steamId&include_appinfo=true";

$response = file_get_contents($url);
$data = json_decode($response, true);

if (!isset($data["response"]["games"])) {
    echo json_encode(["error" => "No games"]);
    exit;
}

$user_id = $_SESSION["user_id"];
$imported = 0;

foreach ($data["response"]["games"] as $game) {

    $appid = $game["appid"];

    $check = $conn->query("SELECT id FROM games WHERE steam_appid=$appid AND user_id=$user_id");

    if ($check->num_rows > 0) continue;

    $conn->query("
        INSERT INTO games (user_id, steam_appid, title, status, platform, playtime, image, link)
        VALUES (
            $user_id,
            $appid,
            '" . $conn->real_escape_string($game["name"]) . "',
            'Wishlist',
            'Steam',
            0,
            '',
            ''
        )
    ");

    $imported++;
}

echo json_encode([
    "success" => true,
    "imported" => $imported
]);