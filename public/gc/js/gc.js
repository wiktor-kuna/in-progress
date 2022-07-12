const color = Math.random()*360;
const script = document.querySelector('#script');
const nick = script.dataset.name;
const input = document.querySelector('.input');
input.focus();
const send = document.querySelector('#send');
const content = document.querySelector('.content');

const socket = io();

socket.on("connect", () => {
    console.log("You are connected, and your ID is:", socket.id);
});

socket.on("disconnect", () => {
    console.log("You are disconnected");
});

function sendValue() {
    if (input.value.trim()) {
        socket.emit('chat message', JSON.stringify({nick: nick, input: input.value}));
        input.value = '';
        input.focus();
    }
}

send.addEventListener('click', (e) => {
    e.preventDefault();
    sendValue();
});

// nick.addEventListener("keyup", (event) => {
//     if (event.keyCode === 13) input.focus();
// });

input.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) sendValue();
});

const addText = function(msg) {
    const el = document.createElement("div");
    el.classList.add("message");

    if (msg.nick === nick){
        el.style.background = `hsl(${color}, 70%, 70%)`;
        el.classList.add("mymessage");
    } else {
        el.style.background = `hsl(${Math.random()*360}, 20%, 70%)`;}
        el.style.color = "#333";
        el.innerHTML = `<p class="header">${msg.nick} [${msg.date}]:</p>
        <p>${msg.input}</p>`;
        content.appendChild(el);
        window.scrollTo(0, document.documentElement.scrollHeight);
}

socket.on("answer", msg => {
    addText(JSON.parse(msg));
});

socket.on('reset', () => content.innerHTML = '');

socket.on('start', msg => {
    const newObj = JSON.parse(msg);
    newObj.forEach(value => {
        addText(value);
    })
});