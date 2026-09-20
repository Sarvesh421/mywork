// ==========================================
// SECRET PASSWORD
// ==========================================

const SECRET_PIN = "26092026";

let enteredPin = "";


// ==========================================
// ELEMENTS
// ==========================================

const loader = document.getElementById("loader");
const lockScreen = document.getElementById("lockScreen");
const main = document.getElementById("main");

const progressBar =
    document.getElementById("loaderProgress");

const loadingText =
    document.getElementById("loadingText");

const loadingPercent =
    document.getElementById("loadingPercent");

const message =
    document.getElementById("message");


// ==========================================
// INITIAL STATE
// ==========================================

lockScreen.style.display = "none";
main.style.display = "none";


// ==========================================
// LOADING SCREEN
// ==========================================

window.addEventListener("load", function () {

    let progress = 0;

    const loadingInterval = setInterval(function () {

        progress += 2;

        // Progress bar
        progressBar.style.width =
            progress + "%";


        // Percentage
        loadingPercent.textContent =
            progress;


        // Loading messages
        if (progress < 25) {

            loadingText.textContent =
                "Preparing your memories...";

        }
        else if (progress < 50) {

            loadingText.textContent =
                "Loading childhood photos...";

        }
        else if (progress < 75) {

            loadingText.textContent =
                "Preparing something special...";

        }
        else if (progress < 95) {

            loadingText.textContent =
                "Almost ready ❤️";

        }
        else {

            loadingText.textContent =
                "Memories loaded!";

        }


        // Finished
        if (progress >= 100) {

            clearInterval(loadingInterval);

            setTimeout(function () {

                loader.style.display = "none";

                lockScreen.style.display = "flex";

            }, 500);

        }

    }, 50);

});


// ==========================================
// ENTER DIGIT
// ==========================================

function enterDigit(number) {

    // Don't allow more than 8 digits
    if (enteredPin.length >= 8) {
        return;
    }


    enteredPin += number;


    updatePasswordDisplay();


    // Automatically check after 8 digits
    if (enteredPin.length === 8) {

        setTimeout(function () {

            checkPin();

        }, 300);

    }

}


// ==========================================
// UPDATE PASSWORD DOTS
// ==========================================

function updatePasswordDisplay() {

    const dots =
        document.querySelectorAll(
            "#passwordDisplay span"
        );


    dots.forEach(function (dot, index) {

        if (index < enteredPin.length) {

            dot.classList.add("filled");

        }
        else {

            dot.classList.remove("filled");

        }

    });

}


// ==========================================
// DELETE DIGIT
// ==========================================

function deleteDigit() {

    if (enteredPin.length === 0) {
        return;
    }


    enteredPin =
        enteredPin.slice(0, -1);


    updatePasswordDisplay();


    message.textContent = "";

}


// ==========================================
// CHECK PASSWORD
// ==========================================

function checkPin() {

    if (enteredPin.length !== 8) {

        message.textContent =
            "Please enter all 8 digits.";

        message.className =
            "password-message error";

        return;
    }


    // ======================================
    // CORRECT PASSWORD
    // ======================================

    if (enteredPin === SECRET_PIN) {

        message.textContent =
            "Access granted ❤️";

        message.className =
            "password-message success";


        setTimeout(function () {

            lockScreen.style.display = "none";

            main.style.display = "block";

            window.scrollTo(0, 0);

        }, 700);

    }


    // ======================================
    // WRONG PASSWORD
    // ======================================

    else {

        message.textContent =
            "❌ Wrong password. Try again.";

        message.className =
            "password-message error";


        const box =
            document.querySelector(".login-box");


        box.classList.add("shake");


        setTimeout(function () {

            box.classList.remove("shake");

            enteredPin = "";

            updatePasswordDisplay();

        }, 600);

    }

}


// ==========================================
// LAPTOP KEYBOARD SUPPORT
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        // Numbers 0-9
        if (/^[0-9]$/.test(event.key)) {

            enterDigit(event.key);

        }


        // Backspace
        else if (event.key === "Backspace") {

            deleteDigit();

        }


        // Enter
        else if (event.key === "Enter") {

            checkPin();

        }

    }
);


// ==========================================
// START ADVENTURE
// ==========================================

const startBtn =
    document.getElementById("startBtn");


if (startBtn) {

    startBtn.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: window.innerHeight,

                behavior: "smooth"

            });

        }
    );

}