function openStatus(element){
    var usernameList = document.getElementsByName("usernameList");
    var emailList = document.getElementsByName("emailList");
    var userRole = document.getElementsByName("userRole");
    var userStatus = document.getElementsByName("userStatus");
    var saveUser = document.getElementsByName("saveUser");

    for(var index in userStatus){
        if(element == userStatus[index]){
            saveUser[index - 1].style.display = "block";
        }
        if(userStatus[index].value == 2){
            usernameList[index].classList.remove("list-group-item-light");
            emailList[index].classList.remove("list-group-item-light");
            userRole[index].classList.remove("list-group-item-light");
            userStatus[index].classList.remove("list-group-item-light");
            usernameList[index].classList.add("list-group-item-danger");
            emailList[index].classList.add("list-group-item-danger");
            userRole[index].classList.add("list-group-item-danger");
            userStatus[index].classList.add("list-group-item-danger");
        }
        if(userStatus[index].value == 1){
            usernameList[index].classList.add("list-group-item-light");
            emailList[index].classList.add("list-group-item-light");
            userRole[index].classList.add("list-group-item-light");
            userStatus[index].classList.add("list-group-item-light");
            usernameList[index].classList.remove("list-group-item-danger");
            emailList[index].classList.remove("list-group-item-danger");
            userRole[index].classList.remove("list-group-item-danger");
            userStatus[index].classList.remove("list-group-item-danger");
        }
    }
}