import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMqZ8anVRCeAukrYV6Og75TVcy2YQieV4",
    authDomain: "myplantfactory-dde8a.firebaseapp.com",
    projectId: "myplantfactory-dde8a",
    storageBucket: "myplantfactory-dde8a.appspot.com",
    messagingSenderId: "65045588499",
    appId: "1:65045588499:web:b9cb8c5cbd138f19ae6de6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to fetch and display products
async function loadProducts() {
    const productList = document.getElementById('product-list');
    
    try {
        const snapshot = await get(ref(db, 'products/'));
        if (snapshot.exists()) {
            const products = snapshot.val();
            productList.innerHTML = ''; // Clear any existing content
            
            Object.keys(products).forEach(key => {
                const product = products[key];
                
                // Filter for the category 'Plants'
                if (product.category === 'Plants') {
                    const listItem = document.createElement('li');
                    listItem.classList.add('product');
                    listItem.innerHTML = `
                        <div class="product-contents">
                            <div class="product-image">
                                <a href="shop-single.html">
                                    <img src="${product.mainImageURL}" alt="Product" class="w-full h-auto">
                                </a>
                                <div class="shop-action">
                                    <ul>
                                        <!-- Add any shop actions here -->
                                    </ul>
                                </div>
                            </div>
                            <div class="product-caption">
                                <div class="product-tags">
                                    <a href="#">${product.category}</a>
                                </div>
                                <h4 class="product-title">
                                    <a href="shop-single.html">${product.name}</a>
                                </h4>
                                <div class="price">
                                    <span>$${product.price.toFixed(2)}</span>
                                </div>
                                <a href="shop-single.html" class="cart-btn"><i class="fas fa-shopping-bag"></i> View Product</a>
                            </div>
                        </div>
                    `;
                    
                    productList.appendChild(listItem);
                }
            });
        } else {
            productList.innerHTML = '<p>No products found.</p>';
        }
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Load products when the page is loaded
document.addEventListener('DOMContentLoaded', loadProducts);
