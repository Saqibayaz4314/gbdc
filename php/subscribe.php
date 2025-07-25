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
    $email = $_POST["email"];
    $date = date("Y-m-d H:i:s");
    
    // Validate email
    if (empty($email)) {
        echo "Email is required";
        exit();
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format";
        exit();
    }
    
    // Check if email already exists
    $checkSql = "SELECT * FROM newsletter_subscribers WHERE email = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows > 0) {
        echo "You are already subscribed to our newsletter!";
        exit();
    }
    
    // Insert new subscriber
    $sql = "INSERT INTO newsletter_subscribers (email, subscription_date) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $date);
    
    if ($stmt->execute()) {
        // Send confirmation email
        $to = $email;
        $subject = "Newsletter Subscription Confirmation";
        $message = "Dear Subscriber,\n\n";
        $message .= "Thank you for subscribing to the GBDC Jacobabad newsletter. You will now receive regular updates about our college events, news, and announcements.\n\n";
        $message .= "If you did not subscribe to our newsletter or wish to unsubscribe, please click on the following link:\n";
        $message .= "https://www.gbdcjacobabad.edu.pk/unsubscribe.php?email=" . urlencode($email) . "\n\n";
        $message .= "Best regards,\nGBDC Jacobabad Team";
        
        $headers = "From: info@gbdcjacobabad.edu.pk";
        
        mail($to, $subject, $message, $headers);
        
        // Redirect to thank you page
        header("Location: ../thank-you-subscription.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
    
    $stmt->close();
}

$conn->close();
?> 