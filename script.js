// List of Exams
const exams = [
    { name: "BUET", date: "2025-01-23" },
    { name: "DU", date: "2025-02-15" },
    { name: "KUET", date: "2025-01-11" }, // Conflict example
    { name: "CUET", date: "2025-01-24" },
    { name: "JU", date: "2025-02-9" },
    { name: "Medical", date: "2025-01-17" },
    { name: "RU", date: "2026-01-11" },
    { name: "RUET", date: "2025-02-08" }, // Conflict example
    { name: "SUST", date: "2025-02-28" },
    { name: "GST", date: "2024-08-05" },
    { name: "JnU", date: "2025-02-22" },
    { name: "IUT", date: "2026-01-24" },
    { name: "BUETX", date: "2025-03-07" }// Added CUEK as per initial request
];

// DOM Elements
const examContainer = document.getElementById("exam-container");
const noticeContainer = document.getElementById("notice-container");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

// Function to Render Exams and Conflict Notices
function renderExams() {
    examContainer.innerHTML = "";
    noticeContainer.innerHTML = "";
    const dateMap = new Map();

    // Populate dateMap to find conflicts
    exams.forEach(exam => {
        if (dateMap.has(exam.date)) {
            dateMap.get(exam.date).push(exam.name);
        } else {
            dateMap.set(exam.date, [exam.name]);
        }
    });

    // Generate Conflict Notices
    dateMap.forEach((examNames, date) => {
        if (examNames.length > 1) {
            const notice = `
                <li class="list-group-item">
                    <strong>${date}:</strong> ${examNames.join(", ")}
                </li>
            `;
            noticeContainer.innerHTML += notice;
        }
    });

    // Generate Exam Cards
    exams.forEach((exam, index) => {
        const examDate = new Date(exam.date);
        const now = new Date();
        const remainingTime = examDate - now;

        // Calculate remaining days, hours, minutes, seconds
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        // Determine if countdown should be red
        const countdownClass = days <= 20 ? "red" : "";

        // Create Exam Card
        const card = document.createElement("div");
        card.className = "col-md-6 col-lg-4";
        card.id = exam.name.toLowerCase(); // For search functionality

        card.innerHTML = `
            <div class="card p-4">
                <div class="card-body">
                    <h5 class="card-title">${exam.name}</h5>
                    <p class="card-text"><strong>Exam Date:</strong> ${exam.date}</p>
                    <p class="countdown ${countdownClass}" id="countdown-${index}">${formatCountdown(remainingTime)}</p>
                </div>
            </div>
        `;

        examContainer.appendChild(card);

        // Initialize Countdown
        startCountdown(`countdown-${index}`, examDate, days);
    });
}

// Function to Format Countdown Display
function formatCountdown(remainingTime) {
    if (remainingTime <= 0) {
        return "Exam is Today!";
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;
}

// Function to Start Countdown Timer
function startCountdown(elementId, examDate, initialDays) {
    const countdownElement = document.getElementById(elementId);

    const timer = setInterval(() => {
        const now = new Date();
        const remainingTime = examDate - now;

        if (remainingTime <= 0) {
            clearInterval(timer);
            countdownElement.innerText = "Exam is Today!";
            countdownElement.classList.remove("red");
            return;
        }

        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s remaining`;

        // Change color if days <= 20
        if (days <= 20) {
            countdownElement.classList.add("red");
        } else {
            countdownElement.classList.remove("red");
        }
    }, 1000);
}

// Search Functionality
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query === "") {
        alert("Please enter a university name to search.");
        return;
    }

    // Find the exam
    const exam = exams.find(exam => exam.name.toLowerCase() === query);

    if (exam) {
        // Scroll to the exam card
        const examElement = document.getElementById(exam.name.toLowerCase());
        if (examElement) {
            examElement.scrollIntoView({ behavior: "smooth", block: "start" });
            // Optionally, highlight the card
            examElement.classList.add("highlight");
            setTimeout(() => {
                examElement.classList.remove("highlight");
            }, 2000);
        }
    } else {
        alert("University not found. Please check the name and try again.");
    }
});

// Optional: Allow search on Enter key press
searchInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

// Initial Render
renderExams();
