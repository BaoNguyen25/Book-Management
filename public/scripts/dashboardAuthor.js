//toggle navbar
let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};
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
  

//others
let add_btn = document.getElementById("add-btn");
let close_add_section = document.getElementById("close-add-btn");
let edit_btn = document.querySelectorAll('[id^="edit-btn-"]');
let delete_btn = document.querySelectorAll('[id^="delete-btn-"]');
let close_edit_section = document.getElementById("close-edit-btn");
let submit_add_btn = document.getElementById("submit-add-btn");
let submit_edit_btn = document.getElementById("submit-edit-btn");
let search_btn = document.getElementById("search-btn");

let navbar_highlight = document.getElementById("author-link").classList.add("active");

add_btn.addEventListener('click', () => {
    let add_section = document.getElementById("add-author");
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', (event) =>{
    event.preventDefault();
    let add_section = document.getElementById("add-author");
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
    let edit_section = document.getElementById("edit-author");
    edit_section.style.display = "none";
})

search_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    let content = document.getElementById("search-content").value;
    let data = await fetch('/author/search', {
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
                if (data.message == 'Search author successfully') {
                    let authorList = data.metadata;
                    
                    await clearTableBody();

                    for (let i = 0; i < authorList.length; i++) {
                        await addAuthorToTable(authorList[i].name, authorList[i].products);
                    }   
                } else {
                    alert('Search author failed');
                }
            }
        );
});

submit_add_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let name = document.getElementById("add-name").value;

    try {
        let data = await fetch('/author/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    })
                })
                .then(response => response.json())
                .then(async data => {
                    if (data.message == 'Add author successfully') {
                        let add_section = document.getElementById("add-author");
                        add_section.style.display = "none";
                        notification("success", "thành công");
                        await addAuthorToTable(name);

                        document.getElementById("add-name").value = '';
                    } else {
                        notification("error", "thất bại");
                    }
                }
            );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại");
    }
});

submit_edit_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let edit_name = document.getElementById("edit-name");
    let name = edit_name.value;
    let oldName = edit_name.getAttribute("old-name");4

    try {
        let data = await fetch('/author/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldName: oldName,
                    name: name,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Edit author successfully') {
                    let edit_section = document.getElementById("edit-author");
                    edit_section.style.display = "none";
                    notification("success", "thành công");
                    await editAuthorInTable(oldName, name);
                } else {
                    notification("error", "thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại");
    }
});

const clearTableBody = async () => {
    let table = document.getElementById("author-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    
    while (table_body.firstChild) {
        table_body.removeChild(table_body.firstChild);
    }
}

const addAuthorToTable = async (name, products) => {
    let table = document.getElementById("author-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let size = table.rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1}`;

    cell2.innerHTML = products ?? 0;
    cell2.id = `category-${size - 1}`;

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

    cell3.appendChild(btn_column);
}

const editAuthorInTable = async (oldName, name) => {
    let table = document.getElementById("author-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == oldName) {
            table_body.rows[i].cells[0].innerHTML = name;
            return
        }
    }
}

const deleteAuthorInTable = async (name) => {
    let table = document.getElementById("author-table");
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
    let author_id = btn.id.split('-')[2];

    try {
        let author_name = document.getElementById(`name-${author_id}`).innerHTML;

        let edit_name = document.getElementById("edit-name");
        edit_name.value = author_name;
        edit_name.setAttribute("old-name", author_name);

        let edit_section = document.getElementById("edit-author");
        edit_section.style.display ='block';
    } catch (e) {
        console.log(e);
        alert(e);
    }
}

async function handleDeleteButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let author_id = btn.id.split('-')[2];

    let author_name = document.getElementById(`name-${author_id}`).innerHTML;

    try {
        const data = await fetch('/author/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: author_name,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Delete author successfully') {
                    notification("success", "thành công");
                    await deleteAuthorInTable(author_name);
                } else {
                    notification("error", "thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "thất bại");
    }
}
