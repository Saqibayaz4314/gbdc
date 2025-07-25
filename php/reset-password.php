<?php
// Database connection
$servername = "localhost";
$username = "root"; // Change to your database username
$password = ""; // Change to your database password
$dbname = "gbdc_jacobabad";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $token = mysqli_real_escape_string($conn, $_POST['token']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate passwords
    if (empty($password) || empty($confirm_password)) {
        header("Location: ../reset-password.html?token=$token&error=empty_fields");
        exit();
    }
    
    if ($password !== $confirm_password) {
        header("Location: ../reset-password.html?token=$token&error=passwords_dont_match");
        exit();
    }
    
    if (strlen($password) < 8) {
        header("Location: ../reset-password.html?token=$token&error=password_too_short");
        exit();
    }
    
    // Check if token exists and is valid
    $sql = "SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expiry > NOW()";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        // Token is valid
        $row = $result->fetch_assoc();
        $student_id = $row['student_id'];
        
        // Hash the new password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Update the student's password
        $sql = "UPDATE students SET password = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $hashed_password, $student_id);
        
        if ($stmt->execute()) {
            // Mark the token as used
            $sql = "UPDATE password_resets SET used = 1 WHERE token = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $token);
            $stmt->execute();
            
            // Redirect to login page with success message
            header("Location: ../login.html?success=password_reset");
            exit();
        } else {
            // Password update failed
            header("Location: ../reset-password.html?token=$token&error=update_failed");
            exit();
        }
    } else {
        // Invalid or expired token
        header("Location: ../forgot-password.html?error=invalid_token");
        exit();
    }
    
    $stmt->close();
} else {
    // If not a POST request, redirect to forgot password page
    header("Location: ../forgot-password.html");
    exit();
}

$conn->close();
?> 