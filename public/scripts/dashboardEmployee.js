//toogle navbar
'use strict';

let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//others
let navbar_highlight = document.getElementById('employee-link').classList.add('active');

let add_btn = document.getElementById('add-employee-btn');
let close_add_section = document.getElementById('close-Em-btn');
let edit_btn = document.getElementById("edit-employee-btn");
let close_edit_section = document.getElementById("close-edit-btn");


add_btn.addEventListener('click', () => {
    let add_section = document.getElementById('add-em');
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', () =>{
    let add_section = document.getElementById("add-em");
    add_section.style.display = "none";
})

edit_btn.addEventListener('click', ()=> {
    let edit_section = document.getElementById("edit-employee");
    edit_section.style.display ='block';
})

close_edit_section.addEventListener('click', () => {
    let edit_section = document.getElementById("edit-employee");
    edit_section.style.display = "none";
})