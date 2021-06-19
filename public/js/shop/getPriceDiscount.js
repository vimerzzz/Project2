function getPriceDiscount(element){
    var price = document.getElementsByName("price");
    var priceDiscount = document.getElementsByName("priceDiscount");

    for(var index in price){
        if(price[index] == element){
            priceDiscount[index].setAttribute("value", price[index].value);
        }
    }
}