// Initialize Firebase
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

// Drag and Drop functionality
const dropArea = document.getElementById('drag-drop-area');
const fileInput = document.getElementById('product-images');
const previewArea = document.getElementById('preview-area');
const mainImageInput = document.getElementById('main-image');
const mainImagePreview = document.getElementById('main-image-preview');

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

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

function handleFiles(files) {
    previewArea.innerHTML = '';
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
            });
            imgContainer.appendChild(removeBtn);

            previewArea.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }
}

// Handle main image preview
mainImageInput.addEventListener('change', () => {
    const file = mainImageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            mainImagePreview.innerHTML = `<img src="${event.target.result}" alt="Main Image Preview" class="image-preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        mainImagePreview.innerHTML = '';
    }
});

// Convert short description to bullet points
function convertToPoints(textarea) {
    const points = textarea.value.split('\n').filter(line => line.trim() !== '');
    const pointsList = document.getElementById('short-description-points');
    pointsList.innerHTML = '';
    points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point.trim();
        pointsList.appendChild(li);
    });
}

document.getElementById('product-short-description').addEventListener('input', (event) => {
    convertToPoints(event.target);
});

// Form submission
document.getElementById('product-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const productName = document.getElementById('product-name').value;
    const shortDescription = document.getElementById('product-short-description').value.split('\n').filter(line => line.trim() !== '');
    const productDescription = document.getElementById('product-description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const images = fileInput.files;
    const mainImageFile = mainImageInput.files[0];

    // Prepare product data
    const productData = {
        name: productName,
        shortDescription: shortDescription,
        description: productDescription,
        category: category,
        price: parseFloat(price)
    };

    // Upload main image
    let mainImageURL = '';
    if (mainImageFile) {
        const mainImageRef = storageRef(storage, `product-images/main/${mainImageFile.name}`);
        const uploadTask = uploadBytesResumable(mainImageRef, mainImageFile);
        await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
                null, 
                (error) => reject(error), 
                () => getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    mainImageURL = url;
                    resolve();
                })
            );
        });
    }

    // Upload other images
    const uploadPromises = [];
    const imageUrls = [];
    for (const file of images) {
        const storagePath = `product-images/${Date.now()}-${file.name}`;
        const imageRef = storageRef(storage, storagePath);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadPromises.push(
            new Promise((resolve, reject) => {
                uploadTask.on('state_changed', 
                    null, 
                    (error) => reject(error), 
                    () => getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        imageUrls.push(downloadURL);
                        resolve();
                    })
                );
            })
        );
    }

    // Save product data to Firebase
    Promise.all(uploadPromises).then(async () => {
        const finalProductData = {
            ...productData,
            mainImageURL,
            imageUrls
        };

        await set(ref(db, 'products/' + Date.now()), finalProductData);
        alert('Product added successfully!');
    }).catch((error) => {
        console.error('Error uploading images or saving product data:', error);
    });
});
