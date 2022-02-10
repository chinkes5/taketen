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
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
        console.log('waiting')
    } while (currentDate - date < milliseconds);
}

function rightProximity(row1, column1, row2, column2) {
    //eval each row and column separately but both must be true to pass
    let boxsize = document.getElementById('0-0').getBoundingClientRect();
    switch ((boxsize.width*1.2)-(row1 - row2)) {
        case -1:
            row = true;
            break;
        case 0:
            row = true;
            break;
        case 1:
            row = true;
            break;
        default:
            row = false;
    }
    switch ((boxsize.height*1.2)-(column1 - column2)) {
        case -1:
            column = true;
            break;
        case 0:
            column = true;
            break;
        case 1:
            column = true;
            break;
        default:
            column = false;
    }
    //logical conjunction for a set of Boolean operands will be true 
    //if and only if all the operands are true. Otherwise it will be false.
    return row && column
}

function valueMatch(cell1, cell2) {
    if (parseInt(cell1) + parseInt(cell2) == 10) {
        console.log('value matched as total of 10')
        return 'ten'
    }
    if (cell1 == cell2) {
        console.log('value matched as pair')
        return 'pair'
    }
    console.log('got: ' + cell1 + ' and ' + cell2 + ' so no match...')
    return false
}

function howBigTable() {
    return false
}

function removeCells(cell1ID, cell2ID) {
    document.getElementById(cell1ID).remove();
    document.getElementById(cell2ID).remove();
    console.log('removed ' + cell1ID + ' and ' + cell2ID)
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
    text += '<div class=column>' // + i + '>'
    // loop the inner array
    for (let j = 0; j < innerArrayLength; j++) {
        //make the game table into HTML to be displayed
        text += '<div class=gamePiece id=' + i + '-' + j + ' draggable="true">' + gameTable[i][j] + '</div>';
    }
    text += '</div>'
}
//put the pieces into the game area on the HTML page
document.getElementById("gameArea").innerHTML += text
document.getElementById("score").innerHTML = 0

//drag and drop - https://www.w3schools.com/html/html5_draganddrop.asp or 
//https://web.dev/drag-and-drop/
document.addEventListener('DOMContentLoaded', (event) => {
    //build out the drag and drop functions when the page is loaded
    function handleDragStart(e) {
        //make slightly transparent and store the object being drug
        this.style.opacity = '0.4';
        dragSrcEl = this;
        startPosition = this.getBoundingClientRect();

        e.dataTransfer.effectAllowed = 'move';
        //don't think I need this, not moving the cell value into the other 
        // e.dataTransfer.setData('text/html', this.innerHTML);
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
            //default is to try and load the dropped item as a URL
        }
        // this.classList.add('under');
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

            //dragSrcEl.innerHTML = this.innerHTML;
            endPosition = this.getBoundingClientRect();

            let showResults = rightProximity(startPosition.x, endPosition.x, startPosition.y, endPosition.y);
            if (showResults) {
                switch (valueMatch(dragSrcEl.innerHTML, this.innerHTML)) {
                    case 'ten':
                        console.log('this is correct! Show response!')
                        dragSrcEl.classList.add('right');
                        this.classList.add('right');

                        score = document.getElementById("score").innerHTML + 10;
                        document.getElementById("score").innerHTML = score;
                        sleep(500);
                        removeCells(dragSrcEl.id, this.id)
                        break;
                    case 'pair':
                        console.log('this is correct! Show response!')
                        dragSrcEl.classList.add('right');
                        this.classList.add('right');

                        score = document.getElementById("score").innerHTML + 8;
                        document.getElementById("score").innerHTML = score;

                        sleep(500);
                        removeCells(dragSrcEl.id, this.id)
                        break;
                    default:
                        console.log('no match but should drop out of this switch')
                        break;
                }
            } else {
                console.log('got it wrong. Show response!')
                dragSrcEl.classList.add('wrong');
                this.classList.add('wrong');

                sleep(500);

                // dragSrcEl.classList.remove('wrong');
                // this.classList.remove('wrong');

            }
            //document.getElementById("results").innerHTML = 'from: ' + dragSrcEl.id + ' to: ' + this.id + '<br>' + showResults;
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
