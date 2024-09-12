import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js';

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

// Function to fetch products and render them
function fetchProducts() {
    const productsRef = ref(db, 'products');
    
    get(productsRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const products = snapshot.val();
                const productContainer = document.querySelector('.swiper-wrapper');
                
                // Clear previous content
                productContainer.innerHTML = '';

                Object.keys(products).forEach((key) => {
                    const product = products[key];
                    
                    // Create a new slide
                    const slide = document.createElement('div');
                    slide.className = 'swiper-slide';
                    slide.innerHTML = `
                        <div class="product">
                            <div class="product-contents">
                                <div class="product-image">
                                    <a href="shop-single.html?id=${key}">
                                        <img src="${product.mainImageURL}" alt="${product.name}">
                                    </a>
                                    <div class="shop-action">
                                        <ul>
                                            <li class="cart">
                                                <a href="#"><span>Add to cart</span></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="product-caption">
                                    <div class="product-tags">
                                        <a href="#">${product.category}</a>
                                    </div>
                                    <h4 class="product-title">
                                        <a href="shop-single.html?id=${key}">${product.name}</a>
                                    </h4>
                                    <div class="price">
                                        <span>$${product.price.toFixed(2)}</span>
                                    </div>
                                    <a href="shop-single.html?id=${key}" class="cart-btn">
                                        <i class="fas fa-shopping-bag"></i> View Product
                                    </a>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    productContainer.appendChild(slide);
                });

                // Initialize Swiper after adding slides
                const swiper = new Swiper('.swiper', {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            } else {
                console.log('No products available');
            }
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
}

// Call the fetchProducts function on page load
window.onload = fetchProducts;
