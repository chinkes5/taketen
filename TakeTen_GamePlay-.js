function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
        // console.log('waiting');
    } while (currentDate - date < milliseconds);
}

function rightProximity(row1, column1, row2, column2, boxsize) {
    //eval each row and column separately but both must be true to pass
    let thresholdX = boxsize.width * 1.7;
    // console.log('x distance: ' + row1 + ' - ' + row2 + ' = ' + (row1 - row2));
    // console.log('max range: ' + thresholdX);
    // console.log(thresholdX > (row1 - row2));
    // console.log(-thresholdX < (row1 - row2));
    if (thresholdX > (row1 - row2) && -thresholdX < (row1 - row2)) {
        row = true;
    }
    else {
        row = false;
        //console.log('too far X');
    }
    let thresholdY = boxsize.height * 1.7;
    // console.log('y distance: ' + column1 + ' - ' + column2 + ' = ' + (column1 - column2));
    // console.log('max range: ' + thresholdY);
    // console.log(thresholdY < (column1 - column2));
    // console.log(-thresholdY < (column1 - column2));
    if (thresholdY > (column1 - column2) && -thresholdY < (column1 - column2)) {
        column = true;
    }
    else {
        column = false;
        //console.log('too far Y');
    }
    //logical conjunction for a set of Boolean operands will be true 
    //if and only if all the operands are true. Otherwise it will be false.
    return row && column
}

function valueMatch(cell1, cell2) {
    if (parseInt(cell1) + parseInt(cell2) == 10) {
        // console.log('value matched as total of 10');
        return 'ten';
    }
    if (cell1 == cell2) {
        // console.log('value matched as pair');
        return 'pair';
    }
    // console.log('got: ' + cell1 + ' and ' + cell2 + ' so no match...');
    return false;
}

function removeCells(cell1ID, cell2ID) {
    document.getElementById(cell1ID).remove();
    document.getElementById(cell2ID).remove();
    // console.log('removed ' + cell1ID + ' and ' + cell2ID);
}

//helpful pages - 
//https://www.javascripttutorial.net/javascript-multidimensional-array/
//https://www.w3schools.com/js/default.asp

//game table will be 5 columns by 20 rows, 
//the display will be verticle where the columns get shorter as numbers are matched
//make each column with 20 random numbers less than 10
let gameTable = [
    column0 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
    column1 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
    column2 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
    column3 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
    column4 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
    column5 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)),
]

// loop the outer array to build the columns
let text = ""
for (let i = 0; i < gameTable.length; i++) {
    // get the size of the inner array
    var innerArrayLength = gameTable[i].length;
    text += '<div class=column>'; // + i + '>'
    // loop the inner array to build the rows
    for (let j = 0; j < innerArrayLength; j++) {
        //make the game table into HTML to be displayed
        text += '<div class=gamePiece id=' + i + '-' + j + ' draggable="true">' + gameTable[i][j] + '</div>';
    }
    text += '</div>';
}
//put the pieces into the game area on the HTML page
document.getElementById("gameArea").innerHTML += text;
document.getElementById("score").innerHTML = 0;

//set the boxsize to use when evaluating proximity
let boxsize = document.getElementById('0-0').getBoundingClientRect();

const container = document.querySelector('.gameArea');
container.addEventListener('pointerdown', userPressed, { passive: true });
function userPressed(event) {
    element = event.target;
    if (element.classList.contains('gamePiece')) {
        console.log("pick up!")
        container.addEventListener('pointermove', userMoved, { passive: true });
        container.addEventListener('pointerup', userReleased, { passive: true });
        container.addEventListener('pointercancel', userReleased, { passive: true });
    };
};

var element, bbox, startX, startY;

function userPressed(event) {
    element = event.target;
    if (element.classList.contains('gamePiece')) {
        startX = event.clientX;
        startY = event.clientY;
        startPosition = this.getBoundingClientRect();
        bbox = element.getBoundingClientRect();
        container.addEventListener('pointermove', userMoved, { passive: true });
        container.addEventListener('pointerup', userReleased, { passive: true });
        container.addEventListener('pointercancel', userReleased, { passive: true });
        this.classList.add('over');
    };
};

function userMoved(event) {
    let deltaX = event.clientX - startX;
    let deltaY = event.clientY - startY;
    element.style.left = bbox.left + deltaX + "px";
    element.style.top = bbox.top + deltaY + "px";
};

function userReleased(event) {
    container.removeEventListener('pointermove', userMoved);
    container.removeEventListener('pointerup', userReleased);
    container.removeEventListener('pointercancel', userReleased);
    endPosition = this.getBoundingClientRect();

    let showResults = rightProximity(startPosition.x, startPosition.y, endPosition.x, endPosition.y, boxsize);
    if (showResults) {
        switch (valueMatch(dragSrcEl.innerHTML, this.innerHTML)) {
            case 'ten':
                // console.log('this is correct! Show response!')
                dragSrcEl.classList.add('right');
                this.classList.add('right');

                score = document.getElementById("score").innerHTML;
                // console.log('score is - ' + parseInt(score));
                document.getElementById("score").innerHTML = parseInt(score) + 10;
                sleep(500);
                removeCells(dragSrcEl.id, this.id);
                break;
            case 'pair':
                // console.log('this is correct! Show response!');
                dragSrcEl.classList.add('right');
                this.classList.add('right');

                score = document.getElementById("score").innerHTML;
                // console.log('score is - ' + parseInt(score));
                document.getElementById("score").innerHTML = parseInt(score) + 8;

                sleep(500);
                removeCells(dragSrcEl.id, this.id);
                break;
            default:
                // console.log('no match but should drop out of this switch')
                break;
        }
    } else {
        console.log('got it wrong. Show response!');
        dragSrcEl.classList.add('wrong');
        this.classList.add('wrong');
    }
    this.classList.remove('over');
};