/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
  })
  
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
       products.forEach(product => {
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
                 <button type="button" class="btn btn-yellow order-button w-100" 
                   data-bs-toggle="modal" 
                   data-bs-target="#orderProductModal"
                   data-product-id="${product.id}"
                   data-product-title="${product.title}"
                   data-product-price="${product.price}"
                   data-product-image="${product.image}"
                   data-product-description="${product.description}">
                   Buy
                 </button>
               </div>
             </div>
           `;
           
           container.appendChild(col);
         });
         
         
  
       // Lägger till flip-funktion
       document.querySelectorAll('.flip-card').forEach(card => {
           card.addEventListener('click', () => {
               card.classList.toggle('flipped');
           });
       });
  
       
  
   } catch (error) {
       console.error("Fel vid hämtning av produkter:", error);
       document.getElementById("products-container").innerHTML = `<p class="text-danger">Kunde inte ladda produkter. Försök igen senare.</p>`;
   }
  }
  
  
  const orderProductModal = document.getElementById('orderProductModal');
  orderProductModal.addEventListener('show.bs.modal', function (event) {
  const button = event.relatedTarget;
  const productTitle = button.getAttribute('data-product-title');
  const productPrice = button.getAttribute('data-product-price');
  const productImage = button.getAttribute('data-product-image');
  const productDescription = button.getAttribute('data-product-description');
  
  document.getElementById('modalProductTitle').textContent = productTitle;
  document.getElementById('modalProductPrice').textContent = "$" + productPrice;
  document.getElementById('modalProductImage').src = productImage;
  document.getElementById('modalProductDescription').textContent = productDescription;
  });
  
  
  document.getElementById('submitOrderButton').addEventListener('click', function() {
  const form = document.getElementById('orderProductForm');
  let valid = true;
  
  // Hämtar fält
  const orderName = document.getElementById('orderName');
  const orderEmail = document.getElementById('orderEmail');
  const orderPhone = document.getElementById('orderPhone');
  const orderStreet = document.getElementById('orderStreet');
  const orderZipCode = document.getElementById('orderZipCode');
  const orderCity = document.getElementById('orderCity');
  
  // Tar bort tidigare felmarkeringar
  [orderName, orderEmail, orderPhone, orderStreet, orderZipCode, orderCity].forEach(input => {
   input.classList.remove('is-invalid');
  });
  
  // Validering av fälten
  if (orderName.value.trim().length < 2 || orderName.value.trim().length > 50) {
   orderName.classList.add('is-invalid');
   valid = false;
  }
  if (!orderEmail.value.includes('@') || orderEmail.value.trim().length > 50) {
   orderEmail.classList.add('is-invalid');
   valid = false;
  }
  const phoneRegex = /^[0-9()\-\s]+$/;
  if (!phoneRegex.test(orderPhone.value) || orderPhone.value.trim().length > 50) {
   orderPhone.classList.add('is-invalid');
   valid = false;
  }
  if (orderStreet.value.trim().length < 2 || orderStreet.value.trim().length > 50) {
    orderStreet.classList.add('is-invalid');
   valid = false;
  }
  const zipCodeRegex = /^\d{5}$/; 
  if (!zipCodeRegex.test(orderZipCode.value)) {
    orderZipCode.classList.add('is-invalid');
    valid = false;
   }
   if (orderCity.value.trim().length < 2 || orderCity.value.trim().length > 50) {
    orderCity.classList.add('is-invalid');
    valid = false;
   }
  
  if (valid) {
   
    // Hämtar produktdata från modalen
    const productTitle = document.getElementById('modalProductTitle').textContent;
    const productPrice = document.getElementById('modalProductPrice').textContent;
    const productImage = document.getElementById('modalProductImage').src;
    const productDescription = document.getElementById('modalProductDescription').textContent;
  
    // Skapar ett objekt med all data på kvittot
    const receiptData = {
      title: productTitle,
      price: productPrice,
      image: productImage,
      description: productDescription,
      orderName: orderName.value.trim(),
      orderEmail: orderEmail.value.trim(),
      orderPhone: orderPhone.value.trim(),
      orderStreet: orderStreet.value.trim(),
      orderZipCode: orderZipCode.value.trim(),
      orderCity: orderCity.value.trim()
    };
  
    // Sparar datan i sessionStorage (datan finns kvar tills fliken stängs)
    sessionStorage.setItem("receiptData", JSON.stringify(receiptData));
   
    // Stänger modalen
   const modalEl = document.getElementById('orderProductModal');
   const modal = bootstrap.Modal.getInstance(modalEl);
   modal.hide(); 
   
   form.reset(); 
  
   // Omdirigerar till kvitto-sidan
   window.location.href = "receipt.html";
  }
  });
  
    
  
  
    