/*
 * Create a list that holds all of your cards
 */
let deck        = document.querySelector('.deck'),
    dialog      = document.getElementById("modal"),
    timer       = 0,
    stars       = document.querySelector('.stars');

const cardList  =   ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb',
                     'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bomb'];


//==================================================================================
// Render shuffled cards

let display = function() {
    const shuffledList = shuffle(cardList); // get shuffled cards
    const deck = document.querySelector('.deck');
    shuffledList.forEach(function(item) {
        let newElement = document.createElement('li');
        newElement.innerHTML = '<i class="' + item + '"></i>';
        newElement.classList.add('card');
        deck.appendChild(newElement);
    });
};

document.addEventListener('DOMContentLoaded', display);
window.onload = removeLoader;

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

//========================================================================================
//                              Restart
//========================================================================================



function restart(openList,matchedList, obj) {
    // window.location.reload();
    deck.innerHTML = '';
    matchedList.length = 0;
    openList.length = 0;
    display(); // render new cards
    obj.moves = 0;
    stopWatch();
    timer = 0;
    document.querySelector('.timer').textContent = timer;
    obj.clickedOnce = false;
    stars.innerHTML = `<li><i class="fa fa-star"></i></li>
            		                                <li><i class="fa fa-star"></i></li>
            	                                	<li><i class="fa fa-star"></i></li>`;
    setScore(obj.moves);
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

function showDialog(moves) { // shows modal
    const str = `<h1>Congratulations! You Won</h1>
                            with   ${moves} moves and ${stars.childElementCount} stars in ${timer} seconds<br>
                            <button  class='play-again' onclick="closeDialog()">Play Again</button>`
    dialog.innerHTML = str;
    dialog.style.display = 'block';
    myAnimation(dialog, 'zoomIn');
}

function closeDialog() { // hides modal
    dialog.style.display = "none";
    document.querySelector('.restart').click();
}

//==================================================================================
// Remove loader

function removeLoader(){
    document.getElementById("loader-container").style.display="none";
    document.getElementById("container").removeAttribute('class');
}

//==================================================================================
// Set Score

let setScore = function(moves) {
    document.querySelector('.moves').textContent = moves;
    if (moves === 25) {
        setStars();
    }
    else if (moves === 45) {
        setStars();
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

function openCard(event,openList, matchedList, obj) {
    const target = event.target;
    if (!(target.classList.contains('open', 'show'))) { // if it doesn't contain open, show
        if (target.nodeName === 'LI') { // only if 'li' is clicked
            if (obj.clickedOnce === false) {
                obj.clickedOnce = true;
                startWatch();
            }
            obj.moves++;
            setScore(obj.moves);
            if (openList.length < 2) { // when open list '1' or 'no' items

                // when 1 item in openlist and it is same as target
                if (openList.length > 0 && target.firstElementChild.className === openList[0].firstElementChild.className) {
                    target.classList.add('show', 'open', 'match', 'animated');
                    myAnimation(target, 'rubberBand');
                    var item = openList.pop();
                    item.classList.add('match');
                    myAnimation(item, 'rubberBand');
                    matchedList.push(item, target); // add items into matched list
                }
                else { // when item 'unmatched'   or '0' item in openlist

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
            showDialog(obj.moves);
        }
    }
};


(function (){
    let openList    =   [],
    matchedList = [],
    obj = {clickedOnce: false, moves: 0};
    deck.onclick = function(e){
        openCard(e,openList, matchedList, obj);
    }; // on clicking card
    document.querySelector('.restart').onclick = function(e){
        restart(openList, matchedList, obj);
    }
})();



// arrays are passed by ref by default
// objects are passed by ref
// primitives are always passed by value