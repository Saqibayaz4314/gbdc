<?php
/**
 * Database Connection
 * 
 * This file establishes a connection to the MySQL database
 * and provides helper functions for database operations.
 */

// Database connection parameters
$db_host = 'localhost';
$db_name = 'gbdc_jacobabad';
$db_user = 'root'; // Change to your database username
$db_pass = ''; // Change to your database password

// Create database connection
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    
    // Set the PDO error mode to exception
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Set default fetch mode to associative array
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Disable emulation of prepared statements
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    // Log the error and show a friendly message
    error_log("Database Connection Error: " . $e->getMessage());
    die("Sorry, there was a problem connecting to the database. Please try again later.");
}

/**
 * Execute a query and return all results
 * 
 * @param string $sql The SQL query
 * @param array $params Parameters for the prepared statement
 * @return array The query results
 */
function query($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Query Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Execute a query and return a single row
 * 
 * @param string $sql The SQL query
 * @param array $params Parameters for the prepared statement
 * @return array|bool The first row or false on failure
 */
function queryOne($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    } catch (PDOException $e) {
        error_log("Query Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Execute an INSERT, UPDATE, or DELETE query
 * 
 * @param string $sql The SQL query
 * @param array $params Parameters for the prepared statement
 * @return int|bool Number of affected rows or false on failure
 */
function execute($sql, $params = []) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Execute Error: " . $e->getMessage());
        return false;
    }
}

/**
 * Get the ID of the last inserted row
 * 
 * @return string The last inserted ID
 */
function lastInsertId() {
    global $pdo;
    return $pdo->lastInsertId();
}

/**
 * Begin a transaction
 */
function beginTransaction() {
    global $pdo;
    return $pdo->beginTransaction();
}

/**
 * Commit a transaction
 */
function commitTransaction() {
    global $pdo;
    return $pdo->commit();
}

/**
 * Rollback a transaction
 */
function rollbackTransaction() {
    global $pdo;
    return $pdo->rollBack();
} 