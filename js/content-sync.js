/**
 * Enhanced Content Synchronization Module
 * 
 * This module handles real-time content synchronization between the admin panel
 * and the public website, including dynamic updates for gallery, faculty, events,
 * and other content.
 */

// Initialize the content sync system
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're in the admin panel or in the website
    const isAdmin = document.querySelector('.admin-container') !== null;
    
    if (isAdmin) {
        // Setup admin-side content editing and syncing
        initializeAdminSync();
    } else {
        // Setup website-side content receiving and updating
        initializeWebsiteSync();
    }
});

/**
 * Initialize Admin-side synchronization
 */
function initializeAdminSync() {
    // Listen for content changes from admin editing actions
    document.addEventListener('contentUpdated', function(e) {
        // Save the updated content to localStorage
        saveContentToStorage(e.detail.type, e.detail.id, e.detail.content);
        
        // In a real implementation, this would send an AJAX request to the server
        console.log('Content updated:', e.detail);
    });
    
    // Setup listeners for form submissions in admin panels
    setupFormSubmissionListeners();
}

/**
 * Initialize Website-side synchronization
 */
function initializeWebsiteSync() {
    // Load and apply any content updates from localStorage
    loadAndApplyContentUpdates();
    
    // Setup an interval to check for new updates (polling)
    setInterval(loadAndApplyContentUpdates, 5000);
}

/**
 * Save updated content to localStorage
 * 
 * @param {string} type - Content type (e.g., 'event', 'faculty', 'gallery')
 * @param {string} id - Unique identifier for the content
 * @param {object} content - The updated content
 */
function saveContentToStorage(type, id, content) {
    // Create a unique key for this content item
    const storageKey = `content_${type}_${id}`;
    
    // Add a timestamp for tracking when the content was last updated
    content.lastUpdated = new Date().toISOString();
    
    // Store in localStorage
    localStorage.setItem(storageKey, JSON.stringify(content));
    
    // Also store in a master list of updated content
    let updatedContent = JSON.parse(localStorage.getItem('updatedContent') || '[]');
    
    // Check if this content is already in the list
    const existingIndex = updatedContent.findIndex(item => item.type === type && item.id === id);
    
    if (existingIndex !== -1) {
        // Update existing entry
        updatedContent[existingIndex] = { type, id, lastUpdated: content.lastUpdated };
    } else {
        // Add new entry
        updatedContent.push({ type, id, lastUpdated: content.lastUpdated });
    }
    
    // Save updated list
    localStorage.setItem('updatedContent', JSON.stringify(updatedContent));
}

/**
 * Load and apply content updates from localStorage
 */
function loadAndApplyContentUpdates() {
    // Get the list of updated content
    const updatedContent = JSON.parse(localStorage.getItem('updatedContent') || '[]');
    
    // Process each content update
    updatedContent.forEach(item => {
        const storageKey = `content_${item.type}_${item.id}`;
        const contentData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        // Apply the content update to the website
        applyContentUpdate(item.type, item.id, contentData);
    });
}

/**
 * Apply a content update to the website
 * 
 * @param {string} type - Content type (e.g., 'event', 'faculty', 'gallery')
 * @param {string} id - Unique identifier for the content
 * @param {object} content - The updated content
 */
function applyContentUpdate(type, id, content) {
    switch (type) {
        case 'event':
            updateEventContent(id, content);
            break;
        case 'faculty':
            updateFacultyContent(id, content);
            break;
        case 'gallery':
            updateGalleryContent(id, content);
            break;
        case 'program':
            updateProgramContent(id, content);
            break;
        case 'college-info':
            updateCollegeInfo(content);
            break;
        default:
            console.log('Unknown content type:', type);
    }
    
    // Show notification about content update if we're on the website (not admin panel)
    if (!document.querySelector('.admin-container') && content !== null) {
        showUpdateNotification(type, content);
    }
}

/**
 * Show a notification about content updates
 * 
 * @param {string} type - Content type that was updated
 * @param {object} content - The updated content
 */
function showUpdateNotification(type, content) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.content-update-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('content-update-notification');
        document.body.appendChild(notification);
        
        // Add styles for the notification
        const style = document.createElement('style');
        style.textContent = `
            .content-update-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: var(--primary-color, #1a6d33);
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                font-family: 'Poppins', sans-serif;
                max-width: 300px;
            }
            
            .content-update-notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .content-update-notification.hide {
                transform: translateY(100px);
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set notification message based on content type
    let message = 'Website content has been updated!';
    
    switch (type) {
        case 'event':
            message = `Event "${content.title}" has been updated!`;
            break;
        case 'faculty':
            message = `Faculty information for ${content.name} has been updated!`;
            break;
        case 'gallery':
            message = `New ${content.type === 'image' ? 'image' : 'video'} added to gallery!`;
            break;
        case 'program':
            message = `Program "${content.name}" has been updated!`;
            break;
    }
    
    // Set the notification text
    notification.textContent = message;
    
    // Show the notification
    notification.classList.add('show');
    notification.classList.remove('hide');
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 5000);
}

/**
 * Setup listeners for form submissions in admin panels
 */
function setupFormSubmissionListeners() {
    // Listen for gallery form submissions
    document.querySelectorAll('#mediaUploadForm, .gallery-item form').forEach(form => {
        form.addEventListener('submit', function(e) {
            const galleryId = this.closest('.gallery-item')?.getAttribute('data-id') || 'new-' + Date.now();
            const title = this.querySelector('[name="title"]')?.value || this.closest('.gallery-item')?.querySelector('h4').textContent;
            const category = this.querySelector('[name="category"]')?.value || this.closest('.gallery-item')?.getAttribute('data-type').split(' ')[1];
            
            // Create content update event
            const contentUpdatedEvent = new CustomEvent('contentUpdated', {
                detail: {
                    type: 'gallery',
                    id: galleryId,
                    content: {
                        title: title,
                        category: category,
                        // Other properties would be included here
                    }
                }
            });
            
            // Dispatch the event
            document.dispatchEvent(contentUpdatedEvent);
        });
    });
    
    // Listen for faculty form submissions
    document.querySelectorAll('#facultyForm').forEach(form => {
        form.addEventListener('submit', function(e) {
            const facultyId = this.getAttribute('data-id') || 'new-' + Date.now();
            const name = this.querySelector('#facultyName').value;
            const designation = this.querySelector('#facultyDesignation').value;
            const department = this.querySelector('#facultyDepartment').value;
            const qualification = this.querySelector('#facultyQualification').value;
            
            // Create content update event
            const contentUpdatedEvent = new CustomEvent('contentUpdated', {
                detail: {
                    type: 'faculty',
                    id: facultyId,
                    content: {
                        name: name,
                        designation: designation,
                        department: department,
                        qualification: qualification,
                        // Other properties would be included here
                    }
                }
            });
            
            // Dispatch the event
            document.dispatchEvent(contentUpdatedEvent);
        });
    });
    
    // Listen for event form submissions
    document.querySelectorAll('#eventForm').forEach(form => {
        form.addEventListener('submit', function(e) {
            const eventId = this.getAttribute('data-id') || 'new-' + Date.now();
            const title = this.querySelector('#eventTitle').value;
            const date = this.querySelector('#eventDate').value;
            const location = this.querySelector('#eventLocation').value;
            
            // Create content update event
            const contentUpdatedEvent = new CustomEvent('contentUpdated', {
                detail: {
                    type: 'event',
                    id: eventId,
                    content: {
                        title: title,
                        date: date,
                        location: location,
                        // Other properties would be included here
                    }
                }
            });
            
            // Dispatch the event
            document.dispatchEvent(contentUpdatedEvent);
        });
    });
    
    // Listen for program form submissions
    document.querySelectorAll('#programForm').forEach(form => {
        form.addEventListener('submit', function(e) {
            const programId = this.getAttribute('data-id') || 'new-' + Date.now();
            const name = this.querySelector('#programName').value;
            const department = this.querySelector('#programDepartment').value;
            const duration = this.querySelector('#programDuration').value;
            
            // Create content update event
            const contentUpdatedEvent = new CustomEvent('contentUpdated', {
                detail: {
                    type: 'program',
                    id: programId,
                    content: {
                        name: name,
                        department: department,
                        duration: duration,
                        // Other properties would be included here
                    }
                }
            });
            
            // Dispatch the event
            document.dispatchEvent(contentUpdatedEvent);
        });
    });
    
    // Listen for college info form submissions
    document.querySelectorAll('.settings-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create content update event for college info
            const contentUpdatedEvent = new CustomEvent('contentUpdated', {
                detail: {
                    type: 'college-info',
                    id: 'main',
                    content: {
                        name: document.querySelector('#college-name')?.value,
                        email: document.querySelector('#college-email')?.value,
                        phone: document.querySelector('#college-phone')?.value,
                        address: document.querySelector('#college-address')?.value,
                        social: {
                            facebook: document.querySelector('#facebook')?.value,
                            twitter: document.querySelector('#twitter')?.value,
                            instagram: document.querySelector('#instagram')?.value,
                            linkedin: document.querySelector('#linkedin')?.value
                        }
                    }
                }
            });
            
            // Dispatch the event
            document.dispatchEvent(contentUpdatedEvent);
            
            // Show success notification
            showNotification('Settings saved successfully!', 'success');
        });
    });
    
    // Listen for inline content edits
    document.addEventListener('inlineEdit', function(e) {
        // Create content update event
        const contentUpdatedEvent = new CustomEvent('contentUpdated', {
            detail: e.detail
        });
        
        // Dispatch the event
        document.dispatchEvent(contentUpdatedEvent);
    });
}

/**
 * Update event content on the website
 * 
 * @param {string} id - Event identifier
 * @param {object} content - Updated event content
 */
function updateEventContent(id, content) {
    // Find event elements with this ID
    const eventElements = document.querySelectorAll(`.event-card[data-id="${id}"], .event-item[data-id="${id}"]`);
    
    eventElements.forEach(element => {
        // Update title
        const titleElement = element.querySelector('h3, .event-title');
        if (titleElement && content.title) {
            titleElement.textContent = content.title;
        }
        
        // Update date
        const dateElement = element.querySelector('.event-date, .date');
        if (dateElement && content.date) {
            dateElement.textContent = content.date;
        }
        
        // Update location
        const locationElement = element.querySelector('.event-location, .location');
        if (locationElement && content.location) {
            locationElement.textContent = content.location;
        }
        
        // Update description
        const descElement = element.querySelector('.event-description, .description, p');
        if (descElement && content.description) {
            descElement.textContent = content.description;
        }
    });
}

/**
 * Update faculty content on the website
 * 
 * @param {string} id - Faculty identifier
 * @param {object} content - Updated faculty content
 */
function updateFacultyContent(id, content) {
    // Find faculty elements with this ID
    const facultyElements = document.querySelectorAll(`.faculty-card[data-id="${id}"], .faculty-member[data-id="${id}"]`);
    
    facultyElements.forEach(element => {
        // Update name
        const nameElement = element.querySelector('h3, .faculty-name');
        if (nameElement && content.name) {
            nameElement.textContent = content.name;
        }
        
        // Update designation
        const designationElement = element.querySelector('.designation, .faculty-designation');
        if (designationElement && content.designation) {
            designationElement.textContent = content.designation;
        }
        
        // Update department
        const departmentElement = element.querySelector('.department, .faculty-department');
        if (departmentElement && content.department) {
            departmentElement.textContent = content.department;
        }
        
        // Update qualification
        const qualificationElement = element.querySelector('.qualification, .faculty-qualification');
        if (qualificationElement && content.qualification) {
            qualificationElement.textContent = content.qualification;
        }
        
        // Update image if available
        const imageElement = element.querySelector('img');
        if (imageElement && content.imageUrl) {
            imageElement.src = content.imageUrl;
            imageElement.alt = content.name || 'Faculty Member';
        }
    });
}

/**
 * Update gallery content on the website
 * 
 * @param {string} id - Gallery item identifier
 * @param {object} content - Updated gallery content
 */
function updateGalleryContent(id, content) {
    // Find gallery elements with this ID
    const galleryElements = document.querySelectorAll(`.gallery-item[data-id="${id}"]`);
    
    // If the content is being deleted
    if (content === null) {
        galleryElements.forEach(element => {
            // Fade out and remove
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            setTimeout(() => {
                element.remove();
            }, 300);
        });
        return;
    }
    
    // If this is a new gallery item and we don't have any existing elements
    if (galleryElements.length === 0 && content) {
        // Find gallery containers to add this new item to
        const galleryContainers = document.querySelectorAll('.gallery-grid, .gallery-main-grid');
        
        if (galleryContainers.length > 0) {
            // Create a new gallery item
            const newItem = document.createElement('div');
            newItem.classList.add('gallery-item');
            newItem.setAttribute('data-id', id);
            newItem.setAttribute('data-type', `${content.type === 'image' ? 'images' : 'videos'} ${content.category || 'campus'}`);
            
            // Different HTML structure based on whether it's in admin panel or website
            const isAdminPanel = document.querySelector('.admin-container') !== null;
            
            if (isAdminPanel) {
                // Admin panel gallery item structure
                if (content.type === 'image') {
                    newItem.innerHTML = `
                        <div class="gallery-item-image">
                            <img src="${content.src || content.imageUrl}" alt="${content.title}">
                        </div>
                        <div class="gallery-item-info">
                            <h4>${content.title}</h4>
                            <p>Uploaded: ${content.uploadDate || new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="gallery-item-actions">
                            <button class="edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                } else {
                    newItem.innerHTML = `
                        <div class="gallery-item-image video">
                            <img src="images/gallery/video-thumbnail.jpg" alt="${content.title}">
                            <div class="video-icon"><i class="fas fa-play"></i></div>
                        </div>
                        <div class="gallery-item-info">
                            <h4>${content.title}</h4>
                            <p>Uploaded: ${content.uploadDate || new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="gallery-item-actions">
                            <button class="edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                }
            } else {
                // Website gallery item structure
                if (content.type === 'image') {
                    newItem.innerHTML = `
                        <img src="${content.src || content.imageUrl}" alt="${content.title}">
                        <div class="gallery-overlay">
                            <i class="fas fa-search-plus"></i>
                        </div>
                    `;
                } else {
                    newItem.innerHTML = `
                        <img src="images/gallery/video-thumbnail.jpg" alt="${content.title}">
                        <div class="gallery-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    `;
                }
            }
            
            // Set initial styles for animation
            newItem.style.opacity = '0';
            newItem.style.transform = 'scale(0.9)';
            
            // Add to the first container
            galleryContainers[0].prepend(newItem);
            
            // Trigger animation
            setTimeout(() => {
                newItem.style.opacity = '1';
                newItem.style.transform = 'scale(1)';
            }, 10);
        }
    } else {
        // Update existing gallery elements
        galleryElements.forEach(element => {
            // Update title
            const titleElement = element.querySelector('h4, .gallery-title');
            if (titleElement && content.title) {
                titleElement.textContent = content.title;
            }
            
            // Update category (data attribute)
            if (content.category) {
                const currentTypes = element.getAttribute('data-type').split(' ');
                currentTypes[1] = content.category;
                element.setAttribute('data-type', currentTypes.join(' '));
            }
            
            // Update image if available
            const imageElement = element.querySelector('img');
            if (imageElement && (content.imageUrl || content.src)) {
                imageElement.src = content.imageUrl || content.src;
                imageElement.alt = content.title || 'Gallery Item';
            }
            
            // Highlight the updated element briefly
            element.classList.add('updated');
            setTimeout(() => {
                element.classList.remove('updated');
            }, 2000);
        });
    }
}

/**
 * Update program content on the website
 * 
 * @param {string} id - Program identifier
 * @param {object} content - Updated program content
 */
function updateProgramContent(id, content) {
    // Find program elements with this ID
    const programElements = document.querySelectorAll(`.program-card[data-id="${id}"], .program-item[data-id="${id}"]`);
    
    // If the content is being deleted
    if (content === null) {
        programElements.forEach(element => {
            // Fade out and remove
            element.style.opacity = '0';
            setTimeout(() => {
                element.remove();
            }, 300);
        });
        return;
    }
    
    // If this is a new program and we don't have any existing elements
    if (programElements.length === 0 && content) {
        // Find program containers to add this new program to
        const programContainers = document.querySelectorAll('.programs-grid, .program-list');
        
        if (programContainers.length > 0) {
            // Create a new program card
            const newProgram = document.createElement('div');
            newProgram.classList.add('program-card');
            newProgram.setAttribute('data-id', id);
            
            // Determine icon based on department
            let icon = 'fa-graduation-cap';
            if (content.department === 'Science') {
                icon = 'fa-flask';
            } else if (content.department === 'Arts') {
                icon = 'fa-paint-brush';
            } else if (content.department === 'Commerce') {
                icon = 'fa-chart-line';
            } else if (content.department === 'Information Technology') {
                icon = 'fa-desktop';
            }
            
            // Create the HTML for the new program
            newProgram.innerHTML = `
                <div class="program-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <h3>${content.name}</h3>
                <p>${content.description || `Our ${content.name} program offers comprehensive education in ${content.department}.`}</p>
                <a href="programs.html#${content.department.toLowerCase()}" class="btn-link">Explore <i class="fas fa-arrow-right"></i></a>
            `;
            
            // Add to the first container
            programContainers[0].appendChild(newProgram);
            
            // Fade in animation
            setTimeout(() => {
                newProgram.style.opacity = '1';
            }, 10);
        }
    } else {
        // Update existing program elements
        programElements.forEach(element => {
            // Update name/title
            const titleElement = element.querySelector('h3, .program-title');
            if (titleElement && content.name) {
                titleElement.textContent = content.name;
            }
            
            // Update department
            const departmentElement = element.querySelector('.department, .program-department');
            if (departmentElement && content.department) {
                departmentElement.textContent = content.department;
            }
            
            // Update duration
            const durationElement = element.querySelector('.duration, .program-duration');
            if (durationElement && content.duration) {
                durationElement.textContent = content.duration;
            }
            
            // Update description
            const descElement = element.querySelector('.description, .program-description, p');
            if (descElement && content.description) {
                descElement.textContent = content.description;
            }
            
            // Update icon if needed
            const iconElement = element.querySelector('.program-icon i');
            if (iconElement && content.department) {
                let icon = 'fa-graduation-cap';
                if (content.department === 'Science') {
                    icon = 'fa-flask';
                } else if (content.department === 'Arts') {
                    icon = 'fa-paint-brush';
                } else if (content.department === 'Commerce') {
                    icon = 'fa-chart-line';
                } else if (content.department === 'Information Technology') {
                    icon = 'fa-desktop';
                }
                
                // Update the icon class
                iconElement.className = '';
                iconElement.classList.add('fas', icon);
            }
            
            // Highlight the updated element briefly
            element.classList.add('updated');
            setTimeout(() => {
                element.classList.remove('updated');
            }, 2000);
        });
    }
}

/**
 * Update college info on the website
 * 
 * @param {object} content - Updated college info
 */
function updateCollegeInfo(content) {
    // Update college name
    if (content.name) {
        document.querySelectorAll('.college-name').forEach(el => {
            el.textContent = content.name;
        });
    }
    
    // Update contact information
    if (content.email) {
        document.querySelectorAll('.contact-email, .college-email').forEach(el => {
            el.textContent = content.email;
            if (el.tagName === 'A') {
                el.href = `mailto:${content.email}`;
            }
        });
    }
    
    if (content.phone) {
        document.querySelectorAll('.contact-phone, .college-phone').forEach(el => {
            el.textContent = content.phone;
            if (el.tagName === 'A') {
                el.href = `tel:${content.phone.replace(/[^0-9+]/g, '')}`;
            }
        });
    }
    
    if (content.address) {
        document.querySelectorAll('.contact-address, .college-address').forEach(el => {
            el.textContent = content.address;
        });
    }
    
    // Update social media links
    if (content.social) {
        if (content.social.facebook) {
            document.querySelectorAll('a[href*="facebook.com"]').forEach(el => {
                el.href = content.social.facebook;
            });
        }
        
        if (content.social.twitter) {
            document.querySelectorAll('a[href*="twitter.com"]').forEach(el => {
                el.href = content.social.twitter;
            });
        }
        
        if (content.social.instagram) {
            document.querySelectorAll('a[href*="instagram.com"]').forEach(el => {
                el.href = content.social.instagram;
            });
        }
        
        if (content.social.linkedin) {
            document.querySelectorAll('a[href*="linkedin.com"]').forEach(el => {
                el.href = content.social.linkedin;
            });
        }
    }
}

/**
 * Show a notification message
 * 
 * @param {string} message - Notification message
 * @param {string} type - Type of notification (success, error, info, warning)
 */
function showNotification(message, type = 'info') {
    // Check if we need to create the notification element
    let notification = document.querySelector('.admin-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('admin-notification');
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = 'admin-notification'; // Reset classes
    notification.classList.add(`notification-${type}`);
    
    // Show notification
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
} 