/*
GamePlay-
1. init- 
    a. make array x by y, random 1-9 int
2. display in div or table?
3. draggible div? Clickable?
4. evaluate two cells in array
    a. right proximity?
    b. value match
        i. both same?
        ii. sum = 10?
    c. display results
        i. failure!
        ii. success - redraw table removing two matches
    d. how many cells left?
        i. =0, win game!
*/

function rightProximity() {
    return false
}

function valueMatch() {
    return false
}

function howBigTable() {
    return false
}

function showFailure() {
    return false
}

function showSuccess() {
    return false
}

//helpful pages - 
//https://www.javascripttutorial.net/javascript-multidimensional-array/
//https://www.w3schools.com/js/default.asp

//game table will be 10 columns by 20 rows, 
//the display will be verticle where the columns get shorter as numbers are matched
//make each column with 20 random numbers less than 10
let gameTable = [
    column0 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9)),
    column1 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9)),
    column2 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9)),
    column3 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9)),
    column4 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9)),
]

// loop the outer array
let text = ""
for (let i = 0; i < gameTable.length; i++) {
    // get the size of the inner array
    var innerArrayLength = gameTable[i].length;
    // loop the inner array
    for (let j = 0; j < innerArrayLength; j++) {
        //make the game table into HTML to be displayed
        text += '<div class=gamePiece id=' + i + j + ' draggable="true"><h3>' + gameTable[i][j] + '</h3></div>';
    }
}
//put the pieces into the game area on the HTML page
document.getElementById("gameArea").innerHTML += text

//drag and drop - https://www.w3schools.com/html/html5_draganddrop.asp or 
//https://web.dev/drag-and-drop/
document.addEventListener('DOMContentLoaded', (event) => {
    //build out the drag and drop functions when the page is loaded
    function handleDragStart(e) {
        //make slightly transparent and store the object being drug
        this.style.opacity = '0.4';
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
            //default is to try and load the dropped item as a URL
        }
        //this.classList.add('eval');
        return false;
    }

    function handleDragEnter(e) {
        //change color for feedback that something is happening
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        //restore color for feedback that something is happening
        this.classList.remove('over');
    }

    function handleDragEnd(e) {
        //restore to no transparency
        this.style.opacity = '1';
        items.forEach(function (item) {
            //change color for feedback that something is happening
            item.classList.remove('over');
        });
    }

    function handleDrop(e) {
        e.stopPropagation(); // stops the browser from redirecting.
        if (dragSrcEl !== this) {
            //if you didn't drop back in same place, do this-
            dragSrcEl.innerHTML = this.innerHTML;
            document.getElementById("results").innerHTML = 'from: ' + dragSrcEl.id + ' to: ' + this.id;
        }
        return false;
    }

    let items = document.querySelectorAll('.gamePiece');
    //load up each game piece with events
    items.forEach(function (item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });
});
