async function getCategory(){
    var category = document.getElementById("category");
    var information = document.getElementById("information");

    var url = "/shop/item-create/getCategory/".concat(category.value);

    var attributes = await fetch(url, {
        method: "POST"
    }).then(res => res.json());
    
    if(!attributes[0]){
        information.innerHTML = `<textarea class="form-control" name="information" rows="5"></textarea>`;
    }
    else{
        information.innerHTML = `<textarea class="form-control" name="information" rows="5" id="text_tmp"></textarea>`;
        var text_tmp = document.getElementById("text_tmp");
        for(var attribute of attributes){
            text_tmp.innerHTML += attribute.attribute + ": " + attribute.defaultAttribute + "&#13;&#10;";
        }
        text_tmp.removeAttribute("id");
    }
}

async function changeCategory(element){
    var category = document.getElementsByName("categoryChangeId");
    var infoChange = document.getElementsByName("infoChange");

    for(var index in category){
        if(category[index] == element){
            var url = "/shop/item-create/getCategory/".concat(category[index].value);

            var attributes = await fetch(url, {
                method: "POST"
            }).then(res => res.json());
            
            if(!attributes[0]){
                infoChange[index].innerHTML = `<textarea class="form-control" name="information" rows="5"></textarea>`;
            }
            else{
                infoChange[index].innerHTML = `<textarea class="form-control" name="information" rows="5" id="text_tmp"></textarea>`;
                var text_tmp = document.getElementById("text_tmp");
                for(var attribute of attributes){
                    text_tmp.innerHTML += attribute.attribute + ": " + attribute.defaultAttribute + "&#13;&#10;";
                }
                text_tmp.removeAttribute("id");
            }
        }
    }
}