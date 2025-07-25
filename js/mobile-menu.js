/**
 * Mobile Menu Handler
 * 
 * This module provides enhanced mobile menu functionality for the admin panel
 * and ensures proper navigation on mobile devices.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
});

/**
 * Initialize the mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const adminSidebar = document.getElementById('adminSidebar');
    
    if (!mobileMenuBtn || !adminSidebar) return;
    
    // Toggle sidebar when mobile menu button is clicked
    mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle classes for animation
        adminSidebar.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
        
        // Add overlay if not exists
        let overlay = document.querySelector('.mobile-overlay');
        if (!overlay && adminSidebar.classList.contains('open')) {
            overlay = document.createElement('div');
            overlay.classList.add('mobile-overlay');
            document.body.appendChild(overlay);
            
            // Fade in animation
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);
            
            // Close sidebar when overlay is clicked
            overlay.addEventListener('click', function() {
                adminSidebar.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
                overlay.classList.remove('active');
                
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            });
        } else if (overlay && !adminSidebar.classList.contains('open')) {
            // Remove overlay when sidebar is closed
            overlay.classList.remove('active');
            
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            adminSidebar.classList.contains('open') && 
            !adminSidebar.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !e.target.closest('.mobile-menu-btn')) {
            
            adminSidebar.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
            
            // Remove overlay
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                
                setTimeout(() => {
                    overlay.remove();
                }, 300);
            }
        }
    });
    
    // Enhanced menu item click handling
    const menuItems = adminSidebar.querySelectorAll('.admin-menu li a');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Get the tab ID from href attribute
            const href = this.getAttribute('href');
            const tabId = href.replace('#', '');
            
            // Find the tab content
            const tabContent = document.getElementById(tabId);
            
            if (tabContent) {
                // Activate the tab
                const allTabs = document.querySelectorAll('.admin-tab');
                allTabs.forEach(tab => tab.classList.remove('active'));
                tabContent.classList.add('active');
                
                // Update active state in menu
                const allMenuItems = adminSidebar.querySelectorAll('.admin-menu li');
                allMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
                this.closest('li').classList.add('active');
                
                // Update URL hash
                window.location.hash = tabId;
                
                // Close sidebar on mobile
                if (window.innerWidth <= 768) {
                    adminSidebar.classList.remove('open');
                    mobileMenuBtn.classList.remove('active');
                    
                    // Remove overlay
                    const overlay = document.querySelector('.mobile-overlay');
                    if (overlay) {
                        overlay.classList.remove('active');
                        
                        setTimeout(() => {
                            overlay.remove();
                        }, 300);
                    }
                }
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Remove overlay on desktop
            const overlay = document.querySelector('.mobile-overlay');
            if (overlay) {
                overlay.remove();
            }
        }
    });
    
    // Style the mobile menu button
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
}

// Add styles for mobile overlay
const overlayStyle = document.createElement('style');
overlayStyle.textContent = `
    .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .mobile-overlay.active {
        opacity: 1;
        visibility: visible;
    }
    
    @media (min-width: 769px) {
        .mobile-overlay {
            display: none;
        }
    }
`;
document.head.appendChild(overlayStyle);

// Add styles for mobile menu button
const menuBtnStyle = document.createElement('style');
menuBtnStyle.textContent = `
    .mobile-menu-btn {
        display: none;
    }
    
    @media (max-width: 768px) {
        .mobile-menu-btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 40px;
            height: 40px;
            padding: 10px;
            background-color: var(--primary-color, #1a6d33);
            border-radius: 5px;
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            border: none;
            outline: none;
        }
        
        .mobile-menu-btn span {
            display: block;
            height: 3px;
            width: 100%;
            background-color: white;
            border-radius: 3px;
            transition: all 0.3s ease;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;
document.head.appendChild(menuBtnStyle); 