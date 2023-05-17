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

let navbar_highlight = document.getElementById("book-link").classList.add("active");

function notification(status, msg) {
    let alert = document.getElementById("Alert");
    alert.innerHTML = msg;
    alert.style.color = "white";

    if (status === "success") {
        alert.style.backgroundColor = "green";
    }
    else if (status === "processing") {
        alert.style.backgroundColor = "blue";
        alert.innerHTML = "Đang xử lý...";
    } else if (status === "error") {
        alert.style.backgroundColor = "red";
    }

    alert.classList.add("showAlert");

    setTimeout(() => {
        alert.classList.remove("showAlert");
    }, 3000);
}

add_btn.addEventListener('click', () => {
    let add_section = document.getElementById("add-book");
    add_section.style.display = 'block';
})

close_add_section.addEventListener('click', (event) =>{
    event.preventDefault();
    let add_section = document.getElementById("add-book");
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
    let edit_section = document.getElementById("edit-book");
    edit_section.style.display = "none";
})

search_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    notification("processing", "Đang xử lý...");

    let content = document.getElementById("search-content").value;
    let data = await fetch('/book/search', {
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
                if (data.message == 'Search book successfully') {
                    let bookList = data.metadata;
                    
                    await clearTableBody();

                    for (let i = 0; i < bookList.length; i++) {
                        await addBookToTable(bookList[i].name, bookList[i].category, bookList[i].author
                            , bookList[i].quantity, bookList[i].price);
                    }   

                    notification("success", "Tìm kiếm thành công");
                } else {
                    notification("error", "Tìm kiếm thất bại");
                }
            }
        );
});

submit_add_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let name = document.getElementById("add-name").value;
    let category = document.getElementById("add-category").value;
    let author = document.getElementById("add-author").value;
    let number = document.getElementById("add-number").value;
    let image = document.getElementById("add-image");
    let price = document.getElementById("add-price").value.split('.').join('').split(',').join('');

    notification("processing", "Đang xử lý...");
    
    console.log(image.files[0])

    const formData = new FormData();

    formData.append('name', name);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('quantity', number);
    formData.append('image', image.files[0]);
    formData.append('price', price);

    try {
        let data = await fetch('/book/add', {
            method: 'POST',
            headers: {
            },
            body:
                formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Add book successfully') {
                    let add_section = document.getElementById("add-book");
                    add_section.style.display = "none";
                    let fetched = data.metadata;
                    await addBookToTable(fetched.name, fetched.category, fetched.author, fetched.quantity, fetched.price);

                    document.getElementById("add-name").value = '';
                    document.getElementById("add-category").value = '';
                    document.getElementById("add-author").value = '';
                    document.getElementById("add-number").value = '';
                    document.getElementById("add-price").value = '';
                    notification("success", "Thêm sách thành công");
                } else {
                    notification("error", "Thêm sách thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "Thêm sách thất bại");
    }
});

submit_edit_btn.addEventListener('click', async (event) => {
    event.preventDefault();
    let edit_name = document.getElementById("edit-name");
    let name = edit_name.value;
    let oldName = edit_name.getAttribute("old-name");
    let edit_category = document.getElementById("edit-category");
    let category = edit_category.value;
    let edit_author = document.getElementById("edit-author");
    let author = edit_author.value;
    let edit_number = document.getElementById("edit-number");
    let number = edit_number.value;
    let image = document.getElementById("edit-image");
    let edit_price = document.getElementById("edit-price");
    let price = edit_price.value.split('.').join('').split(',').join('');

    notification("processing", "Đang xử lý...");

    const formData = new FormData();
    formData.append('oldName', oldName);
    formData.append('name', name);
    formData.append('category', category);
    formData.append('author', author);
    formData.append('quantity', number);
    formData.append('image', image.files[0]);
    formData.append('price', price);

    try {
        let data = await fetch('/book/edit', {
            method: 'POST',
            headers: {
            },
            body: formData
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Edit book successfully') {
                    let edit_section = document.getElementById("edit-book");
                    edit_section.style.display = "none";
                    let edited = data.metadata;
                    await editBookInTable(oldName, edited.name, edited.category, edited.author, edited.quantity, edited.price);

                    notification("success", "Sửa sách thành công");
                } else {
                    notification("error", "Sửa sách thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "Sửa sách thất bại");
    }
});

const clearTableBody = async () => {
    let table = document.getElementById("book-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    
    while (table_body.firstChild) {
        table_body.removeChild(table_body.firstChild);
    }
}

const addBookToTable = async (name, category, author, number, price) => {
    let table = document.getElementById("book-table");
    let table_body = table.getElementsByTagName("tbody")[0];
    let size = table.rows.length;
    let row = table_body.insertRow(-1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4= row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.innerHTML = name;
    cell1.id = `name-${size - 1}`;
    cell2.innerHTML = category;
    cell2.id = `category-${size - 1}`;
    cell3.innerHTML = author;
    cell3.id = `author-${size - 1}`;
    cell4.innerHTML = number;
    cell4.id = `number-${size - 1}`; 
    cell5.innerHTML = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    cell5.id = `price-${size - 1}`;

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

    cell6.appendChild(btn_column);
}

const editBookInTable = async (oldName, name, category, author, number, price) => {
    let table = document.getElementById("book-table");
    let table_body = table.getElementsByTagName("tbody")[0];

    for (let i = 0; i < table_body.rows.length; i++) {
        if (table_body.rows[i].cells[0].innerHTML == oldName) {
            table_body.rows[i].cells[0].innerHTML = name;
            table_body.rows[i].cells[1].innerHTML = category;
            table_body.rows[i].cells[2].innerHTML = author;
            if (number > 0) table_body.rows[i].cells[3].innerHTML = number;
            if (price > 0) table_body.rows[i].cells[4].innerHTML = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }
}

const deleteBookInTable = async (name) => {
    let table = document.getElementById("book-table");
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
    let book_id = btn.id.split('-')[2];

    try {
        let book_name = document.getElementById(`name-${book_id}`).innerHTML;
        let book_category = document.getElementById(`category-${book_id}`).innerHTML;
        let book_author = document.getElementById(`author-${book_id}`).innerHTML;
        let book_quantity = document.getElementById(`number-${book_id}`).innerHTML;
        let book_price = document.getElementById(`price-${book_id}`).innerHTML;

        let edit_name = document.getElementById("edit-name");
        edit_name.value = book_name;
        edit_name.setAttribute("old-name", book_name);
        let edit_category = document.getElementById("edit-category");
        edit_category.value = book_category;
        let edit_author = document.getElementById("edit-author");
        edit_author.value = book_author;
        let edit_number = document.getElementById("edit-number");
        edit_number.value = book_quantity;
        let edit_price = document.getElementById("edit-price");
        edit_price.value = book_price;

        let edit_section = document.getElementById("edit-book");
        edit_section.style.display ='block';
    } catch (e) {
        console.log(e);
        notification("error", "Đã có lỗi xảy ra, vui lòng f5 lại trang")
    }
}

async function handleDeleteButtonEvent(event) {
    event.preventDefault();
    let btn = event.currentTarget;
    let book_id = btn.id.split('-')[2];

    let book_name = document.getElementById(`name-${book_id}`).innerHTML;

    notification("processing", "Đang xử lý...");

    try {
        const data = await fetch('/book/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: book_name,
                })
            })
            .then(response => response.json())
            .then(async data => {
                if (data.message == 'Delete book successfully') {
                    notification("success", "Xóa sách thành công");
                    
                    await deleteBookInTable(book_name);
                } else {
                    notification("error", "Xóa sách thất bại");
                }
            }
        );
    } catch (e) {
        console.log(e);
        notification("error", "Xóa sách thất bại")
    }
}
