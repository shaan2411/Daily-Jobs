// public/js/main.js
const API_URL = '/api';

// Utility for fetching data
async function fetchAPI(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    // Don't set Content-Type for FormData (file uploads)
    if (options.body instanceof FormData) {
        delete defaultHeaders['Content-Type'];
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// Check auth state
function updateAuthUI() {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const navLinks = document.getElementById('nav-links');

    if (!navLinks) return;

    if (userId) {
        let linksHtml = '';
        if (role === 'employer') {
            linksHtml = `
                <a href="/dashboard">Dashboard</a>
                <a href="/post-job" class="btn btn-primary" style="color: white; margin-left:1rem;">Post Job</a>
            `;
        } else {
            // Seeker
            linksHtml = `
                <a href="/jobs">Find Jobs</a>
                <a href="/dashboard">Dashboard</a>
            `;
        }

        linksHtml += `
            <a href="/profile">Profile</a>
            <a href="#" id="logout-btn" style="color: var(--danger-color);">Logout</a>
        `;
        navLinks.innerHTML = linksHtml;

        document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetchAPI('/auth/logout', { method: 'POST' });
                localStorage.removeItem('userId');
                localStorage.removeItem('role');
                window.location.href = '/';
            } catch (err) {
                console.error('Logout failed', err);
            }
        });
    } else {
        navLinks.innerHTML = `
            <a href="/jobs">Browse Jobs</a>
            <a href="/login">Login</a>
            <a href="/register" class="btn btn-primary" style="color: white; margin-left: 1rem;">Register</a>
        `;
    }
}

// Show alert message
function showAlert(message, type = 'error') {
    let alertBox = document.getElementById('alert-box');

    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'alert-box';
        alertBox.className = `alert alert-${type}`;

        // Try to insert it before forms, or at the top of main container
        const container = document.querySelector('.auth-wrapper .card') || document.querySelector('main .container');
        if (container) {
            container.insertBefore(alertBox, container.firstChild);
        } else {
            document.body.appendChild(alertBox);
        }
    }

    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 5000);
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});
