var addresses = document.getElementsByName("address");
var deliverIds = document.getElementsByName("deliverId");
var getDeliverPriceText = document.getElementsByName("getDeliverPriceText");
var getDeliverPrice = document.getElementsByName("getDeliverPrice");
var getTotalPrice = document.getElementsByName("getTotalPrice");
var addAddressField = document.getElementById("addAddressField");
var deliverPrice = document.getElementById("deliverPrice");
var totalPrice = document.getElementById("totalPrice");
var purchasePrice = document.getElementById("purchasePrice");
var initialDeliverPrice = document.getElementById("initialDeliverPrice");

addresses.forEach(function(address){
    address.onchange = function(){
        if(this.value == 0){
            addAddressField.innerHTML = `<input class="form-control" type="text" name="newAddress" style="border-color: black;">`;
        }
        else{
            addAddressField.innerHTML = "";
        }
    }
});

var check = 0;
var tmp = 0;
deliverIds.forEach(function(deliverId){
    deliverId.onchange = function(){
        for(var index in getDeliverPrice){
            if(deliverIds[index] == this){
                deliverPrice.innerHTML = getDeliverPriceText[index].value;
                totalPrice.innerHTML = getTotalPrice[index].value;
                if(check == 0){
                    check = 1;
                    tmp = parseInt(purchasePrice.value) - parseInt(initialDeliverPrice.value);
                }
                tmp += parseInt(getDeliverPrice[index].value);
                purchasePrice.setAttribute("value", tmp);
                tmp -= parseInt(getDeliverPrice[index].value);
            }
        }
    }
});