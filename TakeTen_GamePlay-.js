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

function removeCells(cell1ID, cell2ID) {
    document.getElementById(cell1ID).remove();
    document.getElementById(cell2ID).remove();
    // console.log('removed ' + cell1ID + ' and ' + cell2ID);
}

function evaluateDrop(source, target) {
    switch (valueMatch(source.innerHTML, target.innerHTML)) {
        case 'ten':
            // console.log('this is correct! Show response!')
            source.classList.add('right');
            target.classList.add('right');

            score = document.getElementById("score").innerHTML;
            // console.log('score is - ' + parseInt(score));
            document.getElementById("score").innerHTML = parseInt(score) + 10;
            sleep(500);
            removeCells(source.id, target.id);
            break;
        case 'pair':
            // console.log('this is correct! Show response!');
            source.classList.add('right');
            target.classList.add('right');

            score = document.getElementById("score").innerHTML;
            // console.log('score is - ' + parseInt(score));
            document.getElementById("score").innerHTML = parseInt(score) + 8;

            sleep(500);
            removeCells(source.id, target.id);
            break;
        default:
            // console.log('no match but should drop out of this switch')
            break;
    }
}

//helpful pages - 
//https://www.javascripttutorial.net/javascript-multidimensional-array/
//https://www.w3schools.com/js/default.asp

//game table will be 5 columns by 20 rows, 
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

const position = { x: 0, y: 0 }
interact('.gamePiece').draggable({
    listeners: {
        start(event) {
            console.log(event.type, event.target)
        },
        move(event) {
            position.x += event.dx
            position.y += event.dy
            event.target.style.transform = 'translate(${position.x}pz, ${position.y}px)'
            event.target.classList.add('over')
        },
    }
})
interact('.gamePiece').dropzone({
    ondrop: function (event) {
        let showResults = rightProximity(event.target.x, event.target.y, event.relatedTarget.x, event.relatedTarget.y, boxsize);
        if (showResults) {
            evaluateDrop(event.relatedTarget, event.target);
        } else {
            console.log('got it wrong. Show response!');
            event.relatedTarget.classList.add('wrong');
            event.target.classList.add('wrong');
        }
    }
})
    .on('dropactivate', function (event) {
        event.target.classList.add('over')
    })
