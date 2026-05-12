<?php

session_start();
header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "media_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB error"]);
    exit;
}

$user_id = $_SESSION["user_id"];

// 🔥 récupérer Steam ID depuis la DB
$res = $conn->query("SELECT steam_id FROM users WHERE id=$user_id");
$user = $res->fetch_assoc();

if (!$user || !$user["steam_id"]) {
    echo json_encode(["error" => "No Steam ID set"]);
    exit;
}

$steamId = $user["steam_id"];

$apiKey = "783A99D50004151DF6ABA2F762EE91D9";

$url = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=$apiKey&steamid=$steamId&include_appinfo=true&include_played_free_games=true";

$response = file_get_contents($url);

if (!$response) {
    echo json_encode(["error" => "Steam API failed"]);
    exit;
}

$data = json_decode($response, true);

if (!isset($data["response"]["games"])) {
    echo json_encode(["error" => "No games found"]);
    exit;
}

$imported = 0;

foreach ($data["response"]["games"] as $game) {

    $appid = $game["appid"];
    $title = $conn->real_escape_string($game["name"]);
    $playtime = intval($game["playtime_forever"] / 60);

    $image = "https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/$appid/header.jpg";
    $link = "https://store.steampowered.com/app/$appid";

    $status = $playtime > 0 ? "En cours" : "Wishlist";

    // éviter doublon PAR USER
    $check = $conn->query("
        SELECT id FROM games 
        WHERE steam_appid=$appid AND user_id=$user_id
    ");

    if ($check && $check->num_rows > 0) continue;

    $result = $conn->query("
    INSERT INTO games (
        user_id,
        steam_appid,
        title,
        status,
        platform,
        playtime,
        image,
        link
    ) VALUES (
        $user_id,
        $appid,
        '$title',
        '$status',
        'Steam',
        $playtime,
        '$image',
        '$link'
    )
");

if (!$result) {
    echo json_encode([
        "error" => "SQL ERROR",
        "sql_error" => $conn->error,
        "appid" => $appid
    ]);
    exit;
}

    $imported++;
}

echo json_encode([
    "success" => true,
    "imported" => $imported
]);