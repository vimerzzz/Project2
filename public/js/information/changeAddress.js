function changeAddress(element){
    var address = document.getElementsByName("address");
    var button = document.getElementsByName("changeAddressBtn");

    for(var index in button){
        if(element == button[index]){
            if(address[index].disabled){
                address[index].disabled = false;
                button[index].setAttribute("value", "Hủy");
                button[index].classList.remove("btn-success");
                button[index].classList.add("btn-danger");
            }
            else{
                address[index].disabled = true;
                button[index].setAttribute("value", "Sửa");
                button[index].classList.add("btn-success");
                button[index].classList.remove("btn-danger");
            }
        }
    }
}