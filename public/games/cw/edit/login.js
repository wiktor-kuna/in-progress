const input = document.querySelector('.input');
const button = document.querySelector('.input-btn');

button.addEventListener('click', async () => {
    value = input.value;
    await fetch('http://localhost:3000/api/login');
})