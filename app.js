// Default PIN setup
if (!localStorage.getItem("warplan_pin")) {
  localStorage.setItem("warplan_pin", "1234");
}

// Check PIN
function checkPIN() {
  const entered = document.getElementById("pinInput").value;
  const savedPIN = localStorage.getItem("warplan_pin");

  if (entered === savedPIN) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadData();
  } else {
    alert("Incorrect PIN.");
  }
}

// Change PIN
function changePIN() {
  const newPIN = prompt("Enter new 4-digit PIN:");
  if (newPIN && newPIN.length === 4) {
    localStorage.setItem("warplan_pin", newPIN);
    alert("PIN updated.");
  } else {
    alert("PIN must be 4 digits.");
  }
}

// Update mortgage & car data
function updatePlan() {
  const mortgage = parseFloat(document.getElementById("mortgageBalance").value);
  const car = parseFloat(document.getElementById("carBalance").value);

  localStorage.setItem("mortgage_balance", mortgage);
  localStorage.setItem("car_balance", car);

  calculateStatus(mortgage, car);
}

// Load saved data
function loadData() {
  const mortgage = localStorage.getItem("mortgage_balance");
  const car = localStorage.getItem("car_balance");

  if (mortgage) {
    document.getElementById("mortgageBalance").value = mortgage;
  }
  if (car) {
    document.getElementById("carBalance").value = car;
  }

  if (mortgage && car) {
    calculateStatus(parseFloat(mortgage), parseFloat(car));
  }
}

// Calculation logic
function calculateStatus(mortgage, car) {
  const originalBalance = 226889;
  const weeklyTarget = 691;
  const mortgageRate = 0.0538 / 52;
  const today = new Date();
  const targetDate = new Date("October 28, 2033");

  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeksRemaining = Math.floor((targetDate - today) / msPerWeek);

  const requiredPayment =
    mortgage * mortgageRate /
    (1 - Math.pow(1 + mortgageRate, -weeksRemaining));

  // Progress %
  const percentDestroyed = ((originalBalance - mortgage) / originalBalance) * 100;
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentDestroyed + "%";

  document.getElementById("percentComplete").innerText =
    percentDestroyed.toFixed(1) + "% DESTROYED";
// === PIE CHART ===

// Destroy old chart if it exists (prevents stacking)
if (window.warChartInstance) {
    window.warChartInstance.destroy();
}

const ctx = document.getElementById("warChart").getContext("2d");

const amountPaid = originalBalance - mortgage;
const remainingBalance = mortgage;
const redrawAvailable = car > 0 ? car : 0;

window.warChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Destroyed (Paid)", "Remaining Mortgage", "Available Redraw"],
        datasets: [{
            data: [amountPaid, remainingBalance, redrawAvailable],
            backgroundColor: [
                "#00f5ff",   // cyan destroyed
                "#ff3b3b",   // red remaining
                "#00ff88"    // green redraw
            ],
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "#ffffff",
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});
  // Countdown
  const totalDays = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365);
  const weeks = Math.floor((totalDays % 365) / 7);
  const days = totalDays % 7;

  document.getElementById("countdown").innerText =
    years + " Years | " + weeks + " Weeks | " + days + " Days Remaining";

  // Ahead / Behind calculation
  const weeklyDifference = weeklyTarget - requiredPayment;
  const daysDifference = Math.floor((weeklyDifference / weeklyTarget) * 365);

  let statusText = "";

  if (requiredPayment <= weeklyTarget) {
    statusText = "ON TRACK. " + Math.abs(daysDifference) + " days ahead.";
  } else {
    statusText = "BEHIND. " + Math.abs(daysDifference) + " days behind.";
  }

  if (car <= 0) {
    statusText += " REDIRECT ACTIVE.";
  }

  document.getElementById("status").innerText =
    "Required Weekly: $" +
    requiredPayment.toFixed(0) +
    " | Status: " +
    statusText;
}
