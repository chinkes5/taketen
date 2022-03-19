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

//https://github.com/bevacqua/dragula
dragula([document.querySelector('.gamePiece')], {
    // determine whether to copy elements rather than moving
    copy: false,
    // spilling will put the element back where it was dragged from, if this is true
    revertOnSpill: true,
    // spilling will `.remove` the element, if this is true
    removeOnSpill: false,
    // allows users to select the amount of movement on the X axis before it is considered a drag instead of a click   
    slideFactorX: 0,
    // allows users to select the amount of movement on the Y axis before it is considered a drag instead of a click      
    slideFactorY: 0,
    // only elements in drake.containers will be taken into account
    isContainer: function (el) {
        return false;
    },
    // elements are always draggable by default
    moves: function (el, source, handle, sibling) {
        return true;
    },
    // elements can be dropped in any of the `containers` by default
    accepts: function (el, target, source, sibling) {
        return true;
    },
    // don't prevent any drags from initiating by default
    invalid: function (el, handle) {
        return false;
    }
}).on('drag', function (el, source) {
    dragSrcEl = el;
    startPosition = el.getBoundingClientRect();
}).on('dragend', function (el) {
    // do something
}).on('drop', function (el, target, source, sibling) {
    if (target !== source) {
        //if you didn't drop back in same place, do this-
        endPosition = target.getBoundingClientRect();

        let showResults = rightProximity(startPosition.x, startPosition.y, endPosition.x, endPosition.y, boxsize);
        if (showResults) {
            evaluateDrop(source, target);
        } else {
            console.log('got it wrong. Show response!');
            source.classList.add('wrong');
            el.classList.add('wrong');
        }
    }
}).on('over', function (el, container, source) {
    el.classList.add('over');
}).on('out', function (el, container, source) {
    el.classList.remove('over');
});

