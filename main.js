items = [];

document.addEventListener("product-submit", (event) => {
  const item = event.detail;
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
});

const product = {
  "name": "sofia",
  "quantity":"jobe456",
  "price":"jobe456"

}

const URL_BASE = "https://stock-flow-e92c1-default-rtdb.firebaseio.com"

const httpClient= fetch(`${URL_BASE}/product.json`,{
  method:"POST",
  header:{
    "Content-Type": "application/json"
  },
  body: JSON.stringify(product)
});


const res= httpClient.then(data=> data.json());
res.then(data=> console.log).catch(err=> console.error)