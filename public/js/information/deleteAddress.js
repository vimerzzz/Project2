function deleteAddress(element){
    var addressBlock = document.getElementsByName("addressBlock");
    var button = document.getElementsByName("deleteAddressBtn");
    var labelP = document.getElementsByName("labelP");

    for(var index in button){
        if(element == button[index]){
            addressBlock[index].remove();
        }
    }
    for(var index in labelP){
        labelP[index].innerHTML = `Địa chỉ #${index}`;
    }
}