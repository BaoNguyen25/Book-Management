//toggle navbar
let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//others
let add_btn = document.getElementById("add-btn");
let close_add_section = document.getElementById("close-add-btn");
let edit_btn = document.querySelectorAll('[id^="edit-btn-"]');
let delete_btn = document.querySelectorAll('[id^="delete-btn-"]');
let close_edit_section = document.getElementById("close-edit-btn");
let submit_add_btn = document.getElementById("submit-add-btn");
let submit_edit_btn = document.getElementById("submit-edit-btn");
let search_btn = document.getElementById("search-btn");

let navbar_highlight = document.getElementById("category-link").classList.add("active");

add_btn.addEventListener('click', () => {
    let add_section = document.getElementById("add-category");
    add_section.style.display = 'block';
})

//function
function notification(status, msg) {
    let alert = document.getElementById("Alert");
    alert.innerHTML = msg;
  
    if (status === "success") {
        alert.style.backgroundColor = "green";
    } else if (status === "error") {
        alert.style.backgroundColor = "red";
    }
  
    alert.classList.add("showAlert");
  
    setTimeout(() => {
      alert.classList.remove("showAlert");
    }, 1000);
  }

close_add_section.addEventListener('click', (event) =>{
    event.preventDefault();
    let add_section = document.getElementById("add-category");
    add_section.style.display = "none";
})

edit_btn.forEach((btn) => {
    btn.addEventListener('click', handleEditButtonEvent);
})

delete_btn.forEach((btn) => {
    btn.addEventListener('click', handleDeleteButtonEvent);
})

close_edit_section.addEventListener('click', (event) => {
    event.preventDefault();
    let edit_section = document.getElementById("edit-category");
    edit_section.style.display = "none";
})

search_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    let content = document.getElementById("search-content").value;
    let data = await fetch('/category/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Search category successfully') {
                    let categoryList = data.metadata;
                    
                    await clearTableBody();

                    for (let i = 0; i < categoryList.length; i++) {
                        await addCategoryToTable(categoryList[i].name, categoryList[i].products, categoryList[i].description);
                    }   
                } else {
                    alert('Search category failed');
                }
            }
        );
});

submit_add_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let name = document.getElementById("add-name").value;
    let description = document.getElementById("add-description").value;

    try {
        let data = await fetch('/category/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Add category successfully') {
                    let add_section = document.getElementById("add-category");
                    add_section.style.display = "none";
                    notification("success", "thành công");
                    let fetched = data.metadata
                    await addCategoryToTable(fetched.name, fetched.products, fetched.description);

                    document.getElementById("add-name").value = '';
                } else {
                    notification("error", "thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại")
    }
});

submit_edit_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let edit_name = document.getElementById("edit-name");
    let name = edit_name.value;
    let oldName = edit_name.getAttribute("old-name");
    let edit_description = document.getElementById("edit-description");
    let description = edit_description.value;

    try {
        let data = await fetch('/category/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldName: oldName,
                    name: name,
                    description: description
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Edit category successfully') {
                    let edit_section = document.getElementById("edit-category");
                    edit_section.style.display = "none";
                    notification("success", "thành công");
                    await editCategoryInTable(oldName, name);
                } else {
                    notification("error", "thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại")
    }
});

const clearTableBody = async () => {
    let table = document.getElementById("category-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    
    while (table_body.firstChild) {
        table_body.removeChild(table_body.firstChild);
    }
}

const addCategoryToTable = async (name, products=0, description="") => {
    let table = document.getElementById("category-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let size = table.rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1}`;

    cell2.innerHTML = products ?? 0;
    cell2.id = `description-${size - 1}`;

    cell3.innerHTML = description ?? "";
    cell3.id = `most-sold-${size - 1}`;

    let edit_btn = document.createElement("button");
    edit_btn.setAttribute("class", "edit-button");
    edit_btn.setAttribute("id", `edit-btn-${size - 1}`);
    edit_btn.innerHTML = "Chỉnh sửa";
    edit_btn.addEventListener('click', handleEditButtonEvent);

    let delete_btn = document.createElement("button");
    delete_btn.setAttribute("class", "delete-button");
    delete_btn.setAttribute("id", `delete-btn-${size - 1}`);
    delete_btn.innerHTML = "Xóa";
    delete_btn.addEventListener('click', handleDeleteButtonEvent);

    let btn_column = document.createElement("div");
    btn_column.setAttribute("class", "button-column");
    btn_column.setAttribute("colspan", "2")
    btn_column.appendChild(edit_btn);
    btn_column.appendChild(delete_btn);

    cell4.appendChild(btn_column);
}

const editCategoryInTable = async (oldName, name) => {
    let table = document.getElementById("category-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == oldName) {
            table_body.rows[i].cells[0].innerHTML = name;
            return
        }
    }
}

const deletecategoryInTable = async (name) => {
    let table = document.getElementById("category-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == name) {
            table_body.deleteRow(i);
            return;
        }
    }
}

async function handleEditButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let category_id = btn.id.split('-')[2];

    try {
        let category_name = document.getElementById(`name-${category_id}`).innerHTML;
        let category_description = document.getElementById(`description-${category_id}`).innerHTML;

        let edit_name = document.getElementById("edit-name");
        edit_name.value = category_name;    
        edit_name.setAttribute("old-name", category_name);
        let edit_description = document.getElementById("edit-description");
        edit_description.value = category_description;

        let edit_section = document.getElementById("edit-category");
        edit_section.style.display ='block';
    } catch (e) {
        console.log(e);
        alert(e);
    }
}

async function handleDeleteButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let category_id = btn.id.split('-')[2];

    let category_name = document.getElementById(`name-${category_id}`).innerHTML;

    try {
        const data = await fetch('/category/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: category_name,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Delete category successfully') {
                    notification("success", "thành công");
                    await deletecategoryInTable(category_name);
                } else {
                    notification("error", "thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại")
    }
}
