//#################################
//## copyright 2022 John Chinkes ##
//#################################

// --- Game Logic Functions (Keep these as they are) ---
function rightProximity(row1, column1, row2, column2, boxsize) {
    let row = false;
    let column = false;
    let thresholdX = boxsize.width * 1.7;
    if (thresholdX > (row1 - row2) && -thresholdX < (row1 - row2)) {
        row = true;
    }
    let thresholdY = boxsize.height * 1.7;
    if (thresholdY > (column1 - column2) && -thresholdY < (column1 - column2)) {
        column = true;
    }
    return row && column;
};

function valueMatch(cell1, cell2) {
    if (parseInt(cell1) + parseInt(cell2) == 10) {
        return 'ten';
    }
    if (cell1 == cell2) {
        return 'pair';
    }
    return false;
};

function setScore(element, addPoints) {
    const scoreElement = document.getElementById(element); // Cache element
    if (scoreElement) {
        let score = parseInt(scoreElement.innerHTML) || 0; // Handle potential NaN
        scoreElement.innerHTML = score + addPoints;
    }
};

function removeCells(cell1ID, cell2ID) {
    const cell1 = document.getElementById(cell1ID);
    const cell2 = document.getElementById(cell2ID);
    if (cell1) cell1.remove();
    if (cell2) cell2.remove();
};

function showSuccess(source, target, addPoints) {
    console.log(source.innerHTML + ' and ' + target.innerHTML + ' matched :-)');
    // Add 'right' class for visual feedback (optional, can be timed)
    source.classList.add('right');
    target.classList.add('right');
    // Consider a slight delay before removing if using CSS transitions/animations
    // setTimeout(() => {
    setScore("score", addPoints);
    removeCells(source.id, target.id);
    // }, 300); // Example delay
};

function showFailure(source, target, reasonCode) {
    switch (reasonCode) {
        case 0:
            console.log(source.innerHTML + ' and ' + target.innerHTML + ' did not match :-(');
            break;
        case 1:
            console.log('cells were too far apart :-(');
            break;
    };
    source.classList.add('wrong');
    target.classList.add('wrong');
    // Remove 'wrong' class after a short delay
    setTimeout(() => {
        source.classList.remove('wrong');
        target.classList.remove('wrong');
    }, 500); // Adjust timing as needed
};

function evaluateDrop(source, target) {
    // Ensure both elements still exist in the DOM before proceeding
    if (!document.body.contains(source) || !document.body.contains(target)) {
        console.log("One or both elements removed before evaluation.");
        return;
    }
    const startPosition = source.getBoundingClientRect();
    const endPosition = target.getBoundingClientRect();
    if (rightProximity(startPosition.x, startPosition.y, endPosition.x, endPosition.y, boxsize)) {
        switch (valueMatch(source.innerHTML, target.innerHTML)) {
            case 'ten':
                showSuccess(source, target, 10);
                break;
            case 'pair':
                showSuccess(source, target, 8);
                break;
            default:
                showFailure(source, target, 0);
                break;
        };
    } else {
        showFailure(source, target, 1);
    };
};

// --- State Variables for Drag/Touch ---
let dragSource = null; // For mouse drag-and-drop
let touchSourceElement = null; // For touch interaction
let currentTouchTarget = null; // For touch interaction

// --- Mouse Drag-and-Drop Event Handlers ---
function handleDragStart(event) {
    // Use dragstart to initiate
    dragSource = event.target;
    event.dataTransfer.setData('text/plain', dragSource.id);
    event.dataTransfer.effectAllowed = 'move';
    dragSource.classList.add('over');
    dragSource.classList.remove('under', 'wrong');
};

function handleDragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
    const target = event.target;
    if (target.classList.contains('gamePiece') && target !== dragSource) {
        event.dataTransfer.dropEffect = 'move';
        target.classList.add('under');
        target.classList.remove('wrong');
    } else {
        event.dataTransfer.dropEffect = 'none';
    }
};

function handleDragLeave(event) {
    // Use dragleave instead of dragout for better consistency
    const target = event.target;
    if (target.classList.contains('gamePiece')) {
        target.classList.remove('under', 'wrong');
    }
};

function handleDrop(event) {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('gamePiece') && dragSource && dragSource !== target) {
        evaluateDrop(dragSource, target);
    }
    // Cleanup styles
    if (target.classList.contains('gamePiece')) {
        target.classList.remove('under');
    }
    if (dragSource) {
        dragSource.classList.remove('over');
    }
    dragSource = null; // Reset mouse drag source
};

function handleDragEnd(event) {
    // Clean up if the drag is cancelled or finishes elsewhere
    if (dragSource) {
        dragSource.classList.remove('over');
    }
    // Remove any lingering 'under' styles
    document.querySelectorAll('.gamePiece.under').forEach(el => el.classList.remove('under'));
    dragSource = null;
}


// --- Touch Event Handlers ---
function handleTouchStart(event) {
    const target = event.target;
    if (!target.classList.contains('gamePiece')) return;

    // Prevent default touch actions like scrolling
    event.preventDefault();

    touchSourceElement = target;
    touchSourceElement.classList.add('over'); // Style as being dragged
    touchSourceElement.classList.remove('under', 'wrong');
    console.log("Touch Start:", touchSourceElement.id);
}

function handleTouchMove(event) {
    if (!touchSourceElement) return;

    // Prevent scrolling while dragging
    event.preventDefault();

    // Get current touch coordinates
    const touch = event.changedTouches[0];
    const touchX = touch.pageX;
    const touchY = touch.pageY;

    // Find the element directly under the finger
    // Temporarily hide the source element so elementFromPoint doesn't pick it
    touchSourceElement.style.visibility = 'hidden';
    let elementUnderFinger = document.elementFromPoint(touchX, touchY);
    touchSourceElement.style.visibility = 'visible'; // Make it visible again

    // Clear previous target styling ONLY if the element under finger changed
    if (currentTouchTarget && currentTouchTarget !== elementUnderFinger) {
        currentTouchTarget.classList.remove('under', 'wrong');
        currentTouchTarget = null; // Reset if we moved off
    }

    // Check if we are over a *different* game piece
    if (elementUnderFinger && elementUnderFinger.classList.contains('gamePiece') && elementUnderFinger !== touchSourceElement) {
        // Only update if it's a new target
        if (currentTouchTarget !== elementUnderFinger) {
            currentTouchTarget = elementUnderFinger;
            currentTouchTarget.classList.add('under'); // Style as potential drop target
            currentTouchTarget.classList.remove('wrong');
            console.log("Touch Move Over:", currentTouchTarget.id);
        }
    } else {
        // If we are not over a valid target, ensure currentTouchTarget is null
        if (currentTouchTarget) {
            currentTouchTarget.classList.remove('under', 'wrong');
            currentTouchTarget = null;
        }
    }
}

function handleTouchEnd(event) {
    if (!touchSourceElement) return;

    // Optional: prevent default if needed, though often not required for touchend
    // event.preventDefault();

    console.log("Touch End");

    // Check if we ended over a valid target identified during touchmove
    if (currentTouchTarget) {
        console.log("Dropping (touch) onto:", currentTouchTarget.id);
        evaluateDrop(touchSourceElement, currentTouchTarget);
        currentTouchTarget.classList.remove('under'); // Clean up target style
    } else {
        console.log("Touch ended, no valid target.");
        // Optional: Add visual feedback if the drop was invalid (e.g., animate back)
        touchSourceElement.classList.remove('wrong'); // Ensure no lingering wrong style
    }

    // General cleanup for the source element
    touchSourceElement.classList.remove('over');

    // Reset touch state variables
    touchSourceElement = null;
    currentTouchTarget = null;
}

function handleTouchCancel(event) {
    // Treat cancel the same as end for cleanup purposes
    handleTouchEnd(event);
    console.log("Touch Cancelled");
}


// --- Game Setup ---
let gameTable = [
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
    Array.from({ length: 20 }, () => Math.floor(Math.random() * 9) + 1),
];

let text = "";
for (let i = 0; i < gameTable.length; i++) {
    text += `<div class="column">`; // Use template literal for cleaner HTML string
    for (let j = 0; j < gameTable[i].length; j++) {
        text += `<div class="gamePiece" id="${i}-${j}">${gameTable[i][j]}</div>`;
    }
    text += `</div>`;
};

document.getElementById("gameArea").innerHTML = text; // Use = instead of += to replace content
document.getElementById("score").innerHTML = 0;

// Calculate boxsize *after* elements are added to the DOM
let boxsize = document.getElementById('0-0')?.getBoundingClientRect(); // Use optional chaining in case '0-0' doesn't exist
if (!boxsize) {
    console.error("Could not find element '0-0' to determine box size.");
    // Provide a default or handle the error appropriately
    boxsize = { width: 50, height: 50 }; // Example default
}


// --- Add Event Listeners ---
document.querySelectorAll(".gamePiece").forEach(element => { // Use querySelectorAll for robustness
    // Make draggable for mouse users
    element.draggable = true;

    // Mouse Events
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd); // Add dragend for cleanup

    // Touch Events
    // Use { passive: false } to allow preventDefault() inside handlers
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchCancel); // Handle cancelled touches
});

// --- Small fix for ui.js event listeners ---
// GetElementsByClassName returns a collection, you need to loop or get the first item
// Assuming you have only one element for each class:
const closeButton = document.querySelector(".closebtn"); // Use querySelector
const openButton = document.querySelector(".openbtn");   // Use querySelector

if (closeButton) {
    closeButton.addEventListener('click', closeNav);
    closeButton.addEventListener('touchstart', closeNav); // Correct event name
}
if (openButton) {
    openButton.addEventListener('click', openNav);
    openButton.addEventListener('touchstart', openNav);   // Correct event name
}
// Make sure openNav and closeNav are defined (presumably in ui.js or globally)
// Example definitions if not already present:
/*
function openNav() {
    const sidebar = document.getElementById("sidebarCell");
    if (sidebar) sidebar.style.width = "350px";
}
function closeNav() {
    const sidebar = document.getElementById("sidebarCell");
    if (sidebar) sidebar.style.width = "0";
}
*/
