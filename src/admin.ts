// Define the structure of a product
interface Product {
    id: number;
    product: string;
    description: string;
    amount: number;
    category: string;
    imageUrl: string;
}

// When the DOM is fully loaded...
document.addEventListener('DOMContentLoaded', () => {
    const formModal = document.getElementById('formModal') as HTMLElement;
    const closeModal = document.querySelector('.close') as HTMLElement;
    const form = document.getElementById('dataForm') as HTMLFormElement;
    const formAction = document.getElementById('formAction') as HTMLInputElement;
    const confirmDiv = document.querySelector('.confirm') as HTMLElement;
    const confirmationMessage = document.querySelector(".confirm") as HTMLElement;
    const confirmationText = document.getElementById("confirmationText") as HTMLElement;

    // Function to open the modal form for creating or updating a product
    const openModal = (action: string) => {
        formAction.value = action;
        formModal.style.display = 'block';
    };

    // Function to close the modal form
    const closeModalFunction = () => {
        formModal.style.display = 'none';
    };

    // Close the modal when the close button is clicked
    closeModal.onclick = closeModalFunction;

    // Close the modal when clicking outside the modal
    window.onclick = (event: MouseEvent) => {
        if (event.target === formModal) {
            closeModalFunction();
        }
    };

    // Show a message in the confirmation div
    const showMessage = (message: string) => {
        confirmationText.textContent = message;
        confirmationMessage.style.display = "flex";
        setTimeout(() => {
            confirmationMessage.style.display = "none";
        }, 3000);
    };

    // Handle updating a product
    const handleUpdateProduct = async (event: Event) => {
        const button = event.target as HTMLButtonElement;
        const productId = button.dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product data for update.");
            }
            const productData: Product = await response.json();

            // Populate the form with the current data for the product
            (document.getElementById('productId') as HTMLInputElement).value = productId!;
            (document.getElementById('product') as HTMLInputElement).value = productData.product;
            (document.getElementById('description') as HTMLInputElement).value = productData.description;
            (document.getElementById('amount') as HTMLInputElement).value = productData.amount.toString();
            (document.getElementById('category') as HTMLInputElement).value = productData.category;

            // Open the modal form for updating the product
            openModal('update');
        } catch (error) {
            showMessage("An error occurred. Please try again.");
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    // Handle deleting a product
    const handleDeleteProduct = async (event: Event) => {
        const button = event.target as HTMLButtonElement;
        const productId = button.dataset.id;

        try {
            const response = await fetch(`http://localhost:3000/products/${productId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                showMessage("Product deleted successfully!");
                // Reload the table data after deleting the product
                loadTableData();
            } else {
                throw new Error("Failed to delete product.");
            }
        } catch (error) {
            showMessage("An error occurred. Please try again.");
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    // Add event listener to the menu to open the modal form for create, update, or delete
    document.querySelector('.menu')?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'SPAN' || target.tagName === 'I') {
            const actionElement = target.closest('a');
            if (actionElement) {
                const action = actionElement.textContent?.trim().toLowerCase();
                if (action && ['create', 'update', 'delete'].includes(action)) {
                    openModal(action);
                }
            }
        }
    });

    // Handle form submission for creating, updating, or deleting a product
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            let response;
            if (formAction.value === 'create') {
                response = await fetch('http://localhost:3000/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            } else if (formAction.value === 'update') {
                const productId = (document.getElementById('productId') as HTMLInputElement).value;
                response = await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            } else if (formAction.value === 'delete') {
                const productId = (document.getElementById('productId') as HTMLInputElement).value;
                response = await fetch(`http://localhost:3000/products/${productId}`, {
                    method: 'DELETE'
                });
            }

            if (response && response.ok) {
                showMessage(`Successfully ${formAction.value}d data.`);
                confirmDiv.style.display = 'flex';
                setTimeout(() => {
                    confirmDiv.style.display = 'none';
                }, 5000);
                closeModalFunction();
                loadTableData();
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            showMessage(`Failed to ${formAction.value} data.`);
            confirmDiv.style.display = 'block';
            setTimeout(() => {
                confirmDiv.style.display = 'none';
            }, 3000);
            console.error('There has been a problem with your fetch operation:', error);
        }
    });

    // Load the table data when the page is loaded
    const loadTableData = async () => {
        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = '';
            try {
                const response = await fetch('http://localhost:3000/products');
                if (response.ok) {
                    const data: Product[] = await response.json();
                    data.forEach((product, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${product.product}</td>
                            <td>${product.description}</td>
                            <td>${product.amount}</td>
                            <td>${product.category}</td>
                            <td><div class="viewProduct">View</div></td>
                            <td><div class="updateProduct" data-id="${product.id}">Update</div></td>
                            <td><div class="deleteProduct" data-id="${product.id}">Delete</div></td>
                        `;
                        tableBody.appendChild(row);
                    });

                    // Add event listeners to the update and delete buttons
                    document.querySelectorAll('.deleteProduct').forEach(button => {
                        button.addEventListener('click', handleDeleteProduct);
                    });
                    document.querySelectorAll('.updateProduct').forEach(button => {
                        button.addEventListener('click', handleUpdateProduct);
                    });

                }
            } catch (error) {
                showMessage("An error occurred while loading data. Please try again.");
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
    };

    // Function to fetch and display all the product details
    const fetchAndDisplayProducts = async () => {
        const productContainer = document.getElementById("productContainer") as HTMLElement;
        try {
            const response = await fetch("http://localhost:3000/products");
            const products: Product[] = await response.json();
            productContainer.innerHTML = "";
            products.forEach((product) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.product}">
                    <h3>${product.product}</h3>
                    <p>${product.description}</p>
                    <p><b>Price:</b> $${product.amount}</p>
                `;
                productContainer.appendChild(productDiv);
            });
        } catch (error) {
            showMessage("Failed to fetch products.");
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    // Function to toggle the display of table container and product container
    const toggleContainers = () => {
        const mainProduct = document.querySelector('.main-product') as HTMLElement | null;
        const tableContainer = document.querySelector('.table-container') as HTMLElement | null;

        if (!mainProduct || !tableContainer) {
            console.error('Containers not found');
            return;
        }
        if (tableContainer.style.display === 'block') {
            tableContainer.style.display = 'none';
            mainProduct.style.display = 'grid';
        } else {
            tableContainer.style.display = 'block';
            mainProduct.style.display = 'none';
        }
    };

    // Button to toggle the display of table container and product container
    const viewAllButton = document.getElementById('viewAll') as HTMLElement | null;
    if (viewAllButton) {
        viewAllButton.addEventListener('click', toggleContainers);
    } else {
        console.error('Button not found');
    }

    // Function to calculate the sum of amounts in an array of products
    const sum = (products: Product[]): number => {
        return products.reduce((total, product) => total + product.amount, 0);
    };

    // Update table data function to include sum calculation
    const onloadTable = async () => {
        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = '';
            try {
                const response = await fetch('http://localhost:3000/products');
                if (response.ok) {
                    const data: Product[] = await response.json();

                    // Calculate total amount
                    const totalAmount = sum(data);

                    // Display total amount in table footer
                    const tableFooter = document.querySelector('tfoot');
                    if (tableFooter) {
                        tableFooter.innerHTML = `
                            <tr>
                                <td colspan="3">Total:</td>
                                <td>$${totalAmount.toFixed(2)}</td>
                                <td colspan="3"></td>
                            </tr>
                        `;
                    }

                    // Display total amount in card items
                    const amountElements = document.querySelectorAll('.amount--value');
                    amountElements.forEach(element => {
                        element.textContent = `$${totalAmount.toFixed(2)}`;
                    });
                }
            } catch (error) {
                showMessage("An error occurred while loading data. Please try again.");
                console.error('There has been a problem with your fetch operation:', error);
            }
        }
    };

    // Load the initial table data when the page is loaded
    loadTableData();
    fetchAndDisplayProducts();
});
