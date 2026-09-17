const PRODUCTS = [

  {
    id: 1,
    name: "紀念 T-shirt",
    category: "服裝系列",
    price: 350,
    icon: "👕",
    specs: ["S", "M", "L", "XL"],
    active: true
  },

  {
    id: 2,
    name: "紀念外套",
    category: "服裝系列",
    price: 900,
    icon: "🧥",
    specs: ["S", "M", "L", "XL"],
    active: true
  },

  {
    id: 3,
    name: "校園帆布袋",
    category: "周邊商品",
    price: 280,
    icon: "🎒",
    specs: ["一般"],
    active: true
  },

  {
    id: 4,
    name: "紀念毛巾",
    category: "周邊商品",
    price: 250,
    icon: "🧣",
    specs: ["一般"],
    active: false
  },

  {
    id: 5,
    name: "校慶徽章",
    category: "周邊商品",
    price: 100,
    icon: "📛",
    specs: ["一般"],
    active: false
  },

  {
    id: 6,
    name: "紀念明信片",
    category: "周邊商品",
    price: 80,
    icon: "💌",
    specs: ["一組"],
    active: true
  }

];


let info = {};

let cart = {};


// 建立班級選項

const classNumber =
  document.getElementById("classNumber");


if (classNumber) {

  for (let i = 1; i <= 18; i++) {

    const option =
      document.createElement("option");

    option.value =
      String(i).padStart(2, "0");

    option.textContent =
      `${i} 班`;

    classNumber.appendChild(option);

  }

}



// STEP 1

function startOrder() {

  const year =
    document.getElementById("year").value;

  const grade =
    document.getElementById("grade").value;

  const classNo =
    document.getElementById("classNumber").value;

  const representative =
    document.getElementById("representative").value.trim();


  if (!grade || !classNo || !representative) {

    alert("請完整填寫班級資料。");

    return;

  }


  info = {

    year,

    grade,

    classNo,

    representative

  };


  document
    .getElementById("classStep")
    .classList.add("hidden");


  document
    .getElementById("shopStep")
    .classList.remove("hidden");


  renderProducts();

  renderCart();

}



// 商品

function renderProducts() {

  const container =
    document.getElementById("orderProducts");


  container.innerHTML =
    PRODUCTS.map(product => {

      const quantity =
        cart[product.id] || 0;


      if (!product.active) {

        return `

          <article class="order-product closed">

            <div class="product-top">

              <div>

                <span class="eyebrow">
                  ${product.category}
                </span>

                <h3>
                  ${product.name}
                </h3>

              </div>

              <strong>
                $${product.price}
              </strong>

            </div>

            <p class="product-spec">
              規格：
              ${product.specs.join(" / ")}
            </p>

            <span class="closed-label">
              🔒 訂購截止
            </span>

          </article>

        `;

      }


      return `

        <article class="order-product">

          <div class="product-top">

            <div>

              <span class="eyebrow">
                ${product.category}
              </span>

              <h3>
                ${product.icon}
                ${product.name}
              </h3>

            </div>

            <strong>
              $${product.price}
            </strong>

          </div>


          <p class="product-spec">
            規格：
            ${product.specs.join(" / ")}
          </p>


          <div class="quantity-control">

            <button
              onclick="changeQty(${product.id}, -1)"
            >
              −
            </button>

            <strong>
              ${quantity}
            </strong>

            <button
              onclick="changeQty(${product.id}, 1)"
            >
              ＋
            </button>

          </div>

        </article>

      `;

    }).join("");

}



// 數量

function changeQty(id, change) {

  const current =
    cart[id] || 0;


  const next =
    Math.max(0, current + change);


  cart[id] = next;


  if (cart[id] === 0) {

    delete cart[id];

  }


  renderProducts();

  renderCart();

}



// 總金額

function total() {

  return Object.entries(cart)
    .reduce((sum, [id, quantity]) => {

      const product =
        PRODUCTS.find(
          p => p.id === Number(id)
        );

      return sum +
        product.price * quantity;

    }, 0);

}



// 購物車

function renderCart() {

  const container =
    document.getElementById("cartItems");

  const entries =
    Object.entries(cart);


  if (entries.length === 0) {

    container.innerHTML =
      `<p class="muted">尚未選擇商品</p>`;

    document.getElementById("cartTotal")
      .textContent = "$0";

    return;

  }


  container.innerHTML =
    entries.map(([id, quantity]) => {

      const product =
        PRODUCTS.find(
          p => p.id === Number(id)
        );


      return `

        <div class="cart-item">

          <span>
            ${product.name}
            × ${quantity}
          </span>

          <strong>
            $${product.price * quantity}
          </strong>

        </div>

      `;

    }).join("");


  document.getElementById("cartTotal")
    .textContent =
      `$${total()}`;

}



// STEP 3

function reviewOrder() {

  if (Object.keys(cart).length === 0) {

    alert("請至少選擇一項商品。");

    return;

  }


  document
    .getElementById("shopStep")
    .classList.add("hidden");


  document
    .getElementById("confirmStep")
    .classList.remove("hidden");


  document.getElementById("confirmInfo")
    .innerHTML = `

      <strong>
        ${info.year} 學年度
        高${info.grade}
        ${info.classNo} 班
      </strong>

      <br>

      班代：
      ${info.representative}

    `;


  document.getElementById("confirmItems")
    .innerHTML =
      Object.entries(cart)
        .map(([id, quantity]) => {

          const product =
            PRODUCTS.find(
              p => p.id === Number(id)
            );


          return `

            <div class="confirm-item">

              <span>
                ${product.name}
                × ${quantity}
              </span>

              <strong>
                $${product.price * quantity}
              </strong>

            </div>

          `;

        })
        .join("");


  document.getElementById("confirmTotal")
    .textContent =
      `$${total()}`;

}



// 返回

function backToShop() {

  document
    .getElementById("confirmStep")
    .classList.add("hidden");


  document
    .getElementById("shopStep")
    .classList.remove("hidden");

}



// 送出

function submitOrder() {

  const orders =
    JSON.parse(
      localStorage.getItem("schoolOrders") || "[]"
    );


  const orderCode =
    "A" +
    Date.now().toString().slice(-8);


  const editToken =
    Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();


  const order = {

    orderCode,

    editToken,

    info,

    cart,

    total: total(),

    createdAt:
      new Date().toISOString()

  };


  orders.push(order);


  localStorage.setItem(
    "schoolOrders",
    JSON.stringify(orders)
  );


  document
    .getElementById("confirmStep")
    .classList.add("hidden");


  document
    .getElementById("doneStep")
    .classList.remove("hidden");


  document.getElementById("orderCode")
    .textContent =
      orderCode;


  document.getElementById("editToken")
    .textContent =
      editToken;

}
