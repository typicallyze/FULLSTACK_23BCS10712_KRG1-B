document.addEventListener('DOMContentLoaded', () => {

    // --- OBJECTIVE 1: CREATE A PRODUCT DATASET ---
    const products = [
        { id: 1, name: 'Wireless Mouse', category: 'Electronics', price: 29.99 },
        { id: 2, name: 'Cotton T-Shirt', category: 'Apparel', price: 19.99 },
        { id: 3, name: 'Coffee Maker', category: 'Home Goods', price: 49.99 },
        { id: 4, name: 'Bluetooth Headphones', category: 'Electronics', price: 79.99 },
        { id: 5, name: 'Denim Jeans', category: 'Apparel', price: 59.99 },
        { id: 6, name: 'Smart LED Bulb', category: 'Home Goods', price: 14.99 },
        { id: 7, name: 'Laptop Stand', category: 'Electronics', price: 24.99 },
        { id: 8, name: 'Graphic Hoodie', category: 'Apparel', price: 45.00 },
        { id: 9, name: 'Scented Candle', category: 'Home Goods', price: 9.99 },
        { id: 10, name: 'Mechanical Keyboard', category: 'Electronics', price: 120.00 },
    ];

    // --- Get references to DOM elements ---
    const categoryFilter = document.getElementById('category-filter');
    const productList = document.getElementById('product-list');
    const filterFeedback = document.getElementById('filter-feedback');

    /**
     * Renders a list of products to the DOM.
     * @param {Array} productsToDisplay - The array of product objects to display.
     */
    const displayProducts = (productsToDisplay) => {
        // --- OBJECTIVE 4: DYNAMICALLY UPDATE THE DOM (Part 1: Clear) ---
        // Clear the current list of products to prepare for the new list
        productList.innerHTML = '';

        // If no products match, show a message
        if (productsToDisplay.length === 0) {
            productList.innerHTML = '<p>No products found matching this category.</p>';
            return;
        }

        // --- OBJECTIVE 4: DYNAMICALLY UPDATE THE DOM (Part 2: Render) ---
        // Loop through the products and create an HTML card for each one
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p class="category">${product.category}</p>
                <p class="price">$${product.price.toFixed(2)}</p>
            `;

            productList.appendChild(productCard);
        });
    };

    /**
     * Filters and updates the displayed products based on the dropdown selection.
     */
    const updateProductsView = () => {
        const selectedCategory = categoryFilter.value;
        let filteredProducts;

        // --- OBJECTIVE 3: IMPLEMENT FILTER LOGIC ---
        if (selectedCategory === 'all') {
            // If 'All' is selected, show all products
            filteredProducts = products;
        } else {
            // Otherwise, use Array.prototype.filter() to find matching products
            filteredProducts = products.filter(product => product.category === selectedCategory);
        }

        // Render the filtered products to the page
        displayProducts(filteredProducts);

        // --- OBJECTIVE 5: ADD VISUAL FEEDBACK ---
        if (selectedCategory === 'all') {
            filterFeedback.textContent = `Showing all ${products.length} products.`;
        } else {
            filterFeedback.textContent = `Showing ${filteredProducts.length} products in "${selectedCategory}".`;
        }
    };

    // --- Attach event listener to the dropdown ---
    categoryFilter.addEventListener('change', updateProductsView);

    // --- Initial display of all products when the page loads ---
    updateProductsView();

});