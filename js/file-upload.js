/**
 * File Upload and Management System
 * 
 * This module handles file uploads for the admin panel including:
 * - Image uploads for gallery
 * - Faculty profile photos
 * - Event images
 * - Program thumbnails
 */

// Initialize the file upload system
document.addEventListener('DOMContentLoaded', function() {
    // Set up file upload handlers
    setupFileUploadHandlers();
    
    // Set up delete functionality
    setupDeleteHandlers();
});

/**
 * Set up file upload handlers for all forms
 */
function setupFileUploadHandlers() {
    // Gallery image uploads
    setupGalleryUpload();
    
    // Faculty photo uploads
    setupFacultyPhotoUpload();
    
    // Event image uploads
    setupEventImageUpload();
}

/**
 * Set up gallery image upload functionality
 */
function setupGalleryUpload() {
    // Find the media upload form and file input
    const mediaUploadForms = document.querySelectorAll('#mediaUploadForm');
    
    mediaUploadForms.forEach(form => {
        const fileInput = form.querySelector('#mediaFile');
        if (!fileInput) return;
        
        // Show preview when file is selected
        fileInput.addEventListener('change', function(e) {
            const previewContainer = form.querySelector('.preview-container');
            const mediaPreview = form.querySelector('.media-preview');
            
            if (!previewContainer || !mediaPreview) return;
            
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewContainer.style.display = 'block';
                    
                    // Check if it's an image or video based on file type
                    if (file.type.startsWith('image/')) {
                        mediaPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    } else if (file.type.startsWith('video/')) {
                        mediaPreview.innerHTML = `
                            <video controls>
                                <source src="${e.target.result}" type="${file.type}">
                                Your browser does not support the video tag.
                            </video>
                        `;
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = form.querySelector('#mediaTitle').value;
            const category = form.querySelector('#mediaCategory').value;
            const description = form.querySelector('#mediaDescription').value;
            
            if (!fileInput.files || !fileInput.files[0]) {
                alert('Please select a file to upload');
                return;
            }
            
            const file = fileInput.files[0];
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');
            
            if (!isImage && !isVideo) {
                alert('Please select a valid image or video file');
                return;
            }
            
            // Create a unique ID for this item
            const itemId = `gallery-${Date.now()}`;
            
            // Create a data URL from the file
            const reader = new FileReader();
            reader.onload = function(e) {
                // Create the gallery item data
                const galleryItem = {
                    id: itemId,
                    title: title,
                    category: category,
                    description: description,
                    type: isImage ? 'image' : 'video',
                    src: e.target.result,
                    uploadDate: new Date().toLocaleDateString()
                };
                
                // Save to localStorage
                saveGalleryItem(galleryItem);
                
                // Add to the gallery grid
                addGalleryItemToGrid(galleryItem);
                
                // Show success message
                if (window.showNotification) {
                    window.showNotification(`New ${isImage ? 'image' : 'video'} uploaded successfully!`, 'success');
                }
                
                // Close modal if it exists
                const modal = document.querySelector('.admin-modal');
                if (modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                }
                
                // Reset form
                form.reset();
            };
            
            reader.readAsDataURL(file);
        });
    });
    
    // Handle add image/video buttons
    const addImageBtn = document.querySelector('#gallery .admin-btn:first-child');
    const addVideoBtn = document.querySelector('#gallery .admin-btn:nth-child(2)');
    
    if (addImageBtn) {
        addImageBtn.addEventListener('click', function() {
            showMediaUploadModal('image');
        });
    }
    
    if (addVideoBtn) {
        addVideoBtn.addEventListener('click', function() {
            showMediaUploadModal('video');
        });
    }
}

/**
 * Set up faculty photo upload functionality
 */
function setupFacultyPhotoUpload() {
    // Listen for faculty form submissions
    document.addEventListener('click', function(e) {
        if (e.target.closest('#facultyForm')) {
            const form = e.target.closest('#facultyForm');
            const fileInput = form.querySelector('#facultyPhoto');
            
            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    const previewContainer = form.querySelector('.preview-container');
                    const facultyPreview = form.querySelector('.faculty-preview');
                    
                    if (!previewContainer || !facultyPreview) return;
                    
                    if (this.files && this.files[0]) {
                        const file = this.files[0];
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            previewContainer.style.display = 'block';
                            facultyPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        };
                        
                        reader.readAsDataURL(file);
                    }
                });
                
                // Handle form submission
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    const name = form.querySelector('#facultyName').value;
                    const designation = form.querySelector('#facultyDesignation').value;
                    const department = form.querySelector('#facultyDepartment').value;
                    const qualification = form.querySelector('#facultyQualification').value;
                    const experience = form.querySelector('#facultyExperience').value;
                    const email = form.querySelector('#facultyEmail').value;
                    
                    // Check if this is an edit (form has data-id)
                    const isEdit = form.hasAttribute('data-id');
                    const facultyId = isEdit ? form.getAttribute('data-id') : `faculty-${Date.now()}`;
                    
                    // Process the faculty data
                    processFacultyData(facultyId, {
                        name,
                        designation,
                        department,
                        qualification,
                        experience,
                        email,
                        fileInput,
                        isEdit
                    });
                });
            }
        }
    });
}

/**
 * Process faculty data and save/update
 * 
 * @param {string} facultyId - Unique ID for the faculty member
 * @param {object} data - Faculty data object
 */
function processFacultyData(facultyId, data) {
    const { name, designation, department, qualification, experience, email, fileInput, isEdit } = data;
    
    // Create faculty data object
    const facultyData = {
        id: facultyId,
        name,
        designation,
        department,
        qualification,
        experience,
        email,
        lastUpdated: new Date().toISOString()
    };
    
    // If there's a file, process it
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            facultyData.image = e.target.result;
            saveFacultyMember(facultyData, isEdit);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        // If no new file, keep existing image if editing
        if (isEdit) {
            const existingData = getFacultyMember(facultyId);
            if (existingData && existingData.image) {
                facultyData.image = existingData.image;
            }
        }
        saveFacultyMember(facultyData, isEdit);
    }
}

/**
 * Set up event image upload functionality
 */
function setupEventImageUpload() {
    // Similar to faculty photo upload, but for events
    document.addEventListener('click', function(e) {
        if (e.target.closest('#eventForm')) {
            const form = e.target.closest('#eventForm');
            const fileInput = form.querySelector('#eventImage');
            
            if (fileInput) {
                fileInput.addEventListener('change', function(e) {
                    const previewContainer = form.querySelector('.preview-container');
                    const eventPreview = form.querySelector('.event-preview');
                    
                    if (!previewContainer || !eventPreview) return;
                    
                    if (this.files && this.files[0]) {
                        const reader = new FileReader();
                        
                        reader.onload = function(e) {
                            previewContainer.style.display = 'block';
                            eventPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                        };
                        
                        reader.readAsDataURL(fileInput.files[0]);
                    }
                });
            }
        }
    });
}

/**
 * Set up delete handlers for content items
 */
function setupDeleteHandlers() {
    // Listen for delete button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const deleteBtn = e.target.closest('.delete-btn');
            const item = deleteBtn.closest('.gallery-item, tr');
            
            if (!item) return;
            
            // Determine what type of item is being deleted
            let itemType, itemId, itemName;
            
            if (item.classList.contains('gallery-item')) {
                itemType = 'gallery';
                itemId = item.getAttribute('data-id');
                itemName = item.querySelector('h4').textContent;
            } else if (item.closest('#faculty')) {
                itemType = 'faculty';
                itemId = item.getAttribute('data-id');
                itemName = item.querySelector('td:nth-child(2)').textContent;
            } else if (item.closest('#events')) {
                itemType = 'event';
                itemId = item.getAttribute('data-id');
                itemName = item.querySelector('td:first-child').textContent;
            } else if (item.closest('#programs')) {
                itemType = 'program';
                itemId = item.getAttribute('data-id');
                itemName = item.querySelector('td:first-child').textContent;
            } else {
                return;
            }
            
            // Confirm deletion
            const confirmDelete = confirm(`Are you sure you want to delete "${itemName}"?`);
            if (confirmDelete) {
                // Delete the item from storage
                deleteContentItem(itemType, itemId);
                
                // Remove from UI with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.remove();
                }, 300);
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`"${itemName}" deleted successfully!`, 'success');
                }
                
                // Update the website immediately
                updateWebsiteContent(itemType, itemId, null, true);
            }
        }
    });
}

/**
 * Show media upload modal
 * 
 * @param {string} type - Type of media ('image' or 'video')
 * @param {object} existingData - Data for editing existing item (optional)
 */
function showMediaUploadModal(type, existingData = null) {
    // Create modal
    const modal = document.createElement('div');
    modal.classList.add('admin-modal');
    
    const isEdit = existingData !== null;
    
    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${isEdit ? 'Edit' : 'Add New'} ${type === 'image' ? 'Image' : 'Video'}</h3>
                <button class="modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <form id="mediaUploadForm">
                    <div class="form-group">
                        <label for="mediaTitle">Title</label>
                        <input type="text" id="mediaTitle" required placeholder="Enter title" value="${isEdit ? existingData.title : ''}">
                    </div>
                    <div class="form-group">
                        <label for="mediaCategory">Category</label>
                        <select id="mediaCategory" required>
                            <option value="">Select category</option>
                            <option value="campus" ${isEdit && existingData.category === 'campus' ? 'selected' : ''}>Campus</option>
                            <option value="events" ${isEdit && existingData.category === 'events' ? 'selected' : ''}>Events</option>
                            <option value="students" ${isEdit && existingData.category === 'students' ? 'selected' : ''}>Students</option>
                            <option value="faculty" ${isEdit && existingData.category === 'faculty' ? 'selected' : ''}>Faculty</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="mediaFile">Upload ${type === 'image' ? 'Image' : 'Video'}</label>
                        <input type="file" id="mediaFile" accept="${type === 'image' ? 'image/*' : 'video/*'}" ${isEdit ? '' : 'required'}>
                    </div>
                    <div class="form-group preview-container" ${isEdit ? '' : 'style="display: none;"'}>
                        <label>Preview</label>
                        <div class="media-preview">
                            ${isEdit ? (type === 'image' ? 
                                `<img src="${existingData.image}" alt="${existingData.title}">` : 
                                `<video controls><source src="${existingData.video}" type="video/mp4"></video>`) : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mediaDescription">Description</label>
                        <textarea id="mediaDescription" rows="3" placeholder="Enter description">${isEdit ? existingData.description || '' : ''}</textarea>
                    </div>
                    <input type="hidden" id="mediaId" value="${isEdit ? existingData.id : ''}">
                    <button type="submit" class="admin-btn">${isEdit ? 'Update' : 'Upload'}</button>
                </form>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close modal on button click
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    });
}

/**
 * Save gallery item to localStorage
 * 
 * @param {object} item - Gallery item data
 */
function saveGalleryItem(item) {
    // Get existing gallery items
    let galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    
    // Check if this is an update to an existing item
    const existingIndex = galleryItems.findIndex(existing => existing.id === item.id);
    
    if (existingIndex !== -1) {
        // Update existing item
        galleryItems[existingIndex] = item;
    } else {
        // Add new item
        galleryItems.push(item);
    }
    
    // Save back to localStorage
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    
    // Update the website content
    updateWebsiteContent('gallery', item.id, item);
}

/**
 * Add gallery item to the admin grid
 * 
 * @param {object} item - Gallery item data
 */
function addGalleryItemToGrid(item) {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    const newItem = document.createElement('div');
    newItem.classList.add('gallery-item');
    newItem.setAttribute('data-type', `${item.type === 'image' ? 'images' : 'videos'} ${item.category}`);
    newItem.setAttribute('data-id', item.id);
    
    if (item.type === 'image') {
        newItem.innerHTML = `
            <div class="gallery-item-image">
                <img src="${item.src}" alt="${item.title}">
            </div>
            <div class="gallery-item-info">
                <h4>${item.title}</h4>
                <p>Uploaded: ${item.uploadDate}</p>
            </div>
            <div class="gallery-item-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
    } else {
        newItem.innerHTML = `
            <div class="gallery-item-image video">
                <img src="images/gallery/video-thumbnail.jpg" alt="${item.title}">
                <div class="video-icon"><i class="fas fa-play"></i></div>
            </div>
            <div class="gallery-item-info">
                <h4>${item.title}</h4>
                <p>Uploaded: ${item.uploadDate}</p>
            </div>
            <div class="gallery-item-actions">
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
    }
    
    galleryGrid.prepend(newItem);
}

/**
 * Save faculty member to localStorage
 * 
 * @param {object} faculty - Faculty member data
 * @param {boolean} isEdit - Whether this is an edit of an existing item
 */
function saveFacultyMember(faculty, isEdit) {
    // Get existing faculty members
    let facultyMembers = JSON.parse(localStorage.getItem('facultyMembers') || '[]');
    
    // Check if this is an update to an existing member
    const existingIndex = facultyMembers.findIndex(existing => existing.id === faculty.id);
    
    if (existingIndex !== -1) {
        // Update existing member
        facultyMembers[existingIndex] = faculty;
    } else {
        // Add new member
        facultyMembers.push(faculty);
    }
    
    // Save back to localStorage
    localStorage.setItem('facultyMembers', JSON.stringify(facultyMembers));
    
    // Update the faculty table
    updateFacultyTable(faculty, isEdit);
    
    // Update the website content
    updateWebsiteContent('faculty', faculty.id, faculty);
    
    // Show notification
    if (window.showNotification) {
        window.showNotification(`Faculty member ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
    }
    
    // Close modal if it exists
    const modal = document.querySelector('.admin-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

/**
 * Get faculty member from localStorage
 * 
 * @param {string} id - Faculty member ID
 * @returns {object|null} - Faculty member data or null if not found
 */
function getFacultyMember(id) {
    const facultyMembers = JSON.parse(localStorage.getItem('facultyMembers') || '[]');
    return facultyMembers.find(member => member.id === id) || null;
}

/**
 * Update faculty table with new/updated faculty member
 * 
 * @param {object} faculty - Faculty member data
 * @param {boolean} isEdit - Whether this is an edit of an existing item
 */
function updateFacultyTable(faculty, isEdit) {
    const facultyTable = document.querySelector('.faculty-table tbody');
    if (!facultyTable) return;
    
    if (isEdit) {
        // Find the row to update
        const rows = facultyTable.querySelectorAll('tr');
        rows.forEach(row => {
            if (row.getAttribute('data-id') === faculty.id) {
                // Update the row
                row.setAttribute('data-department', faculty.department);
                row.innerHTML = `
                    <td><img src="${faculty.image}" alt="${faculty.name}"></td>
                    <td>${faculty.name}</td>
                    <td>${faculty.designation}</td>
                    <td>${faculty.department.charAt(0).toUpperCase() + faculty.department.slice(1)}</td>
                    <td>${faculty.qualification}</td>
                    <td>
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;
            }
        });
    } else {
        // Create new row
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-department', faculty.department);
        newRow.setAttribute('data-id', faculty.id);
        
        newRow.innerHTML = `
            <td><img src="${faculty.image}" alt="${faculty.name}"></td>
            <td>${faculty.name}</td>
            <td>${faculty.designation}</td>
            <td>${faculty.department.charAt(0).toUpperCase() + faculty.department.slice(1)}</td>
            <td>${faculty.qualification}</td>
            <td>
                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        facultyTable.appendChild(newRow);
    }
}

/**
 * Delete content item from localStorage
 * 
 * @param {string} type - Type of content ('gallery', 'faculty', 'event', 'program')
 * @param {string} id - Item ID
 */
function deleteContentItem(type, id) {
    let storageKey, items;
    
    switch (type) {
        case 'gallery':
            storageKey = 'galleryItems';
            break;
        case 'faculty':
            storageKey = 'facultyMembers';
            break;
        case 'event':
            storageKey = 'events';
            break;
        case 'program':
            storageKey = 'programs';
            break;
        default:
            return;
    }
    
    // Get existing items
    items = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Filter out the item to delete
    items = items.filter(item => item.id !== id);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(items));
}

/**
 * Update website content after changes in admin panel
 * 
 * @param {string} type - Type of content ('gallery', 'faculty', 'event', 'program')
 * @param {string} id - Item ID
 * @param {object} data - Updated data (null if deleted)
 * @param {boolean} isDelete - Whether this is a deletion
 */
function updateWebsiteContent(type, id, data, isDelete = false) {
    // Create a content update event
    const contentUpdateEvent = new CustomEvent('contentUpdated', {
        detail: {
            type: type,
            id: id,
            content: data,
            action: isDelete ? 'delete' : (data.id ? 'update' : 'add')
        }
    });
    
    // Dispatch the event for content-sync.js to handle
    document.dispatchEvent(contentUpdateEvent);
}

// Make functions available globally
window.fileUpload = {
    showMediaUploadModal,
    saveGalleryItem,
    saveFacultyMember,
    deleteContentItem
}; 