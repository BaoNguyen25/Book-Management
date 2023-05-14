//toggle navbar
let el = document.getElementById("wrapper");
let toggleButton = document.getElementById("menu-toggle");
const detail_btn = document.querySelectorAll("[id^='btn-detail']");
const detail_form = document.getElementById("detail-order");
const close_detail_button = document.getElementById("close-detail-btn");
const search_btn = document.getElementById("search-btn");
const finish_btn = document.querySelectorAll("[id^='finish-btn']");
const delete_btn = document.querySelectorAll("[id^='delete-btn']");

console.log(finish_btn)

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//
search_btn.addEventListener("click", async () => {
    const name = document.getElementById("search-name").value;
    const status = document.getElementById("search-status").value;
    const table = document.getElementById("order-table");
    const table_body = table.getElementsByTagName("tbody")[0];
    
    try {
        const data = await fetch("/order/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, status }),
        })
        .then((res) => res.json())
        .then((data) => {
            table_body.innerHTML = "";
            if (data.metadata) {
                addOrderToTable(data.metadata, status);
            }
        });
    } catch (error) {
        table_body.innerHTML = "";
        console.log(error);
    }
});

detail_btn.forEach((btn) => {
    showOrderDetail(btn);
});

close_detail_button.addEventListener("click", () => {
    detail_form.style.display = "none";
});

finish_btn.forEach((btn) => {
    btn.addEventListener("click", handleFinishOrderEvent);
});

delete_btn.forEach((btn) => {
    btn.addEventListener("click", handleDeleteOrderEvent);
});

function addOrderToTable(orderList, status="Pending") {
    const table = document.getElementById("order-table");
    const table_body = table.getElementsByTagName("tbody")[0];

    orderList.forEach((order, index) => {
        let row = table_body.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);

        cell1.innerHTML = order.user.name;
        cell2.innerHTML = new Date(order.date).toLocaleDateString('en-GB');
        
        const detail_btn = document.createElement("button");
        detail_btn.setAttribute("class", "btn btn-link");
        detail_btn.setAttribute("id", `btn-detail-${index}`);
        detail_btn.setAttribute("value", JSON.stringify(order.orderDetails));
        detail_btn.innerHTML = "Xem chi tiết";
        showOrderDetail(detail_btn);

        cell3.appendChild(detail_btn);
        cell4.innerHTML = order.total;
        cell5.innerHTML = order.status === 'Pending' ? 'Đang giao' : order.status === 'Delivered' ? 'Đã giao' : 'Đã hủy';

        if (status === "Pending") {
            let finish_btn = document.createElement("button");
            finish_btn.setAttribute("class", "finish-button");
            finish_btn.setAttribute("id", `finish-btn-${index}`);
            finish_btn.innerHTML = "Hoàn thành";
            finish_btn.setAttribute("value", order._id);
            finish_btn.addEventListener("click", handleFinishOrderEvent);

            let delete_btn = document.createElement("button");
            delete_btn.setAttribute("class", "delete-button");
            delete_btn.setAttribute("id", `delete-btn-${index}`);
            delete_btn.innerHTML = "Xóa";
            delete_btn.setAttribute("value", order._id);
            delete_btn.addEventListener("click", handleDeleteOrderEvent);

            cell6.appendChild(finish_btn);
            cell6.appendChild(delete_btn);
        }
    });
}

function showOrderDetail(btn) {
    btn.addEventListener("click", () => {  
        let detail = btn.getAttribute("value");
        detail = JSON.parse(detail);
        
        let table = document.getElementById("detail-table");
        let table_body = table.getElementsByTagName("tbody")[0];

        table_body.innerHTML = "";
        
        detail.forEach((item) => {
            let row = table_body.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);

            const book = item.book;

            cell1.innerHTML = book.name;
            cell2.innerHTML = item.quantity;
            cell3.innerHTML = book.price * item.quantity;
        });

        detail_form.style.display = "block";
    });
}

async function handleFinishOrderEvent(event) {
    const btn = event.target;
    let index = btn.id.split("-")[2];

    const orderId = document.getElementById(`id-${index}`).getAttribute("value");

    console.log(orderId)

    try {
        const data = await fetch("/order/finish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Finish order successfully") {
                alert(data.message);
                location.reload();
                return;
            }

            alert("Finish order failed");
        });
    } catch (error) {
        alert("Finish order failed");
    }
}

async function handleDeleteOrderEvent(event) {
    const btn = event.target;
    let index = btn.id.split("-")[2];

    const orderId = document.getElementById(`id-${index}`).getAttribute("value");

    console.log(orderId)

    try {
        const data = await fetch("/order/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.message === "Cancel order successfully") {
                alert(data.message);
                location.reload();
                return;
            }

            alert("Cancel order failed");
        });
    } catch (error) {
        alert("Finish order failed");
    }
}