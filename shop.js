// PRODUCTS ARRAY - Easy to modify and add new products
// Each product needs: name, price, tag
// Available tags: soccer, football, racing, basketball (add more as needed)

const products = [
    { name: "Soccer Pro Jersey", price: 35, tag: "soccer" },
    { name: "Soccer Training Hoodie", price: 45, tag: "soccer" },
    { name: "Football Varsity Tee", price: 30, tag: "football" },
    { name: "Football Training Hoodie", price: 50, tag: "football" },
    { name: "Racing Crew Shirt", price: 32, tag: "racing" },
    { name: "Racing Track Hoodie", price: 48, tag: "racing" },
    { name: "Basketball Court Jersey", price: 36, tag: "basketball" },
    { name: "Basketball Practice Tee", price: 28, tag: "basketball" },
    { name: "Soccer Elite Hoodie", price: 52, tag: "soccer" },
    { name: "Racing Speed Shirt", price: 34, tag: "racing" },
];

// Shopping cart array
let cart = [];

// Google Sheets Web App URL - REPLACE THIS WITH YOUR WEB APP URL
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxwuulIRV_97CZvVyu6HMGhZ-wp7sT2VNfK1Opp8V15T2xI1PS2m_AD_xlIT2oUomr8/exec';

// Display products on page load
displayProducts('all');

// Filter button functionality
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        displayProducts(this.dataset.tag);
    });
});

// Function to display products based on tag
function displayProducts(tag) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    const filteredProducts = tag === 'all' 
        ? products 
        : products.filter(product => product.tag === tag);
    
    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="product-image">Product Image</div>
            <h3 class="product-name">${product.name}</h3>
            <span class="product-tag">${product.tag}</span>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

// Add to cart function
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Added to cart!');
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Show notification
function showNotification(message) {
    // Simple alert for now - you can make this fancier
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) existingNotif.remove();
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #c90000, #ff0000);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 700;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2000);
}

// Cart modal functionality
const cartModal = document.getElementById('cartModal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.querySelector('.close');

cartBtn.onclick = () => {
    displayCart();
    cartModal.style.display = 'block';
};

closeCart.onclick = () => {
    cartModal.style.display = 'none';
};

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        totalPrice.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} each</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    totalPrice.textContent = total;
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartCount();
    displayCart();
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    displayCart();
}

// Checkout modal
const checkoutModal = document.getElementById('checkoutModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const closeCheckout = document.querySelector('.close-checkout');

checkoutBtn.onclick = () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    cartModal.style.display = 'none';
    displayCheckout();
    checkoutModal.style.display = 'block';
};

closeCheckout.onclick = () => {
    checkoutModal.style.display = 'none';
};

// Display checkout summary
function displayCheckout() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    checkoutItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${itemTotal}</span>
        `;
        checkoutItems.appendChild(summaryItem);
    });
    
    checkoutTotal.textContent = total;
}

// Handle checkout form submission
document.getElementById('checkoutForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value;
    const cashDate = document.getElementById('cashDate').value;
    const cashPeriod = document.getElementById('cashPeriod').value;
    const total = document.getElementById('checkoutTotal').textContent;
    
    // Prepare order data
    const orderData = {
        name: customerName,
        cashDate: cashDate,
        cashPeriod: cashPeriod,
        total: total,
        items: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
        timestamp: new Date().toLocaleString()
    };
    
    // Send to Google Sheets
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        // Success
        alert(`Order confirmed! Total: $${total}\nPlease bring cash on ${cashDate} (${cashPeriod})\nThank you, ${customerName}!`);
        
        // Clear cart
        cart = [];
        updateCartCount();
        
        // Close modal
        checkoutModal.style.display = 'none';
        
        // Reset form
        document.getElementById('checkoutForm').reset();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Order placed! (Note: Set up Google Sheets to save orders)');
        
        // Still clear cart even if sheets fails
        cart = [];
        updateCartCount();
        checkoutModal.style.display = 'none';
        document.getElementById('checkoutForm').reset();
    }
};

// Close modals when clicking outside
window.onclick = (event) => {
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target == checkoutModal) {
        checkoutModal.style.display = 'none';
    }
};
