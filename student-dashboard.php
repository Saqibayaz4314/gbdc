<?php
// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.html");
    exit();
}

// Get student information
$student_name = $_SESSION['student_name'];
$roll_number = $_SESSION['roll_number'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard - Government Boys Degree College Jacobabad</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        .dashboard-container {
            min-height: 80vh;
            padding: 50px 20px;
        }
        
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .dashboard-header h1 {
            color: var(--primary-color);
            font-size: 32px;
            margin: 0;
        }
        
        .student-info {
            display: flex;
            align-items: center;
        }
        
        .student-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 15px;
        }
        
        .student-details h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .student-details p {
            margin: 5px 0 0;
            color: #666;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        
        .dashboard-card {
            background-color: white;
            border-radius: 10px;
            box-shadow: var(--box-shadow);
            padding: 25px;
            transition: var(--transition);
        }
        
        .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        }
        
        .dashboard-card-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .dashboard-card-icon {
            width: 50px;
            height: 50px;
            border-radius: 10px;
            background-color: rgba(0, 100, 0, 0.1);
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-right: 15px;
        }
        
        .dashboard-card-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0;
        }
        
        .dashboard-card-content {
            color: #666;
        }
        
        .dashboard-card-content ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .dashboard-card-content ul li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .dashboard-card-content ul li:last-child {
            border-bottom: none;
        }
        
        .dashboard-card-content ul li a {
            color: var(--text-color);
            text-decoration: none;
            transition: var(--transition);
            display: flex;
            justify-content: space-between;
        }
        
        .dashboard-card-content ul li a:hover {
            color: var(--primary-color);
        }
        
        .dashboard-card-content .progress-bar {
            height: 10px;
            background-color: #eee;
            border-radius: 5px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .dashboard-card-content .progress {
            height: 100%;
            background-color: var(--primary-color);
            border-radius: 5px;
        }
        
        .dashboard-card-footer {
            margin-top: 20px;
            text-align: right;
        }
        
        .dashboard-card-footer a {
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: var(--transition);
        }
        
        .dashboard-card-footer a:hover {
            color: var(--secondary-color);
            text-decoration: underline;
        }
        
        .logout-btn {
            background-color: transparent;
            color: #e74c3c;
            border: 1px solid #e74c3c;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: var(--transition);
            font-size: 14px;
        }
        
        .logout-btn:hover {
            background-color: #e74c3c;
            color: white;
        }
    </style>
</head>
<body>
    <!-- Custom Cursor -->
    <div class="cursor"></div>
    <div class="cursor-follower"></div>

    <!-- Header -->
    <header>
        <div class="header-container">
            <div class="logo-left">
                <img src="images/sindh-logo.png" alt="Government of Sindh Logo">
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="faculty.html">Faculty</a></li>
                    <li><a href="programs.html">Programs</a></li>
                    <li><a href="admission.html">Admission</a></li>
                    <li><a href="gallery.html">Gallery</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <div class="mobile-menu">
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                </div>
            </nav>
            <div class="logo-right">
                <img src="images/college-logo.png" alt="Government Boys Degree College Jacobabad Logo">
            </div>
        </div>
    </header>

    <!-- Dashboard Content -->
    <section class="dashboard-container">
        <div class="container">
            <div class="dashboard-header">
                <h1>Student Dashboard</h1>
                <div class="student-info">
                    <div class="student-avatar">
                        <?php echo substr($student_name, 0, 1); ?>
                    </div>
                    <div class="student-details">
                        <h3><?php echo $student_name; ?></h3>
                        <p>Roll Number: <?php echo $roll_number; ?></p>
                    </div>
                    <form action="php/logout.php" method="POST" style="margin-left: 20px;">
                        <button type="submit" class="logout-btn">Logout</button>
                    </form>
                </div>
            </div>
            
            <div class="dashboard-grid">
                <!-- Attendance Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h3 class="dashboard-card-title">Attendance</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <p>Current Month: 85%</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: 85%;"></div>
                        </div>
                        <p>Overall: 92%</p>
                        <div class="progress-bar">
                            <div class="progress" style="width: 92%;"></div>
                        </div>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">View Details <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <!-- Exams Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <h3 class="dashboard-card-title">Exams</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <ul>
                            <li><a href="#">Mid-Term Examination <span>View Results</span></a></li>
                            <li><a href="#">Final Examination <span>Upcoming</span></a></li>
                            <li><a href="#">Quiz 3 <span>85%</span></a></li>
                            <li><a href="#">Assignment 2 <span>90%</span></a></li>
                        </ul>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">View All <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <!-- Courses Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3 class="dashboard-card-title">Courses</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <ul>
                            <li><a href="#">Mathematics <span>Prof. Ahmed</span></a></li>
                            <li><a href="#">Physics <span>Prof. Khan</span></a></li>
                            <li><a href="#">Computer Science <span>Prof. Ali</span></a></li>
                            <li><a href="#">English <span>Prof. Fatima</span></a></li>
                        </ul>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">View All <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <!-- Announcements Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-bullhorn"></i>
                        </div>
                        <h3 class="dashboard-card-title">Announcements</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <ul>
                            <li><a href="#">Final Exam Schedule Released <span>2 days ago</span></a></li>
                            <li><a href="#">Sports Day Registration <span>1 week ago</span></a></li>
                            <li><a href="#">Library Timings Updated <span>2 weeks ago</span></a></li>
                        </ul>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">View All <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <!-- Fee Status Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <h3 class="dashboard-card-title">Fee Status</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <p>Current Semester: <span style="color: #27ae60; font-weight: 500;">Paid</span></p>
                        <p>Next Payment Due: September 15, 2025</p>
                        <p>Amount: Rs. 25,000</p>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">Payment History <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                
                <!-- Timetable Card -->
                <div class="dashboard-card">
                    <div class="dashboard-card-header">
                        <div class="dashboard-card-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3 class="dashboard-card-title">Timetable</h3>
                    </div>
                    <div class="dashboard-card-content">
                        <p>Today's Classes:</p>
                        <ul>
                            <li>Mathematics (9:00 AM - 10:30 AM)</li>
                            <li>Physics (11:00 AM - 12:30 PM)</li>
                            <li>Computer Science (2:00 PM - 3:30 PM)</li>
                        </ul>
                    </div>
                    <div class="dashboard-card-footer">
                        <a href="#">Full Timetable <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="footer-top">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h3>Contact Us</h3>
                        <ul class="contact-info">
                            <li><i class="fas fa-map-marker-alt"></i> College Road, Jacobabad, Sindh, Pakistan</li>
                            <li><i class="fas fa-phone"></i> +92-123-4567890</li>
                            <li><i class="fas fa-envelope"></i> info@gbdcjacobabad.edu.pk</li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="faculty.html">Faculty</a></li>
                            <li><a href="programs.html">Programs</a></li>
                            <li><a href="admission.html">Admission</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3>Important Links</h3>
                        <ul class="footer-links">
                            <li><a href="https://www.sindh.gov.pk/" target="_blank">Government of Sindh</a></li>
                            <li><a href="https://www.hec.gov.pk/" target="_blank">Higher Education Commission</a></li>
                            <li><a href="https://www.sbte.edu.pk/" target="_blank">Sindh Board of Technical Education</a></li>
                            <li><a href="login.html">Student Portal</a></li>
                            <li><a href="alumni.html">Alumni Network</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h3>Connect With Us</h3>
                        <ul class="social-links">
                            <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                            <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
                            <li><a href="#"><i class="fab fa-youtube"></i></a></li>
                        </ul>
                        <div class="footer-map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.522236279651!2d68.43720901504321!3d28.281863982551837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDE2JzU0LjciTiA2OMKwMjYnMTcuNSJF!5e0!3m2!1sen!2s!4v1627321585722!5m2!1sen!2s" width="100%" height="150" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <p>&copy; 2025 Government Boys Degree College Jacobabad. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <a href="#" class="back-to-top">
        <i class="fas fa-arrow-up"></i>
    </a>

    <!-- JS Files -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
    <script src="js/script.js"></script>
</body>
</html> 