<?php
class Database
{
    private $host = "localhost"; // Database host
    private $db_name = "expmanager"; // Your database name
    private $username = "root"; // Your database username
    private $password = ""; // Your database password
    public $conn;

    public function getConnection()
    {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
