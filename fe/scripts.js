let productList = [];
let carrito = [];
let total = 0;
let order = {
  items: [],
};
let contador = 0;

// esta funcion lo que hace es agregra al carrito 
function add(productId, price) {
  const product = productList.find((p) => p.id === productId);
  product.stock--;

  order.items.push(productList.find((p) => p.id === productId));


  console.log(productId, price);
  carrito.push(productId);


  total = total + price;
  document.getElementById("checkout").innerHTML = `Carrito $${total}`;
  displayProducts();


  if(contador=contador){
    contador ++
  }
  document.getElementById("cont").innerHTML=`${contador}`
  showOrder();

 
} 

// estas funciones son para agregra y quitar 
function agregar(productId,price){
  const product = productList.find((p)=> p.id === productId);
  product.stock--;

  order.items.push(productList.find((p)=>p.id ===productId));

  console.log(productId,price);
  carrito.push(productId);
  total = total + price;
  document.getElementById("checkout").innerHTML =`Carrito $${total}`
  showOrder();

  
  contador = contador + 1 ;
  document.getElementById("cont").innerHTML=`${contador}`
  showOrder();

}

function quitar(productId, price) {
  const product = productList.find((p) => p.id === productId);
  product.stock++;

  // quitar 1 item de la orden
  order.items.splice(order.items.indexOf(productList.find((p) => p.id === productId)), 1);

  console.log(productId, price);
  carrito.push(productId);

  // quita el producto del carrito
  carrito.splice(carrito.indexOf(productId), 1);

  // devuelve el total
  total = total - price;
  document.getElementById("checkout").innerHTML = `Carrito $${total}`;
  document.getElementById("order-total").innerHTML = `$${total}`;
  showOrder();

  
  contador = contador - 1 ;
  document.getElementById("cont").innerHTML=`${contador}`
  showOrder();
}


async function showOrder() {
  document.getElementById("all-products").style.display = "none";
  document.getElementById("order").style.display = "block";

  document.getElementById("order-total").innerHTML = `$${total}`;



  let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
        <th>Agregar</th>
        <th>Delete</th>
    </tr>`;
  order.items.forEach((p) => {

    let buttonQuitar= `<button class="" onclick="agregar(${p.id}, ${p.price})">+</button>`
    let buttonAgregar= `<button class="" onclick="quitar(${p.id}, ${p.price})">-</button>`
    
    productsHTML += `<tr>
            <td><input id="cont" value="${contador}"></input></td>
            <td>${p.name}</td>
            <td>$${p.price}</td>
            <td>${buttonQuitar}</td>          
            <td>${buttonAgregar}</td>
            
        </tr>`;
  });
  document.getElementById("order-table").innerHTML = productsHTML;
}

async function pay() {
  try {
    order.shipping = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      addressLine1: document.getElementById("addressLine1").value,
      addressLine2: document.getElementById("addressLine2").value,
      city: document.getElementById("city").value,
      postalCode: document.getElementById("postalCode").value,
      state: document.getElementById("state").value,
      country: document.getElementById("country").value,
    };

    const preference = await (
      await fetch("/api/pay", {
        method: "post",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).json();

    var script = document.createElement("script");

    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src =
      "https://www.mercadopago.com.mx/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference.preferenceId;
    script.setAttribute("data-button-label", "Pagar con Mercado Pago");
    document.getElementById("order-actions").innerHTML = "";
    document.querySelector("#order-actions").appendChild(script);

    document.getElementById("name").disabled = true;
    document.getElementById("email").disabled = true;
    document.getElementById("phone").disabled = true;
    document.getElementById("addressLine1").disabled = true;
    document.getElementById("addressLine2").disabled = true;
    document.getElementById("city").disabled = true;
    document.getElementById("postalCode").disabled = true;
    document.getElementById("state").disabled = true;
    document.getElementById("country").disabled = true;
  } catch {
    window.alert("Sin stock");
  }

  carrito = [];
  total = 0;
  order = {
    items: [],
  };
  //await fetchProducts();
  document.getElementById("checkout").innerHTML = `Carrito $${total}`;
}

//-----
function displayProducts() {
  document.getElementById("all-products").style.display = "block";
  document.getElementById("order").style.display = "none";

  const gym = productList.filter((p) => p.category === "gym");
  displayProductsByType(gym, "product-cards-gym");

  const car = productList.filter((p) => p.category === "car");
  displayProductsByType(car, "product-cards-car");

  const pc = productList.filter((p) => p.category === "pc");
  displayProductsByType(pc, "product-cards-pc");
}

function displayProductsByType(productsByType, tagId) {
  let productsHTML = "";
  productsByType.forEach((p) => {
    let buttonHTML = `<button class="button-add" onclick="add(${p.id}, ${p.price})">Agregar</button>`;
   
    if (p.stock <= 0) {
      buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id}, ${p.price})">Sin stock</button>`;
    }

    productsHTML += `<div class="product-container">
            <div class="img-cont">
               <img src="${p.image}" />
            </div>
            <div class="product-exp">
              <h3>${p.name}</h3>
              <p class=etiqueta">
                 <ul>
                   <li>Tipo:${p.tipo}</li>
                 </ul>
                 <ul>
                   <li>Sabor:${p.sabor}</li> 
                 </ul>
                 <ul>
                    <li>Contenido:${p.contenido}</li> 
                 </ul>
                 <ul>
                    <li>Stock:${p.stock}</li> 
                </ul>
              </p>
              <div class="items-details">
                   <h3 class="price">$${p.price}</h3>
                  ${buttonHTML}
              </div>
            </div>
        </div>`;
  });
  document.getElementById(tagId).innerHTML = productsHTML;
}

async function fetchProducts() {
  productList = await (await fetch("/api/products")).json();
  displayProducts();
}

window.onload = async () => {
  await fetchProducts();
};
