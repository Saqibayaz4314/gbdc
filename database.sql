-- Create database
CREATE DATABASE IF NOT EXISTS gbdc_jacobabad;

-- Use database
USE gbdc_jacobabad;

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    date DATETIME NOT NULL,
    is_read TINYINT(1) DEFAULT 0
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    subscription_date DATETIME NOT NULL,
    is_active TINYINT(1) DEFAULT 1
);

-- Create users table for admin panel
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') NOT NULL,
    created_at DATETIME NOT NULL,
    last_login DATETIME
);

-- Create departments table first (needed for foreign keys)
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_id INT NULL
);

-- Create faculty table
CREATE TABLE IF NOT EXISTS faculty (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    qualification VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    joining_date DATE NOT NULL,
    bio TEXT,
    image VARCHAR(255),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Update departments table with head_id foreign key
ALTER TABLE departments
ADD CONSTRAINT fk_departments_head
FOREIGN KEY (head_id) REFERENCES faculty(id);

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration VARCHAR(50) NOT NULL,
    total_seats INT NOT NULL,
    type ENUM('bachelor', 'associate', 'diploma') NOT NULL,
    department_id INT NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(20) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    cnic VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    program_id INT NOT NULL,
    semester INT NOT NULL,
    admission_date DATE NOT NULL,
    status ENUM('active', 'graduated', 'dropped', 'suspended') NOT NULL DEFAULT 'active',
    remember_token VARCHAR(255),
    last_login DATETIME,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Create password_resets table for student password resets
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expiry DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    credit_hours INT NOT NULL,
    program_id INT NOT NULL,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Create student_courses table for enrollment
CREATE TABLE IF NOT EXISTS student_courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester INT NOT NULL,
    year VARCHAR(10) NOT NULL,
    grade VARCHAR(2),
    status ENUM('enrolled', 'completed', 'dropped') NOT NULL DEFAULT 'enrolled',
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'leave') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    exam_date DATE NOT NULL,
    total_marks INT NOT NULL,
    passing_marks INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Create exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_id INT NOT NULL,
    student_id INT NOT NULL,
    obtained_marks INT NOT NULL,
    remarks TEXT,
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Create fees table
CREATE TABLE IF NOT EXISTS fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    fee_type ENUM('admission', 'tuition', 'examination', 'other') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    status ENUM('paid', 'unpaid', 'partial') NOT NULL DEFAULT 'unpaid',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    venue VARCHAR(200) NOT NULL,
    image VARCHAR(255),
    status ENUM('upcoming', 'ongoing', 'past') NOT NULL,
    created_at DATETIME NOT NULL
);

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    upload_date DATETIME NOT NULL
);

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255),
    published_date DATETIME NOT NULL,
    is_featured TINYINT(1) DEFAULT 0
);

-- Create notices table
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    published_date DATETIME NOT NULL,
    expiry_date DATE,
    is_important TINYINT(1) DEFAULT 0
);

-- Create admission_applications table
CREATE TABLE IF NOT EXISTS admission_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100) NOT NULL,
    cnic VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    program_id INT NOT NULL,
    previous_qualification VARCHAR(100) NOT NULL,
    previous_institution VARCHAR(100) NOT NULL,
    previous_percentage DECIMAL(5, 2) NOT NULL,
    application_date DATETIME NOT NULL,
    status ENUM('new', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'new',
    comments TEXT,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

-- Create documents table for admission applications
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    upload_date DATETIME NOT NULL,
    FOREIGN KEY (application_id) REFERENCES admission_applications(id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, name, email, role, created_at)
VALUES ('admin', '$2y$10$rWWBg5y4yfB5UxF9VSlDH.KFq3J0J7mvw1FqGRmHQ7LFknnJwNlLC', 'Administrator', 'admin@gbdcjacobabad.edu.pk', 'admin', NOW());

-- Insert sample departments
INSERT INTO departments (name, description) VALUES 
('Science', 'Department of Natural Sciences including Physics, Chemistry and Biology'),
('Arts', 'Department of Arts and Humanities'),
('Commerce', 'Department of Commerce and Business Studies'),
('Information Technology', 'Department of Computer Science and Information Technology');

-- Create website_settings table
CREATE TABLE IF NOT EXISTS website_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    setting_group VARCHAR(50) NOT NULL,
    is_public TINYINT(1) DEFAULT 1,
    updated_at DATETIME NOT NULL
);

-- Insert default website settings
INSERT INTO website_settings (setting_key, setting_value, setting_group, updated_at) VALUES
('site_title', 'Government Boys Degree College Jacobabad', 'general', NOW()),
('site_description', 'Official website of Government Boys Degree College Jacobabad', 'general', NOW()),
('contact_email', 'info@gbdcjacobabad.edu.pk', 'contact', NOW()),
('contact_phone', '+92-333-1234567', 'contact', NOW()),
('contact_address', 'Main Road, Jacobabad, Sindh, Pakistan', 'contact', NOW()),
('facebook_url', 'https://facebook.com/gbdcjacobabad', 'social', NOW()),
('twitter_url', 'https://twitter.com/gbdcjacobabad', 'social', NOW()),
('instagram_url', 'https://instagram.com/gbdcjacobabad', 'social', NOW()),
('youtube_url', 'https://youtube.com/gbdcjacobabad', 'social', NOW()),
('primary_color', '#006400', 'appearance', NOW()),
('secondary_color', '#008000', 'appearance', NOW()),
('accent_color', '#28a745', 'appearance', NOW()); 