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

let navbar_highlight = document.getElementById("employee-link").classList.add("active");

add_btn.addEventListener('click', () => {
    let add_section = document.getElementById("add-employee");
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', (event) =>{
    event.preventDefault();
    let add_section = document.getElementById("add-employee");
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
    let edit_section = document.getElementById("edit-employee");
    edit_section.style.display = "none";
})

search_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    let content = document.getElementById("search-content").value;
    let data = await fetch('/employee/search', {
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
                if (data.message == 'Search employee successfully') {
                    let employeeList = data.metadata;
                    notification("success", "Thành công");
                    await clearTableBody();

                    for (let i = 0; i < employeeList.length; i++) {
                        await addEmployeeToTable(employeeList[i].name, employeeList[i].products, employeeList[i].description);
                    }   
                } else {
                    notification("error", "Thất bại");
                }
            }
        );
});

submit_add_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let id = document.getElementById("add-id").value;
    let name = document.getElementById("add-name").value;
    let gender = document.getElementById("add-gender").value;
    let position = document.getElementById("add-position").value;
    let phone = document.getElementById("add-phone").value;
    let address = document.getElementById("add-address").value;
    let cardid = document.getElementById("add-cardid").value;
    let email = document.getElementById("add-email").value;

    try {
        let data = await fetch('/employee/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    email: email,
                    gender: gender,
                    role: position,
                    phone: phone,
                    address: address,
                    identity: cardid
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Add employee successfully') {
                    let add_section = document.getElementById("add-employee");
                    add_section.style.display = "none";
                    notification("success", "Thành công");;
                    let fetched = data.metadata
                    await addEmployeeToTable(fetched.id, fetched.name, fetched.gender, fetched.role, fetched.phone, fetched.address, fetched.identity, fetched.email);

                    document.getElementById("add-id").value = '';
                    document.getElementById("add-name").value = '';
                    document.getElementById("add-gender").value = '';
                    document.getElementById("add-position").value = '';
                    document.getElementById("add-phone").value = '';
                    document.getElementById("add-address").value = '';
                    document.getElementById("add-cardid").value = '';
                    document.getElementById("add-email").value = '';          
                } else {
                    notification("error", "Thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "Thất bại")
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
        let data = await fetch('/employee/edit', {
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
                if (data.message == 'Edit employee successfully') {
                    let edit_section = document.getElementById("edit-employee");
                    edit_section.style.display = "none";
                    notification("success", "Thành công");;
                    await editEmployeeInTable(oldName, name);
                } else {
                    notification("error", "Thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "Thất bại")
    }
});

const clearTableBody = async () => {
    let table = document.getElementById("employee-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    
    while (table_body.firstChild) {
        table_body.removeChild(table_body.firstChild);
    }
}

const addEmployeeToTable = async (id, name, gender, position, phone, address, cardid, email) => {
    let table = document.getElementById("employee-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let size = table.rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);
    let cell8 = row.insertCell(7);
    let cell9 = row.insertCell(8);

    cell1.innerHTML = id ?? "";
    cell1.id = `id-${size - 1}`;

    cell2.innerHTML = name ?? "";
    cell2.id = `name-${size - 1}`;

    cell3.innerHTML = gender ?? "";
    cell3.id = `gender-${size - 1}`;

    cell4.innerHTML = position ?? "";
    cell4.id = `position-${size - 1}`;
    
    cell5.innerHTML = phone ?? "";
    cell5.id = `phone-${size - 1}`;

    cell6.innerHTML = address ?? "";
    cell6.id = `address-${size - 1}`;

    cell7.innerHTML = cardid ?? "";
    cell7.id = `cardid-${size - 1}`;

    cell8.innerHTML = email ?? "";
    cell8.id = `email-${size - 1}`;

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

    cell9.appendChild(btn_column);
}

const editEmployeeInTable = async (oldName, name) => {
    let table = document.getElementById("employee-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == oldName) {
            table_body.rows[i].cells[0].innerHTML = name;
            return
        }
    }
}

const deleteEmployeeInTable = async (email) => {
    let table = document.getElementById("employee-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[7].innerHTML == email) {
            table_body.deleteRow(i);
            return;
        }
    }
}

async function handleEditButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let employee_id = btn.id.split('-')[2];

    try {
        let employee_name = document.getElementById(`name-${employee_id}`).innerHTML;
        let employee_description = document.getElementById(`description-${employee_id}`).innerHTML;

        let edit_name = document.getElementById("edit-name");
        edit_name.value = employee_name;    
        edit_name.setAttribute("old-name", employee_name);
        let edit_description = document.getElementById("edit-description");
        edit_description.value = employee_description;

        let edit_section = document.getElementById("edit-employee");
        edit_section.style.display ='block';
    } catch (e) {
        console.log(e);
        alert(e);
    }
}

async function handleDeleteButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let employee_id = btn.id.split('-')[2];

    let employee_email = document.getElementById(`email-${employee_id}`).innerHTML;
    console.log(employee_email);
    try {
        const data = await fetch('/employee/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: employee_email,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Delete employee successfully') {
                    alert('Delete employee successfully');
                    await deleteEmployeeInTable(employee_email);
                } else {
                    alert('Delete employee failed');
                }
            }
        );
    } catch (e) {
        console.log(e);
        alert('Delete employee failed')
    }
}
