var back_to_top = document.getElementById("back_to_top");
var back_to_top_button = document.getElementById("back_to_top_button");

window.onscroll = function(){
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
        back_to_top.style.display = "block";
    }
    else{
        back_to_top.style.display = "none";
    }
}

function to_top(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}