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
  const weeklyTarget = 691;
  const mortgageRate = 0.0538 / 52;
  const today = new Date();
  const targetDate = new Date("October 28, 2033");

  const weeksRemaining = Math.floor((targetDate - today) / (1000 * 60 * 60 * 24 * 7));
  const requiredPayment =
    mortgage * mortgageRate /
    (1 - Math.pow(1 + mortgageRate, -weeksRemaining));

  let status = "";

  if (requiredPayment <= weeklyTarget) {
    status = "ON TRACK.";
  } else {
    status = "BEHIND. Increase payment.";
  }

  if (car <= 0) {
    status += " REDIRECT ACTIVE.";
  }

  document.getElementById("status").innerText =
    "Required Weekly: $" +
    requiredPayment.toFixed(0) +
    " | Status: " +
    status;
}
