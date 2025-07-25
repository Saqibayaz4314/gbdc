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
    // Get the identifier (roll number or username)
    $identifier = mysqli_real_escape_string($conn, $_POST['identifier']);
    
    // Check if the identifier exists in the database
    $sql = "SELECT * FROM students WHERE roll_number = ? OR username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $identifier, $identifier);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        // User found
        $row = $result->fetch_assoc();
        $student_id = $row['id'];
        $email = $row['email'];
        $name = $row['name'];
        
        // Check if email exists
        if (empty($email)) {
            // No email found
            header("Location: ../forgot-password.html?error=no_email");
            exit();
        }
        
        // Generate a unique token
        $token = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        // Store the token in the database
        $sql = "INSERT INTO password_resets (student_id, token, expiry) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $student_id, $token, $expiry);
        $stmt->execute();
        
        // Send email with reset link
        // Note: This is a placeholder. In a real application, you would use a proper email sending library
        $reset_link = "http://localhost/reset-password.html?token=" . $token;
        $to = $email;
        $subject = "Password Reset - Government Boys Degree College Jacobabad";
        $message = "
        <html>
        <head>
            <title>Password Reset</title>
        </head>
        <body>
            <p>Dear $name,</p>
            <p>We received a request to reset your password for your student account at Government Boys Degree College Jacobabad.</p>
            <p>To reset your password, please click on the link below:</p>
            <p><a href='$reset_link'>Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Regards,<br>Administration<br>Government Boys Degree College Jacobabad</p>
        </body>
        </html>
        ";
        
        // Always set content-type when sending HTML email
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= "From: noreply@gbdcjacobabad.edu.pk" . "\r\n";
        
        // Send email
        // mail($to, $subject, $message, $headers);
        
        // For demo purposes, we'll just redirect to a success page
        // In a real application, you would send the actual email
        header("Location: ../forgot-password-sent.html");
        exit();
    } else {
        // User not found
        header("Location: ../forgot-password.html?error=user_not_found");
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