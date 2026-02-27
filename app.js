
console.log("APP LOADED");
// Default PIN setup
if (!localStorage.getItem("warplan_pin")) {
  localStorage.setItem("warplan_pin", "1234");
}

// Check PIN
function checkPIN() {
  
    alert("PIN function is running");   

    const entered = document.getElementById("pinInput").value;
    const savedPIN = localStorage.getItem("warplan_pin");
function checkPIN() {

    alert("PIN function is running");

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
  const redraw = parseFloat(document.getElementById("redrawBalance").value) || 0;

  localStorage.setItem("mortgage_balance", mortgage);
  localStorage.setItem("car_balance", 
  localStorage.setItem("redraw_balance", redraw);

  calculateStatus(mortgage, car, redraw);
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
const redraw = parseFloat(localStorage.getItem("redraw_balance")) || 0;

if (mortgage && car) {
    calculateStatus(
        parseFloat(mortgage),
        parseFloat(car),
        parseFloat(redraw)
    );
}
  
}

// Calculation logic
function calculateStatus(mortgage, car, redraw) {
  const originalBalance = 226889;
  // ===== Accurate Daily Interest Simulation =====

const interestRate = 0.0563;
const weeklyPayment = 486;
const dailyRate = interestRate / 365;

// ---------- Scenario 1: NO Redraw ----------
let balanceNoRedraw = mortgage;
let totalInterestNoRedraw = 0;
let daysNoRedraw = 0;

while (balanceNoRedraw > 0 && daysNoRedraw < 365 * 40) {
    const interestForDay = balanceNoRedraw * dailyRate;
    balanceNoRedraw += interestForDay;
    totalInterestNoRedraw += interestForDay;

    if (daysNoRedraw % 7 === 0) {
        balanceNoRedraw -= weeklyPayment;
    }

    daysNoRedraw++;
}

// ---------- Scenario 2: WITH Redraw ----------
let balanceWithRedraw = Math.max(0, mortgage - redraw);
let totalInterestWithRedraw = 0;
let daysWithRedraw = 0;

while (balanceWithRedraw > 0 && daysWithRedraw < 365 * 40) {
    const interestForDay = balanceWithRedraw * dailyRate;
    balanceWithRedraw += interestForDay;
    totalInterestWithRedraw += interestForDay;

    if (daysWithRedraw % 7 === 0) {
        balanceWithRedraw -= weeklyPayment;
    }

    daysWithRedraw++;
}

// ===== Results =====
const interestSaved = totalInterestNoRedraw - totalInterestWithRedraw;
const daysSaved = daysNoRedraw - daysWithRedraw;
const yearsToPayoff = daysWithRedraw / 365;
  document.getElementById("status").innerText =
    "Interest Saved: $" + interestSaved.toFixed(0) +
    " | Time Saved: " + Math.floor(daysSaved / 30) + " months";
const requiredPayment = weeklyPayment;
  const today = new Date();
  const targetDate = new Date("October 28, 2033");


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
const redrawAvailable = redraw;

window.warChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Destroyed (Paid)", "Remaining Mortgage", "Available Redraw"],
        datasets: [{

