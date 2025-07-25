<?php
// Start session
session_start();

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
    // Get user input
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];
    
    // Validate input
    if (empty($username) || empty($password)) {
        header("Location: ../login.html?error=empty_fields");
        exit();
    }
    
    // Query to check if user exists
    $sql = "SELECT * FROM students WHERE (roll_number = ? OR username = ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        
        // Verify password
        if (password_verify($password, $row['password'])) {
            // Password is correct, create session
            $_SESSION['student_id'] = $row['id'];
            $_SESSION['student_name'] = $row['first_name'] . ' ' . $row['last_name'];
            $_SESSION['roll_number'] = $row['roll_number'];
            $_SESSION['logged_in'] = true;
            
            // Remember me functionality
            if (isset($_POST['remember']) && $_POST['remember'] == 'on') {
                $token = bin2hex(random_bytes(32));
                
                // Store token in database
                $sql = "UPDATE students SET remember_token = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $token, $row['id']);
                $stmt->execute();
                
                // Set cookie for 30 days
                setcookie('remember_token', $token, time() + (86400 * 30), "/");
                setcookie('student_id', $row['id'], time() + (86400 * 30), "/");
            }
            
            // Redirect to student dashboard
            header("Location: ../student-dashboard.php");
            exit();
        } else {
            // Password is incorrect
            header("Location: ../login.html?error=invalid_password");
            exit();
        }
    } else {
        // User does not exist
        header("Location: ../login.html?error=user_not_found");
        exit();
    }
    
    $stmt->close();
} else {
    // If not a POST request, redirect to login page
    header("Location: ../login.html");
    exit();
}

$conn->close();
?> 