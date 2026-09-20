// ==========================================
// QUESTION DATA
// ==========================================

const question = {

    text: "Which Institution you like study ?",

    options: [

        {
            image: "quiz_images/srm.png",
            text: "SRM Institute of Science and Technology"
        },

        {
            image: "quiz_images/iit madras.jpg",
            text: "IIT Madras"
        },

        {
            image: "quiz_images/nit_trichy.jpg",
            text: "NIT Trichy"
        },

        {
            image: "quiz_images/aims.jpg",
            text: "AIIMS"
        }

    ],

    // IMPORTANT:
    // 0 = Option 1
    // 1 = Option 2
    // 2 = Option 3
    // 3 = Option 4

    // OPTION 3 IS CORRECT
    correctAnswer: 2
};


// ==========================================
// VARIABLES
// ==========================================

let timeLeft = 20;

let score = 0;

let answered = false;

let timerInterval;


// ==========================================
// ELEMENTS
// ==========================================

const timer =
    document.getElementById("timer");

const progressBar =
    document.getElementById("progressBar");

const options =
    document.querySelectorAll(".option");

const answerMessage =
    document.getElementById("answerMessage");

const result =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const resultMessage =
    document.getElementById("resultMessage");

const answerPreview =
    document.getElementById("answerPreview");

const correctAnswerImage =
    document.getElementById("correctAnswerImage");

const correctAnswerText =
    document.getElementById("correctAnswerText");

const playAgain =
    document.getElementById("playAgain");

const closePreview =
    document.getElementById("closePreview");


// ==========================================
// START
// ==========================================

window.addEventListener("DOMContentLoaded", function () {

    loadQuestion();

    startTimer();

});


// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    // Question text

    const questionElement =
        document.getElementById("question");

    questionElement.textContent =
        question.text;


    // Load all 4 options

    options.forEach(function (option, index) {

        const image =
            option.querySelector("img");

        const text =
            option.querySelector("span");


        // Set image

        image.src =
            question.options[index].image;


        // Set alt text

        image.alt =
            question.options[index].text;


        // Set option text

        text.textContent =
            question.options[index].text;


        // Set answer index

        option.dataset.answer =
            index;


        // Remove old classes

        option.classList.remove(
            "correct",
            "wrong"
        );


        // Image error detection

        image.onerror = function () {

            console.error(
                "Image not found:",
                image.src
            );

            image.style.display = "none";

            text.textContent =
                question.options[index].text +
                " - Image not found";

        };


        image.onload = function () {

            image.style.display = "block";

        };

    });

}


// ==========================================
// TIMER
// ==========================================

function startTimer() {

    clearInterval(timerInterval);


    timeLeft = 20;

    timer.textContent = "20";

    progressBar.style.width = "100%";

    timer.style.color = "white";


    timerInterval = setInterval(function () {

        timeLeft--;


        timer.textContent =
            timeLeft;


        const percentage =
            (timeLeft / 20) * 100;


        progressBar.style.width =
            percentage + "%";


        // Last 5 seconds

        if (timeLeft <= 5) {

            timer.style.color =
                "#ff4757";

        }


        // Time finished

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timeUp();

        }

    }, 1000);

}


// ==========================================
// SELECT ANSWER
// ==========================================

options.forEach(function (option) {

    option.addEventListener(
        "click",
        function () {

            // Prevent selecting again

            if (answered) {

                return;

            }


            answered = true;


            clearInterval(timerInterval);


            const selected =
                Number(
                    option.dataset.answer
                );


            // ==================================
            // CORRECT
            // ==================================

            if (
                selected ===
                question.correctAnswer
            ) {

                score++;


                option.classList.add(
                    "correct"
                );


                answerMessage.textContent =
                    "👏 Well done! That's the correct answer ❤️ ";

            }


            // ==================================
            // WRONG
            // ==================================

            else {

                option.classList.add(
                    "wrong"
                );


                // Show actual correct option

                options[
                    question.correctAnswer
                ].classList.add(
                    "correct"
                );


                answerMessage.textContent =
                    "😂 Wrong! Nice try!";

            }


            // ==================================
            // SHOW RESULT
            // ==================================

            setTimeout(function () {

                showResult();

            }, 1500);

        }
    );

});


// ==========================================
// TIME UP
// ==========================================

function timeUp() {

    if (answered) {

        return;

    }


    answered = true;


    // Show correct answer

    options[
        question.correctAnswer
    ].classList.add(
        "correct"
    );


    answerMessage.textContent =
        "⏰ Time's up!";


    setTimeout(function () {

        showResult();

    }, 1500);

}


// ==========================================
// SHOW RESULT
// ==========================================

function showResult() {

    // Show result box

    result.style.display =
        "flex";


    // Display score

    scoreElement.textContent =
        score + " / 1";


    // Result message

    if (score === 1) {

        resultMessage.textContent =
            "🏆 Perfect! You really know him! ❤️";

    }

    else {

        resultMessage.textContent =
            "😂 Better luck next time!";

    }


    // ======================================
    // CORRECT ANSWER PREVIEW
    // ======================================

    setTimeout(function () {

        const correctOption =
            question.options[
                question.correctAnswer
            ];


        // Set preview image

        correctAnswerImage.src =
            correctOption.image;


        // Set preview alt

        correctAnswerImage.alt =
            correctOption.text;


        // Set preview text

        correctAnswerText.textContent =
            "The correct answer was: " +
            correctOption.text;


        // Show preview

        answerPreview.style.display =
            "flex";

    }, 800);

}


// ==========================================
// PLAY AGAIN
// ==========================================

if (playAgain) {

    playAgain.addEventListener(
        "click",
        function () {

            // Hide result

            result.style.display =
                "none";


            // Hide preview

            answerPreview.style.display =
                "none";


            // Reset score

            score = 0;


            // Reset answer state

            answered = false;


            // Clear message

            answerMessage.textContent =
                "";


            // Remove correct/wrong styles

            options.forEach(function (option) {

                option.classList.remove(
                    "correct",
                    "wrong"
                );

            });


            // Load question again

            loadQuestion();


            // Restart timer

            startTimer();

        }
    );

}


// ==========================================
// CLOSE PREVIEW
// ==========================================

if (closePreview) {

    closePreview.addEventListener(
        "click",
        function () {

            answerPreview.style.display =
                "none";

        }
    );

}