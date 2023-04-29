'use strict';

const signInBtn = document.getElementById('signInBtn');

signInBtn.addEventListener('click', async() => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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

            alert(data.message)
        })
        .catch(err => console.log(err));
});