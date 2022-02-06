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

function rightProximity(row1, column1, row2, column2) {
    //eval each row and column separately but both must be true to pass
    switch (row1 - row2){
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
    switch (column1 - column2) {
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
    if(cell1 + cell2 === 10){
        return 'ten'
    }
    if (cell1 === cell2) {
        return 'pair'
    }
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
    text += '<div class=column>' // + i + '>'
    // loop the inner array
    for (let j = 0; j < innerArrayLength; j++) {
        //make the game table into HTML to be displayed
        text += '<div class=gamePiece id=' + i + '-' + j + ' draggable="true"><h3>' + gameTable[i][j] + '</h3></div>';
    }
    text += '</div>'
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
            //dragSrcEl.innerHTML = this.innerHTML;
            let cell1 = dragSrcEl.id.split("-");
            let cell2 = this.id.split("-");
            let showResults = rightProximity(cell1[0], cell1[1], cell2[0], cell2[1]);
            if (showResults) {
                switch (valueMatch(dragSRCEl.innerHTML, this.innerHTML)) {
                    case 'ten':
                        //this is correct! Show response!
                        dragSrcEl.classList.add('right');
                        this.classList.add('right');
                        break;
                    case 'pair':
                        //this is correct! Show response!
                        dragSrcEl.classList.add('right');
                        this.classList.add('right');
                        break;
                    default:
                        console.log('no match but should drop out of this switch')
                        break;
                }

                dragSrcEl.classList.remove('right');
                this.classList.remove('right');

            } else {
                //you got it wrong, show response!
                dragSrcEl.classList.add('wrong');
                this.classList.add('wrong');

                dragSrcEl.classList.remove('wrong');
                this.classList.remove('wrong');
                
            }
            document.getElementById("results").innerHTML = 'from: ' + dragSrcEl.id + ' to: ' + this.id + '<br>' + showResults;
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
