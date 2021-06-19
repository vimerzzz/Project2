function imgInput(event){
    var img = document.getElementById("img");
    var img_div = document.getElementById("img_div");
    img_div.classList.remove("hidden");
    img.src = URL.createObjectURL(event.target.files[0]);
    img.onload = function() {
        URL.revokeObjectURL(img.src);
    };
}