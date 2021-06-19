var buttonCart = document.getElementById("buttonCart");
var buttonBuy = document.getElementById("buttonBuy");
var notification = document.getElementById("notification");

async function add_cart(){
    var number = document.getElementById("number");
    var url = "/item/addCart/".concat(buttonCart.value);
    var check = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            number: number.value
        })
    }).then(res => res.json());
    if(check.tokenError){
        location.href = "/login";
    }
    else{
        notification.style.display = "flex";
        setTimeout(function(){
            notification.style.display = "none";
        }, 2500);
    }
}

async function add_cart_and_buy(){
    var number = document.getElementById("number");
    var url = "/item/addCart/".concat(buttonCart.value);
    var check = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            number: number.value
        })
    }).then(res => res.json());
    if(check.tokenError){
        location.href = "/login";
    }
    else{
        location.href = "/purchase/cart";
    }
}