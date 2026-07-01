let items = [];

document.addEventListener("product-submit", (event) => {
  const item = event.detail;
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
});

const product = {
  "name": "cafe",
  "price": 5000,
  "quantity": 800
};

const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com";

const httpClient = fetch(`${URL_BASE}/product.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(product)
});

const rest = httpClient.then(data=> data.json());
rest.then(data => console.log).catch(err => console.log);

