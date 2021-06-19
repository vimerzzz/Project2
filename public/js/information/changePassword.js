function changePassword(){
    var btn = document.getElementById("changePasswordBtn");
    var content = document.getElementById("changePassword");
    if(btn.checked){
        content.style.display = "block";
        var pass1 = document.createElement("input");
        var pass2 = document.createElement("input");
        var pass3 = document.createElement("input");
        document.getElementById("i1").appendChild(pass1);
        document.getElementById("i2").appendChild(pass2);
        document.getElementById("i3").appendChild(pass3);
        pass1.setAttribute("type", "password");
        pass2.setAttribute("type", "password");
        pass3.setAttribute("type", "password");
        pass1.setAttribute("name", "oldPassword");
        pass2.setAttribute("name", "newPassword");
        pass3.setAttribute("name", "reNewPassword");
        pass1.setAttribute("id", "pass1");
        pass2.setAttribute("id", "pass2");
        pass3.setAttribute("id", "pass3");
        pass1.classList.add("form-control");
        pass2.classList.add("form-control");
        pass3.classList.add("form-control");
    }
    else{
        content.style.display = "none";
        var p1 = document.getElementById("pass1");
        var p2 = document.getElementById("pass2");
        var p3 = document.getElementById("pass3");
        p1.remove();
        p2.remove();
        p3.remove();
    }
}

window.onload = changePassword();