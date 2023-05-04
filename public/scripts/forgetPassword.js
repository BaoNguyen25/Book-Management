const submit_btn = document.getElementById('submit-btn');

submit_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    if (email == '' || email.includes('@') == false || email.includes('.') == false) {
        alert('Please enter your email address');
        return;
    }

    submit_btn.disabled = true;

    let messageSection = document.getElementById('message');
    messageSection.innerHTML = 'Đang xử lý';
    messageSection.style.color = 'blue';

    const data = await fetch('/access/forget-password', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        }).then(res => res.json())
        .then(data => {
            if (data.message == 'Email sent successfully') {
                messageSection.innerHTML = 'Đã gửi email, hãy kiểm tra hòm thư của bạn';
                messageSection.style.color = 'green';
            } else {
                messageSection.innerHTML = 'Email không tồn tại';
                messageSection.style.color = 'red';
            }
            submit_btn.disabled = false;
        });
});