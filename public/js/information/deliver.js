var acceptCell = document.getElementsByName("acceptCell");
var refuseCell = document.getElementsByName("refuseCell");
var orderRow = document.getElementsByName("orderRow");
var orderId = document.getElementsByName("orderId");
var reason = document.getElementsByName("reason");
var refuseBtn = document.getElementsByName("refuseBtn");

function check_limit(){
    var freePrice = document.getElementById("freePrice");
    var freePriceInput = document.getElementById("freePriceInput");

    if(parseInt(freePrice.value) > 300000){
        freePriceInput.innerHTML = `<input type="text" class="form-control" name="freePrice" id="freePrice" value="300000" onkeypress="return (event.charCode >= 48) && (event.charCode <= 57);" oninput="check_limit()">`;
    }
}

async function accept(element){
    for(var index in acceptCell){
        if(acceptCell[index] == element){
            acceptCell[index].innerHTML = "Đã giao";
            acceptCell[index].setAttribute("onclick", "complete(this)");
            refuseCell[index].innerHTML = "Hủy tiếp nhận";
            var url = "/information/deliver/accept/".concat(orderId[index].innerHTML);
            await fetch(url, {
                method: "POST"
            });
        }
    }
}

async function complete(element){
    for(var index in acceptCell){
        if(acceptCell[index] == element){
            orderRow[index].classList.add("hidden");
            var url = "/information/deliver/complete/".concat(orderId[index].innerHTML);
            await fetch(url, {
                method: "POST"
            });
        }
    }
}

async function refuse(element){
    for(var index in refuseBtn){
        if(refuseBtn[index] == element){
            orderRow[index].classList.add("hidden");
            var url = "/information/deliver/refuse/".concat(orderId[index].innerHTML);
            await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    reason: reason[index].value
                })
            });
        }
    }
}