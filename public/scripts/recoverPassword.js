const submit_btn = document.getElementById('submit-btn');

submit_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const token = document.getElementById('token').value;
    const url = submit_btn.getAttribute('url');

    if (password == '' || token == '') {
        alert('Please fill all fields');
        return;
    }

    submit_btn.disabled = true;

    let messageSection = document.getElementById('message');
    messageSection.innerHTML = 'Đang xử lý';
    messageSection.style.color = 'blue';

    const data = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, token })
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.message == 'Password changed successfully') {
                messageSection.innerHTML = 'Đã thay đổi mật khẩu, sẽ chuyển hướng sang trang đăng nhập sau 5 giây';
                messageSection.style.color = 'green';

                setTimeout(() => {
                    window.location.href = '/access/signin';
                }, 5000);
            } else {
                messageSection.innerHTML = 'Đã có lỗi xảy ra';
                messageSection.style.color = 'red';
            }

            submit_btn.disabled = false;
        });
});