document.addEventListener('DOMContentLoaded', function () {
    const invoiceItems = [];
    const productGrid = document.getElementById('productGrid');
    const invoiceDetails = document.getElementById('invoiceDetails').getElementsByTagName('tbody')[0];
    const invoiceDate = document.getElementById('invoiceDate');
    const printInvoiceButton = document.getElementById('printInvoice');
    const saveDataButton = document.getElementById('saveData');
    const taxInput = document.getElementById('taxInput');
    const invoiceSubtotal = document.getElementById('invoiceSubtotal');
    const taxedSubtotal = document.getElementById('taxedSubtotal');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search');
    
    function loadProducts() {
        const products = [
            { name: 'Chicken Biryani', prices: { small: 5, large: 10 }, categories: ['Rice', 'Specials'], image: './images/chicken biryani.jpeg' },
            { name: 'Mutton Biryani', prices: { small: 5, large: 10 }, categories: ['Specials', 'Rice'], image: './images/mutton biryani.jpg' },
            { name: 'Karak Chai', prices: { small: 1 }, categories: ['Breakfast', 'Lunch', 'Dinner'], image: './images/karak chai.jpeg' },
            { name: 'Aloe Mehthi', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner' , 'Salan'], image: './images/aloe mehthi.jpeg' },
            { name: 'Palak', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/palak.jpeg' },
            { name: 'Daal Mash', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner','Salan'], image: './images/daal mash.jpeg' },
            { name: 'Daal chana', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/chana daal.jpeg' },
            { name: 'Fresh Lassi', prices: { small: 4 }, categories: ['Drinks'], image: './images/lassi.jpeg' },
            { name: 'White Chana', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Breakfast', 'Salan'], image: './images/white chana.jpeg' },
            { name: 'Black Chana', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner','Salan'], image: './images/black chana.jpeg' },
            { name: 'Roti', prices: { small: 1 }, categories: ['Lunch', 'Dinner', 'Roti'], image: './images/roti.jpeg' },
            { name: 'Paratha', prices: { small: 1 }, categories: ['Lunch', 'Dinner', 'Roti'], image: './images/paratha.jpeg' },
            { name: 'Alu Paratha', prices: { small: 3.5 }, categories: ['Lunch', 'Dinner', 'Roti','Breakfast'], image: './images/aluparatha.jpeg' },
            { name: 'Bhindi', prices: { small: 5, large: 10 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/bhindi.jpeg' },
            { name: 'Alu Phali', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/aluphali.jpeg' },
            { name: 'Daal Kerala', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/daalkerala.jpeg' },
            { name: 'Daal masoor', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/daalmasoor.jpeg' },
            { name: 'chicken Handi', prices: {  large: 15 }, categories: ['Specials'], image: './images/chickenhandi.jpeg' },
            { name: 'Mutton Handi', prices: {  large: 15 }, categories: ['Specials'], image: './images/muttonhandi.jpeg' },
            { name: 'Mix Sabzi', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/mixsabzi.jpeg' },
            { name: 'Alu gobhi', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/alugobhi.jpeg' },
            { name: 'haleem', prices: { small: 5, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'  ], image: './images/haleem.jpeg' },
            { name: 'Alu Matar', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/alumatar.jpeg' },
            { name: 'Alu Anda', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan','Breakfast'], image: './images/aluanda.jpeg' },
            { name: 'chicken Salan', prices: { small: 4, large: 8 }, categories: ['Lunch', 'Dinner', 'Salan'], image: './images/chickensalan.jpeg' },
            // { name: 'Samosa', prices: { small: 1 }, categories: ['Snacks'], image: './images/samosa.jpeg' },
            // { name: 'Pakora', prices: { small: 1 }, categories: ['Snacks'], image: './images/pakora.jpeg' },
        ];

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.name = product.name;
        productCard.dataset.categories = product.categories.join(',');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <div class="price-buttons">
                ${Object.entries(product.prices).map(([size, price]) => `
                    <button class="price-btn" data-name="${product.name}" data-size="${size}" data-price="${price}">
                        ${size} - ${price} AED
                    </button>
                `).join('')}
            </div>
        `;

        productGrid.appendChild(productCard);
    });
    }
    function updateInvoice() {
        while (invoiceDetails.firstChild) {
            invoiceDetails.removeChild(invoiceDetails.firstChild);
        }

        let subtotal = 0;
        invoiceItems.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name} (${item.size})</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>${item.total.toFixed(2)}</td>
                <td><button class="delete-btn" data-index="${index}"><img src='./images/delete.png' /></button></td>
            `;
            invoiceDetails.appendChild(row);
            subtotal += item.total;
        });

        invoiceSubtotal.textContent = `${subtotal.toFixed(2)} AED`;
        calculateTaxedSubtotal(subtotal);
    }

    function calculateTaxedSubtotal(subtotal) {
        // Get the tax percentage value
        let taxPercentage = parseFloat(taxInput.value) || 0;

        // Calculate the tax amount
        let taxAmount = (subtotal * taxPercentage) / 100;

        // Calculate the taxed subtotal
        let taxedSubtotalValue = subtotal + taxAmount;

        // Update the taxed subtotal display
        taxedSubtotal.textContent = taxedSubtotalValue.toFixed(2) + ' AED';
    }

    function addItemToInvoice(name, size, price) {
        const existingItem = invoiceItems.find(item => item.name === name && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.total = existingItem.price * existingItem.quantity;
        } else {
            invoiceItems.push({
                name,
                size,
                price: parseFloat(price),
                quantity: 1,
                total: parseFloat(price)
            });
        }
        updateInvoice();
    }

    function filterProducts(category) {
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (category === 'All' || card.dataset.categories.includes(category)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function searchProducts(query) {
        const cards = document.querySelectorAll('.product-card');
        query = query.toLowerCase();
        cards.forEach(card => {
            const name = card.dataset.name;
            if (name.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    productGrid.addEventListener('click', function (e) {
        if (e.target.classList.contains('price-btn')) {
            const name = e.target.getAttribute('data-name');
            const size = e.target.getAttribute('data-size');
            const price = e.target.getAttribute('data-price');
            addItemToInvoice(name, size, price);
        }
    });

    invoiceDetails.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn') || e.target.parentElement.classList.contains('delete-btn')) {
            const button = e.target.closest('.delete-btn');
            const index = button.getAttribute('data-index');
            invoiceItems.splice(index, 1); // Remove item from array
            // Re-index the invoiceItems
            invoiceItems.forEach((item, i) => item.index = i);
            updateInvoice();
        }
    });

    taxInput.addEventListener('input', function() {
        // Update the invoice subtotal and tax when tax input changes
        const subtotal = parseFloat(invoiceSubtotal.textContent.replace(' AED', '')) || 0;
        calculateTaxedSubtotal(subtotal);
    });

    printInvoiceButton.addEventListener('click', function () {
        const date = new Date();
        invoiceDate.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        window.print();
    });

    saveDataButton.addEventListener('click', function () {
        const date = new Date();
        invoiceDate.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        const invoiceData = {
            date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString(),
            items: invoiceItems,
            subtotal: invoiceSubtotal.textContent,
            taxedTotal: taxedSubtotal.textContent
        };

        let storedInvoices = JSON.parse(localStorage.getItem('invoices')) || [];
        storedInvoices.push(invoiceData);
        localStorage.setItem('invoices', JSON.stringify(storedInvoices));

        // Clear the invoice items after saving
        invoiceItems.length = 0;
        updateInvoice();

        alert('Invoice data saved successfully!');
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = button.getAttribute('data-category');
            filterProducts(category);

            // Set active state for filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    searchInput.addEventListener('input', function () {
        const query = searchInput.value;
        searchProducts(query);
    });

    const uniqueId = Date.now(); // Unique invoice number based on timestamp
    document.getElementById('invoiceNumber').textContent = uniqueId;
    
    const today = new Date().toLocaleDateString();
    document.getElementById('invoiceDate').textContent = today;

    loadProducts();
});
