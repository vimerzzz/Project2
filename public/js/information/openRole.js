function openRole(element){
    var userRole = document.getElementsByName("userRole");
    var saveUser = document.getElementsByName("saveUser");

    for(var index in userRole){
        if(element == userRole[index]){
            saveUser[index - 1].style.display = "block";
        }
    }
}