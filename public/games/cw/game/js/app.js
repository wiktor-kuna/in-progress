// import { questions } from './questions.js';
// import { questions } from './questions3.js';
// console.log(questions.length);
let questions = [];
let byNumber = 1;
    fetch('/games/cw/db')
        .then(data => data.json())
        .then(array => {
            console.log(array)
            questions = array;
            byNumber = questions.length; 
            createGame();      
        })
        .catch(e => console.log(e));

const volumeBtn = document.querySelector('.volume');
const opts = [...document.querySelectorAll('.opt')];
const changeBoxes = [...document.querySelectorAll('.change-box')];
const optChange = document.querySelector('.opt-change');
const optMoveL = document.querySelector('.opt-move-l');
const optMoveR = document.querySelector('.opt-move-r');
const change1 = document.querySelector('.change-1');
const change2 = document.querySelector('.change-2');
const change3 = document.querySelector('.change-3');
const skipBtn = document.querySelector('.skip-btn');
const wordCounter = document.querySelector('.word-counter');
const enSentence = document.querySelector('.en-sentence');
const gameOverInfo = document.querySelector('.game-over-info');
const coinsInfo = document.querySelector('#coins');

let win = false;
let volume = true;
let letters = document.querySelector('.letters');
let question = {};
let boxes = [...document.querySelectorAll('.box')];

const plWord = document.querySelector('.container .word h3');
const plSentence = document.querySelector('.container .word h5');

const click1 = new Audio('./sounds/click01.mp3');
const click2 = new Audio('./sounds/click02.mp3');
const winSound = new Audio('./sounds/win.mp3');
click1.preload = "auto";
click2.preload = "auto";
winSound.preload = "auto";

(async () => {
    const data = await fetch('/main/coins', {
        method: "POST",
        // body: JSON.stringify({}),
        headers: {"Content-Type": "application/json"}
    });
    coinsInfo.textContent = await data.json();
})();

function playSound(sound) {
    if (volume) sound.play();
    navigator.vibrate(100); //w safari crashuje przeglądarkę
}

//stworzenie obiektu question
function createQuestion(bySkip = false)
{
    let arrayLength = (bySkip ? (questions.length - 1) : questions.length);
    let indexOfQuestions = Math.floor(Math.random() * arrayLength);
    question = questions.splice(indexOfQuestions, 1)[0];

    wordCounter.textContent = `${byNumber - questions.length}/${byNumber}`;

    const lettersList = "qwertyuiopasdfghjklzxcvbnm";

    function randomLetter(txt = '') {
        let randomLetter = '';
        do {
            randomLetter = lettersList[Math.floor(Math.random() * lettersList.length)];
        }
        while (txt.includes(randomLetter));
        return randomLetter;
    }

    question.letters = [];
    [...question.enWord].forEach((value, index) => {
        const letterObj = {};
        letterObj.id = index;
        letterObj.name = value;
        letterObj.current = value;
        letterObj.mix = [];
        letterObj.mix[0] = value;
        letterObj.mix[1] = randomLetter(question.enWord);
        letterObj.mix[2] = randomLetter(question.enWord + letterObj.mix[1]);

        letterObj.mix.sort(() => {
            return 0.5 - Math.random();
        })
        question.letters.push(letterObj);
    });

    function randomizeBoxes() {
        let maxNumberOfCompatibilityLetters = 2;
        let compatibility;
        let newList;
        do {
            compatibility = 0;
            newList = [];
        [...question.enWord].forEach((element, index) => {
            if (element.toUpperCase() === question.letters[index].name.toUpperCase()) compatibility++;
        })
         newList = question.letters.sort(() => {
            return 0.5 - Math.random();
        })
        } while (maxNumberOfCompatibilityLetters <= compatibility)
         return newList;       
    }

    randomizeBoxes();
    return question;
};


function applyQuestion() {
    plWord.textContent = question.plWord;
    plSentence.textContent = question.plSentence;
}

//funkcja tworzy boxy z literami na podstawie tablicy z obiektu question
function createLetterBoxes() {
    letters.innerHTML = '';
    for (const letter of question.letters) {
        const div = document.createElement('div');
        div.classList.add('box');
        const h4 = document.createElement('h4');
        let mix = Math.floor(Math.random() * 3);
        h4.textContent = letter.mix[mix];
        h4.style.pointerEvents = "none"; //rozwiązanie problemu roku :)
        letter.current = letter.mix[mix];
        letters.appendChild(div);
        letters.lastChild.appendChild(h4);
        letters.lastChild.setAttribute('data-id', letter.id);
    }
    let mixedLetters = '';
    for (const letter of question.letters) {
        mixedLetters += letter.current;
    }
    if (mixedLetters.toUpperCase() === question.enWord.toUpperCase());
    boxes = [...document.querySelectorAll('.box')];
    listenersForBoxes();
}

//funkcja odświeża boxy z literami
function reCreateLetterBoxes(clickAnimate) {
    letters.innerHTML = '';
    for (const letter of question.letters) {
        const div = document.createElement('div');
        div.classList.add('box');
        const h4 = document.createElement('h4');
        h4.textContent = letter.current;
        h4.style.pointerEvents = "none";
        letters.appendChild(div);
        letters.lastChild.appendChild(h4);
        letters.lastChild.setAttribute('data-id', letter.id);
    }
    boxes = [...document.querySelectorAll('.box')];
    boxes[clickAnimate].classList.add('active');
    boxes[clickAnimate].classList.add('click');
    setTimeout(() => {
        boxes[clickAnimate].classList.remove('click')
    }, 400);
    listenersForBoxes();
}

//funkcja sprawdza, czy dany element jest aktywny
function isActive(obj, className = 'active') {
    return obj?.classList.contains(className)
}

//funkcja zwraca element z tablicy, który jest aktywny (posiada daną klasę)
function findActive(array, className = 'active') {
    return array.find(element => {
        if (element.classList.contains(className)) return element;
        else return null;
    });
}

function createGame() {
    skipBtn.style.display = 'flex';
    question = createQuestion();
    applyQuestion();
    createLetterBoxes();
};


//listenery dla change-letterów
for (const changeBox of changeBoxes) {
    changeBox.addEventListener('click', (event) => {
        playSound(click2);
        const boxToChange = findActive(boxes);
        boxToChange.lastChild.textContent = event.target.lastChild.textContent;
        boxToChange.classList.add('click');
        setTimeout(() => {
            boxToChange.classList.remove('click')
        }, 400);
        const dataID = parseInt(boxToChange.getAttribute('data-id'));
        const elementID = question.letters.findIndex(element => {
            return element.id == dataID;
        });
        question.letters[elementID].current = event.target.lastChild.textContent;
        optChange.classList.remove('active');
        optChangeFunc();
    })
}

function changeLetters(boxBtn) {
    let counter = 0;
    for (const change of [...document.querySelectorAll('.change-box')]) {
        change.innerHTML = `<h4>${question.letters[question.letters.findIndex(element => {
            return element.id === parseInt(boxBtn.getAttribute("data-id"));
        })].mix[counter++].toUpperCase()}</h4>`
    }

}

//funkcja odpowiedzialna za zachowanie opcji zmiany liter
function optChangeFunc() {
    if (isActive(optChange)) {
        document.querySelector('.change').classList.add('change-flex');
        if (findActive(boxes)) {
            changeLetters(findActive(boxes));

        } else {
            change1.innerHTML = '<h4></h4>';
            change2.innerHTML = '<h4></h4>';
            change3.innerHTML = '<h4></h4>';
        }
    }
    else if (!isActive(optChange)) {
        document.querySelector('.change').classList.add('hide-anim');
        setTimeout(() => {
            document.querySelector('.change').classList.remove('change-flex')
            document.querySelector('.change').classList.remove('hide-anim');
        }, 300);
    };
}

//Listenery dla opcji
for (const opt of opts) {
    opt.addEventListener('click', (event) => {

        const boxActive = findActive(boxes);
        playSound(click1);

        for (const optActive of opts) {
            if (isActive(optActive) && !isActive(event.target)) optActive.classList.remove('active');
        }
        event.target.classList.toggle('active');

        if (isActive(optChange) && !findActive(boxes)) {
            optChange.classList.remove('active');
            return;
        };

        optChangeFunc();

        if (isActive(optMoveL)) {
            setTimeout(() => {
                optMoveL.classList.remove('active');
            }, 100);
            if (boxActive) {
                let index = parseInt(boxActive.getAttribute('data-id'));
                let elementID = question.letters.findIndex(element => {
                    return element.id == index
                });
                let content = question.letters.splice(elementID, 1)[0];

                if (elementID == 0) {
                    question.letters.push(content);
                    reCreateLetterBoxes(question.letters.length - 1);
                } else {
                    question.letters.splice(elementID - 1, 0, content);
                    reCreateLetterBoxes(elementID - 1)
                };
            }
        }

        if (isActive(optMoveR)) {
            setTimeout(() => {
                optMoveR.classList.remove('active');
            }, 100);
            if (boxActive) {
                let index = parseInt(boxActive.getAttribute('data-id'));
                let elementID = question.letters.findIndex(element => {
                    return element.id == index
                });
                let content = question.letters.splice(elementID, 1)[0];

                if (elementID == (question.letters.length)) {
                    question.letters.unshift(content);
                    reCreateLetterBoxes(0);
                } else {
                    question.letters.splice(elementID + 1, 0, content);
                    reCreateLetterBoxes(elementID + 1);
                }
            }
        }
    })
}

//Listenery dla liter
function listenersForBoxes() {
    for (const box of boxes) {
        box.addEventListener('click', event => {
            playSound(click1);
            event.target.classList.add('click');
            setTimeout(() => {
                event.target.classList.remove('click')
            }, 400);


            if (!isActive(event.target)) {
                for (const boxActive of boxes) {
                    if (isActive(boxActive)) boxActive.classList.remove('active');
                }
            }
            event.target.classList.toggle('active');

            if (isActive(event.target) && !isActive(optChange)) {
                optChange.classList.add('active');
                optChangeFunc();
            }

            if (!isActive(event.target) && isActive(optChange)) {
                optChange.classList.remove('active');
                optChangeFunc();
            }

            if (isActive(optChange)) {
                optChangeFunc();
            }
        });
    }
}

//sprawdzanie, czy wynik jest poprawny (listener na body)
document.body.addEventListener('click', () => {
    if (!win) {
        let name = '';
        for (const box of boxes) {
            name += box.lastChild.textContent;
        }
        // console.log(name);
        if (question.enWord.toUpperCase() === name.toUpperCase()) {
            setTimeout(async () => {
                win = true;
                playSound(winSound);

            
                    const data = await fetch('/main/coins/add', {
                        method: "POST",
                        body: JSON.stringify({win: true}),
                        headers: {"Content-Type": "application/json"}
                    });
                    coinsInfo.textContent = await data.json();
           

                enSentence.textContent = question.enSentence;
                gameOverInfo.textContent = `brawo. poprawna odpowiedź to "${question.enWord}"`.toUpperCase();
                boxes.forEach(element => {
                    element.classList.add('win');
                });
                const newGame = document.createElement('button');
                newGame.textContent = "graj dalej".toUpperCase();
                skipBtn.style.display = 'none';
                document.querySelector('.word').appendChild(newGame);
                document.querySelector('button').addEventListener('click', () => {
                    playSound(click1);
                    /////////FUNKCJA RETURN
                    enSentence.textContent = '';
                    gameOverInfo.textContent = '';
                    document.querySelector('button').remove();
                    if (questions.length) {
                        win = false;
                        createGame();
                    }
                    else {
                        win = true;
                        enSentence.textContent = '';
                        plSentence.textContent = '';
                        plWord.textContent = '';
                        letters.remove();
                        document.querySelector('.nav').remove();

                        wordCounter.textContent = `Przerobiłeś wszystkie ${byNumber} słówek. Gratulacje!`;
                        gameOverInfo.textContent = "Skończyło się wszystko. Już nic nie ma :)";
                        document.querySelector('.search-word-label').textContent = '';
                        document.querySelector('.example-sentence-label').textContent = '';
                    }
                });
            }, 100);
        }
    }
});

volumeBtn.addEventListener('click', () => {
    volume = !volume;
    playSound(click1);
    document.querySelector('.icon-tabler-volume').classList.toggle('non-active');
    document.querySelector('.icon-tabler-volume-3').classList.toggle('non-active');
});

skipBtn.addEventListener('click', () => {
    playSound(click1);

    if (questions.length >= 1) {
        questions.push(question);
        createGame(true);
    }
});

