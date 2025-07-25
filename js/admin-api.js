/**
 * Admin API Handler
 * 
 * This module provides functions to interact with the backend API
 * for the admin panel operations.
 */

// API endpoints
const API = {
    programs: 'php/program-management.php',
    faculty: 'php/faculty-management.php',
    events: 'php/event-management.php',
    gallery: 'php/gallery-management.php',
    admissions: 'php/admission-management.php',
    settings: 'php/settings-management.php'
};

/**
 * Send an AJAX request to the backend
 * 
 * @param {string} url The API endpoint URL
 * @param {Object} data The data to send
 * @param {Function} successCallback Function to call on success
 * @param {Function} errorCallback Function to call on error
 * @param {boolean} isFileUpload Whether the request includes file uploads
 */
function sendRequest(url, data, successCallback, errorCallback, isFileUpload = false) {
    // Create form data for the request
    let formData;
    
    if (isFileUpload) {
        formData = new FormData();
        
        // Add all data to FormData
        for (const key in data) {
            if (data[key] instanceof FileList) {
                // Handle file inputs
                if (data[key].length > 0) {
                    formData.append(key, data[key][0]);
                }
            } else {
                formData.append(key, data[key]);
            }
        }
    } else {
        formData = new FormData();
        
        // Add all data to FormData
        for (const key in data) {
            formData.append(key, data[key]);
        }
    }
    
    // Create and configure the AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    
    // Set up event handlers
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                
                if (response.success) {
                    successCallback(response);
                } else {
                    errorCallback(response.message || 'An error occurred');
                }
            } catch (e) {
                errorCallback('Invalid response from server');
                console.error('Error parsing response:', e);
            }
        } else {
            errorCallback('Server error: ' + xhr.status);
        }
    };
    
    xhr.onerror = function() {
        errorCallback('Network error');
    };
    
    // Send the request
    xhr.send(formData);
}

/**
 * Program Management API
 */
const ProgramAPI = {
    /**
     * Get all programs
     * 
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    getAll: function(successCallback, errorCallback) {
        sendRequest(
            API.programs,
            { action: 'list' },
            successCallback,
            errorCallback
        );
    },
    
    /**
     * Add a new program
     * 
     * @param {Object} programData The program data
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    add: function(programData, successCallback, errorCallback) {
        programData.action = 'add';
        sendRequest(
            API.programs,
            programData,
            successCallback,
            errorCallback
        );
    },
    
    /**
     * Update an existing program
     * 
     * @param {Object} programData The program data
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    update: function(programData, successCallback, errorCallback) {
        programData.action = 'update';
        sendRequest(
            API.programs,
            programData,
            successCallback,
            errorCallback
        );
    },
    
    /**
     * Delete a program
     * 
     * @param {number} id The program ID
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    delete: function(id, successCallback, errorCallback) {
        sendRequest(
            API.programs,
            { action: 'delete', id: id },
            successCallback,
            errorCallback
        );
    }
};

/**
 * Faculty Management API
 */
const FacultyAPI = {
    /**
     * Get all faculty members
     * 
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    getAll: function(successCallback, errorCallback) {
        sendRequest(
            API.faculty,
            { action: 'list' },
            successCallback,
            errorCallback
        );
    },
    
    /**
     * Add a new faculty member
     * 
     * @param {Object} facultyData The faculty data
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    add: function(facultyData, successCallback, errorCallback) {
        facultyData.action = 'add';
        sendRequest(
            API.faculty,
            facultyData,
            successCallback,
            errorCallback,
            true // File upload
        );
    },
    
    /**
     * Update an existing faculty member
     * 
     * @param {Object} facultyData The faculty data
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    update: function(facultyData, successCallback, errorCallback) {
        facultyData.action = 'update';
        sendRequest(
            API.faculty,
            facultyData,
            successCallback,
            errorCallback,
            true // File upload
        );
    },
    
    /**
     * Delete a faculty member
     * 
     * @param {number} id The faculty ID
     * @param {Function} successCallback Function to call on success
     * @param {Function} errorCallback Function to call on error
     */
    delete: function(id, successCallback, errorCallback) {
        sendRequest(
            API.faculty,
            { action: 'delete', id: id },
            successCallback,
            errorCallback
        );
    }
};

// Export the API objects
window.AdminAPI = {
    Programs: ProgramAPI,
    Faculty: FacultyAPI
}; 