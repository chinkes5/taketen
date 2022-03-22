//#################################
//## copyright 2022 John Chinkes ##
//#################################

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
    if (thresholdX > (row1 - row2) && -thresholdX < (row1 - row2)) {
        row = true;
    }
    else {
        row = false;
        //console.log('too far X');
    }
    let thresholdY = boxsize.height * 1.7;
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

function setScore(element, addPoints) {
    score = document.getElementById(element).innerHTML;
    document.getElementById(element).innerHTML = parseInt(score) + addPoints;
}

function removeCells(cell1ID, cell2ID) {
    document.getElementById(cell1ID).remove();
    document.getElementById(cell2ID).remove();
}

function showSuccess(source, target, addPoints){
    //make flashy-flashy green lights here!
    setScore("score", addPoints);
    // console.log('score is - ' + parseInt(score));
    sleep(500)
    removeCells(source.id, target.id);
    // console.log('removed ' + cell1ID + ' and ' + cell2ID);

}

function showFailure(source, target){
    //make flashy-flashy red lights here.
    console.log('Did not match ' + source + ' and ' + target)
}

function evaluateDrop(source, target) {
    switch (valueMatch(source.innerHTML, target.innerHTML)) {
        case 'ten':
            source.classList.add('right');
            target.classList.add('right');
            showSuccess(source, target, 10)
            break;
        case 'pair':
            source.classList.add('right');
            target.classList.add('right');
            showSuccess(source, target, 8)
            break;
        default:
            showFailure(source, target)
            break;
    }
}

//helpful pages - 
//https://www.javascripttutorial.net/javascript-multidimensional-array/
//https://www.w3schools.com/js/default.asp

//game table will be 6 columns by 20 rows, 
//the display will be verticle where the columns get shorter as numbers are matched
//make each column with 20 random numbers between 1 and 9
let gameTable = [
    column0 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column1 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column2 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column3 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column4 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column5 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
]

let text = ""
// loop the outer array to build the columns
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

//dragging and touching functionality
//from: https://github.com/marcospont/agnostic-draggable 
//and https://www.cssscript.com/draggable-droppable-sortable-agnostic/
new Draggable(document.querySelector('.gamePiece'), 
    {
        appendTo: 'gameArea',
        cursor: 'move',
        opacity: 0.6,
        revert: true,
        scope: 'gamePiece'
    },
    {
          'drag:move': function (event) {
            // do something
          },
    }
);

new Droppable(document.querySelector('.gamePiece'), 
    {
        scope: 'gamePiece'
    },
    {
    'droppable:init': function (event) {
        // do something
    },
    'droppable:activate': function (event) {
        // do something
    },
    'droppable:drop': function (event) {
        evaluateDrop(draggable, Droppable)
    },
    'droppable:out': function (event) {
        // do something
    },
});