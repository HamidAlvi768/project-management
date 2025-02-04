<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_config.php';

$database = new Database();
$db = $database->getConnection();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($requestMethod) {
    case 'GET':
        if ($id) {
            getAccount($id);
        } else {
            getAllAccounts();
        }
        break;
    case 'POST':
        createAccount();
        break;
    case 'PUT':
        updateAccount($id);
        break;
    case 'DELETE':
        deleteAccount($id);
        break;
    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}

// GET all accounts
function getAllAccounts() {
    global $db;
    $query = "SELECT * FROM accounts WHERE 1=1";
    $params = array();

    // Handle filters from query parameters
    if (isset($_GET['account_type']) && !empty($_GET['account_type'])) {
        $query .= " AND account_type = :account_type";
        $params[':account_type'] = $_GET['account_type'];
    }

    if (isset($_GET['account_title']) && !empty($_GET['account_title'])) {
        $query .= " AND account_title LIKE :account_title";
        $params[':account_title'] = '%' . $_GET['account_title'] . '%';
    }

    if (isset($_GET['min_balance']) && !empty($_GET['min_balance'])) {
        $query .= " AND balance >= :min_balance";
        $params[':min_balance'] = $_GET['min_balance'];
    }

    if (isset($_GET['max_balance']) && !empty($_GET['max_balance'])) {
        $query .= " AND balance <= :max_balance";
        $params[':max_balance'] = $_GET['max_balance'];
    }

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($accounts);
}

// GET a single account
function getAccount($id) {
    global $db;
    $query = "SELECT * FROM accounts WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $account = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($account) {
        echo json_encode($account);
    } else {
        echo json_encode(["message" => "Account not found"]);
    }
}

// POST (create) a new account
function createAccount() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->account_title) && !empty($data->account_type)) {
        $query = "INSERT INTO accounts (account_title, account_type, deposit, balance, withdrawal, total, notes) VALUES (:account_title, :account_type, :deposit, :balance, :withdrawal, :total, :notes)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":account_title", $data->account_title);
        $stmt->bindParam(":account_type", $data->account_type);
        $stmt->bindParam(":deposit", $data->deposit);
        $stmt->bindParam(":balance", $data->balance);
        $stmt->bindParam(":withdrawal", $data->withdrawal);
        $stmt->bindParam(":total", $data->total);
        $stmt->bindParam(":notes", $data->notes);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Account created successfully"]);
        } else {
            echo json_encode(["message" => "Unable to create account"]);
        }
    } else {
        echo json_encode(["message" => "Incomplete data"]);
    }
}

// PUT (update) an account
function updateAccount($id) {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($id)) {
        $query = "UPDATE accounts SET account_title = :account_title, account_type = :account_type, deposit = :deposit, balance = :balance, withdrawal = :withdrawal, total = :total, notes = :notes WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":account_title", $data->account_title);
        $stmt->bindParam(":account_type", $data->account_type);
        $stmt->bindParam(":deposit", $data->deposit);
        $stmt->bindParam(":balance", $data->balance);
        $stmt->bindParam(":withdrawal", $data->withdrawal);
        $stmt->bindParam(":total", $data->total);
        $stmt->bindParam(":notes", $data->notes);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Account updated successfully"]);
        } else {
            echo json_encode(["message" => "Unable to update account"]);
        }
    } else {
        echo json_encode(["message" => "ID not provided"]);
    }
}

// DELETE an account
function deleteAccount($id) {
    global $db;
    if (!empty($id)) {
        $query = "DELETE FROM accounts WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Account deleted successfully"]);
        } else {
            echo json_encode(["message" => "Unable to delete account"]);
        }
    } else {
        echo json_encode(["message" => "ID not provided"]);
    }
}
