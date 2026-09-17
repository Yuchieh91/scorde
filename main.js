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


function productCard(product) {

  return `

    <article class="product ${product.active ? "" : "closed"}">

      <div class="product-image">
        ${product.icon}
      </div>

      <div class="product-body">

        <span class="eyebrow">
          ${product.category}
        </span>

        <h3>
          ${product.name}
        </h3>

        <div class="price">
          $${product.price}
        </div>

        ${
          product.active
          ?
          `<span class="closed-label"
             style="background:#e9edf1;color:#555;">
             可訂購
           </span>`
          :
          `<span class="closed-label">
             🔒 訂購截止
           </span>`
        }

      </div>

    </article>

  `;

}


const homeProducts =
  document.getElementById("homeProducts");


if (homeProducts) {

  homeProducts.innerHTML =
    PRODUCTS
      .map(productCard)
      .join("");

}
