'use strict';

const signInBtn = document.getElementById('signInBtn');

signInBtn.addEventListener('click', async() => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let messageSection = document.getElementById('message');
    messageSection.innerHTML = 'Đang xử lý...';
    messageSection.style.color = 'blue';

    const data = await fetch('/access/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Sign in successfully") {
                return window.location.href = '/dashboard';
            }

            messageSection.innerHTML = "Email hoặc mật khẩu không đúng";
            messageSection.style.color = 'red';
        })
        .catch(err => {
            console.log(err);
            messageSection.innerHTML = "Đã xảy ra lỗi";
            messageSection.style.color = 'red';
        });
});