var numberInput = document.getElementsByName("numberInput");
var amount = document.getElementsByName("amount");
var be_b = document.getElementsByName("be_b");
var af_b = document.getElementsByName("af_b");
var tmp = 0;
var timeout = 0;

function get_before_number(element){
    number = document.getElementsByName("number");
    for(var index in be_b){
        if(be_b[index] == element){
            if(number[index].value > 1){
                tmp = parseInt(number[index].value) - 1;
                numberInput[index].innerHTML = `<input type="text" value="${tmp}" name="number" id="number" onkeypress="return (event.charCode >= 48) && (event.charCode <= 57);" oninput="check_limit(this)">`;
            }
        }
    }
}

function get_after_number(element){
    number = document.getElementsByName("number");
    for(var index in af_b){
        if(af_b[index] == element){
            if(number[index].value < parseInt(amount[index].innerHTML)){
                tmp = parseInt(number[index].value) + 1;
                numberInput[index].innerHTML = `<input type="text" value="${tmp}" name="number" id="number" onkeypress="return (event.charCode >= 48) && (event.charCode <= 57);" oninput="check_limit(this)">`;
            }
        }
    }
}

function check_limit(element){
    number = document.getElementsByName("number");
    for(var index in number){
        if(number[index] == element){
            if(!number[index].value){
                numberInput[index].innerHTML = `<input type="text" value="1" name="number" id="number" onkeypress="return (event.charCode >= 48) && (event.charCode <= 57);" oninput="check_limit(this)">`;
            }
            if(number[index].value > parseInt(amount[index].innerHTML)){
                numberInput[index].innerHTML = `<input type="text" value="${amount[index].innerHTML}" name="number" id="number" onkeypress="return (event.charCode >= 48) && (event.charCode <= 57);" oninput="check_limit(this)">`;
            }
        }
    }
}