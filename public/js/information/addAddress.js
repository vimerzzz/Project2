function addAddress(){
    var count = document.getElementsByName("address").length;
    var data = "Địa chỉ #".concat(count.toString());
    var addressRow = document.getElementsByName("addressRow");

    var div_label = document.createElement("div");
    var label = document.createElement("label");
    var p = document.createTextNode(data);
    var div_ul = document.createElement("div");
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    var input = document.createElement("input");

    addressRow[0].appendChild(div_label);
    div_label.setAttribute("name", "div_label");

    var div_label_name = document.getElementsByName("div_label");
    div_label_name[div_label_name.length - 1].appendChild(label);
    label.setAttribute("for", "address");
    label.setAttribute("name", "labelP");

    var label_name = document.getElementsByName("labelP");
    label_name[label_name.length - 1].appendChild(p);
    div_label_name[div_label_name.length - 1].appendChild(div_ul);
    div_ul.setAttribute("name", "div_ul");

    var div_ul_name = document.getElementsByName("div_ul");
    div_ul_name[div_ul_name.length - 1].appendChild(ul);
    ul.setAttribute("name", "ulElement");

    var ul_name = document.getElementsByName("ulElement");
    ul_name[ul_name.length - 1].appendChild(li);
    li.setAttribute("name", "liElement");

    var li_1 = document.getElementsByName("liElement");
    li_1[li_1.length - 1].appendChild(input);
    input.setAttribute("type", "text");
    input.setAttribute("name", "address");

    div_label.classList.add("row");
    div_label.classList.add("mb-3");
    label.classList.add("col-sm-2");
    label.classList.add("col-form-label");
    label.classList.add("no-select");
    div_ul.classList.add("col-sm-9");
    ul.classList.add("list-group");
    ul.classList.add("list-group-horizontal");
    li.classList.add("list-group-item");
    li.classList.add("address-row");
    li.classList.add("w-100");
    input.classList.add("form-control");
    input.classList.add("w-100");
}