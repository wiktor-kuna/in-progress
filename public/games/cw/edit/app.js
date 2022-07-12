const API_link = "http://localhost:3000/api/";

const loadDataBtn = document.querySelector('.load-btn');
const createDataBtn = document.querySelector('.create-btn');
const saveWordBtn = document.querySelector('.save-word-btn');
const deleteWordBtn = document.querySelector('.delete-word-btn');
const addWordBtn = document.querySelector('.add-word-btn');

const inputWordPl = document.querySelector('.word-pl');
const inputWordEn = document.querySelector('.word-en');
const inputSentencePl = document.querySelector('.sentence-pl');
const inputSentenceEn = document.querySelector('.sentence-en');

loadDataBtn.addEventListener('click', async () => {
    // inputWordPl.value = document.querySelector('select').value;
    try {
        const response = await fetch(`${API_link}`);

    } catch (e) {
        inputWordEn.value = 'błąd';
        // console.log(e);
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

