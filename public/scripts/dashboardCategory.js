//toogle navbar
'use strict';

let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");
let edit_btn = document.getElementById("edit-cate-btn");
let add_btn = document.getElementById("add-category-button");
let cancle_add_btn = document.getElementById("cancel-add-category-btn");
let cancle_edit_btn = document.getElementById("cancel-edit-category-btn");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//others
let navbar_highlight = document.getElementById("category-link").classList.add("active");


add_btn.addEventListener("click", () => {
    let edit_section = document.getElementById("category-form");
    edit_section.style.display = "block";
});
cancle_add_btn.addEventListener("click",() =>{
    let edit_section = document.getElementById("category-form");
    edit_section.style.display = "none";
})

edit_btn.addEventListener("click", () => {
    let edit_section = document.getElementById("category-edit-form");
    edit_section.style.display = "block";
});
cancle_edit_btn.addEventListener("click",() =>{
    let edit_section = document.getElementById("category-edit-form");
    edit_section.style.display = "none";
})