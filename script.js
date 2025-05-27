// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
});

// Appointment Form Handling
if (document.getElementById("appointmentForm")) {
    document.getElementById("appointmentForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const appointment = {
            id: Date.now(),
            fullname: document.getElementById("fullname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            message: document.getElementById("message").value
        };

        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        // Show success message
        showNotification("Appointment booked successfully!", "success");

        this.reset();
        loadAppointments();
    });

    // Load appointments on page load
    window.addEventListener('load', loadAppointments);
}

function loadAppointments() {
    const list = document.getElementById("appointmentList");
    const countElement = document.getElementById("appointmentCount");
    
    if (!list) return;
    
    list.innerHTML = "";
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Update count
    if (countElement) {
        if (appointments.length === 0) {
            countElement.textContent = "No appointments scheduled";
        } else {
            countElement.textContent = `${appointments.length} appointment${appointments.length > 1 ? 's' : ''} scheduled`;
        }
    }

    if (appointments.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments yet. Book your first appointment!</p>
            </div>
        `;
        return;
    }

    appointments.forEach(app => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${app.fullname}</strong>
            <div class="appointment-details">
                <div class="appointment-meta">
                    <i class="fas fa-envelope"></i>
                    <span>${app.email}</span>
                </div>
                <div class="appointment-meta">
                    <i class="fas fa-phone"></i>
                    <span>${app.phone}</span>
                </div>
                <div class="appointment-meta">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(app.date)}</span>
                </div>
                <div class="appointment-meta">
                    <i class="fas fa-clock"></i>
                    <span>${formatTime(app.time)}</span>
                </div>
            </div>
            ${app.message ? `<div class="appointment-message"><strong>Reason:</strong> ${app.message}</div>` : ''}
            <button class="delete-btn" onclick="deleteAppointment(${app.id})">
                <i class="fas fa-trash"></i>
                Delete
            </button>
        `;
        list.appendChild(li);
    });
}

function deleteAppointment(id) {
    if (confirm("Are you sure you want to delete this appointment?")) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments = appointments.filter(app => app.id !== id);
        localStorage.setItem("appointments", JSON.stringify(appointments));
        loadAppointments();
        showNotification("Appointment deleted successfully!", "success");
    }
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation Enhancement
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

function showFieldError(input, message) {
    clearFieldError(input);
    input.style.borderColor = '#f44336';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #f44336;
        font-size: 12px;
        margin-top: 5px;
        display: block;
    `;
    
    input.parentNode.appendChild(errorElement);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: 15px;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);