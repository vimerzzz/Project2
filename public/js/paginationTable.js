var categoryTable = document.getElementById("categoryPaginationTable");
var itemTable = document.getElementById("itemPaginationTable");
var shopTable = document.getElementById("shopPaginationTable");
var userTable = document.getElementById("userPaginationTable");
var followTable = document.getElementById("followPaginationTable");
var all_orderTable = document.getElementById("all_orderPaginationTable");
var canceled_orderTable = document.getElementById("canceled_orderPaginationTable");
var confirming_orderTable = document.getElementById("confirming_orderPaginationTable");
var processing_orderTable = document.getElementById("processing_orderPaginationTable");
var completed_orderTable = document.getElementById("completed_orderPaginationTable");
var orderManagementTable = document.getElementById("orderManagementPaginationTable");

var categoryOptions = {
    valueNames: ["pa_count", "pa_categoryId", "pa_category"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var itemOptions = {
    valueNames: ["pa_count", "pa_item", "pa_category"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var userOptions = {
    valueNames: ["pa_username", "pa_email", "pa_role", "pa_status"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var shopOptions = {
    valueNames: ["pa_count", "pa_shop", "pa_username", "pa_totalItem"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var followOptions = {
    valueNames: ["pa_count", "pa_shop", "pa_date", "pa_date_2"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var all_orderOptions = {
    valueNames: ["pa_number", "pa_user", "pa_date", "pa_date_2", "pa_status", "pa_price"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var canceled_orderOptions = {
    valueNames: ["pa_number", "pa_user", "pa_date", "pa_date_2", "pa_price"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var completed_orderOptions = {
    valueNames: ["pa_number", "pa_user", "pa_date", "pa_date_2", "pa_price"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var confirming_orderOptions = {
    valueNames: ["pa_number", "pa_user", "pa_date", "pa_date_2", "pa_price"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var processing_orderOptions = {
    valueNames: ["pa_number", "pa_user", "pa_date", "pa_date_2", "pa_price"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var orderManagementOptions = {
    valueNames: ["pa_number", "pa_date", "pa_date_2", "pa_status_1", "pa_status_2"],
    searchClass: "pa_search",
    listClass: "pa_list",
    sortClass: "pa_sort",
    page: 10,
    pagination:{
        outerWindow: 1,
        innerWindow: 2,
        left: 2
    }
};

var categoryList = new List(categoryTable, categoryOptions);
var itemList = new List(itemTable, itemOptions);
var shopList = new List(shopTable, shopOptions);
var userList = new List(userTable, userOptions);
var followList = new List(followTable, followOptions);
var all_orderList = new List(all_orderTable, all_orderOptions);
var canceled_orderList = new List(canceled_orderTable, canceled_orderOptions);
var completed_orderList = new List(completed_orderTable, completed_orderOptions);
var confirming_orderList = new List(confirming_orderTable, confirming_orderOptions);
var processing_orderList = new List(processing_orderTable, processing_orderOptions);
var orderManagementList = new List(orderManagementTable, orderManagementOptions);