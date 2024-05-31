// Elements
const productFormElement = document.getElementById("productFormElement") as HTMLFormElement;
const productContainer = document.getElementById("productContainer") as HTMLElement;
const confirmationMessage = document.querySelector(".confirm") as HTMLElement;
const confirmationText = document.getElementById("confirmationText") as HTMLElement;
const cartStatusContainer = document.getElementById("cartStatusContainer") as HTMLElement;

// Variables to keep track of the cart state
let cartQuantity = 0;
let cartTotal = 0;

// Function to update the cart status display
const updateCartStatus = () => {
    const cartStatusValue = document.getElementById("cartStatusValue");
    if (cartStatusValue) {
        cartStatusValue.textContent = cartQuantity.toString();
    }
};

// Helper function to display confirmation messages
const showMessage = (message: string) => {
    confirmationText.textContent = message;
    confirmationMessage.style.display = "block";
    setTimeout(() => {
        confirmationMessage.style.display = "none";
    }, 3000);
};

// Fetch and display all products
const fetchAndDisplayProducts = async () => {
    try {
        const response = await fetch("http://localhost:3000/products");
        const products = await response.json();
        productContainer.innerHTML = products.map((product: any) => `
            <div class="product productgap" data-product-id="${product.id}">
                <img src="${product.imageUrl}" alt="${product.product}">
                <h3>${product.product}</h3>
                <p><b>Description:</b> ${product.description}</p>
                <p><b>Price:</b> $${product.amount}</p>
            </div>
        `).join('');
        setupProductClickHandlers();
    } catch (error) {
        showMessage("Failed to fetch products");
    }
};

// Function to display a single product
const displayProduct = async (productId: string) => {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`);
        const product = await response.json();
        productContainer.innerHTML = `
            <div class="product-detail" data-product-id="${product.id}">
                <div class="left">
                    <img src="${product.imageUrl}" alt="${product.product}">
                </div>
                <div class="right">
                    <h3>${product.product}</h3>
                    <p><b>Category:</b> ${product.category}</p>
                    <p><b>Description:</b> ${product.description}</p>
                    <p><b>Price:</b> $${product.amount}</p>
                    <div class="buttons">
                        <div class="cancel drop-from-cart"><p>drop cart</p><p>&minus;</p></div>
                        <div class="add add-to-cart"><p>Add to cart</p><p>&plus;</p></div>
                    </div>
                </div>
                <div class="closebtn">
                    &times;
                </div>
            </div>
        `;

        // Add event listeners for add to cart and drop from cart buttons
        const addToCartButton = document.querySelector('.add-to-cart') as HTMLElement;
        const dropFromCartButton = document.querySelector('.drop-from-cart') as HTMLElement;

        if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
        cartQuantity++;
        cartTotal += product.price;
        updateCartStatus();
        showMessage("Product added successfully");

        // Append the product HTML to the "ItemsAddedToCart" container
        document.getElementById("ItemsAddedToCart")?.insertAdjacentHTML('beforeend', `
            <div class="product productgap" data-product-id="${product.id}" >
                <div>
                    <img src="${product.imageUrl}" alt="${product.product}"styles="width: 4rem">
                    <h3>${product.product}</h3>
                    <p><b>Description:</b> ${product.description}</p>
                    <p><b>Price:</b> $${product.amount}</p>
                </div>
                
            </div>
        `);
    });
}

        if (dropFromCartButton) {
            dropFromCartButton.addEventListener('click', () => {
                if (cartQuantity > 0) {
                    cartQuantity--;
                    cartTotal -= product.amount;
                    updateCartStatus();
                    showMessage("Item quantity has been updated")
                }
            });
        }
        // Function to toggle the display productlist container and product container
    const toggleContainers = () => {
        const mainProduct = document.querySelector('.main-product') as HTMLElement | null;
        const cardItems = document.querySelector('.cardItems') as HTMLElement | null;

        if (!mainProduct || !cardItems) {
            console.error('Containers not found');
            return;
        }
        if (cardItems.style.display === 'block') {
            cardItems.style.display = 'none';
            mainProduct.style.display = 'grid';
        } else {
            cardItems.style.display = 'block';
            mainProduct.style.display = 'none';
        }
    };

        // Select the close button and set up the click handler for it
        const closeButton = document.querySelector('.closebtn') as HTMLElement;
        if (closeButton) {
            setupSingleProductClickHandler(closeButton);
        }
    } catch (error) {
        showMessage("Failed to fetch product details");
    }
};

// Event listener for single product close button
const setupSingleProductClickHandler = (closeButton: HTMLElement) => {
    closeButton.addEventListener('click', () => {
        fetchAndDisplayProducts();
    });
};

// Event listener for product clicks
const setupProductClickHandlers = () => {
    const products = document.querySelectorAll('.product');
    products.forEach(product => {
        product.addEventListener('click', () => {
            const productId = product.getAttribute('data-product-id');
            if (productId) {
                displayProduct(productId);
            }
        });
    });
};

// Initialize fetch and display products
fetchAndDisplayProducts();
updateCartStatus(); // Ensure cart status is initialized correctly on page load
