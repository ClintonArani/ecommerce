document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const productFormElement = document.getElementById("productFormElement") as HTMLFormElement;
    const productContainer = document.getElementById("productContainer") as HTMLElement;
    const confirmationMessage = document.querySelector(".confirm") as HTMLElement;
    const confirmationText = document.getElementById("confirmationText") as HTMLElement;

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
                    <p><b>Description:</b> $${product.description}</p>
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
                <div class="product-detail " data-product-id="${product.id}">
                    <div class="left">
                        <img src="${product.imageUrl}" alt="${product.product}">
                    </div>
                    <div class="right">
                        <h3>${product.product}</h3>
                        <p><b>Category:</b> $${product.category}</p>
                        <p><b>Description:</b> $${product.description}</p>
                        <p><b>Price:</b> $${product.amount}</p>
                        <div class="buttons">
                            <div class="cancel "><p>drop cart</p><p>&minus;</p></div>
                            <div class="add"><p>Add to cart</p><p>&plus;</p></div>
                        </div>
                    </div>
                </div>
            `;
            setupSingleProductClickHandler();
        } catch (error) {
            showMessage("Failed to fetch product details");
        }
    };

    // Event listener for single product click to revert to all products
    const setupSingleProductClickHandler = () => {
        const productDetail = document.querySelector('.product-detail');
        if (productDetail) {
            productDetail.addEventListener('click', () => {
                fetchAndDisplayProducts();
            });
        }
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
});
