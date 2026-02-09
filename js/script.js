/*
    FILE: script.js - Common JavaScript Functions
    CONTENTS:
    1. Dark mode toggle functionality
    2. Motivational quotes API integration
    3. Form validation utilities
    4. Navigation and accessibility setup
    5. Smooth scrolling implementation
    6. Toast notification system
    7. Activity feed simulation
    8. Helper functions and utilities
    
    FEATURES:
    - Persistent dark mode preference
    - Real-time quote fetching with fallback
    - Comprehensive form validation
    - Accessible navigation
    - Interactive feedback system
    
    AUTHOR: George Papasotiriou
    COURSE: ITC 4214 - Fullstack Web Design
    PROJECT: ToMyPizza! Task Management Application
*/

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('ToMyPizza! website loaded successfully - George Papasotiriou ITC 4214');
    
    // Initialize all core functionalities
    initializeDarkMode();
    setupNavigation();
    enhanceAccessibility();
    setupSmoothScrolling();
    addInteractiveEffects();
    
    // Page-specific initializations
    if (document.getElementById('quote-text')) {
        initializeMotivationalQuotes();
    }
    
    if (document.getElementById('latest-activity')) {
        simulateActivityFeed();
    }
    
    // Add performance monitoring
    monitorPerformance();
});

// ===== DARK MODE FUNCTIONALITY =====
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('tomypizza-theme');
    const prefersDark = prefersDarkScheme.matches;
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
        if (darkModeToggle) darkModeToggle.checked = true;
    }
    
    // Setup toggle event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', handleDarkModeToggle);
    }
    
    // Listen for OS theme changes
    prefersDarkScheme.addEventListener('change', handleSystemThemeChange);
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.documentElement.setAttribute('data-theme', 'light');
}

function handleDarkModeToggle(event) {
    if (event.target.checked) {
        enableDarkMode();
        localStorage.setItem('tomypizza-theme', 'dark');
        showToast('Dark mode enabled', 'success');
    } else {
        disableDarkMode();
        localStorage.setItem('tomypizza-theme', 'light');
        showToast('Light mode enabled', 'info');
    }
}

function handleSystemThemeChange(event) {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem('tomypizza-theme')) {
        if (event.matches) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }
}

// ===== MOTIVATIONAL QUOTES API =====
async function initializeMotivationalQuotes() {
    // Load initial quote
    await fetchMotivationalQuote();
    
    // Setup refresh button
    const refreshButton = document.getElementById('new-quote');
    if (refreshButton) {
        refreshButton.addEventListener('click', handleQuoteRefresh);
    }
}

async function fetchMotivationalQuote() {
    try {
        // Try to fetch from API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://api.quotable.io/random?tags=motivational|success|food', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`API responded with ${response.status}`);
        }
        
        const quoteData = await response.json();
        updateQuoteDisplay(quoteData);
        
    } catch (error) {
        console.warn('Failed to fetch quote from API:', error);
        useFallbackQuote();
    }
}

function updateQuoteDisplay(quoteData) {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    
    if (quoteText && quoteAuthor) {
        quoteText.textContent = `"${quoteData.content}"`;
        quoteAuthor.textContent = `- ${quoteData.author}`;
        
        // Add visual feedback
        const container = document.getElementById('quote-container');
        container.classList.add('quote-updated');
        setTimeout(() => container.classList.remove('quote-updated'), 1000);
    }
}

function useFallbackQuote() {
    const pizzaQuotes = [
        {
            content: "Pizza is the answer, no matter the question.",
            author: "Unknown Pizza Lover"
        },
        {
            content: "Life is like a pizza, it's all about how you slice it.",
            author: "Pizza Proverb"
        },
        {
            content: "A day without pizza is like a day without sunshine.",
            author: "Italian Saying"
        },
        {
            content: "Happiness is a warm pizza fresh from the oven.",
            author: "Pizza Philosopher"
        },
        {
            content: "The best things in life are cheesy and delicious.",
            author: "Cheese Enthusiast"
        }
    ];
    
    const randomQuote = pizzaQuotes[Math.floor(Math.random() * pizzaQuotes.length)];
    updateQuoteDisplay(randomQuote);
}

async function handleQuoteRefresh(event) {
    const button = event.target;
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
    button.disabled = true;
    
    // Fetch new quote
    await fetchMotivationalQuote();
    
    // Restore button state
    button.innerHTML = originalText;
    button.disabled = false;
    
    // Show success feedback
    showToast('New quote loaded!', 'success');
}

// ===== ACTIVITY FEED SIMULATION =====
function simulateActivityFeed() {
    const activities = [
        {
            action: "Order completed",
            details: "Large Pepperoni Pizza to Aghia Paraskevi",
            time: "2 minutes ago",
            icon: "fa-pizza-slice",
            color: "warning"
        },
        {
            action: "Delivery started",
            details: "2x Margherita Pizzas to Chalandri",
            time: "5 minutes ago",
            icon: "fa-truck",
            color: "success"
        },
        {
            action: "In the oven",
            details: "Greek Style Pizza for Marousi",
            time: "8 minutes ago",
            icon: "fa-fire",
            color: "danger"
        },
        {
            action: "Order received",
            details: "BBQ Chicken Pizza for Kifisia",
            time: "10 minutes ago",
            icon: "fa-shopping-cart",
            color: "primary"
        },
        {
            action: "Dough prepared",
            details: "Family size pizza base",
            time: "12 minutes ago",
            icon: "fa-bread-slice",
            color: "warning"
        },
        {
            action: "Quality check",
            details: "Four Cheese Pizza approved",
            time: "15 minutes ago",
            icon: "fa-check-circle",
            color: "success"
        }
    ];
    
    // Update activity feed every 15 seconds
    setInterval(() => {
        updateActivityFeed(activities);
    }, 15000);
}

function updateActivityFeed(activities) {
    const activityContainer = document.getElementById('latest-activity');
    if (!activityContainer) return;
    
    const activityItems = activityContainer.querySelectorAll('.activity-item');
    if (activityItems.length === 0) return;
    
    // Get random activity
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    // Time updates for existing items
    const timeUpdates = ["just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago", "5 minutes ago"];
    
    // Shift all items down
    for (let i = activityItems.length - 1; i > 0; i--) {
        const currentTime = activityItems[i-1].querySelector('.text-muted').textContent;
        activityItems[i].querySelector('.text-muted').textContent = timeUpdates[Math.min(i, timeUpdates.length - 1)];
        
        // Update content from previous item
        const prevContent = activityItems[i-1].querySelector('.fw-medium').parentElement.innerHTML;
        activityItems[i].querySelector('.fw-medium').parentElement.innerHTML = prevContent;
    }
    
    // Update first item with new activity
    const firstItem = activityItems[0];
    firstItem.querySelector('.text-muted').textContent = "just now";
    firstItem.querySelector('.fw-medium').parentElement.innerHTML = `
        <i class="fas ${randomActivity.icon} text-${randomActivity.color} me-2"></i>
        <span class="fw-medium">${randomActivity.action}:</span> ${randomActivity.details}
    `;
    
    // Add subtle animation
    firstItem.style.opacity = '0.7';
    setTimeout(() => {
        firstItem.style.opacity = '1';
    }, 300);
}

// ===== FORM VALIDATION UTILITIES =====
function validateForm(formElement) {
    let isValid = true;
    const requiredInputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    
    requiredInputs.forEach(input => {
        if (!validateFormField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateFormField(field) {
    // Reset validation state
    field.classList.remove('is-invalid', 'is-valid');
    
    // Check if field is empty
    if (!field.value.trim()) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Special validation for email fields
    if (field.type === 'email' && !isValidEmail(field.value)) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Special validation for date/time fields
    if (field.type === 'datetime-local' || field.type === 'date') {
        const selectedDate = new Date(field.value);
        const currentDate = new Date();
        
        if (selectedDate < currentDate) {
            field.classList.add('is-invalid');
            field.nextElementSibling.textContent = 'Please select a future date and time';
            return false;
        }
    }
    
    // Field is valid
    field.classList.add('is-valid');
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NAVIGATION SETUP =====
function setupNavigation() {
    highlightCurrentPage();
    enhanceNavbarInteractions();
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Reset active state
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        // Set active state for current page
        if ((currentPage === 'index.html' && linkHref === 'index.html') || 
            (currentPage !== 'index.html' && linkHref === currentPage)) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function enhanceNavbarInteractions() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add keyboard navigation support
        link.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    addIconLabels();
    setupKeyboardNavigation();
    addSkipToContentLink();
}

function addIconLabels() {
    document.querySelectorAll('i[aria-hidden="true"]').forEach(icon => {
        const parentElement = icon.parentElement;
        
        if ((parentElement.tagName === 'BUTTON' || parentElement.tagName === 'A') && 
            !parentElement.getAttribute('aria-label')) {
            
            // Extract icon name from class for aria-label
            const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
            if (iconClass) {
                const labelText = iconClass.replace('fa-', '').replace('-', ' ');
                const formattedLabel = labelText.charAt(0).toUpperCase() + labelText.slice(1);
                parentElement.setAttribute('aria-label', formattedLabel);
            }
        }
    });
}

function setupKeyboardNavigation() {
    // Add keyboard navigation class for focus styles
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

function addSkipToContentLink() {
    // Create skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Skip to main content';
    
    // Add main content id if not present
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===== SMOOTH SCROLLING =====
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', handleSmoothScroll);
    });
}

function handleSmoothScroll(event) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        event.preventDefault();
        
        // Calculate offset for fixed header
        const navbar = document.querySelector('.navbar');
        const headerHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, targetId);
        
        // Focus target for accessibility
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus();
    }
}

// ===== INTERACTIVE EFFECTS =====
function addInteractiveEffects() {
    addRippleEffect();
    enhanceCardInteractions();
    setupFormFieldAnimations();
}

function addRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function createRipple(event) {
    const button = event.currentTarget;
    
    // Remove existing ripple
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) {
        existingRipple.remove();
    }
    
    // Create new ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    // Calculate ripple position and size
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    // Apply styles
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Add ripple to button
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode === button) {
            ripple.remove();
        }
    }, 600);
}

function enhanceCardInteractions() {
    document.querySelectorAll('.card.hover-shadow').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });
}

function setupFormFieldAnimations() {
    document.querySelectorAll('.form-control, .form-select').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    // Toast content
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fas ${getToastIcon(type)} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                    data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Initialize Bootstrap toast
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: duration
    });
    
    // Show toast
    bsToast.show();
    
    // Auto-remove from DOM after hiding
    toast.addEventListener('hidden.bs.toast', function() {
        if (toast.parentNode) {
            toast.remove();
        }
    });
    
    // Add click to dismiss
    toast.querySelector('.btn-close').addEventListener('click', function() {
        bsToast.hide();
    });
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle',
        info: 'fa-info-circle'
    };
    
    return icons[type] || 'fa-info-circle';
}

// ===== DATE FORMATTING UTILITIES =====
function formatDate(dateString, format = 'standard') {
    const date = new Date(dateString);
    
    const formats = {
        short: date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        
        time: date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        
        standard: date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        
        full: date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    return formats[format] || formats.standard;
}

// ===== DEBOUNCE UTILITY =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== PERFORMANCE MONITORING =====
function monitorPerformance() {
    // Log page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = window.performance.getEntriesByType('navigation')[0];
            if (perfData) {
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                console.log(`Page loaded in ${loadTime}ms`);
            }
        }
    });
    
    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('Largest Contentful Paint:', lastEntry.startTime, 'ms');
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    showToast('An error occurred. Please try again.', 'danger');
});

// ===== EXPORT FUNCTIONS FOR MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        validateForm, 
        validateFormField,
        isValidEmail,
        formatDate,
        showToast,
        debounce
    };
}

// ===== INJECT STYLES FOR DYNAMIC ELEMENTS =====
const dynamicStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .quote-updated {
        animation: quote-pulse 1s ease;
    }
    
    @keyframes quote-pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.02); opacity: 0.8; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    body.keyboard-navigation *:focus {
        outline: 3px solid rgba(255, 107, 0, 0.5) !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.25) !important;
    }
    
    .form-group.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .skip-to-main {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        text-decoration: none;
        border-radius: 0 0 0.5rem 0.5rem;
        z-index: 9999;
        transition: top 0.3s ease;
    }
    
    .skip-to-main:focus {
        top: 0;
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);