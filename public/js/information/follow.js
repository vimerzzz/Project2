var onFollow = document.getElementsByName("onFollow");
var shopId = document.getElementsByName("shopId");

async function remove_follow(element){
    for(var index in onFollow){
        if(onFollow[index] == element){
            onFollow[index].innerHTML = "Theo dõi";
            var url = "/information/follower/removeFollow/".concat(shopId[index].innerHTML);
            await fetch(url, {
                method: "POST"
            });
            onFollow[index].setAttribute("onclick", "add_follow(this)");
        }
    }
}

async function add_follow(element){
    for(var index in onFollow){
        if(onFollow[index] == element){
            onFollow[index].innerHTML = "Bỏ theo dõi";
            var url = "/information/follower/addFollow/".concat(shopId[index].innerHTML);
            await fetch(url, {
                method: "POST"
            });
            onFollow[index].setAttribute("onclick", "remove_follow(this)");
        }
    }
}