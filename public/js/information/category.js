var changeBtn = document.getElementsByName("changeBtn");
var deleteBtn = document.getElementsByName("deleteBtn");
var deleteYesBtn = document.getElementsByName("deleteYesBtn");
var saveBtn = document.getElementsByName("saveBtn");
var cancelBtn = document.getElementsByName("cancelBtn");
var categoryId = document.getElementsByName("categoryId");
var newCategoryId = document.getElementsByName("newCategoryId");
var category = document.getElementsByName("category");
var newCategory = document.getElementsByName("newCategory");
var n_categoryDetailError = document.getElementById("n_categoryDetailError");
var n_categoryDetailInfo = document.getElementById("n_categoryDetailInfo");
var categoryDetailError = document.getElementsByName("categoryDetailError");
var categoryDetailInfo = document.getElementsByName("categoryDetailInfo");
var e_mb = document.getElementsByName("e_mb");
var attribute;
var newAttribute;
var defaultAttribute;
var newDefaultAttribute;
var pointer;

function add_attribute_field(){
    var n_mb = document.getElementById("n_mb");
    var fieldLabel = document.getElementById("fieldLabel");
    if(fieldLabel){
        fieldLabel.innerHTML = `
            <label for="inputEmail3" class="col-form-label no-select" style="width: 45%;"><b>Tên thuộc tính</b></label>
            <label for="inputEmail3" class="col-form-label no-select"><b>Thuộc tính mặc định</b></label>`;
        fieldLabel.removeAttribute("id");
    }

    var fieldButton = document.getElementById("div_label2");
    if(fieldButton){
        fieldButton.remove();
    }

    var count = document.getElementsByName("n_attribute").length;
    count++;
    var data = "Thuộc tính #".concat(count.toString());
    var div_label = document.createElement("div");
    var label = document.createElement("label");
    var div_input = document.createElement("div");
    var input = document.createElement("input");
    var input_default = document.createElement("input");
    var b = document.createElement("b");
    var bp = document.createTextNode(data);

    n_mb.appendChild(div_label);
    div_label.setAttribute("name", "div_label");

    var div_label_name = document.getElementsByName("div_label");
    div_label_name[div_label_name.length - 1].appendChild(label);
    label.setAttribute("for", "inputEmail3");
    label.setAttribute("name", "labelB");

    var labelB = document.getElementsByName("labelB");
    labelB[labelB.length - 1].appendChild(b);
    b.setAttribute("name", "bold");

    var bold = document.getElementsByName("bold");
    bold[bold.length - 1].appendChild(bp);

    div_label_name[div_label_name.length - 1].appendChild(div_input);
    div_input.setAttribute("name", "field");

    var field = document.getElementsByName("field");
    field[field.length - 1].appendChild(input);
    field[field.length - 1].appendChild(input_default);
    input.setAttribute("type", "text");
    input.setAttribute("name", "n_attribute");
    input_default.setAttribute("type", "text");
    input_default.setAttribute("name", "n_default_attribute");

    input.style.width = "45%";
    input.style.display = "inline";
    input_default.style.width = "45%";
    input_default.style.display = "inline";

    div_label.classList.add("row");
    div_label.classList.add("mb-3");
    label.classList.add("col-sm-4");
    label.classList.add("col-form-label");
    label.classList.add("no-select");
    div_input.classList.add("col-sm-8");
    input.classList.add("form-control");
    input_default.classList.add("form-control");


    var div_label2 = document.createElement("div");
    var label2 = document.createElement("label");
    var div_button = document.createElement("div");
    var button = document.createElement("button");
    var p = document.createTextNode("Thêm");

    n_mb.appendChild(div_label2);
    div_label2.setAttribute("id", "div_label2");

    var div_label_name2 = document.getElementById("div_label2");
    div_label_name2.appendChild(label2);
    label2.setAttribute("for", "inputEmail3");

    div_label_name2.appendChild(div_button);
    div_button.setAttribute("id", "field2");

    var field2 = document.getElementById("field2");
    field2.appendChild(button);
    button.setAttribute("type", "button");
    button.setAttribute("id", "buttonP");
    button.setAttribute("onclick", "add_attribute_field()");

    var buttonP = document.getElementById("buttonP");
    buttonP.appendChild(p);

    div_label2.classList.add("row");
    div_label2.classList.add("mb-3");
    label2.classList.add("col-sm-4");
    label2.classList.add("col-form-label");
    label2.classList.add("no-select");
    div_button.classList.add("col-sm-8");
    button.classList.add("btn");
    button.classList.add("btn-primary");
}

async function create_category(){
    var n_categoryId = document.getElementById("n_categoryId");
    var n_category = document.getElementById("n_category");
    var n_attribute = document.getElementsByName("n_attribute");
    var n_default_attribute = document.getElementsByName("n_default_attribute");

    var list_attribute = [];
    for(var index in n_attribute){
        if(n_attribute[index].value){
            list_attribute.push({
                attribute: n_attribute[index].value,
                defaultAttribute: n_default_attribute[index].value
            });
        }
    }

    var create = await fetch("/information/category/create", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            categoryId: n_categoryId.value,
            category: n_category.value,
            attribute: list_attribute
        })
    }).then(res => res.json());
    if(create.tokenError){
        n_categoryDetailError.innerHTML = `
            <div class="alert alert-danger alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
                ${create.message}
            </div>`;
        n_categoryDetailInfo.innerHTML = "";
        n_categoryDetailInfo.classList.remove("show");
        n_categoryDetailError.classList.add("show");
    }
    else{
        n_categoryDetailInfo.innerHTML = `
            <div class="alert alert-info alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                ${create.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
            </div>`;
        n_categoryDetailError.innerHTML = "";
        n_categoryDetailInfo.classList.add("show");
        n_categoryDetailError.classList.remove("show");
        setTimeout(function(){
            window.location.reload();
        }, 1500);
    }
}

function change_category_detail(element){
    for(var index in changeBtn){
        if(changeBtn[index] == element){
            pointer = index;
            changeBtn[index].classList.add("hidden");
            deleteBtn[index].classList.add("hidden");
            saveBtn[index].classList.remove("hidden");
            cancelBtn[index].classList.remove("hidden");
            categoryId[index].classList.add("hidden")
            newCategoryId[index].classList.remove("hidden");
            category[index].classList.add("hidden");
            newCategory[index].classList.remove("hidden");
        }
    }
    var count = parseInt(changeBtn[pointer].value);
    var name = "attribute".concat(pointer.toString());
    var newName = "newAttribute".concat(pointer.toString());
    var name_default = "defaultAttribute".concat(pointer.toString());
    var newName_default = "newDefaultAttribute".concat(pointer.toString());
    attribute = document.getElementsByName(name);
    newAttribute = document.getElementsByName(newName);
    defaultAttribute = document.getElementsByName(name_default);
    newDefaultAttribute = document.getElementsByName(newName_default);
    for(var i = 0; i < count; i++){
        attribute[i].style.display = "none";
        newAttribute[i].style.display = "inline";
        defaultAttribute[i].style.display = "none";
        newDefaultAttribute[i].style.display = "inline";
    }
    var name_extra = "extraField".concat(pointer.toString());
    var extraField = document.getElementsByName(name_extra);
    for(var index in extraField){
        extraField[index].classList.remove("hidden");
    }
}

function cancel_changing(element){
    for(var index in cancelBtn){
        if(cancelBtn[index] == element){
            pointer = index;
            changeBtn[index].classList.remove("hidden");
            deleteBtn[index].classList.remove("hidden");
            saveBtn[index].classList.add("hidden");
            cancelBtn[index].classList.add("hidden");
            categoryId[index].classList.remove("hidden")
            newCategoryId[index].classList.add("hidden");
            category[index].classList.remove("hidden");
            newCategory[index].classList.add("hidden");
        }
    }
    var count = parseInt(changeBtn[pointer].value);
    var name = "attribute".concat(pointer.toString());
    var newName = "newAttribute".concat(pointer.toString());
    var name_default = "defaultAttribute".concat(pointer.toString());
    var newName_default = "newDefaultAttribute".concat(pointer.toString());
    attribute = document.getElementsByName(name);
    newAttribute = document.getElementsByName(newName);
    defaultAttribute = document.getElementsByName(name_default);
    newDefaultAttribute = document.getElementsByName(newName_default);
    for(var i = 0; i < count; i++){
        attribute[i].style.display = "inline";
        newAttribute[i].style.display = "none";
        defaultAttribute[i].style.display = "inline";
        newDefaultAttribute[i].style.display = "none";
    }
    var name_extra = "extraField".concat(pointer.toString());
    var extraField = document.getElementsByName(name_extra);
    for(var index in extraField){
        extraField[index].classList.add("hidden");
    }
}

async function save_changing(element){
    var pointer;
    for(var index in saveBtn){
        if(saveBtn[index] == element){
            pointer = index;
        }
    }
    var newName = "newAttribute".concat(pointer.toString());
    var newName_default = "newDefaultAttribute".concat(pointer.toString());
    newAttribute = document.getElementsByName(newName);
    newDefaultAttribute = document.getElementsByName(newName_default);

    var list_attribute = [];
    for(var index in newAttribute){
        if(newAttribute[index].value){
            list_attribute.push({
                newAttribute: newAttribute[index].value,
                newDefaultAttribute: newDefaultAttribute[index].value
            });
        }
    }

    var url = "/information/category/update/".concat(categoryId[pointer].value);
    var save = await fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            newCategoryId: newCategoryId[pointer].value,
            newCategory: newCategory[pointer].value,
            newAttribute: list_attribute
        })
    }).then(res => res.json());
    if(save.tokenError){
        categoryDetailError[pointer].innerHTML = `
            <div class="alert alert-danger alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                ${save.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
            </div>`;
        categoryDetailInfo[pointer].innerHTML = "";
        categoryDetailInfo[pointer].classList.remove("show");
        categoryDetailError[pointer].classList.add("show");
    }
    else{
        categoryDetailInfo[pointer].innerHTML = `
            <div class="alert alert-info alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                ${save.message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
            </div>`;
        categoryDetailError[pointer].innerHTML = "";
        categoryDetailInfo[pointer].classList.add("show");
        categoryDetailError[pointer].classList.remove("show");
        setTimeout(function(){
            window.location.reload();
        }, 1500);
    }
}

async function delete_category(element){
    for(var index in deleteYesBtn){
        if(deleteYesBtn[index] == element){
            var url = "/information/category/delete/".concat(categoryId[index].value);
            await fetch(url, {
                method: "POST"
            });
            window.location.reload();
        }
    }
}

function close_alert(){
    n_categoryDetailError.classList.remove("show");
    n_categoryDetailInfo.classList.remove("show");
    for(var index in categoryDetailError){
        categoryDetailError[index].classList.remove("show");
        categoryDetailInfo[index].classList.remove("show");
    }
}

function add_extra_field(){
    var name = "newAttribute".concat(pointer.toString());
    attribute = document.getElementsByName(name);
    var name_extra = "extraField".concat(pointer.toString());
    var extraField = document.getElementsByName(name_extra);
    extraField[extraField.length - 1].innerHTML = `
        <label for="inputEmail3" class="col-sm-4 col-form-label no-select"><b>Thuộc tính #${attribute.length + 1}</b></label>
        <div class="col-sm-8">
            <input type="text" class="form-control" name="newAttribute${pointer}" style="width: 45%; display: inline;">
            <input type="text" class="form-control" name="newDefaultAttribute${pointer}" style="width: 45%; display: inline;">
        </div>`;

    var div_label = document.createElement("div");
    var label = document.createElement("label");
    var b = document.createElement("b");
    var extraData = document.createTextNode("Thêm thuộc tính");
    var div_button = document.createElement("div");
    var button = document.createElement("button");
    var p = document.createTextNode("Thêm");

    e_mb[pointer].appendChild(div_label);
    div_label.setAttribute("name", name_extra);

    extraField = document.getElementsByName(name_extra);
    extraField[extraField.length - 1].appendChild(label);
    label.setAttribute("for", "inputEmail3");
    label.setAttribute("name", "extraLabel".concat(pointer.toString()));

    var extraLabel = document.getElementsByName("extraLabel".concat(pointer.toString()));
    extraLabel[extraLabel.length - 1].appendChild(b);
    b.setAttribute("name", "extraBold".concat(pointer.toString()));

    var extraBold = document.getElementsByName("extraBold".concat(pointer.toString()));
    extraBold[extraBold.length - 1].appendChild(extraData);

    extraField[extraField.length - 1].appendChild(div_button);
    div_button.setAttribute("name", "extraDivButton".concat(pointer.toString()));

    var extraDivButton = document.getElementsByName("extraDivButton".concat(pointer.toString()));
    extraDivButton[extraDivButton.length - 1].appendChild(button);
    button.setAttribute("type", "button");
    button.setAttribute("onclick", "add_extra_field()");
    button.setAttribute("name", "extraButton".concat(pointer.toString()));

    var extraButton = document.getElementsByName("extraButton".concat(pointer.toString()));
    extraButton[extraButton.length - 1].appendChild(p);

    div_label.classList.add("row");
    div_label.classList.add("mb-3");
    label.classList.add("col-sm-4");
    label.classList.add("col-form-label");
    label.classList.add("no-select");
    div_button.classList.add("col-sm-8");
    button.classList.add("btn");
    button.classList.add("btn-primary");
}

function getPointer(element){
    var tmp = document.getElementsByClassName("item-detail");
    for(var index in tmp){
        if(tmp[index] == element){
            pointer = index;
        }
    }
}