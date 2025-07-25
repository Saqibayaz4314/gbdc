<?php
/**
 * Faculty Management
 * 
 * This file handles all faculty-related operations for the admin panel
 * including adding, updating, and deleting faculty members.
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
            addFaculty();
            break;
        case 'update':
            updateFaculty();
            break;
        case 'delete':
            deleteFaculty();
            break;
        case 'list':
            listFaculty();
            break;
        default:
            sendResponse(false, 'Invalid action');
    }
} else {
    sendResponse(false, 'Invalid request method');
}

/**
 * Add a new faculty member
 */
function addFaculty() {
    // Validate input
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $designation = filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING);
    $qualification = filter_input(INPUT_POST, 'qualification', FILTER_SANITIZE_STRING);
    $specialization = filter_input(INPUT_POST, 'specialization', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $departmentId = filter_input(INPUT_POST, 'department_id', FILTER_VALIDATE_INT);
    $joiningDate = filter_input(INPUT_POST, 'joining_date', FILTER_SANITIZE_STRING);
    $bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_STRING);
    
    // Check required fields
    if (!$name || !$designation || !$qualification || !$email || !$departmentId || !$joiningDate) {
        sendResponse(false, 'All required fields must be filled');
        return;
    }
    
    // Check if email is already used
    $existingFaculty = queryOne("SELECT id FROM faculty WHERE email = ?", [$email]);
    if ($existingFaculty) {
        sendResponse(false, 'A faculty member with this email already exists');
        return;
    }
    
    // Handle image upload
    $imagePath = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imagePath = handleImageUpload($_FILES['image'], 'faculty');
        if (!$imagePath) {
            sendResponse(false, 'Failed to upload image');
            return;
        }
    }
    
    // Insert new faculty member
    $sql = "INSERT INTO faculty (name, designation, qualification, specialization, email, phone, 
            department_id, joining_date, bio, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $result = execute($sql, [
        $name, 
        $designation, 
        $qualification, 
        $specialization, 
        $email, 
        $phone, 
        $departmentId, 
        $joiningDate, 
        $bio, 
        $imagePath
    ]);
    
    if ($result) {
        $facultyId = lastInsertId();
        
        // Get the department name for the response
        $department = queryOne("SELECT name FROM departments WHERE id = ?", [$departmentId]);
        $departmentName = $department ? $department['name'] : '';
        
        sendResponse(true, 'Faculty member added successfully', [
            'id' => $facultyId,
            'name' => $name,
            'designation' => $designation,
            'qualification' => $qualification,
            'specialization' => $specialization,
            'email' => $email,
            'phone' => $phone,
            'department_id' => $departmentId,
            'department_name' => $departmentName,
            'joining_date' => $joiningDate,
            'bio' => $bio,
            'image' => $imagePath
        ]);
    } else {
        sendResponse(false, 'Failed to add faculty member');
    }
}

/**
 * Update an existing faculty member
 */
function updateFaculty() {
    // Validate input
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $designation = filter_input(INPUT_POST, 'designation', FILTER_SANITIZE_STRING);
    $qualification = filter_input(INPUT_POST, 'qualification', FILTER_SANITIZE_STRING);
    $specialization = filter_input(INPUT_POST, 'specialization', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $departmentId = filter_input(INPUT_POST, 'department_id', FILTER_VALIDATE_INT);
    $joiningDate = filter_input(INPUT_POST, 'joining_date', FILTER_SANITIZE_STRING);
    $bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_STRING);
    
    // Check required fields
    if (!$id || !$name || !$designation || !$qualification || !$email || !$departmentId || !$joiningDate) {
        sendResponse(false, 'All required fields must be filled');
        return;
    }
    
    // Check if faculty member exists
    $existingFaculty = queryOne("SELECT image FROM faculty WHERE id = ?", [$id]);
    if (!$existingFaculty) {
        sendResponse(false, 'Faculty member not found');
        return;
    }
    
    // Check if email is already used by another faculty member
    $emailCheck = queryOne("SELECT id FROM faculty WHERE email = ? AND id != ?", [$email, $id]);
    if ($emailCheck) {
        sendResponse(false, 'Another faculty member with this email already exists');
        return;
    }
    
    // Handle image upload
    $imagePath = $existingFaculty['image'];
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $newImagePath = handleImageUpload($_FILES['image'], 'faculty');
        if ($newImagePath) {
            // Delete old image if it exists
            if ($imagePath && file_exists('../' . $imagePath)) {
                unlink('../' . $imagePath);
            }
            $imagePath = $newImagePath;
        }
    }
    
    // Update faculty member
    $sql = "UPDATE faculty SET name = ?, designation = ?, qualification = ?, specialization = ?, 
            email = ?, phone = ?, department_id = ?, joining_date = ?, bio = ?, image = ? WHERE id = ?";
    
    $result = execute($sql, [
        $name, 
        $designation, 
        $qualification, 
        $specialization, 
        $email, 
        $phone, 
        $departmentId, 
        $joiningDate, 
        $bio, 
        $imagePath, 
        $id
    ]);
    
    if ($result !== false) {
        // Get the department name for the response
        $department = queryOne("SELECT name FROM departments WHERE id = ?", [$departmentId]);
        $departmentName = $department ? $department['name'] : '';
        
        sendResponse(true, 'Faculty member updated successfully', [
            'id' => $id,
            'name' => $name,
            'designation' => $designation,
            'qualification' => $qualification,
            'specialization' => $specialization,
            'email' => $email,
            'phone' => $phone,
            'department_id' => $departmentId,
            'department_name' => $departmentName,
            'joining_date' => $joiningDate,
            'bio' => $bio,
            'image' => $imagePath
        ]);
    } else {
        sendResponse(false, 'Failed to update faculty member');
    }
}

/**
 * Delete a faculty member
 */
function deleteFaculty() {
    // Validate input
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    
    if (!$id) {
        sendResponse(false, 'Invalid faculty ID');
        return;
    }
    
    // Check if faculty member exists
    $existingFaculty = queryOne("SELECT image FROM faculty WHERE id = ?", [$id]);
    if (!$existingFaculty) {
        sendResponse(false, 'Faculty member not found');
        return;
    }
    
    // Check if faculty member is a department head
    $isDepartmentHead = queryOne("SELECT id FROM departments WHERE head_id = ?", [$id]);
    if ($isDepartmentHead) {
        sendResponse(false, 'Cannot delete faculty member because they are a department head');
        return;
    }
    
    // Delete faculty member
    $result = execute("DELETE FROM faculty WHERE id = ?", [$id]);
    
    if ($result) {
        // Delete image if it exists
        if ($existingFaculty['image'] && file_exists('../' . $existingFaculty['image'])) {
            unlink('../' . $existingFaculty['image']);
        }
        
        sendResponse(true, 'Faculty member deleted successfully');
    } else {
        sendResponse(false, 'Failed to delete faculty member');
    }
}

/**
 * List all faculty members
 */
function listFaculty() {
    $sql = "SELECT f.*, d.name as department_name 
            FROM faculty f 
            LEFT JOIN departments d ON f.department_id = d.id 
            ORDER BY f.name";
    
    $faculty = query($sql);
    
    if ($faculty !== false) {
        sendResponse(true, 'Faculty members retrieved successfully', ['faculty' => $faculty]);
    } else {
        sendResponse(false, 'Failed to retrieve faculty members');
    }
}

/**
 * Handle image upload
 * 
 * @param array $file The uploaded file data
 * @param string $folder The subfolder to store the image in
 * @return string|bool The image path on success, false on failure
 */
function handleImageUpload($file, $folder) {
    // Create upload directory if it doesn't exist
    $uploadDir = "../uploads/$folder/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate a unique filename
    $filename = uniqid() . '_' . basename($file['name']);
    $uploadPath = $uploadDir . $filename;
    
    // Check file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!in_array($file['type'], $allowedTypes)) {
        return false;
    }
    
    // Check file size (max 5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        return false;
    }
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return "uploads/$folder/$filename";
    }
    
    return false;
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