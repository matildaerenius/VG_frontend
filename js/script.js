/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    updateCartUI();
    loadProducts();
});

async function loadProducts() {
    try {
        console.log("Hämtar produkter från fakestore...");

        // Hämtar produkter från API
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error(`API-fel: ${response.status}`);

        const products = await response.json();

        // Hitta container
        const container = document.getElementById("products-container");
        if (!container) throw new Error("Fel: Ingen container hittades!");

        // Rensa container innan produkter läggs in 
        container.innerHTML = "";

        // Loopa igenom produkterna
        products.forEach((product) => {
            const col = document.createElement("div");
            col.classList.add("col-auto");


            col.innerHTML = `
        <div class="card product-card flip-card d-flex flex-column">
          <div class="flip-card-inner flex-grow-1">
            <div class="flip-card-front">
              <img src="${product.image}" class="card-img-top" alt="${product.title}">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-price">$${product.price}</p>
            </div>
            <div class="flip-card-back">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-description">${product.description}</p>
            </div>
          </div>
          <div class="p-2 mt-auto">
            <button type="button" class="btn btn-primary w-100 add-to-cart-btn">
              Add to Cart
            </button>
          </div>
        </div>
      `;

            container.appendChild(col);

            // Lägger till flip-funktion
            const flipCard = col.querySelector(".flip-card");
            flipCard.addEventListener("click", () => {
                flipCard.classList.toggle("flipped");
            });

            // "Add to Cart"-knappen
            const addToCartBtn = col.querySelector(".add-to-cart-btn");
            addToCartBtn.addEventListener("click", (event) => {
                event.stopPropagation();
                addToCart(product);
            });
        });
    } catch (error) {
        console.error("Fel vid hämtning av produkter:", error);
        document.getElementById("products-container").innerHTML =
            `<p class="text-danger">Kunde inte ladda produkter. Försök igen senare.</p>`;
    }
}

// Lägg till en produkt i varukorgen
function addToCart(product) {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    updateCartUI();
}


function updateCartUI() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");


    cartItems.innerHTML = "";


    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='text-center'>Your cart is empty.</p>";
        cartCount.textContent = 0;
        return;
    }

    // Räkna ut totalpris
    let total = 0;

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        const itemRow = document.createElement("div");

        itemRow.classList.add("py-2");

        itemRow.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center">
        <img 
          src="${item.image}" 
          alt="${item.title}"
          style="width: 60px; height: auto; object-fit: contain; margin-right: 10px;"
        />
        
        <div>
          <h6 class="mb-1">${item.title}</h6>
          <p class="mb-1">$${item.price.toFixed(2)}</p>
          
          <div class="quantity-controls">
            <button class="quantity-btn minus-btn">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn plus-btn">+</button>
          </div>
        </div>
      </div>
    <div class="text-end">
      <button class="btn btn-sm btn-danger remove-item-btn">
        <i class="bi bi-trash"></i>
      </button>
       <p class="mb-0 mt-2"> <strong>Sum:</strong> $${itemSubtotal.toFixed(2)}</p>
      </div>
    </div>
    `;

        // Infoga itemRow i cartItems
        cartItems.appendChild(itemRow);

        // Lägg en linje under varje produkt
        const separator = document.createElement("hr");
        cartItems.appendChild(separator);

        // Minus-knapp
        itemRow.querySelector(".minus-btn").addEventListener("click", () => {
            decreaseQuantity(index);
        });

        // Plus-knapp
        itemRow.querySelector(".plus-btn").addEventListener("click", () => {
            increaseQuantity(index);
        });

        // Papperskorgsikon
        itemRow.querySelector(".remove-item-btn").addEventListener("click", () => {
            removeFromCart(index);
        });

        // Ta bort enskild produkt
        itemRow.querySelector(".remove-item-btn").addEventListener("click", () => {
            removeFromCart(index);
        });

        cartItems.appendChild(itemRow);
    });

    localStorage.setItem("cart", JSON.stringify(cart));


    function increaseQuantity(index) {
        cart[index].quantity++;
        updateCartUI();
    }

    function decreaseQuantity(index) {
        cart[index].quantity--;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            updateCartUI();
        }
    }


    const totalDiv = document.createElement("div");
    totalDiv.classList.add("mt-auto");

    totalDiv.innerHTML = `
    <hr>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <strong>Total</strong>
      <span>$${total.toFixed(2)}</span>
    </div>
    <a href="order.html" class="btn btn-primary w-100">Buy Now</a>

  `;

    cartItems.appendChild(totalDiv);

    // Uppdatera antal artiklar
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = totalItems;

}

// Ta bort en produkt från varukorgen baserat på index
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

function clearCart() {
    cart = [];
    updateCartUI();
}


