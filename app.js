// Function to add item to the list (UI)
function addItem(name, price) {
  const itemList = document.getElementById('itemList');
  const listItem = document.createElement('li');
  listItem.textContent = `${name} - $${price}`;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.onclick = () => {
    itemList.removeChild(listItem);
  };
  listItem.appendChild(deleteBtn);
  itemList.appendChild(listItem);
}

// Fetching products from the backend
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:8080/products');
    const products = await response.json();
    products.forEach(product => {
      addItem(product.name, product.price);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Adding a new product to the backend
// Adding a new product to the backend
async function addProduct(name, price, shortDescription, longDescription, category, pbrand, images) {
  // Create the product object with all necessary fields
  const newProduct = {
    sku: Date.now(), // Unique SKU
    name: name,
    short_description: shortDescription,
    long_description: longDescription,
    images: images || [], // Empty array if no images
    price: parseFloat(price).toFixed(2), // Ensure the price is a float and has 2 decimals
    discount: "0.00", // You can adjust the discount value if necessary
    available_inventory: 10, // Set a default inventory, adjust as needed
    category: [category], // Wrap category in an array
    pbrand: pbrand // Brand (e.g., "NVIDIA", "AMD", etc.)
  };

  try {
    // Send POST request to the backend to create a product
    const response = await fetch('http://localhost:8080/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct), // Send product object as JSON
    });

    const data = await response.json();

    if (response.ok) {
      // If the product is successfully added, update the UI
      addItem(data.name, data.price); // Add to inventory list on frontend
    } else {
      console.error('Failed to add product:', data);
    }
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

// Fetching orders from the backend
async function fetchOrders() {
  try {
    const response = await fetch('http://localhost:8080/orders');
    const orders = await response.json();

    orders.forEach(order => {
      addOrder(order.customer_name, order.items, order.status);
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

// Adding an order to the backend
async function addOrderToBackend(orderData) {
  try {
    const response = await fetch('http://localhost:8080/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();
    if (response.ok) {
      addOrder(data.customer_name, data.items, data.status);
    } else {
      console.error('Failed to add order:', data);
    }
  } catch (error) {
    console.error('Error adding order:', error);
  }
}

// Function to display orders
function addOrder(customerName, items, status) {
  const orderList = document.getElementById('orderList');
  const listItem = document.createElement('li');

  // Format items nicely
  const itemsFormatted = Array.isArray(items)
    ? items.map(item => `${item.item} (x${item.quantity})`).join(', ')
    : items;

  listItem.innerHTML = `
    <strong>Customer:</strong> ${customerName} <br>
    <strong>Items:</strong> ${itemsFormatted} <br>
    <strong>Status:</strong> <span class="order-status ${status}">${status}</span>
  `;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.onclick = () => {
    orderList.removeChild(listItem);
  };

  listItem.appendChild(deleteBtn);
  orderList.appendChild(listItem);
}

// Event listener for the item form
document.getElementById('itemForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('itemName').value;
  const price = document.getElementById('itemPrice').value;
  const category = document.getElementById('itemCategory').value;
  const pbrand = document.getElementById('itemBrand').value;

  addProduct(name, price, category, pbrand);
  document.getElementById('itemForm').reset();
});

// Event listener for the order form
document.getElementById('orderForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const customerName = document.getElementById('orderCustomerName').value;
  const itemsString = document.getElementById('orderItems').value;
  const quantity = document.getElementById('orderQuantity').value;
  const status = document.getElementById('orderStatus').value;

  // Convert comma-separated items into real array
  const itemArray = itemsString.split(',').map(item => item.trim()).filter(item => item !== '');

  const orderData = {
    customer_name: customerName,
    items: itemArray.map(itemName => ({
      item: itemName,
      price: 100, // Default price placeholder
      quantity: parseInt(quantity)
    })),
    status
  };

  addOrderToBackend(orderData);
  document.getElementById('orderForm').reset();
});

// When page loads
document.addEventListener('DOMContentLoaded', function () {
  fetchProducts();
  fetchOrders();
});

