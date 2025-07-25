// Admin Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const adminSidebar = document.getElementById('adminSidebar');
    
    if (mobileMenuBtn && adminSidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            adminSidebar.classList.toggle('open');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!adminSidebar.contains(e.target) && e.target !== mobileMenuBtn && adminSidebar.classList.contains('open')) {
                adminSidebar.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
    
    // Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            const filterCategory = this.parentElement.classList[0]; // gallery-filters, faculty-filters, etc.
            const items = document.querySelectorAll(`.${filterCategory.split('-')[0]}-item, tbody tr`);
            
            // Remove active class from all filter buttons in this category
            document.querySelectorAll(`.${filterCategory} .filter-btn`).forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter items
            items.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = '';
                } else {
                    const itemType = item.getAttribute('data-type') || item.getAttribute('data-department') || item.getAttribute('data-status');
                    
                    if (itemType && itemType.includes(filterValue)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Real-time content editing functions
    function setupContentEditing() {
        // Make content editable on double-click
        document.addEventListener('dblclick', function(e) {
            const editableElements = [
                '.gallery-item-info h4', '.gallery-item-info p',
                'td:not(:first-child):not(:last-child)', 
                '.event-card h3', '.event-card p',
                '.faculty-card h3', '.faculty-card .designation', '.faculty-card .qualification'
            ];
            
            // Check if the clicked element or its parent matches any editable element selector
            let targetElement = null;
            for (const selector of editableElements) {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    targetElement = e.target.matches(selector) ? e.target : e.target.closest(selector);
                    break;
                }
            }
            
            if (targetElement) {
                // Save the original content
                const originalContent = targetElement.innerHTML;
                
                // Make it editable
                targetElement.setAttribute('contenteditable', 'true');
                targetElement.focus();
                
                // Add a class to show it's being edited
                targetElement.classList.add('editing');
                
                // Create save and cancel buttons
                const actionBtns = document.createElement('div');
                actionBtns.classList.add('edit-actions');
                actionBtns.innerHTML = `
                    <button class="save-edit-btn"><i class="fas fa-check"></i></button>
                    <button class="cancel-edit-btn"><i class="fas fa-times"></i></button>
                `;
                
                // Position the buttons
                const rect = targetElement.getBoundingClientRect();
                actionBtns.style.position = 'absolute';
                actionBtns.style.top = `${rect.bottom + window.scrollY}px`;
                actionBtns.style.left = `${rect.left + window.scrollX}px`;
                
                // Add to body
                document.body.appendChild(actionBtns);
                
                // Save button event
                actionBtns.querySelector('.save-edit-btn').addEventListener('click', function() {
                    const newContent = targetElement.innerHTML;
                    targetElement.setAttribute('contenteditable', 'false');
                    targetElement.classList.remove('editing');
                    actionBtns.remove();
                    
                    // Here you would typically send an AJAX request to save the changes
                    showNotification('Content updated successfully!', 'success');
                });
                
                // Cancel button event
                actionBtns.querySelector('.cancel-edit-btn').addEventListener('click', function() {
                    targetElement.innerHTML = originalContent;
                    targetElement.setAttribute('contenteditable', 'false');
                    targetElement.classList.remove('editing');
                    actionBtns.remove();
                });
                
                // Handle Esc key
                targetElement.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        targetElement.innerHTML = originalContent;
                        targetElement.setAttribute('contenteditable', 'false');
                        targetElement.classList.remove('editing');
                        actionBtns.remove();
                    } else if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        const newContent = targetElement.innerHTML;
                        targetElement.setAttribute('contenteditable', 'false');
                        targetElement.classList.remove('editing');
                        actionBtns.remove();
                        
                        // Here you would typically send an AJAX request to save the changes
                        showNotification('Content updated successfully!', 'success');
                    }
                });
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
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
    
    // Initialize content editing
    setupContentEditing();

    // Gallery Management with real-time preview
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
    
    // Show media upload modal
    function showMediaUploadModal(type) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('admin-modal');
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add New ${type === 'image' ? 'Image' : 'Video'}</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="mediaUploadForm">
                        <div class="form-group">
                            <label for="mediaTitle">Title</label>
                            <input type="text" id="mediaTitle" required placeholder="Enter title">
                        </div>
                        <div class="form-group">
                            <label for="mediaCategory">Category</label>
                            <select id="mediaCategory" required>
                                <option value="">Select category</option>
                                <option value="campus">Campus</option>
                                <option value="events">Events</option>
                                <option value="students">Students</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="mediaFile">Upload ${type === 'image' ? 'Image' : 'Video'}</label>
                            <input type="file" id="mediaFile" accept="${type === 'image' ? 'image/*' : 'video/*" required>
                        </div>
                        <div class="form-group preview-container" style="display: none;">
                            <label>Preview</label>
                            <div class="media-preview"></div>
                        </div>
                        <div class="form-group">
                            <label for="mediaDescription">Description</label>
                            <textarea id="mediaDescription" rows="3" placeholder="Enter description"></textarea>
                        </div>
                        <button type="submit" class="admin-btn">Upload</button>
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
        
        // File preview
        const fileInput = modal.querySelector('#mediaFile');
        const previewContainer = modal.querySelector('.preview-container');
        const mediaPreview = modal.querySelector('.media-preview');
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewContainer.style.display = 'block';
                    
                    if (type === 'image') {
                        mediaPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                    } else {
                        mediaPreview.innerHTML = `
                            <video controls>
                                <source src="${e.target.result}" type="${file.type}">
                                Your browser does not support the video tag.
                            </video>
                        `;
                    }
                }
                
                reader.readAsDataURL(file);
            }
        });
        
        // Form submission
        const form = modal.querySelector('#mediaUploadForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = modal.querySelector('#mediaTitle').value;
            const category = modal.querySelector('#mediaCategory').value;
            const description = modal.querySelector('#mediaDescription').value;
            
            // In a real application, you would upload the file to a server here
            // For demo purposes, we'll just add it to the gallery grid
            
            const galleryGrid = document.querySelector('.gallery-grid');
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            
            const newItem = document.createElement('div');
            newItem.classList.add('gallery-item');
            newItem.setAttribute('data-type', `${type === 'image' ? 'images' : 'videos'} ${category}`);
            
            if (type === 'image') {
                newItem.innerHTML = `
                    <div class="gallery-item-image">
                        <img src="${URL.createObjectURL(fileInput.files[0])}" alt="${title}">
                    </div>
                    <div class="gallery-item-info">
                        <h4>${title}</h4>
                        <p>Uploaded: ${formattedDate}</p>
                    </div>
                    <div class="gallery-item-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            } else {
                newItem.innerHTML = `
                    <div class="gallery-item-image video">
                        <img src="images/gallery/video-thumbnail.jpg" alt="${title}">
                        <div class="video-icon"><i class="fas fa-play"></i></div>
                    </div>
                    <div class="gallery-item-info">
                        <h4>${title}</h4>
                        <p>Uploaded: ${formattedDate}</p>
                    </div>
                    <div class="gallery-item-actions">
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            }
            
            galleryGrid.prepend(newItem);
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
            
            showNotification(`New ${type} uploaded successfully!`, 'success');
        });
    }
    
    // Faculty Management
    const addFacultyBtn = document.querySelector('#faculty .admin-btn');
    
    if (addFacultyBtn) {
        addFacultyBtn.addEventListener('click', function() {
            showFacultyModal();
        });
    }
    
    // Show faculty add/edit modal
    function showFacultyModal(facultyData = null) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('admin-modal');
        
        const isEdit = facultyData !== null;
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEdit ? 'Edit' : 'Add New'} Faculty Member</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="facultyForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="facultyName">Full Name</label>
                                <input type="text" id="facultyName" required placeholder="Enter full name" value="${isEdit ? facultyData.name : ''}">
                            </div>
                            <div class="form-group">
                                <label for="facultyDesignation">Designation</label>
                                <input type="text" id="facultyDesignation" required placeholder="Enter designation" value="${isEdit ? facultyData.designation : ''}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="facultyDepartment">Department</label>
                                <select id="facultyDepartment" required>
                                    <option value="">Select department</option>
                                    <option value="science" ${isEdit && facultyData.department === 'science' ? 'selected' : ''}>Science</option>
                                    <option value="arts" ${isEdit && facultyData.department === 'arts' ? 'selected' : ''}>Arts</option>
                                    <option value="commerce" ${isEdit && facultyData.department === 'commerce' ? 'selected' : ''}>Commerce</option>
                                    <option value="it" ${isEdit && facultyData.department === 'it' ? 'selected' : ''}>IT</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="facultyQualification">Qualification</label>
                                <input type="text" id="facultyQualification" required placeholder="Enter qualification" value="${isEdit ? facultyData.qualification : ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="facultyPhoto">Profile Photo</label>
                            <input type="file" id="facultyPhoto" accept="image/*" ${isEdit ? '' : 'required'}>
                        </div>
                        <div class="form-group preview-container" ${isEdit ? '' : 'style="display: none;"'}>
                            <label>Preview</label>
                            <div class="faculty-preview">
                                ${isEdit ? `<img src="${facultyData.image}" alt="${facultyData.name}">` : ''}
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="facultyExperience">Experience (years)</label>
                            <input type="number" id="facultyExperience" min="0" placeholder="Enter years of experience" value="${isEdit ? facultyData.experience : ''}">
                        </div>
                        <div class="form-group">
                            <label for="facultyEmail">Email</label>
                            <input type="email" id="facultyEmail" placeholder="Enter email address" value="${isEdit ? facultyData.email : ''}">
                        </div>
                        <button type="submit" class="admin-btn">${isEdit ? 'Update' : 'Add'} Faculty Member</button>
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
        
        // File preview
        const fileInput = modal.querySelector('#facultyPhoto');
        const previewContainer = modal.querySelector('.preview-container');
        const facultyPreview = modal.querySelector('.faculty-preview');
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewContainer.style.display = 'block';
                    facultyPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        // Form submission
        const form = modal.querySelector('#facultyForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = modal.querySelector('#facultyName').value;
            const designation = modal.querySelector('#facultyDesignation').value;
            const department = modal.querySelector('#facultyDepartment').value;
            const qualification = modal.querySelector('#facultyQualification').value;
            const experience = modal.querySelector('#facultyExperience').value;
            const email = modal.querySelector('#facultyEmail').value;
            
            // In a real application, you would upload the file to a server here
            // For demo purposes, we'll just add it to the faculty table
            
            const facultyTable = document.querySelector('.faculty-table tbody');
            
            if (isEdit) {
                // Find the row to update
                const rows = facultyTable.querySelectorAll('tr');
                let rowToUpdate = null;
                
                rows.forEach(row => {
                    if (row.querySelector('td:nth-child(2)').textContent === facultyData.name) {
                        rowToUpdate = row;
                    }
                });
                
                if (rowToUpdate) {
                    // Get the image source - use the new one if provided, otherwise keep the old one
                    let imageSrc = facultyData.image;
                    if (fileInput.files.length > 0) {
                        imageSrc = URL.createObjectURL(fileInput.files[0]);
                    }
                    
                    // Update the row
                    rowToUpdate.setAttribute('data-department', department);
                    rowToUpdate.innerHTML = `
                        <td><img src="${imageSrc}" alt="${name}"></td>
                        <td>${name}</td>
                        <td>${designation}</td>
                        <td>${department.charAt(0).toUpperCase() + department.slice(1)}</td>
                        <td>${qualification}</td>
                        <td>
                            <button class="edit-btn" data-name="${name}" data-designation="${designation}" 
                                data-department="${department}" data-qualification="${qualification}"
                                data-experience="${experience}" data-email="${email}" 
                                data-image="${imageSrc}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    
                    // Add event listeners to the new buttons
                    addFacultyActionEventListeners(rowToUpdate);
                    
                    showNotification('Faculty member updated successfully!', 'success');
                } else {
                    showNotification('Error updating faculty member. Please try again.', 'error');
                }
            } else {
                // Create new row
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-department', department);
                
                // Get image source
                const imageSrc = URL.createObjectURL(fileInput.files[0]);
                
                newRow.innerHTML = `
                    <td><img src="${imageSrc}" alt="${name}"></td>
                    <td>${name}</td>
                    <td>${designation}</td>
                    <td>${department.charAt(0).toUpperCase() + department.slice(1)}</td>
                    <td>${qualification}</td>
                    <td>
                        <button class="edit-btn" data-name="${name}" data-designation="${designation}" 
                            data-department="${department}" data-qualification="${qualification}"
                            data-experience="${experience}" data-email="${email}" 
                            data-image="${imageSrc}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Add event listeners to the new buttons
                addFacultyActionEventListeners(newRow);
                
                facultyTable.appendChild(newRow);
                
                showNotification('New faculty member added successfully!', 'success');
            }
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    // Helper function to add event listeners to faculty action buttons
    function addFacultyActionEventListeners(row) {
        // Edit button
        const editBtn = row.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const facultyData = {
                    name: this.getAttribute('data-name'),
                    designation: this.getAttribute('data-designation'),
                    department: this.getAttribute('data-department'),
                    qualification: this.getAttribute('data-qualification'),
                    experience: this.getAttribute('data-experience'),
                    email: this.getAttribute('data-email'),
                    image: this.getAttribute('data-image')
                };
                
                showFacultyModal(facultyData);
            });
        }
        
        // Delete button
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this faculty member?')) {
                    row.remove();
                    showNotification('Faculty member deleted successfully!', 'success');
                }
            });
        }
    }
    
    // Add event listeners to existing faculty action buttons
    function initializeFacultyActionButtons() {
        const facultyTable = document.querySelector('.faculty-table tbody');
        if (facultyTable) {
            const rows = facultyTable.querySelectorAll('tr');
            rows.forEach(row => {
                addFacultyActionEventListeners(row);
            });
        }
    }
    
    // Initialize faculty action buttons
    initializeFacultyActionButtons();
    
    // Events Management
    const addEventBtn = document.querySelector('#events .admin-btn');
    
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            showEventModal();
        });
    }
    
    // Show event add/edit modal
    function showEventModal(eventData = null) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('admin-modal');
        
        const isEdit = eventData !== null;
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEdit ? 'Edit' : 'Add New'} Event</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="eventForm">
                        <div class="form-group">
                            <label for="eventTitle">Event Title</label>
                            <input type="text" id="eventTitle" required placeholder="Enter event title" value="${isEdit ? eventData.title : ''}">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="eventDate">Date</label>
                                <input type="date" id="eventDate" required value="${isEdit ? eventData.date : ''}">
                            </div>
                            <div class="form-group">
                                <label for="eventTime">Time</label>
                                <input type="time" id="eventTime" required value="${isEdit ? eventData.time.split(' - ')[0] : ''}">
                                <span style="margin: 0 5px;">to</span>
                                <input type="time" id="eventTimeEnd" required value="${isEdit ? eventData.time.split(' - ')[1] : ''}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="eventLocation">Location</label>
                            <input type="text" id="eventLocation" required placeholder="Enter event location" value="${isEdit ? eventData.location : ''}">
                        </div>
                        <div class="form-group">
                            <label for="eventDescription">Description</label>
                            <textarea id="eventDescription" rows="3" placeholder="Enter event description">${isEdit ? eventData.description : ''}</textarea>
                        </div>
                        <button type="submit" class="admin-btn">${isEdit ? 'Update' : 'Add'} Event</button>
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
        
        // Form submission
        const form = modal.querySelector('#eventForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = modal.querySelector('#eventTitle').value;
            const date = modal.querySelector('#eventDate').value;
            const time = modal.querySelector('#eventTime').value;
            const timeEnd = modal.querySelector('#eventTimeEnd').value;
            const location = modal.querySelector('#eventLocation').value;
            const description = modal.querySelector('#eventDescription').value;
            
            // Format date
            const dateObj = new Date(date);
            const formattedDate = `${dateObj.toLocaleString('default', { month: 'long' })} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
            
            // Format time
            const formatTime = (timeStr) => {
                const [hours, minutes] = timeStr.split(':');
                const hour = parseInt(hours);
                return `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
            };
            
            const formattedTime = `${formatTime(time)} - ${formatTime(timeEnd)}`;
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just add it to the events table
            
            const eventsTable = document.querySelector('.events-table tbody');
            
            // Determine if it's an upcoming or past event
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const status = dateObj >= today ? 'upcoming' : 'past';
            
            if (isEdit) {
                // Find the row to update
                const rows = eventsTable.querySelectorAll('tr');
                rows.forEach(row => {
                    if (row.querySelector('td:first-child').textContent === eventData.title) {
                        // Update the row
                        row.setAttribute('data-status', status);
                        row.innerHTML = `
                            <td>${title}</td>
                            <td>${formattedDate}</td>
                            <td>${formattedTime}</td>
                            <td>${location}</td>
                            <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                            <td>
                                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                            </td>
                        `;
                    }
                });
                
                showNotification('Event updated successfully!', 'success');
            } else {
                // Create new row
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-status', status);
                
                newRow.innerHTML = `
                    <td>${title}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedTime}</td>
                    <td>${location}</td>
                    <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td>
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                eventsTable.appendChild(newRow);
                
                // Also add to the events section on the homepage
                if (status === 'upcoming') {
                    // Here you would typically update the homepage via AJAX
                    showNotification('Event added to homepage!', 'info');
                }
                
                showNotification('New event added successfully!', 'success');
            }
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    // Programs Management
    const addProgramBtn = document.querySelector('#programs .admin-btn');
    
    if (addProgramBtn) {
        addProgramBtn.addEventListener('click', function() {
            showProgramModal();
        });
    }
    
    // Show program add/edit modal
    function showProgramModal(programData = null) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('admin-modal');
        
        const isEdit = programData !== null;
        
        const modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${isEdit ? 'Edit' : 'Add New'} Program</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <form id="programForm">
                        <div class="form-group">
                            <label for="programName">Program Name</label>
                            <input type="text" id="programName" required placeholder="Enter program name" value="${isEdit ? programData.name : ''}">
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="programDepartment">Department</label>
                                <select id="programDepartment" required>
                                    <option value="">Select department</option>
                                    <option value="Science" ${isEdit && programData.department === 'Science' ? 'selected' : ''}>Science</option>
                                    <option value="Arts" ${isEdit && programData.department === 'Arts' ? 'selected' : ''}>Arts</option>
                                    <option value="Commerce" ${isEdit && programData.department === 'Commerce' ? 'selected' : ''}>Commerce</option>
                                    <option value="Information Technology" ${isEdit && programData.department === 'Information Technology' ? 'selected' : ''}>Information Technology</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="programDuration">Duration</label>
                                <input type="text" id="programDuration" required placeholder="e.g. 4 Years" value="${isEdit ? programData.duration : ''}">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="programSeats">Total Seats</label>
                                <input type="number" id="programSeats" required min="1" placeholder="Enter number of seats" value="${isEdit ? programData.seats : ''}">
                            </div>
                            <div class="form-group">
                                <label for="programStatus">Status</label>
                                <select id="programStatus" required>
                                    <option value="active" ${isEdit && programData.status === 'active' ? 'selected' : ''}>Active</option>
                                    <option value="inactive" ${isEdit && programData.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="programDescription">Description</label>
                            <textarea id="programDescription" rows="3" placeholder="Enter program description">${isEdit ? programData.description : ''}</textarea>
                        </div>
                        <button type="submit" class="admin-btn">${isEdit ? 'Update' : 'Add'} Program</button>
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
        
        // Form submission
        const form = modal.querySelector('#programForm');
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = modal.querySelector('#programName').value;
            const department = modal.querySelector('#programDepartment').value;
            const duration = modal.querySelector('#programDuration').value;
            const seats = modal.querySelector('#programSeats').value;
            const status = modal.querySelector('#programStatus').value;
            const description = modal.querySelector('#programDescription').value;
            
            // In a real application, you would send this data to a server via AJAX
            // For demo purposes, we'll just add it to the programs table
            
            const programsTable = document.querySelector('.programs-table tbody');
            
            if (isEdit) {
                // Find the row to update
                const rows = programsTable.querySelectorAll('tr');
                let rowToUpdate = null;
                
                rows.forEach(row => {
                    if (row.querySelector('td:first-child').textContent === programData.name) {
                        rowToUpdate = row;
                    }
                });
                
                if (rowToUpdate) {
                    // Update the row with sanitized description to avoid breaking the HTML
                    const sanitizedDesc = description.replace(/"/g, '&quot;');
                    rowToUpdate.innerHTML = `
                        <td>${name}</td>
                        <td>${department}</td>
                        <td>${duration}</td>
                        <td>${seats}</td>
                        <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                        <td>
                            <button class="edit-btn" data-name="${name}" data-department="${department}" data-duration="${duration}" data-seats="${seats}" data-status="${status}" data-description="${sanitizedDesc}"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    
                    // Add event listeners to the new buttons
                    addProgramActionEventListeners(rowToUpdate);
                    
                    showNotification('Program updated successfully!', 'success');
                } else {
                    showNotification('Error updating program. Please try again.', 'error');
                }
            } else {
                // Create new row
                const newRow = document.createElement('tr');
                newRow.setAttribute('data-department', department.toLowerCase());
                
                // Sanitize description to avoid breaking the HTML
                const sanitizedDesc = description.replace(/"/g, '&quot;');
                
                newRow.innerHTML = `
                    <td>${name}</td>
                    <td>${department}</td>
                    <td>${duration}</td>
                    <td>${seats}</td>
                    <td><span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></td>
                    <td>
                        <button class="edit-btn" data-name="${name}" data-department="${department}" data-duration="${duration}" data-seats="${seats}" data-status="${status}" data-description="${sanitizedDesc}"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                // Add event listeners to the new buttons
                addProgramActionEventListeners(newRow);
                
                programsTable.appendChild(newRow);
                
                showNotification('New program added successfully!', 'success');
            }
            
            // Close modal
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
    }
    
    // Helper function to add event listeners to program action buttons
    function addProgramActionEventListeners(row) {
        // Edit button
        const editBtn = row.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                const programData = {
                    name: this.getAttribute('data-name'),
                    department: this.getAttribute('data-department'),
                    duration: this.getAttribute('data-duration'),
                    seats: this.getAttribute('data-seats'),
                    status: this.getAttribute('data-status'),
                    description: this.getAttribute('data-description')
                };
                
                showProgramModal(programData);
            });
        }
        
        // Delete button
        const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this program?')) {
                    row.remove();
                    showNotification('Program deleted successfully!', 'success');
                }
            });
        }
    }
    
    // Add event listeners to existing program action buttons
    function initializeProgramActionButtons() {
        const programsTable = document.querySelector('.programs-table tbody');
        if (programsTable) {
            const rows = programsTable.querySelectorAll('tr');
            rows.forEach(row => {
                addProgramActionEventListeners(row);
            });
        }
    }
    
    // Initialize program action buttons
    initializeProgramActionButtons();
    
    // Action Buttons Event Listeners
    document.addEventListener('click', function(e) {
        // Edit Button
        if (e.target.closest('.edit-btn')) {
            const item = e.target.closest('tr') || e.target.closest('.gallery-item');
            
            if (item.closest('#gallery')) {
                // Gallery item edit
                const title = item.querySelector('h4').textContent;
                const type = item.getAttribute('data-type').includes('videos') ? 'video' : 'image';
                const imageSrc = item.querySelector('img').src;
                const uploadDate = item.querySelector('p').textContent.replace('Uploaded: ', '');
                
                showMediaUploadModal(type, {
                    title: title,
                    image: imageSrc,
                    uploadDate: uploadDate
                });
            } else if (item.closest('#faculty')) {
                // Faculty member edit
                const name = item.querySelector('td:nth-child(2)').textContent;
                const designation = item.querySelector('td:nth-child(3)').textContent;
                const department = item.getAttribute('data-department');
                const qualification = item.querySelector('td:nth-child(5)').textContent;
                const image = item.querySelector('img').src;
                
                showFacultyModal({
                    name: name,
                    designation: designation,
                    department: department,
                    qualification: qualification,
                    image: image,
                    experience: '',
                    email: ''
                });
            } else if (item.closest('#events')) {
                // Event edit
                const title = item.querySelector('td:nth-child(1)').textContent;
                const date = item.querySelector('td:nth-child(2)').textContent;
                const time = item.querySelector('td:nth-child(3)').textContent;
                const location = item.querySelector('td:nth-child(4)').textContent;
                
                showEventModal({
                    title: title,
                    date: '', // Would need to convert from formatted date
                    time: time,
                    location: location,
                    description: ''
                });
            } else if (item.closest('#programs')) {
                // Program edit
                const name = item.querySelector('td:nth-child(1)').textContent;
                const department = item.querySelector('td:nth-child(2)').textContent;
                const duration = item.querySelector('td:nth-child(3)').textContent;
                const seats = item.querySelector('td:nth-child(4)').textContent;
                const status = item.querySelector('.status').classList.contains('active') ? 'active' : 'inactive';
                
                showProgramModal({
                    name: name,
                    department: department,
                    duration: duration,
                    seats: seats,
                    status: status,
                    description: ''
                });
            } else if (item.closest('#admissions')) {
                // Application view
                const applicationId = item.querySelector('td:first-child').textContent;
                showApplicationDetails(applicationId);
            }
        }
        
        // Delete Button
        if (e.target.closest('.delete-btn')) {
            const item = e.target.closest('tr') || e.target.closest('.gallery-item');
            let itemName = '';
            
            if (item.closest('#gallery')) {
                itemName = item.querySelector('h4').textContent;
            } else if (item.querySelector('td:nth-child(2)')) {
                itemName = item.querySelector('td:nth-child(2)').textContent;
            } else if (item.querySelector('td:first-child')) {
                itemName = item.querySelector('td:first-child').textContent;
            } else {
                itemName = 'this item';
            }
            
            const confirmDelete = confirm(`Are you sure you want to delete "${itemName}"?`);
            if (confirmDelete) {
                // Here you would typically send an AJAX request to delete the item
                // For now, just remove the element from the DOM with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.remove();
                }, 300);
                
                showNotification(`"${itemName}" deleted successfully!`, 'success');
            }
        }
        
        // View Button
        if (e.target.closest('.view-btn')) {
            const item = e.target.closest('tr');
            const applicationId = item.querySelector('td:first-child').textContent;
            
            showApplicationDetails(applicationId);
        }
        
        // Approve Button
        if (e.target.closest('.approve-btn')) {
            const item = e.target.closest('tr');
            const applicationId = item.querySelector('td:first-child').textContent;
            
            const confirmApprove = confirm(`Are you sure you want to approve application ${applicationId}?`);
            if (confirmApprove) {
                // Here you would typically send an AJAX request to approve the application
                const statusCell = item.querySelector('td:nth-child(5)');
                statusCell.innerHTML = '<span class="status approved">Approved</span>';
                
                // Update the buttons
                const actionsCell = item.querySelector('td:last-child');
                actionsCell.innerHTML = '<button class="view-btn"><i class="fas fa-eye"></i></button>';
                
                // Update the data-status attribute
                item.setAttribute('data-status', 'approved');
                
                showNotification(`Application ${applicationId} approved successfully!`, 'success');
            }
        }
        
        // Reject Button
        if (e.target.closest('.reject-btn')) {
            const item = e.target.closest('tr');
            const applicationId = item.querySelector('td:first-child').textContent;
            
            const confirmReject = confirm(`Are you sure you want to reject application ${applicationId}?`);
            if (confirmReject) {
                // Here you would typically send an AJAX request to reject the application
                const statusCell = item.querySelector('td:nth-child(5)');
                statusCell.innerHTML = '<span class="status rejected">Rejected</span>';
                
                // Update the buttons
                const actionsCell = item.querySelector('td:last-child');
                actionsCell.innerHTML = '<button class="view-btn"><i class="fas fa-eye"></i></button>';
                
                // Update the data-status attribute
                item.setAttribute('data-status', 'rejected');
                
                showNotification(`Application ${applicationId} rejected successfully!`, 'success');
            }
        }
    });
    
    // Show application details
    function showApplicationDetails(applicationId) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('admin-modal');
        
        // In a real application, you would fetch the application details from a server
        // For demo purposes, we'll use hardcoded data
        
        const modalContent = `
            <div class="modal-content modal-lg">
                <div class="modal-header">
                    <h3>Application Details - ${applicationId}</h3>
                    <button class="modal-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="application-details">
                        <div class="detail-section">
                            <h4>Personal Information</h4>
                            <div class="detail-row">
                                <div class="detail-col">
                                    <label>Full Name</label>
                                    <p>Ahmed Ali</p>
                                </div>
                                <div class="detail-col">
                                    <label>Father's Name</label>
                                    <p>Muhammad Ali</p>
                                </div>
                                <div class="detail-col">
                                    <label>Date of Birth</label>
                                    <p>15-05-2000</p>
                                </div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-col">
                                    <label>CNIC</label>
                                    <p>4321-0987654-3</p>
                                </div>
                                <div class="detail-col">
                                    <label>Gender</label>
                                    <p>Male</p>
                                </div>
                                <div class="detail-col">
                                    <label>Nationality</label>
                                    <p>Pakistani</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Contact Information</h4>
                            <div class="detail-row">
                                <div class="detail-col">
                                    <label>Email</label>
                                    <p>ahmedali@gmail.com</p>
                                </div>
                                <div class="detail-col">
                                    <label>Phone</label>
                                    <p>+92-300-1234567</p>
                                </div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-col full-width">
                                    <label>Address</label>
                                    <p>House #123, Street #7, Mohalla ABC, Jacobabad, Sindh</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Academic Information</h4>
                            <div class="detail-row">
                                <div class="detail-col">
                                    <label>Applied Program</label>
                                    <p>Bachelor of Science (Physics)</p>
                                </div>
                                <div class="detail-col">
                                    <label>Previous Institution</label>
                                    <p>Govt. Higher Secondary School, Jacobabad</p>
                                </div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-col">
                                    <label>SSC Result</label>
                                    <p>Total Marks: 850/1100</p>
                                    <p>Percentage: 77.27%</p>
                                </div>
                                <div class="detail-col">
                                    <label>HSSC Result</label>
                                    <p>Total Marks: 900/1100</p>
                                    <p>Percentage: 81.82%</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Documents</h4>
                            <div class="document-list">
                                <div class="document-item">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>CNIC Copy</span>
                                    <a href="#" class="view-doc-btn">View</a>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>SSC Certificate</span>
                                    <a href="#" class="view-doc-btn">View</a>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>HSSC Certificate</span>
                                    <a href="#" class="view-doc-btn">View</a>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-file-image"></i>
                                    <span>Passport Size Photo</span>
                                    <a href="#" class="view-doc-btn">View</a>
                                </div>
                                <div class="document-item">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>Character Certificate</span>
                                    <a href="#" class="view-doc-btn">View</a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-section">
                            <h4>Application Status</h4>
                            <div class="status-timeline">
                                <div class="status-point active">
                                    <div class="status-dot"></div>
                                    <div class="status-label">Application Submitted</div>
                                    <div class="status-date">15 July, 2023</div>
                                </div>
                                <div class="status-point active">
                                    <div class="status-dot"></div>
                                    <div class="status-label">Documents Verified</div>
                                    <div class="status-date">17 July, 2023</div>
                                </div>
                                <div class="status-point">
                                    <div class="status-dot"></div>
                                    <div class="status-label">Interview</div>
                                    <div class="status-date">Pending</div>
                                </div>
                                <div class="status-point">
                                    <div class="status-dot"></div>
                                    <div class="status-label">Final Decision</div>
                                    <div class="status-date">Pending</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-actions-container">
                            <h4>Admin Actions</h4>
                            <div class="admin-action-buttons">
                                <button class="admin-btn approve-application-btn"><i class="fas fa-check"></i> Approve Application</button>
                                <button class="admin-btn reject-application-btn"><i class="fas fa-times"></i> Reject Application</button>
                                <button class="admin-btn request-docs-btn"><i class="fas fa-file"></i> Request More Documents</button>
                                <button class="admin-btn schedule-interview-btn"><i class="fas fa-calendar"></i> Schedule Interview</button>
                            </div>
                            <div class="admin-comments">
                                <h5>Add Comment</h5>
                                <textarea placeholder="Add a comment or note regarding this application"></textarea>
                                <button class="admin-btn"><i class="fas fa-paper-plane"></i> Submit Comment</button>
                            </div>
                        </div>
                    </div>
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
        
        // Admin action buttons
        const approveBtn = modal.querySelector('.approve-application-btn');
        const rejectBtn = modal.querySelector('.reject-application-btn');
        const requestDocsBtn = modal.querySelector('.request-docs-btn');
        const scheduleInterviewBtn = modal.querySelector('.schedule-interview-btn');
        
        approveBtn.addEventListener('click', function() {
            const confirmApprove = confirm(`Are you sure you want to approve application ${applicationId}?`);
            if (confirmApprove) {
                // Update the application status in the UI
                const rows = document.querySelectorAll('#admissions tbody tr');
                rows.forEach(row => {
                    if (row.querySelector('td:first-child').textContent === applicationId) {
                        const statusCell = row.querySelector('td:nth-child(5)');
                        statusCell.innerHTML = '<span class="status approved">Approved</span>';
                        
                        // Update the buttons
                        const actionsCell = row.querySelector('td:last-child');
                        actionsCell.innerHTML = '<button class="view-btn"><i class="fas fa-eye"></i></button>';
                        
                        // Update the data-status attribute
                        row.setAttribute('data-status', 'approved');
                    }
                });
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
                
                showNotification(`Application ${applicationId} approved successfully!`, 'success');
            }
        });
        
        rejectBtn.addEventListener('click', function() {
            const confirmReject = confirm(`Are you sure you want to reject application ${applicationId}?`);
            if (confirmReject) {
                // Update the application status in the UI
                const rows = document.querySelectorAll('#admissions tbody tr');
                rows.forEach(row => {
                    if (row.querySelector('td:first-child').textContent === applicationId) {
                        const statusCell = row.querySelector('td:nth-child(5)');
                        statusCell.innerHTML = '<span class="status rejected">Rejected</span>';
                        
                        // Update the buttons
                        const actionsCell = row.querySelector('td:last-child');
                        actionsCell.innerHTML = '<button class="view-btn"><i class="fas fa-eye"></i></button>';
                        
                        // Update the data-status attribute
                        row.setAttribute('data-status', 'rejected');
                    }
                });
                
                // Close modal
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.remove();
                }, 300);
                
                showNotification(`Application ${applicationId} rejected successfully!`, 'success');
            }
        });
        
        requestDocsBtn.addEventListener('click', function() {
            alert('This will send a notification to the applicant requesting additional documents. Feature coming soon!');
        });
        
        scheduleInterviewBtn.addEventListener('click', function() {
            alert('This will open an interview scheduling interface. Feature coming soon!');
        });
    }
    
    // Settings Forms
    const settingsForms = document.querySelectorAll('.settings-form');
    
    settingsForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Settings saved successfully!');
            // Here you would typically send an AJAX request to save the settings
        });
    });
    
    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Clear login status
            localStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminLoggedIn');
            
            // Show notification
            showNotification('You have been logged out successfully!', 'info');
            
            // Redirect after a short delay
            setTimeout(function() {
                window.location.href = 'admin-login.html';
            }, 1500);
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // Go back to dashboard tab
            menuItems.forEach(item => item.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            
            menuItems[0].classList.add('active');
            tabs[0].classList.add('active');
        });
    }
    
    // Responsive Sidebar Toggle for mobile
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.classList.add('admin-menu-toggle');
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    document.body.appendChild(mobileMenuToggle);
    
    mobileMenuToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('active');
        
        // Change the icon
        if (sidebar.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.admin-sidebar');
        const mobileToggle = document.querySelector('.admin-menu-toggle');
        
        if (window.innerWidth <= 576 && 
            sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            e.target !== mobileToggle && 
            !mobileToggle.contains(e.target)) {
            
            sidebar.classList.remove('active');
            mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}); 