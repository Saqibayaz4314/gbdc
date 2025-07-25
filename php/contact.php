<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
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
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = isset($_POST["phone"]) ? $_POST["phone"] : "";
    $subject = $_POST["subject"];
    $message = $_POST["message"];
    $date = date("Y-m-d H:i:s");
    
    // Validate form data
    $errors = array();
    
    if (empty($name)) {
        $errors[] = "Name is required";
    }
    
    if (empty($email)) {
        $errors[] = "Email is required";
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    if (empty($subject)) {
        $errors[] = "Subject is required";
    }
    
    if (empty($message)) {
        $errors[] = "Message is required";
    }
    
    // If no errors, proceed with database insertion and email sending
    if (empty($errors)) {
        // Prepare and execute the SQL statement
        $sql = "INSERT INTO contact_messages (name, email, phone, subject, message, date)
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssssss", $name, $email, $phone, $subject, $message, $date);
        
        if ($stmt->execute()) {
            // Send email notification
            $to = "info@gbdcjacobabad.edu.pk";
            $emailSubject = "New Contact Form Submission: $subject";
            $emailMessage = "You have received a new contact form submission:\n\n";
            $emailMessage .= "Name: $name\n";
            $emailMessage .= "Email: $email\n";
            $emailMessage .= "Phone: $phone\n";
            $emailMessage .= "Subject: $subject\n";
            $emailMessage .= "Message: $message\n";
            
            $headers = "From: webmaster@gbdcjacobabad.edu.pk";
            
            mail($to, $emailSubject, $emailMessage, $headers);
            
            // Redirect to thank you page
            header("Location: ../thank-you.html");
            exit();
        } else {
            echo "Error: " . $stmt->error;
        }
        
        $stmt->close();
    } else {
        // Display errors
        foreach ($errors as $error) {
            echo $error . "<br>";
        }
    }
}

$conn->close();
?> 