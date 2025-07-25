/**
 * Website Content Updater
 * 
 * This module handles real-time updates to the website content
 * based on changes made in the admin panel.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load content from localStorage on page load
    loadAllContent();
    
    // Listen for content update events
    document.addEventListener('contentUpdated', function(e) {
        const { type, id, content, action } = e.detail;
        
        // Handle different types of content updates
        switch (type) {
            case 'gallery':
                updateGalleryContent(id, content, action);
                break;
            case 'faculty':
                updateFacultyContent(id, content, action);
                break;
            case 'event':
                updateEventContent(id, content, action);
                break;
            case 'program':
                updateProgramContent(id, content, action);
                break;
            case 'college-info':
                updateCollegeInfo(content);
                break;
        }
    });
    
    // Set up an interval to check for new updates
    setInterval(checkForContentUpdates, 5000);
});

/**
 * Load all content from localStorage on page load
 */
function loadAllContent() {
    // Load gallery items
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    galleryItems.forEach(item => {
        updateGalleryContent(item.id, item, 'add');
    });
    
    // Load faculty members
    const facultyMembers = JSON.parse(localStorage.getItem('facultyMembers') || '[]');
    facultyMembers.forEach(faculty => {
        updateFacultyContent(faculty.id, faculty, 'add');
    });
    
    // Load events
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    events.forEach(event => {
        updateEventContent(event.id, event, 'add');
    });
    
    // Load programs
    const programs = JSON.parse(localStorage.getItem('programs') || '[]');
    programs.forEach(program => {
        updateProgramContent(program.id, program, 'add');
    });
    
    // Load college info
    const collegeInfo = JSON.parse(localStorage.getItem('collegeInfo') || '{}');
    if (Object.keys(collegeInfo).length > 0) {
        updateCollegeInfo(collegeInfo);
    }
}

/**
 * Check for content updates periodically
 */
function checkForContentUpdates() {
    // This function would typically check with a server for updates
    // For our localStorage implementation, we don't need to do anything here
    // as updates are handled via the contentUpdated event
}

/**
 * Update gallery content on the website
 * 
 * @param {string} id - Gallery item ID
 * @param {object} content - Gallery item content
 * @param {string} action - Action type ('add', 'update', 'delete')
 */
function updateGalleryContent(id, content, action) {
    // Find all gallery sections on the website
    const gallerySections = document.querySelectorAll('.gallery-grid, .gallery-main-grid');
    
    if (action === 'delete') {
        // Remove the item from all gallery sections
        gallerySections.forEach(section => {
            const item = section.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.remove();
            }
        });
        return;
    }
    
    // For add or update actions
    gallerySections.forEach(section => {
        // Check if this item already exists in this section
        const existingItem = section.querySelector(`[data-id="${id}"]`);
        
        if (existingItem) {
            // Update existing item
            if (action === 'update') {
                // Update image/video source
                const img = existingItem.querySelector('img');
                if (img && content.src) {
                    img.src = content.src;
                    img.alt = content.title;
                }
                
                // Update title
                const title = existingItem.querySelector('h4, h3');
                if (title) {
                    title.textContent = content.title;
                }
                
                // Update category (data attribute)
                if (content.category) {
                    existingItem.setAttribute('data-type', `${content.type === 'image' ? 'images' : 'videos'} ${content.category}`);
                }
            }
        } else if (action === 'add' && section.children.length < 12) {
            // Only add to sections that don't already have too many items
            // Create new gallery item
            const newItem = document.createElement('div');
            newItem.classList.add('gallery-item');
            newItem.setAttribute('data-type', `${content.type === 'image' ? 'images' : 'videos'} ${content.category}`);
            newItem.setAttribute('data-id', id);
            
            // Different HTML structure based on whether it's in admin panel or website
            const isAdminPanel = document.querySelector('.admin-container') !== null;
            
            if (isAdminPanel) {
                // Admin panel gallery item structure
                if (content.type === 'image') {
                    newItem.innerHTML = `
                        <div class="gallery-item-image">
                            <img src="${content.src}" alt="${content.title}">
                        </div>
                        <div class="gallery-item-info">
                            <h4>${content.title}</h4>
                            <p>Uploaded: ${content.uploadDate}</p>
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
                            <p>Uploaded: ${content.uploadDate}</p>
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
                        <img src="${content.src}" alt="${content.title}">
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
            
            // Add the new item to the gallery
            section.prepend(newItem);
        }
    });
}

/**
 * Update faculty content on the website
 * 
 * @param {string} id - Faculty member ID
 * @param {object} content - Faculty member content
 * @param {string} action - Action type ('add', 'update', 'delete')
 */
function updateFacultyContent(id, content, action) {
    // Find all faculty sections on the website
    const facultySections = document.querySelectorAll('.faculty-grid');
    
    if (action === 'delete') {
        // Remove the faculty member from all sections
        facultySections.forEach(section => {
            const item = section.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.remove();
            }
        });
        return;
    }
    
    // For add or update actions
    facultySections.forEach(section => {
        // Check if this faculty member already exists in this section
        const existingItem = section.querySelector(`[data-id="${id}"]`);
        
        if (existingItem) {
            // Update existing faculty member
            if (action === 'update') {
                // Update image
                const img = existingItem.querySelector('img');
                if (img && content.image) {
                    img.src = content.image;
                    img.alt = content.name;
                }
                
                // Update name
                const name = existingItem.querySelector('h3');
                if (name) {
                    name.textContent = content.name;
                }
                
                // Update designation
                const designation = existingItem.querySelector('.designation');
                if (designation) {
                    designation.textContent = content.designation;
                }
                
                // Update qualification
                const qualification = existingItem.querySelector('.qualification');
                if (qualification) {
                    qualification.textContent = content.qualification;
                }
            }
        } else if (action === 'add') {
            // Create new faculty card
            const newItem = document.createElement('div');
            newItem.classList.add('faculty-card');
            newItem.setAttribute('data-id', id);
            
            // Different HTML structure based on whether it's in admin panel or website
            const isAdminPanel = document.querySelector('.admin-container') !== null;
            
            if (!isAdminPanel) {
                // Website faculty card structure
                newItem.innerHTML = `
                    <div class="faculty-image">
                        <img src="${content.image}" alt="${content.name}">
                    </div>
                    <div class="faculty-info">
                        <h3>${content.name}</h3>
                        <p class="designation">${content.designation}</p>
                        <p class="qualification">${content.qualification}</p>
                        ${content.experience ? `<p class="experience">${content.experience} years experience</p>` : ''}
                    </div>
                    <div class="faculty-contact">
                        ${content.email ? `<a href="mailto:${content.email}"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                `;
            }
            
            // Add the new faculty member to the section
            section.appendChild(newItem);
        }
    });
}

/**
 * Update event content on the website
 * 
 * @param {string} id - Event ID
 * @param {object} content - Event content
 * @param {string} action - Action type ('add', 'update', 'delete')
 */
function updateEventContent(id, content, action) {
    // Find all event sections on the website
    const eventSections = document.querySelectorAll('.events-slider');
    
    if (action === 'delete') {
        // Remove the event from all sections
        eventSections.forEach(section => {
            const item = section.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.remove();
            }
        });
        return;
    }
    
    // For add or update actions
    eventSections.forEach(section => {
        // Check if this event already exists in this section
        const existingItem = section.querySelector(`[data-id="${id}"]`);
        
        if (existingItem) {
            // Update existing event
            if (action === 'update') {
                // Update title
                const title = existingItem.querySelector('h3');
                if (title) {
                    title.textContent = content.title;
                }
                
                // Update date
                const date = existingItem.querySelector('.day');
                const month = existingItem.querySelector('.month');
                if (date && month && content.date) {
                    const eventDate = new Date(content.date);
                    date.textContent = eventDate.getDate();
                    month.textContent = eventDate.toLocaleString('default', { month: 'short' });
                }
                
                // Update location
                const location = existingItem.querySelector('.fa-map-marker-alt').parentNode;
                if (location && content.location) {
                    location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${content.location}`;
                }
                
                // Update time
                const time = existingItem.querySelector('.fa-clock').parentNode;
                if (time && content.time) {
                    time.innerHTML = `<i class="fas fa-clock"></i> ${content.time}`;
                }
            }
        } else if (action === 'add' && content.status === 'upcoming') {
            // Only add upcoming events
            // Create new event card
            const newItem = document.createElement('div');
            newItem.classList.add('event-card');
            newItem.setAttribute('data-id', id);
            
            // Parse the date
            const eventDate = new Date(content.date);
            const day = eventDate.getDate();
            const month = eventDate.toLocaleString('default', { month: 'short' });
            
            // Website event card structure
            newItem.innerHTML = `
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="event-details">
                    <h3>${content.title}</h3>
                    <p><i class="fas fa-clock"></i> ${content.time}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${content.location}</p>
                </div>
            `;
            
            // Add the new event to the section
            section.appendChild(newItem);
        }
    });
}

/**
 * Update program content on the website
 * 
 * @param {string} id - Program ID
 * @param {object} content - Program content
 * @param {string} action - Action type ('add', 'update', 'delete')
 */
function updateProgramContent(id, content, action) {
    // Find all program sections on the website
    const programSections = document.querySelectorAll('.programs-grid');
    
    if (action === 'delete') {
        // Remove the program from all sections
        programSections.forEach(section => {
            const item = section.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.remove();
            }
        });
        return;
    }
    
    // For add or update actions
    programSections.forEach(section => {
        // Check if this program already exists in this section
        const existingItem = section.querySelector(`[data-id="${id}"]`);
        
        if (existingItem) {
            // Update existing program
            if (action === 'update') {
                // Update title
                const title = existingItem.querySelector('h3');
                if (title) {
                    title.textContent = content.name;
                }
                
                // Update description
                const description = existingItem.querySelector('p');
                if (description && content.description) {
                    description.textContent = content.description;
                }
            }
        } else if (action === 'add' && content.status === 'active') {
            // Only add active programs
            // Create new program card
            const newItem = document.createElement('div');
            newItem.classList.add('program-card');
            newItem.setAttribute('data-id', id);
            
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
            
            // Website program card structure
            newItem.innerHTML = `
                <div class="program-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <h3>${content.name}</h3>
                <p>${content.description || `Our ${content.name} program offers comprehensive education in ${content.department}.`}</p>
                <a href="programs.html#${content.department.toLowerCase()}" class="btn-link">Explore <i class="fas fa-arrow-right"></i></a>
            `;
            
            // Add the new program to the section
            section.appendChild(newItem);
        }
    });
}

/**
 * Update college info on the website
 * 
 * @param {object} content - College info content
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