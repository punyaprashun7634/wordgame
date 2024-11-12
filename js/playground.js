let response = await fetch('../data/data.json');
let data = await response.json();

let selected = new Set();

let urlParams = new URLSearchParams(window.location.search);

// Retrieve the 'buttonContent' parameter from the URL
let category = decodeURIComponent(urlParams.get('category'));
let headingtext = document.querySelector('.heading-text');

// global variables for game starts here
let score = 0;

let obj;
let letterOpened = 0;
let count = 0;

let attemps = 0;
let totalAttemps = 0;
let randomIndex = undefined;
// global variables for game ends here

let startGame = (category, data) =>{
    for(let i = 0; i<data.length; i++){
        selected.add(i);
    }
    headingtext.textContent = category;
    let word = getRandomUniqueWord(data)
    loadWords(word);
    InitializeGame(word);
}

let getRandomUniqueWord = (data)=>{
    randomIndex = [...selected][Math.floor(Math.random() * selected.size)];
    return data[randomIndex].name;
}

let loadWords = (words)=>{
    let wordContainer = document.querySelector('.current-word-container');
    let wordsArr = words.toString().split(" ");
    count = 0;
    wordsArr.forEach((word)=>{
        let wordBox = document.createElement('div');
        wordBox.classList.add('word');
        for(let i = 0; i<word.length; i++){
            let letter = document.createElement('p');
            letter.classList.add('letter');
            letter.id = count;
            count++;
            wordBox.appendChild(letter);
        }
        wordContainer.appendChild(wordBox);
    })
}

let loadKeyboard = ()=>{
    let keyboardContainer = document.querySelector('.keyboard');
    for(let i = 0; i<26; i++){
        let letter = 65; //ascii value of 65 is A
        let key = document.createElement('div');
        key.classList.add('key');
        let keytext = document.createElement('p');
        keytext.classList.add('key-text');
        keytext.textContent = String.fromCharCode(letter+i);
        key.appendChild(keytext);
        keyboardContainer.appendChild(key);
    }
}

let InitializeGame = (word)=>{
    // initialization of the map for storing index of the letters    
    obj = new Map();
    let uniqueLetters = new Set();
    count = 0;

    let wordsArr = word.toString().split(" ");
    wordsArr.forEach((word)=>{
        for (let i = 0; i < word.length; i++) {
            if (obj.has(word[i].toUpperCase())) {
                obj.get(word[i].toUpperCase()).add(count); 
            } else {
                obj.set(word[i].toUpperCase(), new Set([count])); 
            }
            uniqueLetters.add(word[i]);
            count++;
        }      
    })

    // game status counter
    letterOpened = 0;
    attemps = uniqueLetters.size + 2;
    totalAttemps = attemps;
}

let updateProgressBar = (totalAttemp, remainingAttemp)=>{
    let progressBar = document.querySelector('.progress-bar');
    let width = (remainingAttemp*100)/totalAttemp;
    
    progressBar.style.width = `${width}%`;
    if (width >=75){
        progressBar.style.backgroundColor = 'green';
    }
    else if(width<50 && width > 30){
        progressBar.style.backgroundColor = '#FFFF00';
    }
    else if(width<30){
        progressBar.style.backgroundColor = '#ff0000';
    }
}

let updateScoreAndHeart = ()=>{
    let heart = document.querySelector('.fa-heart');
    let scoreElement = document.querySelector('.score');
    if(score>=200){
        heart.style.color = '#FFD700';
    }
    else if(score >=100){
        heart.style.color = '#C0C0C0';
    }
    else if(score >=50){
        heart.style.color = '#CE8946';
    }
    else{
        heart.style.color = 'red';
    }
    scoreElement.textContent = score;
}

let resetGame = ()=>{
    unloadWords();
    startGame(category, data.categories[category]);
    let progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '100%';
    progressBar.style.backgroundColor = 'green';

}
let unloadWords = ()=>{
    let words = document.querySelectorAll('.word');
    words.forEach((word)=>{
        word.remove();
    })
}

let toggleHamburger = ()=>{
    let hamburgerMenu = document.querySelector('.hamburger-menu');
    hamburgerMenu.querySelector('.message').textContent = "Game Paused"
    hamburgerMenu.classList.toggle('active');
}

// game starts from here
loadKeyboard()
updateScoreAndHeart();
startGame(category, data.categories[category]);
// game ends here


// Listeners starts from here

let keys = document.querySelectorAll('.key');
keys.forEach((key)=>{
    key.addEventListener('click', ()=>{
        if(attemps>0){
            // running state
            key.classList.add('disabled');
            let ids = obj.get(key.textContent);
            if(ids){
                for(let id of ids){
                    let letter = document.getElementById(id);
                    letter.classList.add('active')
                    letter.textContent = key.textContent;
                    letterOpened++;
                }
            }
            if(letterOpened===count){
                // win game
                let hamburgerMenu = document.querySelector('.hamburger-menu');
                hamburgerMenu.querySelector('.message').textContent = "YOU WIN!"
                hamburgerMenu.classList.add('active');

                // delete index for unique word next time
                selected.delete(randomIndex);

                score+=20;
            }
            attemps--;
            updateProgressBar(totalAttemps, attemps);
            updateScoreAndHeart();
        }else{
            // game end state
            let hamburgerMenu = document.querySelector('.hamburger-menu');
            hamburgerMenu.querySelector('.message').textContent = "YOU LOSE!"
            hamburgerMenu.classList.add('active');
        }

    })
})


let hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', ()=>{
    toggleHamburger();
})

let continueBtn = document.querySelector('.continue');
continueBtn.addEventListener('click', ()=>{
    toggleHamburger();
})

let playAgain = document.querySelector('.play-again');
playAgain.addEventListener('click', ()=>{
    resetGame();
    let keys = document.querySelectorAll('.key');
    keys.forEach((key)=>{
        key.classList.remove('disabled');
    })
    toggleHamburger();
})

// Listeners ends from here