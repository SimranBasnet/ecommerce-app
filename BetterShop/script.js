// BetterShop JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('bettershopCart')) || [];
    updateCartCount();

    // Search Button Functionality
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchQuery = prompt('Enter product name to search:');
            if (searchQuery) {
                searchProducts(searchQuery);
            }
        });
    }

    // User Button Functionality
    const userBtn = document.getElementById('user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            showUserModal();
        });
    }

    // Cart Button Functionality
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            showCartModal();
        });
    }

    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').src;

            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        });
    });

    // Contact Form Submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            alert(`Thank you, ${name}! Your message has been sent.\n\nWe'll reply to ${email} shortly.`);
            this.reset();
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (email) {
                alert(`Thank you for subscribing with ${email}! You'll receive our latest updates.`);
                this.reset();
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add to Cart Function
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('bettershopCart', JSON.stringify(cart));
        updateCartCount();
        
        // Show confirmation
        showNotification(`${product.name} added to cart!`);
    }

    // Update Cart Count
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    // Search Products Function
    function searchProducts(query) {
        const products = document.querySelectorAll('.product-card');
        const lowerQuery = query.toLowerCase();
        let found = false;

        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(lowerQuery)) {
                product.style.display = 'block';
                found = true;
            } else {
                product.style.display = 'none';
            }
        });

        if (!found) {
            alert(`No products found matching "${query}"`);
            products.forEach(product => {
                product.style.display = 'block';
            });
        }
    }

    // Show User Modal
    function showUserModal() {
        const modal = createModal('User Account', `
            <div class="user-modal-content">
                <div class="user-options">
                    <button class="user-option-btn" onclick="alert('Login form would open here')">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button class="user-option-btn" onclick="alert('Registration form would open here')">
                        <i class="fas fa-user-plus"></i> Register
                    </button>
                </div>
                <div class="user-info">
                    <p>Manage your account, view order history, and track deliveries.</p>
                </div>
            </div>
        `);
        document.body.appendChild(modal);

        modal.classList.add('show');
    }

    // Show Cart Modal
    function showCartModal() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        let cartItems = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('Rs', ''));
            return sum + (price * item.quantity);
        }, 0);

        const modal = createModal('Shopping Cart', `
            <div class="cart-modal-content">
                ${cartItems}
                <div class="cart-total">
                    <h3>Total: Rs${total.toFixed(2)}</h3>
                </div>
                <button class="checkout-btn" onclick="alert('Proceeding to checkout...')">
                    Proceed to Checkout
                </button>
            </div>
        `);
        document.body.appendChild(modal);

        modal.classList.add('show')
    }

    // Remove from Cart Function
    window.removeFromCart = function(productName) {
        cart = cart.filter(item => item.name !== productName);
        localStorage.setItem('bettershopCart', JSON.stringify(cart));
        updateCartCount();
        updateCartModal(); // Refresh the modal
    };

    function updateCartModal() {
    const modalContent = document.querySelector('.cart-modal-content');
    if (!modalContent) return;

    // regenerate the cartItems + total HTML
    const cartItemsHtml = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="">
            <div>
                <h4>${item.name}</h4>
                <p>Rs ${item.price} x ${item.quantity}</p>
            </div>
            <button class=remove-item onclick="removeFromCart('${item.name}')"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + price * item.quantity;
    }, 0);

    modalContent.innerHTML = `
        ${cartItemsHtml}
        <div class="cart-total">
            <h3>Total: Rs ${total.toFixed(2)}</h3>
        </div>
        <button class="checkout-btn" onclick="alert('Proceeding to checkout')">
            Proceed to Checkout
        </button>
    `;
}

    // Create Modal Function
    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2>${title}</h2>
                ${content}
            </div>
        `;

        modal.querySelector('.modal-close').addEventListener('click', function() {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    // Show Notification Function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }

    // Add Modal and Notification Styles Dynamically
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.3s;
        }

        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s;
        }

        .modal-close {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 28px;
            font-weight: bold;
            color:gray;
            cursor: pointer;
        }

        .modal-close:hover {
            color: #333;
        }

        .user-option-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 15px;
            margin: 10px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s;
        }

        .user-option-btn:hover {
            transform: scale(1.02);
        }

        .cart-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }

        .cart-item img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
        }

        .cart-item-info {
            flex: 1;
        }

        .cart-item-info h4 {
            margin-bottom: 5px;
        }

        .remove-item {
            background:red;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
        }

        .cart-total {
            padding: 20px 0;
            text-align: center;
        }

        .cart-total h3 {
            font-size: 1.5rem;
            color: #333;
        }

        .checkout-btn {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
        }

        .checkout-btn:hover {
            transform: scale(1.02);
        }

        .notification {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 3000;
        }

        .notification.show {
            transform: translateX(0);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
