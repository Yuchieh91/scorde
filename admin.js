const PRODUCTS = [

  {
    id: 1,
    name: "紀念 T-shirt",
    category: "服裝系列",
    price: 350,
    specs: ["S", "M", "L", "XL"],
    active: true
  },

  {
    id: 2,
    name: "紀念外套",
    category: "服裝系列",
    price: 900,
    specs: ["S", "M", "L", "XL"],
    active: true
  },

  {
    id: 3,
    name: "校園帆布袋",
    category: "周邊商品",
    price: 280,
    specs: ["一般"],
    active: true
  },

  {
    id: 4,
    name: "紀念毛巾",
    category: "周邊商品",
    price: 250,
    specs: ["一般"],
    active: false
  },

  {
    id: 5,
    name: "校慶徽章",
    category: "周邊商品",
    price: 100,
    specs: ["一般"],
    active: false
  },

  {
    id: 6,
    name: "紀念明信片",
    category: "周邊商品",
    price: 80,
    specs: ["一組"],
    active: true
  }

];



// 登入

function adminLogin() {

  const username =
    document
      .getElementById("adminUsername")
      .value;


  const password =
    document
      .getElementById("adminPassword")
      .value;


  if (
    username === "student-council" &&
    password === "123456"
  ) {

    sessionStorage.setItem(
      "adminLogin",
      "true"
    );


    showDashboard();

  } else {

    alert("帳號或密碼錯誤。");

  }

}



// 顯示後台

function showDashboard() {

  document
    .getElementById("loginBox")
    .classList.add("hidden");


  document
    .getElementById("dashboard")
    .classList.remove("hidden");


  refreshDashboard();

}



// 登出

function adminLogout() {

  sessionStorage.removeItem(
    "adminLogin"
  );


  location.reload();

}



// 更新

function refreshDashboard() {

  const orders =
    JSON.parse(
      localStorage.getItem("schoolOrders") || "[]"
    );


  document.getElementById("statOrders")
    .textContent =
      orders.length;


  renderOrders();

  renderProducts();

}



// Tabs

function showPanel(panelId, button) {

  document
    .querySelectorAll(".admin-panel")
    .forEach(panel => {

      panel.classList.add("hidden");

    });


  document
    .getElementById(panelId)
    .classList.remove("hidden");


  document
    .querySelectorAll(".admin-tabs button")
    .forEach(btn => {

      btn.classList.remove("active");

    });


  button.classList.add("active");

}



// 訂單

function renderOrders() {

  const orders =
    JSON.parse(
      localStorage.getItem("schoolOrders") || "[]"
    );


  const container =
    document.getElementById("adminOrders");


  if (orders.length === 0) {

    container.innerHTML =
      `<p class="muted">
        目前還沒有訂單。
      </p>`;

    return;

  }


  container.innerHTML = `

    <table class="admin-table">

      <thead>

        <tr>

          <th>訂單編號</th>
          <th>班級</th>
          <th>班代</th>
          <th>商品</th>
          <th>金額</th>

        </tr>

      </thead>


      <tbody>

        ${orders.map(order => {

          const items =
            Object.entries(order.cart)
              .map(([id, qty]) => {

                const product =
                  PRODUCTS.find(
                    p => p.id === Number(id)
                  );

                return `${product.name} × ${qty}`;

              })
              .join("<br>");


          return `

            <tr>

              <td>
                ${order.orderCode}
              </td>

              <td>
                高${order.info.grade}
                ${order.info.classNo}班
              </td>

              <td>
                ${order.info.representative}
              </td>

              <td>
                ${items}
              </td>

              <td>
                $${order.total}
              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  `;

}



// 商品

function renderProducts() {

  const container =
    document.getElementById("adminProducts");


  container.innerHTML =
    PRODUCTS.map(product => {

      return `

        <div class="admin-product">

          <div>

            <strong>
              ${product.name}
            </strong>

            <div class="muted">
              $${product.price}
              ｜${product.specs.join(" / ")}
            </div>

          </div>


          <span
            class="closed-label"
            style="
              background:
              ${product.active ? "#e6f5ed" : "#eeeeee"};
              color:
              ${product.active ? "#3f8f68" : "#777"};
            "
          >

            ${
              product.active
              ? "🟢 訂購中"
              : "⚪ 訂購截止"
            }

          </span>

        </div>

      `;

    }).join("");

}



// 公告

function saveNotice() {

  const title =
    document
      .getElementById("noticeTitle")
      .value;


  const content =
    document
      .getElementById("noticeContent")
      .value;


  localStorage.setItem(

    "schoolNotice",

    JSON.stringify({
      title,
      content
    })

  );


  alert("公告已儲存。");

}



// CSV

function downloadCSV(filename, rows) {

  const csv =
    rows
      .map(row =>
        row
          .map(value =>
            `"${String(value)
              .replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      ["\uFEFF" + csv],
      {
        type: "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download = filename;

  link.click();


  URL.revokeObjectURL(url);

}



// 全體統計

function exportSummary() {

  const orders =
    JSON.parse(
      localStorage.getItem("schoolOrders") || "[]"
    );


  const summary = {};


  orders.forEach(order => {

    Object.entries(order.cart)
      .forEach(([id, quantity]) => {

        const product =
          PRODUCTS.find(
            p => p.id === Number(id)
          );


        const key =
          product.name;


        if (!summary[key]) {

          summary[key] = 0;

        }


        summary[key] += quantity;

      });

  });


  const rows = [

    [
      "商品",
      "總數量"
    ]

  ];


  Object.entries(summary)
    .forEach(([name, quantity]) => {

      rows.push([
        name,
        quantity
      ]);

    });


  downloadCSV(
    "全體訂單統計.csv",
    rows
  );

}



// 含價格

function exportPriced() {

  const orders =
    JSON.parse(
      localStorage.getItem("schoolOrders") || "[]"
    );


  const rows = [

    [
      "訂單編號",
      "年級",
      "班級",
      "班代",
      "商品",
      "數量",
      "單價",
      "小計"
    ]

  ];


  orders.forEach(order => {

    Object.entries(order.cart)
      .forEach(([id, quantity]) => {

        const product =
          PRODUCTS.find(
            p => p.id === Number(id)
          );


        rows.push([

          order.orderCode,

          `高${order.info.grade}`,

          `${order.info.classNo}班`,

          order.info.representative,

          product.name,

          quantity,

          product.price,

          quantity * product.price

        ]);

      });

  });


  downloadCSV(
    "含價格訂單.csv",
    rows
  );

}



// 自動登入

if (
  sessionStorage.getItem("adminLogin") === "true"
) {

  showDashboard();

}
