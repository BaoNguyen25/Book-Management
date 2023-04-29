//toogle navbar
'use strict';

let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//others
let navbar_highlight = document.getElementById('author-link').classList.add('active');

let add_btn = document.getElementById('add-author-btn');
let close_add_section = document.getElementById('close-Au-btn');
let edit_btn = document.getElementById("edit-author-btn");
let close_edit_section = document.getElementById("close-edit-btn");


add_btn.addEventListener('click', () => {
    let add_section = document.getElementById('add-au');
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', () =>{
    let add_section = document.getElementById("add-au");
    add_section.style.display = "none";
})

edit_btn.addEventListener('click', ()=> {
    let edit_section = document.getElementById("edit-author");
    edit_section.style.display ='block';
})

close_edit_section.addEventListener('click', () => {
    let edit_section = document.getElementById("edit-author");
    edit_section.style.display = "none";
})