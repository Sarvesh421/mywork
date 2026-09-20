// ==========================================
// SETTINGS
// ==========================================

const SIZE = 3;

// ==========================================
// 3 PUZZLE IMAGES
// ==========================================
// Put these files inside:
// games/images/

const PUZZLES = [
    "./1000012368.jpg",
    "./1000012446.jpg",
    "./1234.jpeg"
];


// ==========================================
// CURRENT PUZZLE
// ==========================================

let currentPuzzle = 0;


// ==========================================
// GET ELEMENTS
// ==========================================

const board = document.getElementById("dropZone");

const piecesContainer =
    document.getElementById("piecesContainer");

const timer =
    document.getElementById("timer");

const movesText =
    document.getElementById("moves");

const preview =
    document.getElementById("previewModal");

const previewBtn =
    document.getElementById("previewBtn");

const closePreview =
    document.getElementById("closePreview");

const restartBtn =
    document.getElementById("restartBtn");

const success =
    document.getElementById("success");

const playAgain =
    document.getElementById("playAgain");


// ==========================================
// VARIABLES
// ==========================================

let draggedPiece = null;

let moves = 0;

let seconds = 0;

let timerInterval = null;

let puzzleCompleted = false;


// ==========================================
// GET CURRENT IMAGE
// ==========================================

function getCurrentImage() {

    return PUZZLES[currentPuzzle];

}


// ==========================================
// START GAME
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    createPieces();

    setupSlots();

    startTimer();

    updatePreviewImage();

});


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);

    seconds = 0;

    if (timer) {
        timer.textContent = "00:00";
    }

    timerInterval = setInterval(() => {

        seconds++;

        const minutes =
            String(
                Math.floor(seconds / 60)
            ).padStart(2, "0");

        const secs =
            String(
                seconds % 60
            ).padStart(2, "0");

        if (timer) {

            timer.textContent =
                `${minutes}:${secs}`;

        }

    }, 1000);

}


// ==========================================
// CREATE PUZZLE PIECES
// ==========================================

function createPieces() {

    if (!piecesContainer) {
        return;
    }

    piecesContainer.innerHTML = "";

    let order = [];

    // Create 0 - 8
    for (let i = 0; i < SIZE * SIZE; i++) {

        order.push(i);

    }

    // Shuffle
    shuffle(order);


    // Create pieces
    order.forEach(index => {

        const piece =
            document.createElement("div");

        piece.className = "piece";

        piece.dataset.index = index;

        piece.draggable = true;


        // ======================================
        // IMAGE
        // ======================================

        piece.style.backgroundImage =
            `url("${getCurrentImage()}")`;


        // ======================================
        // IMAGE POSITION
        // ======================================

        const column =
            index % SIZE;

        const row =
            Math.floor(index / SIZE);


        /*
            3 × 3

            0  1  2
            3  4  5
            6  7  8
        */

        const x =
            column * 50;

        const y =
            row * 50;


        piece.style.backgroundPosition =
            `${x}% ${y}%`;


        // Add drag events
        addDragEvents(piece);


        // Add piece
        piecesContainer.appendChild(piece);

    });

}


// ==========================================
// SHUFFLE
// ==========================================

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}


// ==========================================
// DRAG EVENTS
// ==========================================

function addDragEvents(piece) {

    piece.addEventListener(
        "dragstart",
        dragStart
    );

    piece.addEventListener(
        "dragend",
        dragEnd
    );

}


// ==========================================
// DRAG START
// ==========================================

function dragStart(event) {

    if (puzzleCompleted) {
        return;
    }

    draggedPiece = this;

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
        "text/plain",
        this.dataset.index
    );

    this.classList.add("dragging");

}


// ==========================================
// DRAG END
// ==========================================

function dragEnd() {

    this.classList.remove("dragging");

}


// ==========================================
// SETUP PUZZLE SLOTS
// ==========================================

function setupSlots() {

    const slots =
        document.querySelectorAll(".slot");


    slots.forEach(slot => {


        // ==============================
        // DRAG OVER
        // ==============================

        slot.addEventListener(
            "dragover",
            event => {

                if (puzzleCompleted) {
                    return;
                }

                event.preventDefault();

                slot.classList.add("over");

            }
        );


        // ==============================
        // DRAG LEAVE
        // ==============================

        slot.addEventListener(
            "dragleave",
            () => {

                slot.classList.remove("over");

            }
        );


        // ==============================
        // DROP
        // ==============================

        slot.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                slot.classList.remove("over");


                if (puzzleCompleted) {
                    return;
                }


                if (!draggedPiece) {
                    return;
                }


                // Don't replace existing piece
                if (slot.children.length > 0) {
                    return;
                }


                // Put piece into slot
                slot.appendChild(draggedPiece);


                // Increase moves
                moves++;

                if (movesText) {

                    movesText.textContent =
                        moves;

                }


                // Check puzzle
                checkPuzzle();


                // Clear dragged piece
                draggedPiece = null;

            }
        );

    });

}


// ==========================================
// CHECK PUZZLE
// ==========================================

function checkPuzzle() {

    const slots =
        document.querySelectorAll(".slot");

    let correct = 0;


    slots.forEach(slot => {

        if (slot.children.length === 0) {
            return;
        }


        const piece =
            slot.children[0];


        if (
            piece.dataset.index ===
            slot.dataset.index
        ) {

            correct++;

        }

    });


    // ======================================
    // PUZZLE COMPLETED
    // ======================================

    if (
        correct === SIZE * SIZE &&
        !puzzleCompleted
    ) {

        puzzleCompleted = true;


        // Stop timer
        clearInterval(timerInterval);


        // Add completed effect
        if (board) {

            board.classList.add(
                "completed"
            );

        }


        // Disable pieces
        document
            .querySelectorAll(".piece")
            .forEach(piece => {

                piece.draggable = false;

                piece.style.pointerEvents =
                    "none";

                piece.style.cursor =
                    "default";

            });


        /*
            IMPORTANT:

            Keep completed image visible
            for 2 seconds.
        */

        setTimeout(() => {

            goToNextPuzzle();

        }, 2000);

    }

}


// ==========================================
// NEXT PUZZLE
// ==========================================

function goToNextPuzzle() {

    // Remove completed effect
    if (board) {

        board.classList.remove(
            "completed"
        );

    }


    // Check if more puzzles exist
    if (
        currentPuzzle <
        PUZZLES.length - 1
    ) {

        // Move to next puzzle
        currentPuzzle++;


        // Restart game
        restartGame();


        // Update preview
        updatePreviewImage();


        /*
            Optional message
            displayed briefly.
        */

        showNextPuzzleMessage();

    }

    else {

        // ==================================
        // ALL 3 PUZZLES COMPLETED
        // ==================================

        clearInterval(timerInterval);


        if (success) {

            success.style.display =
                "flex";

        }

    }

}


// ==========================================
// NEXT PUZZLE MESSAGE
// ==========================================

function showNextPuzzleMessage() {

    const message =
        document.createElement("div");

    message.className =
        "next-puzzle-message";


    message.innerHTML = `
        <div>
            <h2>🎉 Puzzle Completed!</h2>
            <p>Get ready for the next childhood memory ❤️</p>
        </div>
    `;


    document.body.appendChild(message);


    setTimeout(() => {

        message.classList.add(
            "show"
        );

    }, 50);


    setTimeout(() => {

        message.classList.remove(
            "show"
        );

        setTimeout(() => {

            message.remove();

        }, 400);

    }, 1800);

}


// ==========================================
// PREVIEW
// ==========================================

if (previewBtn) {

    previewBtn.addEventListener(
        "click",
        () => {

            updatePreviewImage();

            if (preview) {

                preview.style.display =
                    "flex";

            }

        }
    );

}


// ==========================================
// UPDATE PREVIEW IMAGE
// ==========================================

function updatePreviewImage() {

    const previewImage =
        document.querySelector(
            ".preview-image"
        );


    if (
        previewImage &&
        PUZZLES[currentPuzzle]
    ) {

        previewImage.src =
            PUZZLES[currentPuzzle];

    }

}


// ==========================================
// CLOSE PREVIEW
// ==========================================

if (closePreview) {

    closePreview.addEventListener(
        "click",
        () => {

            if (preview) {

                preview.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// CLOSE PREVIEW BY CLICKING OUTSIDE
// ==========================================

if (preview) {

    preview.addEventListener(
        "click",
        event => {

            if (
                event.target === preview
            ) {

                preview.style.display =
                    "none";

            }

        }
    );

}


// ==========================================
// PLAY AGAIN
// ==========================================

if (playAgain) {

    playAgain.addEventListener(
        "click",
        () => {

            if (success) {

                success.style.display =
                    "none";

            }


            // Start from Puzzle 1
            currentPuzzle = 0;


            restartGame();


            updatePreviewImage();

        }
    );

}


// ==========================================
// RESTART CURRENT PUZZLE
// ==========================================

if (restartBtn) {

    restartBtn.addEventListener(
        "click",
        restartGame
    );

}


// ==========================================
// RESTART GAME
// ==========================================

function restartGame() {

    // Reset variables
    moves = 0;

    puzzleCompleted = false;


    // Reset moves display
    if (movesText) {

        movesText.textContent =
            "0";

    }


    // Clear slots
    const slots =
        document.querySelectorAll(".slot");


    slots.forEach(slot => {

        slot.innerHTML = "";

        slot.classList.remove(
            "over"
        );

    });


    // Create new pieces
    createPieces();


    // Restart timer
    startTimer();


    // Update preview
    updatePreviewImage();

}


// ==========================================
// KEYBOARD ESCAPE FOR PREVIEW
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            preview
        ) {

            preview.style.display =
                "none";

        }

    }
);