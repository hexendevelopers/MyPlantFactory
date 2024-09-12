// Import Firebase modules
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

// Function to convert text to bullet points
// Convert short description to bullet points for a specific form
function convertToPoints(textarea, index) {
    const pointsList = document.getElementById(`short-description-points-${index}`);
    const points = textarea.value.split('\n').filter(line => line.trim() !== '');
    pointsList.innerHTML = '';
    points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point.trim();
        pointsList.appendChild(li);
    });
}

// Create and append form HTML
function createForm(index) {
    const container = document.getElementById('form-container');

    const formHTML = `
        <form id="product-form-${index}" class="space-y-4 p-4 border border-gray-300 rounded-md shadow-sm">
            <!-- Product Name -->
            <div>
                <label for="product-name-${index}" class="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" id="product-name-${index}" name="product-name" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <!-- Product Short Description -->
            <div>
                <label for="product-short-description-${index}" class="block text-sm font-medium text-gray-700">Product Short Description</label>
                <textarea id="product-short-description-${index}" name="product-short-description" rows="2" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    oninput="convertToPoints(this, ${index})"></textarea>
                <ul id="short-description-points-${index}" class="mt-2 list-disc list-inside text-gray-700"></ul>
            </div>

            <!-- Product Description -->
            <div>
                <label for="product-description-${index}" class="block text-sm font-medium text-gray-700">Product Description</label>
                <textarea id="product-description-${index}" name="product-description" rows="4" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>

            <!-- Category Dropdown -->
            <div>
                <label for="category-${index}" class="block text-sm font-medium text-gray-700">Category</label>
                <select id="category-${index}" name="category" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="Plants">Plants</option>
                    <option value="Manure & Fertilizer">Manure & Fertilizer</option>
                    <option value="Tools & Accessories">Tools & Accessories</option>
                    <option value="Corporate Gifts">Corporate Gifts</option>
                    <option value="Seeds">Seeds</option>
                </select>
            </div>

            <!-- Price -->
            <div>
                <label for="price-${index}" class="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input type="number" id="price-${index}" name="price" step="0.01" value="0" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <!-- Botanical Name -->
            <div>
                <label for="botanicalName-${index}" class="block text-sm font-medium text-gray-700">Botanical Name</label>
                <input type="text" id="botanicalName-${index}" name="botanicalName"  
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>

            <!-- Main Image Upload -->
            <div>
                <label class="block text-sm font-medium text-gray-700">Main Product Image</label>
                <input type="file" id="main-image-${index}" name="main-image" accept="image/*" required
                    class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <div id="main-image-preview-${index}" class="main-image-preview mt-4"></div>
            </div>

            <!-- Multiple Image Upload with Drag and Drop -->
            <div>
                <label class="block text-sm font-medium text-gray-700">Product Images</label>
                <div id="drag-drop-area-${index}" class="drag-drop-area flex justify-center items-center">
                    <div class="text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 48 48" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 16v16m8-8h16m-6 6l6-6-6-6m6 6H10"></path>
                        </svg>
                        <div class="text-sm text-gray-600">
                            <label for="product-images-${index}"
                                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <span>Upload multiple images</span>
                                <input id="product-images-${index}" name="product-images[]" type="file" accept="image/*" multiple
                                    class="sr-only">
                            </label>
                            <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
                <div id="preview-area-${index}" class="mt-4 flex flex-wrap"></div>
            </div>

            <!-- Submit Button -->
            <div>
                <button type="submit" id="submit-btn-${index}"
                    class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Submit
                </button>
                <div id="loading-${index}" class="hidden text-green-600">Saving...</div>
            </div>
        </form>
    `;

    container.insertAdjacentHTML('beforeend', formHTML);

    // Add event listeners for each form
    document.getElementById(`product-form-${index}`).addEventListener('submit', async (event) => {
        event.preventDefault();

        const formId = index;
        const productName = document.getElementById(`product-name-${formId}`).value;
        const botanicalName = document.getElementById(`botanicalName-${formId}`).value;
        const shortDescription = document.getElementById(`product-short-description-${formId}`).value.split('\n');
        const productDescription = document.getElementById(`product-description-${formId}`).value;
        const category = document.getElementById(`category-${formId}`).value;
        const price = parseFloat(document.getElementById(`price-${formId}`).value);
        const mainImage = document.getElementById(`main-image-${formId}`).files[0];
        const imageFiles = document.getElementById(`product-images-${formId}`).files;

        const mainImageURL = await uploadImage(mainImage, `products/${formId}/main-image`);
        const imageURLs = await Promise.all(Array.from(imageFiles).map(file => uploadImage(file, `products/${formId}/images`)));

        // Save data to Firebase
        set(ref(db, `products/${formId}`), {
            productName,
            botanicalName,
            shortDescription,
            productDescription,
            category,
            price,
            mainImageURL,
            imageURLs
        }).then(() => {
            document.getElementById(`loading-${formId}`).classList.add('hidden');
            alert('Product saved successfully!');
        }).catch(error => {
            console.error("Error saving product: ", error);
        });
    });

    // Drag and Drop setup
    setupDragAndDrop(index);
}

// Function to setup drag and drop area
function setupDragAndDrop(index) {
    const dropArea = document.getElementById(`drag-drop-area-${index}`);
    const fileInput = document.getElementById(`product-images-${index}`);
    const previewArea = document.getElementById(`preview-area-${index}`);

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.classList.add('bg-gray-200');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('bg-gray-200');
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.classList.remove('bg-gray-200');
        
        const files = event.dataTransfer.files;
        fileInput.files = files; // Update file input with dropped files
        handleFiles(files, previewArea);
    });

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files, previewArea);
    });
}

// Function to handle file previews
function handleFiles(files, previewArea) {
    previewArea.innerHTML = '';
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('w-24', 'h-24', 'object-cover', 'm-2');
            previewArea.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Create multiple forms dynamically
const numberOfForms = 3; // Change this number to create more forms
for (let i = 1; i <= numberOfForms; i++) {
    createForm(i);
}
