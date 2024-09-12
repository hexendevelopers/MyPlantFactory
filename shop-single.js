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

// Get the product ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fetch product data from Firebase
const productRef = ref(db, 'products/' + productId);
get(productRef).then((snapshot) => {
    if (snapshot.exists()) {
        const productData = snapshot.val();
        document.getElementById('product-name').textContent = productData.name;
        document.getElementById('product-category').textContent = `Category: ${productData.category}`;
        document.getElementById('product-description').textContent = productData.description;
        document.getElementById('product-price').textContent = `Price: $${productData.price}`;
        document.getElementById('botanicalname').textContent = `Botanical name: ${productData.botanicalName}`;

        // Generate carousel items
        const carouselInner = document.getElementById('carousel-inner');
        carouselInner.innerHTML = ''; // Clear any existing items

        // Generate Swiper slides
        const swiperWrapper = document.getElementById('swiper-wrapper');
        swiperWrapper.innerHTML = ''; // Clear any existing slides

        if (Array.isArray(productData.imageUrls) && productData.imageUrls.length > 0) {
            productData.imageUrls.forEach((url, index) => {
                // Create carousel item
                const isActive = index === 0 ? 'active' : '';
                const carouselItem = document.createElement('div');
                carouselItem.className = `carousel-item product-item ${isActive}`;
                carouselItem.innerHTML = `
                    <a href="${url}" class="item popup-gallery">
                        <img src="${url}" alt="Thumb">
                    </a>
                 `;
                carouselInner.appendChild(carouselItem);

                // Create Swiper slide
                const swiperSlide = document.createElement('div');
                swiperSlide.className = 'swiper-slide';
                swiperSlide.innerHTML = `
                    <div class="item ${isActive}" data-bs-target="#timeline-carousel" data-bs-slide-to="${index}" aria-current="${index === 0 ? 'true' : 'false'}">
                        <img src="${url}" alt="">
                    </div>
                `;
                swiperWrapper.appendChild(swiperSlide);
            });
        } else {
            console.log("No images available");
        }

        // Display short descriptions as list items with custom bullet
        const shortDescriptionList = document.getElementById('short-description-list');
        shortDescriptionList.innerHTML = ''; // Clear any existing items
        if (Array.isArray(productData.shortDescription)) {
            productData.shortDescription.forEach(desc => {
                const listItem = document.createElement('li');
                listItem.textContent = desc; // Add text to list item
                listItem.style.listStyleType = 'circle'; // Custom bullet point style
                shortDescriptionList.appendChild(listItem);
            });
        }
    } else {
        console.log("No product data available");
    }
}).catch((error) => {
    console.error(error);
});
///////////////////////////////////

///////////////////////////////////


  ///////////////////////////////////

///////////////////////////////////


  ///////////////////////////////////

///////////////////////////////////


  ///////////////////////////////////

///////////////////////////////////


  ///////////////////////////////////

///////////////////////////////////


  ///////////////////////////////////

///////////////////////////////////


  







// Function to load products
function loadProducts() {
    const productsRef = ref(db, 'products');
    get(productsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            const productContainer = document.getElementById('product-container');
            productContainer.innerHTML = ''; // Clear existing content

            Object.keys(products).forEach((key) => {
                const product = products[key];
                const productHTML = `
                    <div class="swiper-slide">
                        <div class="product">
                            <div class="product-contents">
                                <div class="product-image">
                                    <a href="shop-single.html?id=${key}">
                                        <img src="${product.mainImageURL}" alt="Product">
                                    </a>
                                    <div class="shop-action">
                                        <!-- <ul>
                                            <li class="cart">
                                                <a href="#"><span>Add to cart</span></a>
                                            </li>
                                            <li class="wishlist">
                                                <a href="#"><span>Add to wishlist</span></a>
                                            </li>
                                            <li class="quick-view">
                                                <a href="#"><span>Quick view</span></a>
                                            </li>
                                        </ul> -->
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
                                        <span hidden>${product.price}</span>
                                    </div>
                                    <a href="shop-single.html?id=${key}" class="cart-btn"><i class="fas fa-shopping-bag"></i> View Product</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        } else {
            console.log("No products found");
        }
    }).catch((error) => {
        console.error(error);
    });
}

// Call the function to load products when the page loads
document.addEventListener('DOMContentLoaded', loadProducts);