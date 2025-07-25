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
    $roll_number = mysqli_real_escape_string($conn, $_POST['roll_number']);
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $first_name = mysqli_real_escape_string($conn, $_POST['first_name']);
    $last_name = mysqli_real_escape_string($conn, $_POST['last_name']);
    $father_name = mysqli_real_escape_string($conn, $_POST['father_name']);
    $cnic = mysqli_real_escape_string($conn, $_POST['cnic']);
    $email = isset($_POST['email']) ? mysqli_real_escape_string($conn, $_POST['email']) : null;
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    $date_of_birth = mysqli_real_escape_string($conn, $_POST['date_of_birth']);
    $gender = mysqli_real_escape_string($conn, $_POST['gender']);
    $program_id = mysqli_real_escape_string($conn, $_POST['program_id']);
    $semester = mysqli_real_escape_string($conn, $_POST['semester']);
    $address = mysqli_real_escape_string($conn, $_POST['address']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validation
    $errors = array();
    
    // Check if passwords match
    if ($password !== $confirm_password) {
        $errors[] = "Passwords do not match";
    }
    
    // Check if password is strong enough
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long";
    }
    
    // Check if roll number already exists
    $check_roll = "SELECT * FROM students WHERE roll_number = ?";
    $stmt = $conn->prepare($check_roll);
    $stmt->bind_param("s", $roll_number);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $errors[] = "Roll number already exists";
    }
    
    // Check if username already exists
    $check_username = "SELECT * FROM students WHERE username = ?";
    $stmt = $conn->prepare($check_username);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $errors[] = "Username already exists";
    }
    
    // If there are errors, redirect back with error messages
    if (!empty($errors)) {
        $error_string = implode("<br>", $errors);
        header("Location: ../register.html?error=" . urlencode($error_string));
        exit();
    }
    
    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Combine first and last name
    $name = $first_name . " " . $last_name;
    
    // Current date for admission date
    $admission_date = date("Y-m-d");
    
    // Insert data into database
    $sql = "INSERT INTO students (roll_number, username, password, name, father_name, cnic, date_of_birth, gender, address, phone, email, program_id, semester, admission_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssssiis", $roll_number, $username, $hashed_password, $name, $father_name, $cnic, $date_of_birth, $gender, $address, $phone, $email, $program_id, $semester, $admission_date);
    
    if ($stmt->execute()) {
        // Registration successful
        header("Location: ../login.html?success=registration_complete");
        exit();
    } else {
        // Registration failed
        header("Location: ../register.html?error=registration_failed");
        exit();
    }
    
    $stmt->close();
} else {
    // If not a POST request, redirect to registration page
    header("Location: ../register.html");
    exit();
}

$conn->close();
?> 