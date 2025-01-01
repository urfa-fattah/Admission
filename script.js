document.addEventListener("DOMContentLoaded", () => {
  const countdownCells = document.querySelectorAll(".countdown");
  const runningNotice = document.getElementById("running-notice");
  const conflictNotice = document.getElementById("exam-conflict-notice");

  let runningApps = [];
  let examDates = {};

  countdownCells.forEach((cell) => {
    const startDate = new Date(cell.dataset.start);
    const endDate = new Date(cell.dataset.end);
    const examDate = new Date(cell.dataset.exam);
    const today = new Date();

    let appCountdown = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    let examCountdown = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));

    // Handle running applications
    if (today >= startDate && today <= endDate) {
      runningApps.push(cell.closest("tr").children[0].textContent);
    }

    // Handle countdown display
    if (appCountdown < 0) appCountdown = "Ended";
    if (examCountdown < 0) examCountdown = "Passed";

    cell.textContent = `App: ${appCountdown} days, Exam: ${examCountdown} days`;

    // Set countdown colors
    if (typeof appCountdown === "number") {
      if (appCountdown > 10) {
        cell.classList.add("safe");
      } else if (appCountdown <= 10 && appCountdown > 3) {
        cell.classList.add("medium");
      } else {
        cell.classList.add("risk");
      }
    } else {
      cell.classList.add("risk"); // For "Ended"
    }

    // Handle exam conflict detection
    const examDateString = examDate.toISOString().split("T")[0];
    if (!examDates[examDateString]) {
      examDates[examDateString] = [];
    }
    examDates[examDateString].push(cell.closest("tr").children[0].textContent);
  });

  // Update running applications notice
  if (runningApps.length > 0) {
    runningNotice.textContent = `Currently running applications: ${runningApps.join(", ")}`;
  } else {
    runningNotice.textContent = "No running applications today.";
  }

  // Check for exam conflicts
  const conflictingExams = Object.keys(examDates).filter(
    (date) => examDates[date].length > 1
  );

  if (conflictingExams.length > 0) {
    conflictNotice.style.display = "block";
    conflictNotice.textContent = `Alert: Exam conflicts found on ${conflictingExams
      .map(
        (date) =>
          `${date} (${examDates[date].join(", ")})`
      )
      .join("; ")}.`;
  }
});