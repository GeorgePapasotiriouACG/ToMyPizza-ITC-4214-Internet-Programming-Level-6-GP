/*
    FILE: contact.js - Contact Form Handling
    CONTENTS:
    1. ContactForm class for form management
    2. Form validation with real-time feedback
    3. Form submission handling
    4. Confirmation modal display
    5. FAQ interactivity
    6. Social media link enhancements (Added icons and animations)
    
    FEATURES:
    - Comprehensive form validation
    - Real-time field validation
    - Form data confirmation modal
    - Interactive FAQ accordion
    - Social media hover effects
    - Accessibility enhancements
    
    AUTHOR: George Papasotiriou
    COURSE: ITC 4214 - Fullstack Web Design
    PROJECT: ToMyPizza! Task Management Application
*/

// ===== CONTACT FORM CLASS =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.init();
    }
    
    // ===== INITIALIZATION =====
    init() {
        this.setupFormValidation();
        this.setupEventListeners();
        this.setupFAQInteractions();
        this.setupSocialMediaEffects();
        this.setupFormAnimations();
    }
    
    // ===== FORM VALIDATION SETUP =====
    setupFormValidation() {
        // Custom validation for email field
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('input', () => {
                if (emailField.value && !this.isValidEmail(emailField.value)) {
                    emailField.setCustomValidity('Please enter a valid email address (e.g., name@example.com)');
                } else {
                    emailField.setCustomValidity('');
                }
            });
        }
        
        // Character counter for message field
        const messageField = document.getElementById('message');
        if (messageField) {
            this.setupCharacterCounter(messageField, 500);
        }
    }
    
    setupCharacterCounter(field, maxLength) {
        const counter = document.createElement('div');
        counter.className = 'form-text text-end';
        counter.id = `${field.id}-counter`;
        counter.textContent = `0/${maxLength} characters`;
        
        field.parentNode.insertBefore(counter, field.nextSibling);
        
        field.addEventListener('input', () => {
            const currentLength = field.value.length;
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (currentLength > maxLength * 0.9) {
                counter.classList.add('text-warning');
            } else {
                counter.classList.remove('text-warning');
            }
            
            if (currentLength > maxLength) {
                counter.classList.add('text-danger');
                field.classList.add('is-invalid');
            } else {
                counter.classList.remove('text-danger');
                field.classList.remove('is-invalid');
            }
        });
    }
    
    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        
        // Real-time validation on blur
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldValidation(field));
        });
        
        // Newsletter toggle effect
        const newsletterCheckbox = document.getElementById('newsletter');
        if (newsletterCheckbox) {
            newsletterCheckbox.addEventListener('change', (event) => {
                const label = event.target.nextElementSibling;
                if (event.target.checked) {
                    label.classList.add('text-warning');
                    this.showToast('You\'ll receive pizza deals and updates!', 'success');
                } else {
                    label.classList.remove('text-warning');
                }
            });
        }
    }
    
    // ===== FORM VALIDATION METHODS =====
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validateField(field) {
        field.classList.remove('is-invalid', 'is-valid');
        
        // Check required fields
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('is-invalid');
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
            field.classList.add('is-invalid');
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        // Message length validation
        if (field.id === 'message' && field.value.length > 500) {
            field.classList.add('is-invalid');
            this.showFieldError(field, 'Message must be 500 characters or less');
            return false;
        }
        
        // If field has value and passed validation
        if (field.value.trim()) {
            field.classList.add('is-valid');
            this.clearFieldError(field);
        }
        
        return true;
    }
    
    clearFieldValidation(field) {
        field.classList.remove('is-invalid');
        this.clearFieldError(field);
    }
    
    showFieldError(field, message) {
        let errorElement = field.nextElementSibling;
        
        // Create error element if it doesn't exist
        if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.textContent = '';
        }
    }
    
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // ===== FORM SUBMISSION HANDLER =====
    async handleSubmit(event) {
        event.preventDefault();
        
        if (!this.validateForm()) {
            this.showFormError('Please fill in all required fields correctly.');
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call delay
            await this.simulateApiCall();
            
            // Get form data
            const formData = this.getFormData();
            
            // Show confirmation modal
            this.showConfirmationModal(formData);
            
            // Reset form
            this.form.reset();
            this.resetFormValidation();
            
            // Show success message
            this.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError('Something went wrong. Please try again.');
        } finally {
            // Restore button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500); // Simulate 1.5 second API call
        });
    }
    
    getFormData() {
        return {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            newsletter: document.getElementById('newsletter').checked,
            timestamp: new Date().toISOString(),
            ipAddress: this.getClientIP() // Simulated for demo
        };
    }
    
    getClientIP() {
        // This is a simulation - in a real app, you'd get this from the server
        const simulatedIPs = [
            '192.168.1.100',
            '10.0.0.50',
            '172.16.254.1'
        ];
        return simulatedIPs[Math.floor(Math.random() * simulatedIPs.length)];
    }
    
    resetFormValidation() {
        this.form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        
        this.form.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });
        
        // Reset character counter
        const counter = document.getElementById('message-counter');
        if (counter) {
            counter.textContent = '0/500 characters';
            counter.classList.remove('text-warning', 'text-danger');
        }
    }
    
    // ===== CONFIRMATION MODAL =====
    showConfirmationModal(formData) {
        const modalId = 'contact-confirmation-modal';
        let modal = document.getElementById(modalId);
        
        // Create modal if it doesn't exist
        if (!modal) {
            modal = this.createConfirmationModal(modalId);
            document.body.appendChild(modal);
        }
        
        // Populate modal with form data
        this.populateConfirmationModal(modal, formData);
        
        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Add close button event listener
        modal.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', () => {
            bsModal.hide();
        });
    }
    
    createConfirmationModal(id) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = id;
        modal.tabIndex = -1;
        modal.setAttribute('aria-labelledby', 'confirmationModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-warning text-dark">
                        <h5 class="modal-title" id="confirmationModalLabel">
                            <i class="fas fa-check-circle me-2"></i>Message Sent Successfully!
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" 
                                aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success">
                            <i class="fas fa-pizza-slice me-2"></i>
                            Thank you for contacting ToMyPizza! Athens. We'll respond within 24 hours.
                        </div>
                        <div class="confirmation-details mt-4">
                            <h6 class="fw-bold mb-3">Message Details:</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <tbody id="confirmation-details-body">
                                        <!-- Details will be populated here -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="pizza-celebration text-center mt-4">
                            <i class="fas fa-pizza-slice fa-3x text-warning"></i>
                            <i class="fas fa-heart fa-2x text-danger mx-3"></i>
                            <i class="fas fa-pizza-slice fa-3x text-warning"></i>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Close
                        </button>
                        <button type="button" class="btn btn-outline-warning" id="send-another">
                            <i class="fas fa-redo me-2"></i>Send Another
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    populateConfirmationModal(modal, formData) {
        const detailsBody = modal.querySelector('#confirmation-details-body');
        
        const details = [
            { label: 'Name', value: formData.name },
            { label: 'Email', value: formData.email },
            { label: 'Subject', value: this.formatSubject(formData.subject) },
            { label: 'Message', value: this.truncateMessage(formData.message, 100) },
            { label: 'Newsletter', value: formData.newsletter ? 'Subscribed' : 'Not subscribed' },
            { label: 'Submitted', value: new Date(formData.timestamp).toLocaleString() },
            { label: 'Reference ID', value: `ATH-${Date.now().toString().slice(-6)}` }
        ];
        
        detailsBody.innerHTML = details.map(detail => `
            <tr>
                <th class="text-nowrap">${detail.label}:</th>
                <td>${detail.value}</td>
            </tr>
        `).join('');
        
        // Add event listener for "Send Another" button
        modal.querySelector('#send-another').addEventListener('click', () => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            bsModal.hide();
            
            // Scroll to form
            setTimeout(() => {
                this.form.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('name').focus();
            }, 300);
        });
    }
    
    formatSubject(subjectValue) {
        const subjects = {
            'order': 'Order Issue',
            'feedback': 'Feedback/Suggestion',
            'corporate': 'Corporate Inquiry',
            'careers': 'Careers in Athens',
            'other': 'Other'
        };
        return subjects[subjectValue] || subjectValue;
    }
    
    truncateMessage(message, maxLength) {
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    }
    
    // ===== FAQ INTERACTIONS =====
    setupFAQInteractions() {
        const faqItems = document.querySelectorAll('.accordion-item');
        
        faqItems.forEach((item, index) => {
            const button = item.querySelector('.accordion-button');
            const body = item.querySelector('.accordion-body');
            
            // Add pizza decoration to FAQ items
            if (!body.querySelector('.pizza-decoration')) {
                const decoration = document.createElement('div');
                decoration.className = 'pizza-decoration mt-3';
                decoration.innerHTML = `
                    <i class="fas fa-cheese text-warning"></i>
                    <i class="fas fa-question-circle text-info mx-2"></i>
                    <i class="fas fa-cheese text-warning"></i>
                `;
                body.appendChild(decoration);
            }
            
            // Add click animation
            button.addEventListener('click', () => {
                // Add bounce animation to pizza decoration
                const decoration = body.querySelector('.pizza-decoration');
                if (decoration) {
                    decoration.classList.add('faq-bounce');
                    setTimeout(() => decoration.classList.remove('faq-bounce'), 1000);
                }
                
                // Log FAQ interaction for analytics
                this.logFAQInteraction(index + 1);
            });
        });
    }
    
    logFAQInteraction(faqNumber) {
        // In a real app, this would send data to analytics
        console.log(`FAQ #${faqNumber} viewed`);
    }
    
    // ===== SOCIAL MEDIA EFFECTS =====
    setupSocialMediaEffects() {
        const socialButtons = document.querySelectorAll('.social-links a');
        
        socialButtons.forEach(button => {
            const icon = button.querySelector('i');
            if (!icon) return;
            
            // Store original icon class
            const originalIconClass = icon.className;
            
            button.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
                
                // Add pulse animation
                button.classList.add('social-pulse');
            });
            
            button.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
                button.classList.remove('social-pulse');
            });
            
            // Add click effect
            button.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Show toast notification
                const platform = this.getSocialPlatform(icon.classList);
                this.showToast(`Opening ${platform} (simulated link)`, 'info');
                
                // Add click animation
                button.classList.add('social-click');
                setTimeout(() => button.classList.remove('social-click'), 300);
            });
        });
    }
    
    getSocialPlatform(iconClasses) {
        if (iconClasses.contains('fa-facebook-f')) return 'Facebook';
        if (iconClasses.contains('fa-twitter')) return 'Twitter';
        if (iconClasses.contains('fa-instagram')) return 'Instagram';
        if (iconClasses.contains('fa-tiktok')) return 'TikTok';
        if (iconClasses.contains('fa-whatsapp')) return 'WhatsApp';
        return 'social media';
    }
    
    // ===== FORM ANIMATIONS =====
    setupFormAnimations() {
        const formGroups = this.form.querySelectorAll('.mb-3');
        
        formGroups.forEach((group, index) => {
            // Add staggered animation
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                group.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ===== ERROR AND FEEDBACK METHODS =====
    showFormError(message) {
        // Remove any existing error alerts
        const existingAlert = this.form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create error alert
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" 
                    aria-label="Close"></button>
        `;
        
        this.form.prepend(alert);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.classList.remove('show');
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
        
        // Scroll to error
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('contact-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'contact-toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${this.getToastIcon(type)} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Initialize and show toast
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        bsToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', function() {
            if (toast.parentNode) {
                toast.remove();
            }
        });
    }
    
    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || 'fa-info-circle';
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form')) {
        new ContactForm();
    }
});

// ===== ADDITIONAL STYLES =====
const contactStyles = `
    .social-pulse {
        animation: pulse 1s ease-in-out;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .social-click {
        transform: scale(0.95);
        transition: transform 0.1s ease;
    }
    
    .faq-bounce i {
        animation: bounce 0.5s ease;
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }
    
    .highlight-new {
        animation: highlight 2s ease;
    }
    
    @keyframes highlight {
        0% { background-color: rgba(255, 107, 0, 0.2); }
        100% { background-color: transparent; }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
}