// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-database.js';
import { getStorage, ref as storageReference, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.19.0/firebase-storage.js';

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

// Drag and Drop functionality
const dropArea = document.getElementById('drag-drop-area');
const fileInput = document.getElementById('product-images');
const previewArea = document.getElementById('preview-area');
const mainImageInput = document.getElementById('main-image');
const mainImagePreview = document.getElementById('main-image-preview');

// Modified handleFiles function to store File objects
let uploadedFiles = [];

function handleFiles(files) {
    previewArea.innerHTML = '';
    uploadedFiles = Array.from(files); // Store File objects
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.classList.add('image-preview');
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('relative');
            imgContainer.appendChild(img);

            // Add remove button
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'X';
            removeBtn.classList.add('absolute', 'top-0', 'right-0', 'text-white', 'bg-black', 'text-xs');
            removeBtn.addEventListener('click', () => {
                imgContainer.remove();
                const index = uploadedFiles.indexOf(file);
                if (index > -1) {
                    uploadedFiles.splice(index, 1);
                }
            });
            imgContainer.appendChild(removeBtn);

            previewArea.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }
}

// Form submission
document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the form values
    const productName = document.getElementById('product-name').value.trim();
    const botanicalName = document.getElementById('botanicalName').value.trim();
    const shortDescription = document.getElementById('product-short-description').value.trim();
    const productDescription = document.getElementById('product-description').value.trim();
    const category = document.getElementById('category').value.trim();
    let price = document.getElementById('price').value.trim();
    const mainImageFile = mainImageInput.files[0];

    // Validate that the fields are not empty or invalid
    if (!productName || !category || !productDescription) {
        alert('Please fill out all required fields.');
        return;
    }

    if (!price || isNaN(price)) {
        price = 0;
    } else {
        price = parseFloat(price);
    }

    // Prepare product data
    const productData = {
        name: productName,
        botanicalName: botanicalName || '',
        shortDescription: shortDescription ? shortDescription.split('\n').filter(line => line.trim() !== '') : [],
        description: productDescription,
        category: category,
        price: price
    };

    // Upload main image
    let mainImageURL = '';
    if (mainImageFile) {
        try {
            const mainImageRef = storageReference(storage, `product-images/main/${mainImageFile.name}`);
            const uploadTask = uploadBytesResumable(mainImageRef, mainImageFile);
            mainImageURL = await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    null, 
                    (error) => reject(error), 
                    () => getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject)
                );
            });
        } catch (error) {
            console.error('Error uploading main image:', error);
            return;
        }
    }

    // Upload other images
    const uploadPromises = [];
    const imageUrls = [];
    for (const file of uploadedFiles) {
        const storagePath = `product-images/${Date.now()}-${file.name}`;
        const imageRef = storageReference(storage, storagePath);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadPromises.push(
            new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    null, 
                    (error) => reject(error), 
                    () => getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        imageUrls.push(downloadURL);
                        resolve();
                    }).catch(reject)
                );
            })
        );
    }

    try {
        await Promise.all(uploadPromises);

        // Save product data to Firebase after all images are uploaded
        const finalProductData = {
            ...productData,
            mainImageURL,
            imageUrls // Save additional images URLs
        };

        await set(ref(db, 'products/' + Date.now()), finalProductData);
        alert('Product added successfully!');
        
        // Clear the form and preview areas after successful submission
        document.getElementById('product-form').reset();
        previewArea.innerHTML = '';
        mainImagePreview.innerHTML = '';
        uploadedFiles = [];
    } catch (error) {
        console.error('Error uploading images or saving product data:', error);
        alert('An error occurred while saving the product. Please try again.');
    }
});

// Drag and Drop functionality
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.add('dragging');
});

dropArea.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove('dragging');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove('dragging');
    handleFiles(event.dataTransfer.files);
});
