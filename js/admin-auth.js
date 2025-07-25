/**
 * Admin Authentication Module
 * 
 * This module handles all admin authentication functionality including:
 * - Login/logout
 * - Session management
 * - Auth state persistence
 * - Security checks
 */

// Initialize the authentication system
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const isLoginPage = window.location.href.includes('admin-login.html');
    
    if (isLoginPage) {
        setupLoginForm();
    } else {
        // Check auth on any admin page
        checkAuthentication();
    }
    
    // Setup logout button on all pages
    setupLogout();
});

/**
 * Set up the login form submission handler
 */
function setupLoginForm() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Simple credentials check (in production, this would be server-side)
        if (username === 'admin' && password === 'admin123') {
            handleSuccessfulLogin(rememberMe);
        } else {
            handleFailedLogin();
        }
    });
}

/**
 * Handle successful login
 * 
 * @param {boolean} rememberMe - Whether to remember the login across browser sessions
 */
function handleSuccessfulLogin(rememberMe) {
    // Hide error message if visible
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.style.display = 'none';
    }
    
    // Show success message
    const successAlert = document.getElementById('successAlert');
    if (successAlert) {
        successAlert.style.display = 'block';
    }
    
    // Store auth state based on remember me preference
    if (rememberMe) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
    } else {
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminLoginTime', Date.now().toString());
    }
    
    // Redirect to admin panel after short delay
    setTimeout(function() {
        window.location.href = 'admin.html';
    }, 1500);
}

/**
 * Handle failed login attempt
 */
function handleFailedLogin() {
    // Hide success message if visible
    const successAlert = document.getElementById('successAlert');
    if (successAlert) {
        successAlert.style.display = 'none';
    }
    
    // Show error message
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.style.display = 'block';
    }
    
    // Clear password field
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.value = '';
        passwordField.focus();
    }
}

/**
 * Check if user is authenticated
 * Redirects to login page if not authenticated
 */
function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true' || 
                          sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isAuthenticated) {
        // Not logged in, redirect to login page
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Check session timeout (24 hours)
    const loginTime = parseInt(localStorage.getItem('adminLoginTime') || 
                            sessionStorage.getItem('adminLoginTime') || '0');
    const currentTime = Date.now();
    const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (currentTime - loginTime > SESSION_TIMEOUT) {
        // Session expired
        logout();
        window.location.href = 'admin-login.html?session_expired=true';
        return;
    }
    
    // Update last activity time
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        localStorage.setItem('adminLoginTime', currentTime.toString());
    } else {
        sessionStorage.setItem('adminLoginTime', currentTime.toString());
    }
}

/**
 * Set up logout functionality
 */
function setupLogout() {
    // Check for logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
            
            // Show notification if available
            if (window.showNotification) {
                window.showNotification('Logged out successfully', 'info');
            }
            
            // Redirect after a short delay
            setTimeout(function() {
                window.location.href = 'admin-login.html';
            }, 1000);
        });
    }
    
    // Check for logout menu item
    const logoutMenuItem = document.querySelector('[data-tab="logout"]');
    if (logoutMenuItem) {
        logoutMenuItem.addEventListener('click', function() {
            // This will activate the logout tab, which contains the confirmation buttons
            const logoutTab = document.getElementById('logout');
            if (logoutTab) {
                // Remove active class from all tabs
                document.querySelectorAll('.admin-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Activate logout tab
                logoutTab.classList.add('active');
            }
        });
    }
}

/**
 * Perform logout by clearing auth state
 */
function logout() {
    // Clear authentication state
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
}

// Make functions available globally
window.adminAuth = {
    checkAuthentication,
    logout
}; 