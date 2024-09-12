// Firebase Imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js';

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
const storage = getStorage(app);

// CSV Handling
document.getElementById('csv-file').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        Papa.parse(file, {
            header: true,
            complete: async function(results) {
                const products = results.data;
                console.log('Parsed CSV data:', products); // Log parsed data for debugging
                await uploadProductsToFirebase(products);
            }
        });
    }
}

async function uploadProductsToFirebase(products) {
    for (const product of products) {
        const productName = product['name'];
        const shortDescription = product['short description'];
        const description = product['description'];
        const category = product['categories'];
        const images = product['images'] ? product['images'].split(',').map(url => url.trim()) : [];

        // Log product data for debugging
        console.log('Product being uploaded:', {
            name: productName,
            shortDescription,
            description,
            category,
            images
        });

        // Ensure required fields are not undefined
        if (!productName) {
            console.error('Product name is undefined, skipping this product.');
            continue; // Skip this product and move to the next one
        }

        // Prepare product data
        const productData = {
            name: productName,
            shortDescription: shortDescription || '', // Provide default empty string if undefined
            description: description || '',
            category: category || '',
            imageUrls: images
        };

        // Save product data to Firebase
        try {
            await set(ref(db, 'products/' + Date.now()), productData);
            console.log(`Product "${productName}" added successfully.`);
        } catch (error) {
            console.error(`Error saving product "${productName}" to Firebase:`, error);
        }
    }
}
