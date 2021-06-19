var date = document.getElementById("birthday");
var now = new Date();
var dd = now.getDate();
var mm = now.getMonth() + 1;
var yyyy = now.getFullYear();

if(dd < 10){
    dd = "0" + dd;
}

if(mm < 10){
    mm = "0" + mm;
}

date.max = yyyy + "-" + mm + "-" + dd;