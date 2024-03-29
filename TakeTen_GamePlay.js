//#################################
//## copyright 2022 John Chinkes ##
//#################################

//functions to make the game logic
function rightProximity(row1, column1, row2, column2, boxsize) {
    let row = false;
    let column = false;
    //eval each row and column separately but both must be true to pass
    let thresholdX = boxsize.width * 1.7;
    if (thresholdX > (row1 - row2) && -thresholdX < (row1 - row2)) {
        row = true;
    }
    let thresholdY = boxsize.height * 1.7;
    if (thresholdY > (column1 - column2) && -thresholdY < (column1 - column2)) {
        column = true;
    }
    //logical conjunction for a set of Boolean operands will be true 
    //if and only if all the operands are true. Otherwise it will be false.
    return row && column
};

function valueMatch(cell1, cell2) {
    if (parseInt(cell1) + parseInt(cell2) == 10) {
        // console.log('value matched as total of 10');
        return 'ten';
    }
    if (cell1 == cell2) {
        // console.log('value matched as pair');
        return 'pair';
    }
    return false;
};

function setScore(element, addPoints) {
    score = document.getElementById(element).innerHTML;
    document.getElementById(element).innerHTML = parseInt(score) + addPoints;
};

function removeCells(cell1ID, cell2ID) {
    document.getElementById(cell1ID).remove();
    document.getElementById(cell2ID).remove();
};

function showSuccess(source, target, addPoints){
    //make flashy-flashy green lights here!
    console.log(source.innerHTML + ' and ' + target.innerHTML +' matched :-)' )
    setScore("score", addPoints);
    removeCells(source.id, target.id);
};

function showFailure(source, target, reasonCode){
    //make flashy-flashy red lights here.
    switch(reasonCode){
        case 0:
            console.log(source.innerHTML + ' and ' + target.innerHTML +' did not match :-(' );
            break;
        case 1:
            console.log('cells were too far apart :-(');
            break;
    };    
    source.classList.add('wrong');
    target.classList.add('wrong');
};

function evaluateDrop(source, target) {
    startPosition = source.getBoundingClientRect();
    endPosition = target.getBoundingClientRect();
    if(rightProximity(startPosition.x, startPosition.y, endPosition.x, endPosition.y, boxsize)){
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
                showFailure(source, target, 0)
                break;
        };
    }
    else {
        showFailure(source, target, 1)
    };
};

//functions to get the game play events to execute the logic
function dragging(event){
    event.target.classList.add('over');
    event.target.classList.remove('under');
    event.target.classList.remove('wrong');
    dragSource = event.target

    return false;
};

function dragOver(event){
    event.preventDefault();
    event.target.classList.add('under')
    event.target.classList.remove('wrong');
};

function dragOut(event){
    event.preventDefault();
    event.target.classList.remove('under');
    event.target.classList.remove('wrong');
};

function dropping(event){
    event.preventDefault();
    if(dragSource !== event.target){
        //can't drop on yourself!
        evaluateDrop(dragSource,event.target);
    }
    event.target.classList.remove('under');
    dragSource.classList.remove('under');
}

//game table will be 6 columns by 20 rows, 
//make each column with 20 random numbers between 1 and 9
let gameTable = [
    column0 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column1 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column2 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column3 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column4 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    column5 = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
];

// loop the outer array to build the columns
let text = ""
for (let i = 0; i < gameTable.length; i++) {
    // get the size of the inner array
    var innerArrayLength = gameTable[i].length;
    text += '<div class=column>'; // + i + '>'
    // loop the inner array to build the rows
    for (let j = 0; j < innerArrayLength; j++) {
        //make the game table into HTML to be displayed
        text += '<div class=gamePiece id=' + i + '-' + j + ' \
        >' + gameTable[i][j] + '</div>';
    }
    text += '</div>';
};
//put the pieces into the game area on the HTML page
document.getElementById("gameArea").innerHTML += text;
document.getElementById("score").innerHTML = 0;

//set the boxsize to use when evaluating proximity
let boxsize = document.getElementById('0-0').getBoundingClientRect();

    //loop thru the game pieces and add the drag 'n drop events
[...document.getElementsByClassName("gamePiece")].forEach(element => {
    element.draggable = true;
    element.addEventListener('dragover', dragOver);
    element.addEventListener('drag', dragging);
    element.addEventListener('dragleave', dragOut);
    element.addEventListener('drop', dropping);
    element.addEventListener('ontouchstart', dragging);
    element.addEventListener('ontouchmove', dragging);
    element.addEventListener('ontouchend', dropping);
    element.addEventListener('ontouchcancel', dropping);
});