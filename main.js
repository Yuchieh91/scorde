/* ========================================
   CAMPUS ORDER
   Main JavaScript
======================================== */


/* ---------- PRODUCTS ---------- */

const products = [

    {
        id: 1,
        name: "校園紀念 T-shirt",
        price: 350,
        category: "clothing",
        image: "images/tshirt.jpg",
        status: "熱門推薦",
        available: true
    },

    {
        id: 2,
        name: "校園紀念外套",
        price: 900,
        category: "clothing",
        image: "images/jacket.jpg",
        status: "",
        available: true
    },

    {
        id: 3,
        name: "校園帆布袋",
        price: 280,
        category: "life",
        image: "images/bag.jpg",
        status: "",
        available: true
    },

    {
        id: 4,
        name: "紀念毛巾",
        price: 250,
        category: "life",
        image: "images/towel.jpg",
        status: "訂購截止",
        available: false
    },

    {
        id: 5,
        name: "紀念明信片",
        price: 80,
        category: "souvenir",
        image: "images/postcard.jpg",
        status: "",
        available: true
    },

    {
        id: 6,
        name: "校慶徽章",
        price: 100,
        category: "souvenir",
        image: "images/badge.jpg",
        status: "",
        available: true
    }

];


/* ---------- CART ---------- */

let cart =
    JSON.parse(
        localStorage.getItem("campusCart")
    ) || [];


/* ---------- DOM ---------- */

const productGrid =
    document.getElementById("productGrid");

const cartCount =
    document.getElementById("cartCount");

const cartPanel =
    document.getElementById("cartPanel");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");


/* ========================================
   RENDER PRODUCTS
======================================== */

function renderProducts(category = "all") {

    productGrid.innerHTML = "";

    const filteredProducts =
        category === "all"
            ? products
            : products.filter(
                product =>
                    product.category === category
            );


    filteredProducts.forEach(product => {

        const card =
            document.createElement("article");

        card.className =
            "product-card" +
            (!product.available
                ? " expired"
                : "");


        card.innerHTML = `

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                >

                ${
                    product.status
                        ? `
                        <span class="product-status">
                            ${product.status}
                        </span>
                        `
                        : ""
                }

            </div>


            <div class="product-info">

                <div>

                    <div class="product-name">
                        ${product.name}
                    </div>

                    <div class="product-price">
                        NT$ ${product.price.toLocaleString()}
                    </div>

                </div>


                <span class="product-arrow">
                    →
                </span>

            </div>

        `;


        if (product.available) {

            card.addEventListener(
                "click",
                () => addToCart(product)
            );

        }


        productGrid.appendChild(card);

    });

}


/* ========================================
   ADD CART
======================================== */

function addToCart(product) {

    const existing =
        cart.find(
            item => item.id === product.id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    openCart();

}


/* ========================================
   REMOVE CART
======================================== */

function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

    renderCart();

}


/* ========================================
   CHANGE QUANTITY
======================================== */

function changeQuantity(id, amount) {

    const item =
        cart.find(
            item => item.id === id
        );

    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;

    }


    saveCart();

    renderCart();

}


/* ========================================
   RENDER CART
======================================== */

function renderCart() {

    const totalQuantity =
        cart.reduce(
            (sum, item) =>
                sum + item.quantity,
            0
        );


    cartCount.textContent =
        totalQuantity;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <span>🛍</span>

                <p>
                    購物車目前是空的
                </p>

            </div>

        `;

        cartTotal.textContent =
            "NT$ 0";

        return;

    }


    cartItems.innerHTML = "";


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;


        const element =
            document.createElement("div");


        element.style.cssText = `

            display:flex;
            gap:15px;
            padding:18px 0;
            border-bottom:1px solid #e5e8ea;
            align-items:center;

        `;


        element.innerHTML = `

            <img
                src="${item.image}"
                style="
                    width:72px;
                    height:82px;
                    object-fit:cover;
                    background:#f0f2f3;
                "
            >


            <div style="flex:1">

                <div style="
                    font-size:13px;
                    color:#405363;
                    margin-bottom:7px;
                ">
                    ${item.name}
                </div>


                <div style="
                    font-size:12px;
                    color:#89949c;
                    margin-bottom:12px;
                ">
                    NT$ ${item.price.toLocaleString()}
                </div>


                <div style="
                    display:flex;
                    align-items:center;
                    gap:13px;
                ">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                        style="font-size:17px;color:#72818c"
                    >
                        −
                    </button>

                    <span style="font-size:12px">
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                        style="font-size:17px;color:#72818c"
                    >
                        ＋
                    </button>

                </div>

            </div>


            <button
                onclick="removeFromCart(${item.id})"
                style="
                    font-size:20px;
                    color:#a2abb1;
                "
            >
                ×
            </button>

        `;


        cartItems.appendChild(element);

    });


    cartTotal.textContent =
        `NT$ ${total.toLocaleString()}`;

}


/* ========================================
   SAVE CART
======================================== */

function saveCart() {

    localStorage.setItem(
        "campusCart",
        JSON.stringify(cart)
    );

}


/* ========================================
   OPEN / CLOSE CART
======================================== */

function openCart() {

    cartPanel.classList.add("show");

    cartOverlay.classList.add("show");

}

function closeCart() {

    cartPanel.classList.remove("show");

    cartOverlay.classList.remove("show");

}


document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


cartOverlay.addEventListener(
    "click",
    closeCart
);


/* ========================================
   CATEGORY FILTER
======================================== */

document
    .querySelectorAll(".category")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".category")
                    .forEach(
                        btn =>
                            btn.classList.remove("active")
                    );


                button.classList.add("active");


                renderProducts(
                    button.dataset.category
                );

            }
        );

    });


/* ========================================
   SCROLL
======================================== */

function scrollToProducts() {

    document
        .getElementById("products")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* ========================================
   SEARCH BUTTON
======================================== */

document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        () => {

            alert(
                "搜尋功能之後可以加入商品名稱、分類與規格搜尋。"
            );

        }
    );


/* ========================================
   INIT
======================================== */

renderProducts();

renderCart();
