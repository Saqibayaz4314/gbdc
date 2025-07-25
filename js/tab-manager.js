/**
 * Tab Management System
 * 
 * This module handles all tab switching functionality in the admin panel
 * and ensures proper navigation between different sections.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tab management
    initTabSystem();
});

/**
 * Initialize the tab management system
 */
function initTabSystem() {
    // Tab switching
    const menuItems = document.querySelectorAll('.admin-menu li');
    const tabs = document.querySelectorAll('.admin-tab');
    
    if (!menuItems.length || !tabs.length) return;
    
    // Keep track of current active tab
    let currentTab = 'dashboard';
    
    // Add click handlers to all menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent default behavior
            e.preventDefault();
            
            // Get tab ID from data attribute
            const tabId = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabId);
            
            // Don't proceed if this is the logout tab
            if (tabId === 'logout') {
                // Let the logout handler handle this
                return;
            }
            
            // Update current tab
            currentTab = tabId;
            
            // Switch to the selected tab
            switchToTab(tabId, menuItems, tabs);
        });
    });
    
    // Check for hash in URL to activate specific tab
    checkHashForTab(menuItems, tabs);
    
    // Listen for hash changes
    window.addEventListener('hashchange', function() {
        checkHashForTab(menuItems, tabs);
    });
}

/**
 * Switch to a specific tab
 * 
 * @param {string} tabId - ID of the tab to switch to
 * @param {NodeList} menuItems - All menu items
 * @param {NodeList} tabs - All tab panels
 */
function switchToTab(tabId, menuItems, tabs) {
    // Remove active class from all menu items and tabs
    menuItems.forEach(item => item.classList.remove('active'));
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Find the target tab element
    const targetTab = document.getElementById(tabId);
    
    // Find the target menu item
    const targetMenuItem = document.querySelector(`[data-tab="${tabId}"]`);
    
    // Update URL hash without triggering page scroll
    const scrollPosition = window.scrollY;
    window.location.hash = tabId;
    window.scrollTo(0, scrollPosition);
    
    // Activate the tab and menu item if they exist
    if (targetTab) {
        targetTab.classList.add('active');
        console.log('Activated tab:', tabId);
    } else {
        console.error('Tab not found:', tabId);
    }
    
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
    
    // Close mobile menu if it's open
    const adminSidebar = document.getElementById('adminSidebar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (adminSidebar && mobileMenuBtn && window.innerWidth <= 768) {
        adminSidebar.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
    }
}

/**
 * Check URL hash for tab name and activate that tab
 * 
 * @param {NodeList} menuItems - All menu items
 * @param {NodeList} tabs - All tab panels
 */
function checkHashForTab(menuItems, tabs) {
    // Get hash without the # symbol
    const hash = window.location.hash.substring(1);
    
    if (hash) {
        // Check if hash corresponds to a valid tab
        const targetTab = document.getElementById(hash);
        
        if (targetTab && targetTab.classList.contains('admin-tab')) {
            switchToTab(hash, menuItems, tabs);
        }
    }
}

// Make functions available globally
window.tabManager = {
    switchToTab: function(tabId) {
        const menuItems = document.querySelectorAll('.admin-menu li');
        const tabs = document.querySelectorAll('.admin-tab');
        switchToTab(tabId, menuItems, tabs);
    }
}; 