<?php

session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://media.local");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "", "media_tracker");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB error"]);
    exit;
}

$action = $_GET["action"] ?? "";

// REGISTER
if ($action === "register") {

    $data = json_decode(file_get_contents("php://input"), true);

    $username = $conn->real_escape_string($data["username"]);
    $email = $conn->real_escape_string($data["email"]);
    $password = password_hash($data["password"], PASSWORD_DEFAULT);

    $check = $conn->query("SELECT id FROM users WHERE email='$email'");

    if ($check->num_rows > 0) {
        echo json_encode(["error" => "Email déjà utilisé"]);
        exit;
    }

    $conn->query("
        INSERT INTO users (username, email, password)
        VALUES ('$username', '$email', '$password')
    ");

    echo json_encode(["success" => true]);
    exit;
}

// LOGIN
if ($action === "login") {

    $data = json_decode(file_get_contents("php://input"), true);

    $email = $conn->real_escape_string($data["email"]);
    $password = $data["password"];

    $result = $conn->query("SELECT * FROM users WHERE email='$email'");
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user["password"])) {
        echo json_encode(["error" => "Invalid"]);
        exit;
    }

    $_SESSION["user_id"] = $user["id"];

    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user["id"],
            "username" => $user["username"]
        ]
    ]);
    exit;
}

// LOGOUT
if ($action === "logout") {
    session_destroy();
    echo json_encode(["success" => true]);
    exit;
}

// ME
if ($action === "me") {

    if (!isset($_SESSION["user_id"])) {
        echo json_encode(["logged" => false]);
        exit;
    }

    $id = $_SESSION["user_id"];

    $res = $conn->query("SELECT id, username FROM users WHERE id=$id");
    $user = $res->fetch_assoc();

    echo json_encode([
        "logged" => true,
        "user" => $user
    ]);
    exit;
}

// UPDATE STEAM ID
if ($action === "update_steam") {

    $data = json_decode(file_get_contents("php://input"), true);

    $steam = $conn->real_escape_string($data["steam_id"]);
    $user_id = $_SESSION["user_id"];

    $conn->query("
        UPDATE users 
        SET steam_id='$steam' 
        WHERE id=$user_id
    ");

    echo json_encode(["success" => true]);
    exit;
}