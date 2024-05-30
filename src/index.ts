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
            productContainer.innerHTML = "";
            products.forEach((product: any) => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.product}</h3>
                    <p>${product.description}</p>
                    <p><b>Price:</b>&nbsp$${product.amount}</p>
                `;
                productContainer.appendChild(productDiv);
            });

        } catch (error) {
            showMessage("Failed to fetch products.");
        }
    };

    // Initial fetch and display of products
    fetchAndDisplayProducts();
});
