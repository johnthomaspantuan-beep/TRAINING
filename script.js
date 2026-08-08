/* =====================================================
   NAVIGATION
===================================================== */

const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".section");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const sectionName = button.dataset.section;

        openSection(sectionName);

    });

});


function openSection(sectionName) {

    sections.forEach(section => {
        section.classList.remove("active");
    });

    navButtons.forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(sectionName).classList.add("active");

    const activeButton = document.querySelector(
        `[data-section="${sectionName}"]`
    );

    if (activeButton) {
        activeButton.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



/* =====================================================
   DATE
===================================================== */

function updateDate() {

    const date = new Date();

    const formatted = date.toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

    document.getElementById("currentDate").textContent = formatted;
}

updateDate();



/* =====================================================
   DARK MODE
===================================================== */

const themeToggle = document.getElementById("themeToggle");

let darkMode = localStorage.getItem("darkMode") === "true";

if (darkMode) {
    document.body.classList.add("dark");
    themeToggle.innerHTML =
        '<i class="fa-solid fa-sun"></i> Light Mode';
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    darkMode = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", darkMode);

    if (darkMode) {

        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i> Light Mode';

    } else {

        themeToggle.innerHTML =
            '<i class="fa-solid fa-moon"></i> Dark Mode';

    }

});



/* =====================================================
   TASK SYSTEM
===================================================== */

let tasks = JSON.parse(
    localStorage.getItem("studyTasks")
) || [];

function saveTasks() {

    localStorage.setItem(
        "studyTasks",
        JSON.stringify(tasks)
    );

}


function renderTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.className =
            `task ${task.completed ? "completed" : ""}`;

        taskElement.innerHTML = `

            <input
                type="checkbox"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${index})"
            >

            <div class="task-info">

                <h3>${escapeHTML(task.title)}</h3>

                <span>${escapeHTML(task.subject)}</span>

            </div>

            <button
                class="delete-task"
                onclick="deleteTask(${index})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;

        taskList.appendChild(taskElement);

    });

    updateStatistics();

}


function addTask() {

    const input = document.getElementById("taskInput");

    const subject =
        document.getElementById("taskSubject").value;

    const title = input.value.trim();

    if (title === "") {

        alert("Please enter a task.");

        return;
    }

    tasks.push({

        title: title,

        subject: subject,

        completed: false

    });

    input.value = "";

    saveTasks();

    renderTasks();

}


function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;

    saveTasks();

    renderTasks();

}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


renderTasks();



/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    const completed =
        tasks.filter(task => task.completed).length;

    const total = tasks.length;

    document.getElementById(
        "completedCount"
    ).textContent = completed;

    let percentage = 0;

    if (total > 0) {

        percentage =
            Math.round((completed / total) * 100);

    }

    document.getElementById(
        "progressPercent"
    ).textContent = percentage + "%";

}



/* =====================================================
   POMODORO TIMER
===================================================== */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;

    document.getElementById(
        "timerDisplay"
    ).textContent =

        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;

    document.getElementById(
        "timerStatus"
    ).textContent = "Focus! You got this 💪";


    timerInterval = setInterval(() => {

        if (timerSeconds <= 0) {

            clearInterval(timerInterval);

            timerRunning = false;

            document.getElementById(
                "timerStatus"
            ).textContent = "Time's up! 🎉";

            alert("Study session complete!");

            return;
        }

        timerSeconds--;

        updateTimerDisplay();

    }, 1000);

}


function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    document.getElementById(
        "timerStatus"
    ).textContent = "Timer paused";

}


function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();

    document.getElementById(
        "timerStatus"
    ).textContent = "Ready to study";

}


function setTimer(minutes) {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = minutes * 60;

    updateTimerDisplay();

    document.getElementById(
        "timerStatus"
    ).textContent = `${minutes} minute session`;

}


updateTimerDisplay();



/* =====================================================
   FLASHCARDS
===================================================== */

const flashcards = [

    {
        category: "Mathematics",

        question: "What is the quadratic formula?",

        answer:
            "x = (-b ± √(b² - 4ac)) / 2a"
    },

    {
        category: "Mathematics",

        question: "What is the derivative of x²?",

        answer: "2x"
    },

    {
        category: "Physics",

        question: "What is Newton's second law?",

        answer: "F = ma"
    },

    {
        category: "Programming",

        question: "What does HTML stand for?",

        answer:
            "HyperText Markup Language"
    },

    {
        category: "Programming",

        question: "What does CSS control?",

        answer:
            "The appearance and layout of a webpage"
    }

];


let currentCard = 0;


function displayCard() {

    const card = flashcards[currentCard];

    document.getElementById(
        "cardCategory"
    ).textContent = card.category;

    document.getElementById(
        "cardQuestion"
    ).textContent = card.question;

    document.getElementById(
        "cardAnswer"
    ).textContent = card.answer;

    document.getElementById(
        "cardCounter"
    ).textContent =
        `${currentCard + 1} / ${flashcards.length}`;

    document
        .getElementById("flashcard")
        .classList.remove("flipped");

}


function flipCard() {

    document
        .getElementById("flashcard")
        .classList.toggle("flipped");

}


function nextCard() {

    currentCard++;

    if (currentCard >= flashcards.length) {
        currentCard = 0;
    }

    displayCard();

}


function previousCard() {

    currentCard--;

    if (currentCard < 0) {
        currentCard = flashcards.length - 1;
    }

    displayCard();

}


displayCard();



/* =====================================================
   QUIZ
===================================================== */

const quizQuestions = [

    {
        question: "What is 2 + 2?",

        answers: [
            "3",
            "4",
            "5",
            "6"
        ],

        correct: 1
    },

    {
        question: "What is the derivative of x²?",

        answers: [
            "x",
            "2x",
            "x²",
            "2"
        ],

        correct: 1
    },

    {
        question: "Which language is used to style webpages?",

        answers: [
            "HTML",
            "Python",
            "CSS",
            "Java"
        ],

        correct: 2
    },

    {
        question: "What does CPU stand for?",

        answers: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility",
            "Computer Processing Utility"
        ],

        correct: 0
    },

    {
        question: "What is Newton's second law?",

        answers: [
            "E = mc²",
            "V = IR",
            "F = ma",
            "P = IV"
        ],

        correct: 2
    }

];


let currentQuestion = 0;

let score = 0;


function loadQuestion() {

    const question =
        quizQuestions[currentQuestion];

    document.getElementById(
        "quizQuestion"
    ).textContent = question.question;

    document.getElementById(
        "quizQuestionNumber"
    ).textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    document.getElementById(
        "quizProgress"
    ).style.width =
        `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;


    const answerContainer =
        document.getElementById("quizAnswers");

    answerContainer.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className = "quiz-answer";

        button.textContent = answer;

        button.onclick = () =>
            selectAnswer(index, button);

        answerContainer.appendChild(button);

    });


    document
        .getElementById("nextQuestionBtn")
        .classList.add("hidden");

}


function selectAnswer(selected, button) {

    const question =
        quizQuestions[currentQuestion];

    const answerButtons =
        document.querySelectorAll(".quiz-answer");


    answerButtons.forEach(btn => {
        btn.disabled = true;
    });


    if (selected === question.correct) {

        button.classList.add("correct");

        score++;

    } else {

        button.classList.add("wrong");

        answerButtons[
            question.correct
        ].classList.add("correct");

    }


    document
        .getElementById("nextQuestionBtn")
        .classList.remove("hidden");

}


function nextQuestion() {

    currentQuestion++;

    if (currentQuestion >= quizQuestions.length) {

        showQuizResult();

        return;

    }

    loadQuestion();

}


function showQuizResult() {

    document
        .getElementById("quizQuestion")
        .textContent = "Quiz Complete! 🎉";

    document
        .getElementById("quizAnswers")
        .innerHTML = "";

    document
        .getElementById("nextQuestionBtn")
        .classList.add("hidden");

    const result =
        document.getElementById("quizResult");

    result.classList.remove("hidden");

    result.innerHTML = `

        <h2>You scored ${score}/${quizQuestions.length}</h2>

        <p>
            ${
                score === quizQuestions.length
                    ? "Perfect score! 🔥"
                    : "Great job! Keep studying and try again."
            }
        </p>

        <button
            class="primary-btn"
            onclick="restartQuiz()"
            style="margin-top:15px;"
        >
            Try Again
        </button>

    `;

}


function restartQuiz() {

    currentQuestion = 0;

    score = 0;

    document
        .getElementById("quizResult")
        .classList.add("hidden");

    loadQuestion();

}


loadQuestion();