// public/js/main.js
const API_URL = '/api';

// Utility for fetching data
async function fetchAPI(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    const token = localStorage.getItem('token');
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

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
        if (role === 'employer') {
            linksHtml = `
                <a href="/">Home</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/employer">Review Apps</a>
                <a href="/profile">Profile</a>
                <a href="#" id="logout-btn" style="color: var(--danger-color);">Logout</a>
            `;
        } else {
            linksHtml = `
                <a href="/">Home</a>
                <a href="/jobs">Find Jobs</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/profile">Profile</a>
                <a href="#" id="logout-btn" style="color: var(--danger-color);">Logout</a>
            `;
        }
        navLinks.innerHTML = linksHtml;

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            window.location.href = 'login.html';
        });
    } else {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="login.html">Login</a>
            <a href="register.html" class="btn btn-primary" style="color: white; margin-left: 1rem;">Register</a>
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

// Notification System Logic
async function initNotifications() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const navInner = document.querySelector('.navbar-inner');
    if (!navInner) return;

    // Inject Notification Bell
    const notifWrapper = document.createElement('div');
    notifWrapper.className = 'nav-notif-wrapper';
    notifWrapper.style.marginRight = '1rem';
    notifWrapper.innerHTML = `
        <button class="notif-btn" id="notif-toggle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span class="notif-badge hidden" id="notif-count">0</span>
        </button>
        <div class="notif-dropdown" id="notif-dropdown">
            <div class="notif-header">
                <span>Notifications</span>
            </div>
            <div class="notif-list" id="notif-list">
                <div class="notif-empty">No new notifications</div>
            </div>
        </div>
    `;

    // Insert before nav-links or at the end
    const navLinks = document.getElementById('nav-links');
    navLinks.parentNode.insertBefore(notifWrapper, navLinks);

    const toggle = document.getElementById('notif-toggle');
    const dropdown = document.getElementById('notif-dropdown');
    const list = document.getElementById('notif-list');
    const badge = document.getElementById('notif-count');

    // Toggle Dropdown
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
        if (dropdown.classList.contains('active')) {
            fetchNotifications();
        }
    });

    document.addEventListener('click', () => dropdown.classList.remove('active'));
    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Fetch Notifications
    async function fetchNotifications() {
        try {
            const userId = localStorage.getItem('userId');
            const notifications = await fetchAPI(`/notification/${userId}`);
            renderNotifications(notifications);
            
            const unread = notifications.filter(n => !n.isRead).length;
            if (unread > 0) {
                badge.textContent = unread;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    }

    function renderNotifications(notifs) {
        if (notifs.length === 0) {
            list.innerHTML = '<div class="notif-empty">No notifications yet</div>';
            return;
        }

        list.innerHTML = notifs.map(n => `
            <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n._id}">
                <div class="notif-msg">${n.message}</div>
                <div class="notif-time">${new Date(n.createdAt).toLocaleString()}</div>
            </div>
        `).join('');

        // Mark as read on click
        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', async () => {
                const id = item.dataset.id;
                try {
                    await fetchAPI(`/notification/${id}/read`, { method: 'PATCH' });
                    item.classList.remove('unread');
                    fetchNotifications(); // Refresh count
                } catch (err) {
                    console.error('Failed to mark as read', err);
                }
            });
        });
    }

    // Initial fetch and poll
    fetchNotifications();
    setInterval(fetchNotifications, 30000); // Poll every 30s
}

// Apply for a job
async function applyJob(jobId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        window.location.href = 'login.html';
        return;
    }
    try {
        await fetchAPI('/apply', {
            method: 'POST',
            body: JSON.stringify({ jobId, userId })
        });
        showAlert('Application submitted successfully!', 'success');
    } catch (err) {
        showAlert(err.message, 'error');
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    initNotifications();
});
