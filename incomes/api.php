<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../accounts/db_config.php';

$database = new Database();
$db = $database->getConnection();

$requestMethod = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($requestMethod) {
    case 'GET':
        if ($id) {
            getIncome($id);
        } else {
            getAllIncomes();
        }
        break;
    case 'POST':
        createIncome();
        break;
    case 'PUT':
        updateIncome($id);
        break;
    case 'DELETE':
        deleteIncome($id);
        break;
    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}

// GET all incomes
function getAllIncomes() {
    global $db;
    $query = "SELECT id, account, category, amount, description, DATE_FORMAT(date, '%Y-%m-%d') as date FROM incomes WHERE 1=1";
    $params = array();

    // Handle filters from query parameters
    if (isset($_GET['account']) && !empty($_GET['account'])) {
        $query .= " AND account = :account";
        $params[':account'] = $_GET['account'];
    }

    if (isset($_GET['category']) && !empty($_GET['category'])) {
        $query .= " AND category = :category";
        $params[':category'] = $_GET['category'];
    }

    if (isset($_GET['startDate']) && !empty($_GET['startDate'])) {
        $query .= " AND date >= :startDate";
        $params[':startDate'] = $_GET['startDate'];
    }

    if (isset($_GET['endDate']) && !empty($_GET['endDate'])) {
        $query .= " AND date <= :endDate";
        $params[':endDate'] = $_GET['endDate'];
    }

    $stmt = $db->prepare($query);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    $stmt->execute();
    $incomes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($incomes);
}

// GET a single income
function getIncome($id) {
    global $db;
    $query = "SELECT id, account, category, amount, description, DATE_FORMAT(date, '%Y-%m-%d') as date FROM incomes WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $income = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($income) {
        echo json_encode($income);
    } else {
        echo json_encode(["message" => "Income not found"]);
    }
}

// POST (create) a new income
function createIncome() {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->account) && !empty($data->amount)) {
        $query = "INSERT INTO incomes (account, category, amount, description, date) VALUES (:account, :category, :amount, :description, :date)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":account", $data->account);
        $stmt->bindParam(":category", $data->category);
        $stmt->bindParam(":amount", $data->amount);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":date", $data->date);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Income created successfully"]);
        } else {
            echo json_encode(["message" => "Unable to create income"]);
        }
    } else {
        echo json_encode(["message" => "Incomplete data"]);
    }
}

// PUT (update) an income
function updateIncome($id) {
    global $db;
    $data = json_decode(file_get_contents("php://input"));

    if (!empty($id)) {
        $query = "UPDATE incomes SET account = :account, category = :category, amount = :amount, description = :description, date = :date WHERE id = :id";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":account", $data->account);
        $stmt->bindParam(":category", $data->category);
        $stmt->bindParam(":amount", $data->amount);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":date", $data->date);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Income updated successfully"]);
        } else {
            echo json_encode(["message" => "Unable to update income"]);
        }
    } else {
        echo json_encode(["message" => "ID not provided"]);
    }
}

// DELETE an income
function deleteIncome($id) {
    global $db;
    if (!empty($id)) {
        $query = "DELETE FROM incomes WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Income deleted successfully"]);
        } else {
            echo json_encode(["message" => "Unable to delete income"]);
        }
    } else {
        echo json_encode(["message" => "ID not provided"]);
    }
} 