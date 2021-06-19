async function delete_item(element){
    var deleteBtn = document.getElementsByName("deleteBtn");
    var item = document.getElementsByName("item");
    var cartId = document.getElementsByName("cartId");
    for(var index in deleteBtn){
        if(deleteBtn[index] == element){
            var url = "/purchase/cart/delete/".concat(cartId[index].value);
            await fetch(url, {
                method: "POST"
            });
            item[index].remove();
        }
        location.reload();
    }
}

async function update_item(element){
    var updateBtn = document.getElementsByName("updateBtn");
    var number = document.getElementsByName("number");
    var cartId = document.getElementsByName("cartId");
    for(var index in updateBtn){
        if(updateBtn[index] == element){
            var url = "/purchase/cart/update/".concat(cartId[index].value);
            await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    amount: number[index].value
                })
            });
            location.reload();
        }
    }
}