var changeBtn = document.getElementsByName("changeBtn");
var saveBtn = document.getElementsByName("saveBtn");
var deleteBtn = document.getElementsByName("deleteBtn");
var deleteYesBtn = document.getElementsByName("deleteYesBtn");
var cancelBtn = document.getElementsByName("cancelBtn");
var itemId = document.getElementsByName("itemId");
var itemName = document.getElementsByName("itemName");
var information = document.getElementsByName("information");
var price = document.getElementsByName("price");
var priceDiscount = document.getElementsByName("priceDiscount");
var amount = document.getElementsByName("amount");
var image = document.getElementsByName("image");
var categoryId = document.getElementsByName("categoryChangeId");
var oldItemName = document.getElementsByName("oldItemName");
var oldInformation = document.getElementsByName("oldInformation");
var oldPrice = document.getElementsByName("oldPrice");
var oldPriceDiscount = document.getElementsByName("oldPriceDiscount");
var oldAmount = document.getElementsByName("oldAmount");
var oldImage = document.getElementsByName("oldImage");
var imageLabel = document.getElementsByName("imageLabel");
var imageDiv = document.getElementsByName("imageDiv");
var imageUrl = document.getElementsByName("imageUrl");
var oldImageUrl = document.getElementsByName("oldImageUrl");
var oldCategoryId = document.getElementsByName("oldCategoryChangeId");
var itemDetailInfo = document.getElementsByName("itemDetailInfo");
var itemDetailError = document.getElementsByName("itemDetailError");

function change_item_detail(element){
    for(var index in changeBtn){
        if(changeBtn[index] == element){
            changeBtn[index].classList.add("hidden");
            deleteBtn[index].classList.add("hidden");
            saveBtn[index].classList.remove("hidden");
            cancelBtn[index].classList.remove("hidden");
            imageDiv[index].classList.remove("hidden");
            oldItemName[index].classList.add("hidden");
            oldInformation[index].classList.add("hidden");
            oldPrice[index].classList.add("hidden");
            oldPriceDiscount[index].classList.add("hidden");
            oldAmount[index].classList.add("hidden");
            oldImage[index].classList.add("hidden");
            oldCategoryId[index].classList.add("hidden");
            itemName[index].classList.remove("hidden");
            information[index].classList.remove("hidden");
            price[index].classList.remove("hidden");
            priceDiscount[index].classList.remove("hidden");
            amount[index].classList.remove("hidden");
            image[index].classList.remove("hidden");
            categoryId[index].classList.remove("hidden");
            imageLabel[index].innerHTML = "";
        }
    }
}

function cancel_changing(element){
    for(var index in cancelBtn){
        if(cancelBtn[index] == element){
            changeBtn[index].classList.remove("hidden");
            deleteBtn[index].classList.remove("hidden");
            saveBtn[index].classList.add("hidden");
            cancelBtn[index].classList.add("hidden");
            imageDiv[index].classList.add("hidden");
            itemDetailError[index].classList.add("hidden");
            itemDetailInfo[index].classList.add("hidden");
            oldItemName[index].classList.remove("hidden");
            oldInformation[index].classList.remove("hidden");
            oldPrice[index].classList.remove("hidden");
            oldPriceDiscount[index].classList.remove("hidden");
            oldAmount[index].classList.remove("hidden");
            oldImage[index].classList.remove("hidden");
            oldCategoryId[index].classList.remove("hidden");
            itemName[index].classList.add("hidden");
            information[index].classList.add("hidden");
            price[index].classList.add("hidden");
            priceDiscount[index].classList.add("hidden");
            amount[index].classList.add("hidden");
            image[index].classList.add("hidden");
            categoryId[index].classList.add("hidden");
            imageLabel[index].innerHTML = "<b>Hình ảnh sản phẩm</b>";
        }
    }
}

function imgInput(element, event){
    for(var index in imageUrl){
        if(imageUrl[index] == element){
            image[index].src = URL.createObjectURL(event.target.files[0]);
            image[index].onload = function() {
                URL.revokeObjectURL(image.src);
            };
        }
    }
}

async function save_changing(element){
    for(var index in saveBtn){
        if(saveBtn[index] == element){
            var changeItemDetailForm = new FormData();
            changeItemDetailForm.append("itemName", itemName[index].value);
            changeItemDetailForm.append("information", information[index].value);
            changeItemDetailForm.append("price", price[index].value);
            changeItemDetailForm.append("priceDiscount", priceDiscount[index].value);
            changeItemDetailForm.append("amount", amount[index].value);
            changeItemDetailForm.append("image", imageUrl[index].files[0]);
            changeItemDetailForm.append("oldImage", oldImageUrl[index].value);
            changeItemDetailForm.append("categoryId", categoryId[index].value);
            var url = "/shop/items/update/".concat(itemId[index].value);
            var change = await fetch(url, {
                method: "POST",
                body: changeItemDetailForm
            }).then(res => res.json());
            if(change.tokenError){
                itemDetailError[index].innerHTML = `
                    <div class="alert alert-danger alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                        ${change.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
                    </div>`;
                itemDetailInfo[index].innerHTML = "";
                itemDetailInfo[index].classList.remove("show");
                itemDetailError[index].classList.add("show");
            }
            else{
                itemDetailInfo[index].innerHTML = `
                    <div class="alert alert-info alert-information fade show" role="alert" style="position: fixed; width: 600px;">
                        ${change.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" onclick="close_alert()" aria-label="Close" style="float: right; margin-bottom: 0px;"></button>
                    </div>`;
                itemDetailError[index].innerHTML = "";
                itemDetailError[index].classList.remove("show");
                itemDetailInfo[index].classList.add("show");
                setTimeout(function(){
                    window.location.reload();
                }, 1500);
            }
        }
    }
}

async function delete_item(element){
    for(var index in deleteYesBtn){
        if(deleteYesBtn[index] == element){
            var url = "/shop/items/delete/".concat(itemId[index].value);
            await fetch(url, {
                method: "POST"
            });
            window.location.reload();
        }
    }
}

function close_alert(){
    for(var index in itemDetailError){
        itemDetailError[index].classList.remove("show");
        itemDetailInfo[index].classList.remove("show");
    }
}