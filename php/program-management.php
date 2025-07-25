<?php
/**
 * Program Management
 * 
 * This file handles all program-related operations for the admin panel
 * including adding, updating, and deleting programs.
 */

// Include database connection
require_once 'db-connect.php';

// Check if the user is logged in as admin
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// Handle AJAX requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    switch ($action) {
        case 'add':
            addProgram();
            break;
        case 'update':
            updateProgram();
            break;
        case 'delete':
            deleteProgram();
            break;
        case 'list':
            listPrograms();
            break;
        default:
            sendResponse(false, 'Invalid action');
    }
} else {
    sendResponse(false, 'Invalid request method');
}

/**
 * Add a new program
 */
function addProgram() {
    // Validate input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);
    $duration = filter_input(INPUT_POST, 'duration', FILTER_SANITIZE_STRING);
    $totalSeats = filter_input(INPUT_POST, 'total_seats', FILTER_VALIDATE_INT);
    $type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
    $departmentId = filter_input(INPUT_POST, 'department_id', FILTER_VALIDATE_INT);
    $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_STRING);
    
    // Check required fields
    if (!$name || !$duration || !$totalSeats || !$type || !$departmentId) {
        sendResponse(false, 'All required fields must be filled');
        return;
    }
    
    // Check if program already exists
    $existingProgram = queryOne("SELECT id FROM programs WHERE name = ?", [$name]);
    if ($existingProgram) {
        sendResponse(false, 'A program with this name already exists');
        return;
    }
    
    // Insert new program
    $sql = "INSERT INTO programs (name, description, duration, total_seats, type, department_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    $result = execute($sql, [
        $name, 
        $description, 
        $duration, 
        $totalSeats, 
        $type, 
        $departmentId, 
        $status ?: 'active'
    ]);
    
    if ($result) {
        $programId = lastInsertId();
        
        // Get the department name for the response
        $department = queryOne("SELECT name FROM departments WHERE id = ?", [$departmentId]);
        $departmentName = $department ? $department['name'] : '';
        
        sendResponse(true, 'Program added successfully', [
            'id' => $programId,
            'name' => $name,
            'description' => $description,
            'duration' => $duration,
            'total_seats' => $totalSeats,
            'type' => $type,
            'department_id' => $departmentId,
            'department_name' => $departmentName,
            'status' => $status ?: 'active'
        ]);
    } else {
        sendResponse(false, 'Failed to add program');
    }
}

/**
 * Update an existing program
 */
function updateProgram() {
    // Validate input
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $description = filter_input(INPUT_POST, 'description', FILTER_SANITIZE_STRING);
    $duration = filter_input(INPUT_POST, 'duration', FILTER_SANITIZE_STRING);
    $totalSeats = filter_input(INPUT_POST, 'total_seats', FILTER_VALIDATE_INT);
    $type = filter_input(INPUT_POST, 'type', FILTER_SANITIZE_STRING);
    $departmentId = filter_input(INPUT_POST, 'department_id', FILTER_VALIDATE_INT);
    $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_STRING);
    
    // Check required fields
    if (!$id || !$name || !$duration || !$totalSeats || !$type || !$departmentId) {
        sendResponse(false, 'All required fields must be filled');
        return;
    }
    
    // Check if program exists
    $existingProgram = queryOne("SELECT id FROM programs WHERE id = ?", [$id]);
    if (!$existingProgram) {
        sendResponse(false, 'Program not found');
        return;
    }
    
    // Check if name is already used by another program
    $nameCheck = queryOne("SELECT id FROM programs WHERE name = ? AND id != ?", [$name, $id]);
    if ($nameCheck) {
        sendResponse(false, 'Another program with this name already exists');
        return;
    }
    
    // Update program
    $sql = "UPDATE programs SET name = ?, description = ?, duration = ?, total_seats = ?, 
            type = ?, department_id = ?, status = ? WHERE id = ?";
    
    $result = execute($sql, [
        $name, 
        $description, 
        $duration, 
        $totalSeats, 
        $type, 
        $departmentId, 
        $status, 
        $id
    ]);
    
    if ($result !== false) {
        // Get the department name for the response
        $department = queryOne("SELECT name FROM departments WHERE id = ?", [$departmentId]);
        $departmentName = $department ? $department['name'] : '';
        
        sendResponse(true, 'Program updated successfully', [
            'id' => $id,
            'name' => $name,
            'description' => $description,
            'duration' => $duration,
            'total_seats' => $totalSeats,
            'type' => $type,
            'department_id' => $departmentId,
            'department_name' => $departmentName,
            'status' => $status
        ]);
    } else {
        sendResponse(false, 'Failed to update program');
    }
}

/**
 * Delete a program
 */
function deleteProgram() {
    // Validate input
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    
    if (!$id) {
        sendResponse(false, 'Invalid program ID');
        return;
    }
    
    // Check if program exists
    $existingProgram = queryOne("SELECT id FROM programs WHERE id = ?", [$id]);
    if (!$existingProgram) {
        sendResponse(false, 'Program not found');
        return;
    }
    
    // Check if program is being used by students
    $studentsUsingProgram = queryOne("SELECT COUNT(*) as count FROM students WHERE program_id = ?", [$id]);
    if ($studentsUsingProgram && $studentsUsingProgram['count'] > 0) {
        sendResponse(false, 'Cannot delete program because it is assigned to students');
        return;
    }
    
    // Check if program is being used by courses
    $coursesUsingProgram = queryOne("SELECT COUNT(*) as count FROM courses WHERE program_id = ?", [$id]);
    if ($coursesUsingProgram && $coursesUsingProgram['count'] > 0) {
        sendResponse(false, 'Cannot delete program because it has courses assigned to it');
        return;
    }
    
    // Delete program
    $result = execute("DELETE FROM programs WHERE id = ?", [$id]);
    
    if ($result) {
        sendResponse(true, 'Program deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete program');
    }
}

/**
 * List all programs
 */
function listPrograms() {
    $sql = "SELECT p.*, d.name as department_name 
            FROM programs p 
            LEFT JOIN departments d ON p.department_id = d.id 
            ORDER BY p.name";
    
    $programs = query($sql);
    
    if ($programs !== false) {
        sendResponse(true, 'Programs retrieved successfully', ['programs' => $programs]);
    } else {
        sendResponse(false, 'Failed to retrieve programs');
    }
}

/**
 * Send JSON response
 * 
 * @param bool $success Whether the operation was successful
 * @param string $message Response message
 * @param array $data Additional data to include in the response
 */
function sendResponse($success, $message, $data = []) {
    header('Content-Type: application/json');
    echo json_encode(array_merge(
        ['success' => $success, 'message' => $message],
        $data
    ));
    exit;
} 