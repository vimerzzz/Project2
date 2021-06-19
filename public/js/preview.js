var button_follow = document.getElementById("button_follow");
var shopId = document.getElementById("shopId");

async function add_follow(){
    button_follow.setAttribute("onclick", "remove_follow()");
    button_follow.innerHTML = `
        <i class="fas fa-user-check"></i>
        <span>Đang theo dõi</span>`;
    var url = "/user/addFollow/".concat(shopId.value);
    var check = await fetch(url, {
        method: "POST"
    }).then(res => res.json());
    if(check.tokenError){
        location.href = "/login";
    }
}

async function remove_follow(){
    button_follow.setAttribute("onclick", "add_follow()");
    button_follow.innerHTML = `
        <i class="fas fa-user-plus"></i>
        <span>Theo dõi</span>`;
    var url = "/user/removeFollow/".concat(shopId.value);
    var check = await fetch(url, {
        method: "POST"
    }).then(res => res.json());
    if(check.tokenError){
        location.href = "/login";
    }
}