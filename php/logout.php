<?php
// Start session
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Delete cookies if they exist
if (isset($_COOKIE['remember_token'])) {
    setcookie('remember_token', '', time() - 3600, '/');
}

if (isset($_COOKIE['student_id'])) {
    setcookie('student_id', '', time() - 3600, '/');
}

// Redirect to login page
header("Location: ../login.html");
exit();
?> 