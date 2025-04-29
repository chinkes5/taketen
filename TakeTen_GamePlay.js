// Keep track of the element being touched/dragged
let touchSourceElement = null;
// Keep track of the element currently under the finger
let currentTouchTarget = null;

function handleTouchStart(event) {
    // Prevent default touch action (like scrolling)
    event.preventDefault();
    const target = event.target;
    if (!target.classList.contains('gamePiece')) return; // Only drag game pieces

    touchSourceElement = target;
    touchSourceElement.classList.add('over'); // Style as being dragged
    touchSourceElement.classList.remove('wrong');

    // Optional: You might want to create a visual clone or slightly change
    // the appearance of the source element here (e.g., lower opacity)
    // For simplicity, we'll just use classes for now.

    console.log("Touch Start:", touchSourceElement.id);
}

function handleTouchMove(event) {
    if (!touchSourceElement) return;

    // Prevent scrolling while dragging
    event.preventDefault();

    // Get current touch coordinates
    const touchX = event.changedTouches[0].pageX;
    const touchY = event.changedTouches[0].pageY;

    // Find the element directly under the finger
    // Temporarily hide the source element so elementFromPoint doesn't pick it
    touchSourceElement.style.visibility = 'hidden';
    let elementUnderFinger = document.elementFromPoint(touchX, touchY);
    touchSourceElement.style.visibility = 'visible'; // Make it visible again

    // Clear previous target styling
    if (currentTouchTarget && currentTouchTarget !== elementUnderFinger) {
        currentTouchTarget.classList.remove('under');
        currentTouchTarget.classList.remove('wrong');
    }

    if (elementUnderFinger && elementUnderFinger.classList.contains('gamePiece') && elementUnderFinger !== touchSourceElement) {
        // We are over a potential target
        currentTouchTarget = elementUnderFinger;
        currentTouchTarget.classList.add('under'); // Style as potential drop target
        currentTouchTarget.classList.remove('wrong');
        console.log("Touch Move Over:", currentTouchTarget.id);
    } else {
        // We are not over a valid target
        currentTouchTarget = null;
    }

    // Optional: Move a visual representation of the element
    // This is more complex, often involves cloning the element and updating its
    // position style (e.g., position: absolute, left: touchX, top: touchY)
    // For now, we focus on identifying the target.
}

function handleTouchEnd(event) {
    if (!touchSourceElement) return;

    event.preventDefault(); // Prevent potential ghost clicks

    console.log("Touch End");

    // Clear dragging styles from source
    touchSourceElement.classList.remove('over');

    // Check if we ended over a valid target
    if (currentTouchTarget) {
        console.log("Dropping onto:", currentTouchTarget.id);
        currentTouchTarget.classList.remove('under'); // Clear target styling
        // Call the evaluation logic
        evaluateDrop(touchSourceElement, currentTouchTarget);
    } else {
        console.log("Touch ended, no valid target.");
        // Optional: Add visual feedback if the drop was invalid (e.g., animate back)
    }

    // Reset state variables
    touchSourceElement = null;
    currentTouchTarget = null;
}

// --- Keep your existing evaluateDrop, valueMatch, etc. functions ---

// --- Update Event Listeners ---
//loop thru the game pieces and add the drag 'n drop AND touch events
[...document.getElementsByClassName("gamePiece")].forEach(element => {
    element.draggable = true; // Keep for desktop drag & drop

    // Mouse Events
    element.addEventListener('dragstart', dragging); // Use dragstart instead of drag for source
    element.addEventListener('dragover', dragOver);
    element.addEventListener('dragleave', dragOut);
    element.addEventListener('drop', dropping);
    // Note: You might need a dragend listener to clean up styles if a drag is cancelled
    // element.addEventListener('dragend', (event) => {
    //     event.target.classList.remove('over');
    //     // Find any elements with 'under' and remove it if needed
    // });


    // Touch Events
    element.addEventListener('touchstart', handleTouchStart, { passive: false }); // Need passive: false to call preventDefault
    element.addEventListener('touchmove', handleTouchMove, { passive: false });  // Need passive: false to call preventDefault
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd); // Handle cancelled touches too
});

// --- Minor change in dragging for consistency ---
function dragging(event) {
    // event.target.classList.add('over'); // Moved this to handleTouchStart for touch
    event.target.classList.remove('under');
    event.target.classList.remove('wrong');
    // For mouse drag, set the dataTransfer to allow the drop
    event.dataTransfer.setData('text/plain', event.target.id); // Good practice
    event.dataTransfer.effectAllowed = 'move';
    dragSource = event.target; // Keep using dragSource for mouse D&D
    dragSource.classList.add('over'); // Add 'over' style on drag start for mouse
    // return false; // Not needed with dragstart
};

// --- Adjust dropping for mouse ---
function dropping(event) {
    event.preventDefault();
    const target = event.target;
    target.classList.remove('under'); // Clean up target style

    if (dragSource && dragSource !== target) { // Check dragSource is set
        //can't drop on yourself!
        evaluateDrop(dragSource, target);
    }

    if (dragSource) {
        dragSource.classList.remove('over'); // Clean up source style
    }
    dragSource = null; // Reset dragSource for mouse D&D
}

// --- Adjust dragOut for mouse ---
function dragOut(event) {
    event.preventDefault();
    if (event.target.classList.contains('gamePiece')) {
        event.target.classList.remove('under');
        event.target.classList.remove('wrong');
    }
}

// --- Adjust dragOver for mouse ---
function dragOver(event) {
    event.preventDefault(); // Necessary to allow dropping
    if (event.target.classList.contains('gamePiece') && event.target !== dragSource) {
        event.dataTransfer.dropEffect = 'move'; // Indicate a move is possible
        event.target.classList.add('under');
        event.target.classList.remove('wrong');
    } else {
        event.dataTransfer.dropEffect = 'none'; // Indicate cannot drop here
    }
}


// --- Your existing game setup code ---
// ... (gameTable creation, HTML generation, etc.) ...

// Make sure boxsize is calculated after elements are in the DOM
let boxsize = document.getElementById('0-0').getBoundingClientRect();

// ... (rest of your code like setScore, removeCells, etc.)

// Global variable for mouse drag source (keep separate from touch)
let dragSource = null;
