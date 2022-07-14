const loadDataBtn = document.querySelector('.load-btn');
const createDataBtn = document.querySelector('.create-btn');
const saveWordBtn = document.querySelector('.save-word-btn');
const deleteWordBtn = document.querySelector('.delete-word-btn');
const addWordBtn = document.querySelector('.add-word-btn');

const inputWordPl = document.querySelector('.word-pl');
const inputWordEn = document.querySelector('.word-en');
const inputSentencePl = document.querySelector('.sentence-pl');
const inputSentenceEn = document.querySelector('.sentence-en');

const selectDB = document.querySelector('.data-bases');

loadDataBtn.addEventListener('click', async () => {
    try {
        const response = await fetch(`/games/cw/editor`);
        const {login} = await response.json();
        const response2 = await fetch(`/games/cw/editor/${login}`);
        const list = await response2.json();
        selectDB.innerHTML = '';
        list.forEach(val => {
            const newOpt = document.createElement('option');
            newOpt.appendChild(document.createTextNode(val));
            selectDB.appendChild(newOpt);
        });
    } catch (e) {
        inputWordEn.value = 'błąd';
    }
});

createDataBtn.addEventListener('click', () => {
    console.log('kliknięto!')
});

saveWordBtn.addEventListener('click', () => {
    console.log('kliknięto!')
});

deleteWordBtn.addEventListener('click', () => {
    console.log('kliknięto!')
});

addWordBtn.addEventListener('click', () => {
    console.log('kliknięto!')
});

