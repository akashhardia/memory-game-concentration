/*
 * Create a list that holds all of your cards
 */
let moves = 0,
    stars = 3,
    deck = document.querySelector('.deck'),
    dialog = document.getElementById("modal"),
    timer = 0,
    matchedList = [],
    clickedOnce = false;

const cardList = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
        'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'
    ],
    openList = [];


//========================================================================================
// Restart

document.querySelector('.restart').addEventListener('click', restart);

function restart() {
    // window.location.reload();
    deck.innerHTML = '';
    matchedList.length = 0;
    openList.length = 0;
    display(); // render new cards
    moves = 0;
    stars = 3;
    stopWatch();
    timer = 0;
    document.querySelector('.timer').textContent = timer;
    clickedOnce = false;
    document.querySelector('.stars').innerHTML = `<li><i class="fa fa-star"></i></li>
            		                                <li><i class="fa fa-star"></i></li>
            	                                	<li><i class="fa fa-star"></i></li>`;
    setScore();
}

//========================================================================================
// Timer

let myWatch;

function startWatch() {
    myWatch = setInterval(function() { // starts timer
        timer++;
        document.querySelector('.timer').textContent = timer;
    }, 1000);
}

function stopWatch() {
    clearInterval(myWatch); //stops the timer
}

//==================================================================================
// Modal

function showDialog() { // shows modal
    const str = `<h1>Congratulations! You Won</h1>
                            with   ${moves} moves and ${stars} stars in ${timer} seconds<br>
                            <button  class='play-again' onclick="closeDialog()">Play Again</button>`
    dialog.innerHTML = str;
    dialog.style.display = 'block';
    myAnimation(dialog, 'zoomIn');
}

function closeDialog() { // hides modal
    dialog.style.display = "none";
    restart();
}

//==================================================================================
// Render shuffled cards

let display = function() {
    const shuffledList = shuffle(cardList); // get shuffled cards
    console.log(shuffledList);
    const deck = document.querySelector('.deck');
    shuffledList.forEach(function(item) {
        let newElement = document.createElement('li');
        newElement.innerHTML = '<i class="' + item + '"></i>';
        newElement.classList.add('card');
        deck.appendChild(newElement);
    });
};

document.addEventListener('DOMContentLoaded', display);

//==================================================================================
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}



//==================================================================================
// Set Score

let setScore = function() {
    document.querySelector('.moves').textContent = moves;
    if (moves === 25) {
        setStars();
        --stars;
    }
    else if (moves === 45) {
        setStars();
        --stars;
    }
};

//==================================================================================
// Set Stars

function setStars() {
    document.querySelector('.stars').firstElementChild.remove(); // remove one star
}

//==================================================================================
// myAnimation

function myAnimation(item, animation) {
    item.classList.toggle(animation);
    setTimeout(function() {
        item.classList.toggle(animation);
    }, 1000);
}

//==================================================================================
// Open Card

let openCard = function(event) {
    const target = event.target;
    if (!(target.classList.contains('open', 'show'))) { // if it doesn't contain open, show
        if (target.nodeName === 'LI') { // if li is clicked
            if (clickedOnce === false) {
                clickedOnce = true;
                startWatch();
            }
            moves++;
            setScore();
            if (openList.length < 2) { // when open list has 0 or 1 items
                console.log(target);

                // when 1 item in openlist and it is same as target
                if (openList.length > 0 && target.firstElementChild.className === openList[0].firstElementChild.className) {
                    target.classList.add('show', 'open', 'match', 'animated');
                    myAnimation(target, 'rubberBand');
                    var item = openList.pop();
                    item.classList.add('match');
                    myAnimation(item, 'rubberBand');
                    matchedList.push(item, target); // add items into matched list
                }
                else { // when 0 item

                    openList.push(target);
                    target.classList.add('open', 'show', 'animated');
                    myAnimation(target, 'flipInY');
                }
            }
            else { // when openlist has 2 items
                // remove both items
                let item = openList.pop();
                item.classList.remove('open', 'show');
                item = openList.pop();
                item.classList.remove('open', 'show');

                // add the target
                openList.push(target);
                target.classList.add('open', 'show', 'animated');
                myAnimation(target, 'flipInY');
            }

        }
        if (matchedList.length === 16) {
            stopWatch();
            showDialog();
        }
    }
};

deck.addEventListener('click', openCard); // on clicking card
