<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://127.0.0.1:8788");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$pdo = new PDO(
    "mysql:host=localhost;dbname=media_tracker;charset=utf8",
    "root",
    ""
);

$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION["user_id"];

$data = json_decode(file_get_contents("php://input"), true);

// GET
if ($method === "GET") {

    $stmt = $pdo->prepare("SELECT * FROM games WHERE user_id=? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

// POST
if ($method === "POST") {

    $stmt = $pdo->prepare("
        INSERT INTO games (user_id, title, status, platform, image, link, rating, review)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $user_id,
        $data["title"],
        $data["status"],
        $data["platform"],
        $data["image"],
        $data["link"],
        intval($data["rating"]),
        $data["review"]
    ]);

    echo json_encode(["success" => true]);
    exit;
}

// DELETE
if ($method === "DELETE") {

    $stmt = $pdo->prepare("DELETE FROM games WHERE id=? AND user_id=?");
    $stmt->execute([$data["id"], $user_id]);

    echo json_encode(["success" => true]);
    exit;
}

// PUT
if ($method === "PUT") {

    $stmt = $pdo->prepare("
        UPDATE games SET
            title=?, status=?, platform=?, image=?, link=?, rating=?, review=?
        WHERE id=? AND user_id=?
    ");

    $stmt->execute([
        $data["title"],
        $data["status"],
        $data["platform"],
        $data["image"],
        $data["link"],
        intval($data["rating"]),
        $data["review"],
        $data["id"],
        $user_id
    ]);

    echo json_encode(["success" => true]);
    exit;
}