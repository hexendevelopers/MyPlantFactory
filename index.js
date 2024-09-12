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

// Function to load products
function loadProducts() {
    const productsRef = ref(db, 'products');
    get(productsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const products = snapshot.val();
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear existing content

            Object.keys(products).forEach((key) => {
                const product = products[key];
                const productHTML = `
                    <li class="product">
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
                                    <a  >${product.name}</a>
                                </h4>
                                <div class="price">
                                    <span hidden >${product.price}</span>
                                </div>
                                <a href="shop-single.html?id=${key}" class="cart-btn"><i class="fas fa-shopping-bag"></i> Add to cart</a>
                            </div>
                        </div>
                    </li>
                `;
                productList.innerHTML += productHTML;
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
