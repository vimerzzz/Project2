function preSubmitAddress(){
    var address = document.getElementsByName("address");
    for(var index in address){
        address[index].disabled = false;
    }
    return true;
}