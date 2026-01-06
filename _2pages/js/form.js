// RSVP Form Handling and Validation

class RSVPForm {
    constructor() {
        this.form = document.getElementById('rsvpForm');
        this.messageDiv = document.getElementById('formMessage');
        this.submitBtn = this.form?.querySelector('.submit-btn');

        // Cloudflare Worker endpoint
        this.workerEndpoint = 'https://wedding-rsvp-worker.michal-basznianin.workers.dev';

        this.init();
    }

    init() {
        if (!this.form) return;

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.addFieldValidation();

        // Conditional field visibility
        this.handleConditionalFields();
    }

    addFieldValidation() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const attendanceSelect = document.getElementById('attendance');

        // Name validation
        nameInput?.addEventListener('blur', () => {
            this.validateName(nameInput);
        });

        // Email validation
        emailInput?.addEventListener('blur', () => {
            if (emailInput.value) {
                this.validateEmail(emailInput);
            }
        });

        // Required field indicators
        [nameInput, attendanceSelect].forEach(field => {
            field?.addEventListener('blur', () => {
                if (!field.value) {
                    field.style.borderColor = '#C97C5D';
                } else {
                    field.style.borderColor = '';
                }
            });
        });
    }

    validateName(input) {
        const value = input.value.trim();
        const isValid = value.length >= 2;

        if (!isValid && value.length > 0) {
            this.showFieldError(input, 'Please enter a valid name');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    validateEmail(input) {
        const value = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);

        if (!isValid && value.length > 0) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        } else {
            this.clearFieldError(input);
            return true;
        }
    }

    showFieldError(input, message) {
        // Remove existing error
        this.clearFieldError(input);

        // Create error element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #C97C5D;
            font-size: 0.85rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        `;

        input.parentElement.appendChild(errorDiv);
        input.style.borderColor = '#C97C5D';
    }

    clearFieldError(input) {
        const existingError = input.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }

    handleConditionalFields() {
        const attendanceSelect = document.getElementById('attendance');
        const guestsField = document.getElementById('guests')?.parentElement;
        const dietaryField = document.getElementById('dietary')?.parentElement;

        attendanceSelect?.addEventListener('change', (e) => {
            const isAttending = e.target.value === 'yes';

            if (guestsField) {
                guestsField.style.opacity = isAttending ? '1' : '0.5';
                document.getElementById('guests').disabled = !isAttending;
            }

            if (dietaryField) {
                dietaryField.style.opacity = isAttending ? '1' : '0.5';
                document.getElementById('dietary').disabled = !isAttending;
            }
        });
    }

    async handleSubmit() {
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Get form data
        const formData = this.getFormData();

        // Disable submit button
        this.setSubmitting(true);

        try {
            // Send to Cloudflare Worker
            const response = await this.submitToWorker(formData);

            if (response.success) {
                this.showMessage('Thank you! Your RSVP has been received successfully.', 'success');
                this.form.reset();

                // Scroll to message
                this.messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage(
                'Sorry, there was an error submitting your RSVP. Please try again or contact us directly.',
                'error'
            );
        } finally {
            this.setSubmitting(false);
        }
    }

    validateForm() {
        const name = document.getElementById('name').value.trim();
        const attendance = document.getElementById('attendance').value;
        const email = document.getElementById('email').value.trim();

        // Required fields
        if (!name || name.length < 2) {
            document.getElementById('name').focus();
            return false;
        }

        if (!attendance) {
            document.getElementById('attendance').focus();
            return false;
        }

        // Email validation (if provided)
        if (email && !this.validateEmail(document.getElementById('email'))) {
            return false;
        }

        return true;
    }

    getFormData() {
        return {
            timestamp: new Date().toISOString(),
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim() || 'Not provided',
            phone: document.getElementById('phone').value.trim() || 'Not provided',
            attendance: document.getElementById('attendance').value,
            guests: document.getElementById('guests').value || '1',
            dietary: document.getElementById('dietary').value.trim() || 'None',
            message: document.getElementById('message').value.trim() || 'None'
        };
    }

    async submitToWorker(formData) {
        // For now, simulate API call
        // Replace this with actual Cloudflare Worker call after deployment
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate successful submission
                console.log('Form data to be submitted:', formData);
                resolve({ success: true });

                // Store in localStorage as backup (temporary solution)
                this.saveToLocalStorage(formData);
            }, 1000);
        });

        // Uncomment and use this after Cloudflare Worker is deployed:
        /*
        const response = await fetch(this.workerEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
        */
    }

    saveToLocalStorage(formData) {
        try {
            // Get existing submissions
            const submissions = JSON.parse(localStorage.getItem('rsvpSubmissions') || '[]');

            // Add new submission
            submissions.push(formData);

            // Save back to localStorage
            localStorage.setItem('rsvpSubmissions', JSON.stringify(submissions));

            console.log('RSVP saved to localStorage:', formData);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    setSubmitting(isSubmitting) {
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            this.submitBtn.style.opacity = '0.7';
            this.submitBtn.querySelector('span').textContent = 'Sending...';

            // Add loading animation
            const svg = this.submitBtn.querySelector('svg');
            svg.style.animation = 'spin 1s linear infinite';
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.style.opacity = '1';
            this.submitBtn.querySelector('span').textContent = 'Send RSVP';

            // Remove loading animation
            const svg = this.submitBtn.querySelector('svg');
            svg.style.animation = '';
        }
    }

    showMessage(message, type) {
        this.messageDiv.textContent = message;
        this.messageDiv.className = `form-message ${type}`;
        this.messageDiv.style.display = 'block';

        // Hide after 8 seconds
        setTimeout(() => {
            this.messageDiv.style.display = 'none';
        }, 8000);
    }
}

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .field-error {
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RSVPForm();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSVPForm;
}
