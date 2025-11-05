document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navigation & Modal ---
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.style.display = 'flex';
        });
    }
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });
    }
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- 2. Modal Tab Switching ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const tabId = btn.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });

    // --- 3. Order Form Total Calculator ---
    const orderInputs = document.querySelectorAll('.order-input');
    const totalPriceEl = document.getElementById('total-price');

    function calculateTotal() {
        let total = 0;
        orderInputs.forEach(input => {
            const price = parseFloat(input.dataset.price);
            // Use parseFloat for kg/liters which can be decimals (like 0.5)
            const quantity = parseFloat(input.value) || 0; 
            if (quantity > 0) {
                total += price * quantity;
            }
        });
        
        // 
        // !! THIS IS THE CHANGE !!
        // The symbol is changed from $ to ₹
        //
        totalPriceEl.textContent = `₹${total.toFixed(2)}`;
    }

    orderInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });

    calculateTotal(); // Initial calculation on load

    // --- 4. Client-Side Form Validation ---
    const allForms = document.querySelectorAll('.form');

    allForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            if (validateForm(form)) {
                alert('Success! Form submitted.Thank You');
                form.reset();
                // Reset total to 0.00 after successful "order"
                if (form.closest('#order')) { 
                    calculateTotal();
                }
            } else {
                alert('Please fix the errors in the form.');
            }
        });
    });

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

        requiredFields.forEach(field => {
            let error = '';
            if (field.type === 'radio') {
                const radioGroup = form.querySelector(`input[name="${field.name}"]:checked`);
                if (!radioGroup) {
                    error = 'Please make a selection.';
                    isValid = false;
                }
            } else if (field.value.trim() === '') {
                error = 'This field is required.';
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                error = 'Please enter a valid email address.';
                isValid = false;
            }

            if (error) {
                field.classList.add('invalid');
                const errorEl = field.closest('.form-group').querySelector('.error-message');
                if (errorEl) {
                    errorEl.textContent = error;
                    errorEl.style.display = 'block';
                }
            }
        });
        return isValid;
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});