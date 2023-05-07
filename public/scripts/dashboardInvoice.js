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
    }, 3000);
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
let detail_add_btn = document.getElementById("detail-add-btn");
let detail_edit_btn = document.getElementById("detail-edit-btn");

let navbar_highlight = document.getElementById("receipt-link").classList.add("active");

add_btn.addEventListener('click', () => {
    let add_section = document.getElementById("add-invoice");
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', (event) =>{
    event.preventDefault();
    let add_section = document.getElementById("add-invoice");
    add_section.style.display = "none";
})

detail_add_btn.addEventListener('click', (event) => {
    event.preventDefault();
    try {
        let bookName = document.getElementById("add-book-detail").value;
        let bookQuantity = document.getElementById("add-book-quantity").value;

        if (bookQuantity == '' || bookName == '') {
            throw new Error('Please fill in all the fields');
        }

        addDetailToTable(bookName, bookQuantity);
    } catch (err) {
        console.log(err);
        alert('Please fill in all the fields');
    }
});

detail_edit_btn.addEventListener('click', (event) => {
    event.preventDefault();
    try {
        let bookName = document.getElementById("edit-book-detail").value;
        let bookQuantity = document.getElementById("edit-book-quantity").value;

        if (bookQuantity == '' || bookName == '') {
            throw new Error('Please fill in all the fields');
        }

        editDetailToTable(bookName, bookQuantity);
    } catch (err) {
        console.log(err);
        alert('Please fill in all the fields');
    }
});

edit_btn.forEach((btn) => {
    btn.addEventListener('click', handleEditButtonEvent);
})

delete_btn.forEach((btn) => {
    btn.addEventListener('click', handleDeleteButtonEvent);
})

close_edit_section.addEventListener('click', (event) => {
    event.preventDefault();
    clearTableBody("edit-table");
    let edit_section = document.getElementById("edit-invoice");
    edit_section.style.display = "none";
})

search_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    let content = document.getElementById("search-content").value;
    let data = await fetch('/invoice/search', {
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
                if (data.message == 'Search invoice successfully') {
                    let invoiceList = data.metadata;
                    
                    await clearTableBody("invoice-table");

                    for (let i = 0; i < invoiceList.length; i++) {
                        await addInvoiceToTable(invoiceList[i]);
                    }   

                    notification("success", "thành công");
                } else {
                    notification("success", "thất bại");
                }
            }
        );
});

submit_add_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let invoiceName  = document.getElementById("add-invoice-name").value;
    let table = document.getElementById("add-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let rows = table_body.getElementsByTagName("tr");
    let bookDetail = [];
    let invoiceDate = document.getElementById("add-invoice-date").value;

    for (let i = 0; i < rows.length; i++) {
        let data = {};
        let cells = rows[i].getElementsByTagName("td");
        data.name = cells[0].innerHTML;
        data.quantity = cells[1].innerHTML;
        bookDetail.push(data);
    }

    try {
        let data = await fetch('/invoice/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookDetail: bookDetail,
                    name: invoiceName,
                    date: invoiceDate
                    })
                })
                .then(response => response.json())
                .then(async data => {
                    if (data.message == 'Add invoice successfully') {
                        let add_section = document.getElementById("add-invoice");
                        add_section.style.display = "none";
                        notification("success", "thành công");
                        let fetched = data.metadata;
                        await addInvoiceToTable(fetched);

                        document.getElementById("add-book-quantity").value = '';
                        document.getElementById("add-invoice-date").value = '';
                        document.getElementById("add-invoice-name").value = '';
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
    let invoiceName  = document.getElementById("edit-invoice-name").value;
    let oldName = document.getElementById("edit-invoice-name").getAttribute("old-name");
    let table = document.getElementById("edit-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let rows = table_body.getElementsByTagName("tr");
    let bookDetail = [];
    let invoiceDate = document.getElementById("edit-invoice-date").value;

    for (let i = 0; i < rows.length; i++) {
        let data = {};
        let cells = rows[i].getElementsByTagName("td");
        data.bookName = cells[0].innerHTML;
        data.quantity = cells[1].innerHTML;
        bookDetail.push(data);
    }

    if (invoiceName == '' || invoiceDate == '' || bookDetail.length == 0) {
        throw new Error('Please fill in all the fields');
    }

    try {
        let data = await fetch('/invoice/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldName: oldName,
                    name: invoiceName,
                    bookDetail: bookDetail,
                    date: invoiceDate    
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Edit invoice successfully') {
                    let edit_section = document.getElementById("edit-invoice");
                    edit_section.style.display = "none";
                    notification("success", "thành công");
                    let edited = data.metadata;
                    await editInvoiceInTable(oldName, edited);
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

const clearTableBody = async (tableName) => {
    let table = document.getElementById(tableName);
    let table_body = table.getElementsByTagName("tbody")[0];
    
    while (table_body.firstChild) {
        table_body.removeChild(table_body.firstChild);
    }
}

const addDetailToTable = async (name, quantity) => {
    let table = document.getElementById("add-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let rows = table_body.rows;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerHTML == name) {
            rows[i].cells[1].innerHTML = parseInt(quantity);
            return;
        }
    }

    let size = rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1 >= 0 ? size - 1 : 0}`;
    cell2.innerHTML = quantity;
    cell2.id = `quantity-${size - 1 >= 0 ? size - 1 : 0}`;

    let delete_btn = document.createElement("button");
    delete_btn.innerHTML = "Delete";
    delete_btn.id = `delete-detail-${size - 1 > 0 ? size - 1 : 0}`;
    delete_btn.classList.add("btn", "delete-button");
    delete_btn.addEventListener('click', handleDeleteDetailButtonEvent);

    cell3.appendChild(delete_btn);
};

const editDetailToTable = async (name, quantity) => {
    let table = document.getElementById("edit-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let rows = table_body.rows;

    //check if the book is already in the table
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[0].innerHTML == name) {
            rows[i].cells[1].innerHTML = parseInt(quantity);
            return;
        }
    }

    let size = rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1 >= 0 ? size - 1 : 0}`;
    cell2.innerHTML = quantity;
    cell2.id = `quantity-${size - 1 >= 0 ? size - 1 : 0}`;

    let delete_btn = document.createElement("button");
    delete_btn.innerHTML = "Delete";
    delete_btn.id = `delete-detail-${size - 1 > 0 ? size - 1 : 0}`;
    delete_btn.classList.add("btn", "delete-button");
    delete_btn.addEventListener('click', handleDeleteDetailButtonEvent);

    cell3.appendChild(delete_btn);
};

const addInvoiceToTable = async (data) => {
    let table = document.getElementById("invoice-table");
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

    let name = data.name;
    let detail = data.detail;
    let madeBy = data.madeBy;
    let price = data.price;
    let selectTag = `<select id=book-name-detail-${size - 1 > 0 ? size : 0}>`;
    let bookCount = 0;

    for (let i = 0; i < detail.length; i++) {
        let bookName = detail[i].bookName;
        let bookQuantity = detail[i].quantity;

        selectTag += `<option value='${JSON.stringify(detail[i])}'>${bookName}</option>`;
        bookCount += bookQuantity;
    }

    selectTag += "</select>";

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1 >= 0 ? size - 1 : 0}`;
    cell2.innerHTML = selectTag;
    cell2.id = `book-name-${size - 1 >= 0 ? size - 1 : 0}`;
    cell3.innerHTML = bookCount;
    cell3.id = `book-quantity-${size - 1 >= 0 ? size - 1 : 0}`;
    cell4.innerHTML = madeBy;
    cell4.id = `made-by-${size - 1 >= 0 ? size - 1 : 0}`;
    cell5.innerHTML =  new Date(data.date)
    .toLocaleDateString('en-GB');
    cell5.id = `date-${size - 1 >= 0 ? size - 1 : 0}`;
    cell6.innerHTML = price;
    cell6.id = `price-${size - 1 >= 0 ? size - 1 : 0}`;

    let edit_btn = document.createElement("button");
    edit_btn.setAttribute("class", "edit-button");
    edit_btn.setAttribute("id", `edit-btn-${size - 1 >= 0 ? size - 1 : 0}`);
    edit_btn.innerHTML = "Chỉnh sửa";
    edit_btn.addEventListener('click', handleEditButtonEvent);

    let delete_btn = document.createElement("button");
    delete_btn.setAttribute("class", "delete-button");
    delete_btn.setAttribute("id", `delete-btn-${size - 1 >= 0 ? size - 1 : 0}`);
    delete_btn.innerHTML = "Xóa";
    delete_btn.addEventListener('click', handleDeleteButtonEvent);

    let btn_column = document.createElement("div");
    btn_column.setAttribute("class", "button-column");
    btn_column.setAttribute("colspan", "2")
    btn_column.appendChild(edit_btn);
    btn_column.appendChild(delete_btn);

    cell7.appendChild(btn_column);
}

const editInvoiceInTable = async (oldName, data) => {
    let table = document.getElementById("invoice-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == oldName) {
            let bookDetail = data.detail;
            let selectTag = `<select id=book-name-detail-${i}>`;
            let bookCount = 0;

            for (let i = 0; i < bookDetail.length; i++) {
                let bookName = bookDetail[i].bookName;
                let bookQuantity = bookDetail[i].quantity;
                let json = JSON.stringify(bookDetail[i]);

                selectTag += `<option value='${json}'>${bookName}</option>`;
                bookCount += bookQuantity;
            }

            console.log(data);

            selectTag += "</select>";

            table_body.rows[i].cells[0].innerHTML = data.name;
            table_body.rows[i].cells[1].innerHTML = selectTag;
            table_body.rows[i].cells[2].innerHTML = bookCount;
            table_body.rows[i].cells[3].innerHTML = data.madeBy;
            table_body.rows[i].cells[4].innerHTML = new Date(data.date)
            .toLocaleDateString('en-GB');
            table_body.rows[i].cells[5].innerHTML = data.price;

        }
    }
}

const deleteInvoiceInTable = async (tableName, name) => {
    let table = document.getElementById(tableName); 
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
    let invoice_id = btn.id.split('-')[2];

    let invoice_name = document.getElementById(`name-${invoice_id}`).innerHTML;
    let invoice_detail = document.getElementById(`book-name-detail-${invoice_id}`);
    let invoice_date = document.getElementById(`date-${invoice_id}`).innerHTML;

    try {
        let edit_name = document.getElementById("edit-invoice-name");
        edit_name.value = invoice_name;
        edit_name.setAttribute("old-name", invoice_name);

        let edit_date = document.getElementById("edit-invoice-date");
        let date_parts = invoice_date.split('/');
        let date = new Date(Date.UTC(date_parts[2], date_parts[1] - 1, date_parts[0]));
        edit_date.value = date.toISOString().slice(0, 10);

        const options = invoice_detail.options;

        for (let i = 0; i < options.length; i++) {
            let value = options[i].value;
            console.log(value)
            value = JSON.parse(value);

            editDetailToTable(value.bookName, value.quantity);
        }

        let edit_section = document.getElementById("edit-invoice");
        edit_section.style.display ='block';
    } catch (e) {
        console.log(e);
        alert(e);
    }
}

async function handleDeleteButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let invoice_id = btn.id.split('-')[2];

    let invoice_name = document.getElementById(`name-${invoice_id}`).innerHTML;

    try {
        const data = await fetch('/invoice/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: invoice_name,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Delete invoice successfully') {
                    notification("success", "thành công");
                    await deleteInvoiceInTable("invoice-table", invoice_name);
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

const handleDeleteDetailButtonEvent = async (event) => {
    event.preventDefault();

    try {
        let btn = event.currentTarget;
        let detail_id = btn.id.split('-')[2];
    
        let table = document.getElementById("add-table").getElementsByTagName("tbody")[0].rows.length < 1 ? 
        document.getElementById("edit-table") : document.getElementById("add-table");
        let table_body = table.getElementsByTagName("tbody")[0];
        let rows = table_body.rows;
    
        let book_name = rows[detail_id].cells[0].innerHTML;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].cells[0].innerHTML == book_name) {
                table_body.deleteRow(i);
                return;
            }
        }
    } catch (err) {
        console.log(err);
        notification("error", "thất bại");
    }  
};