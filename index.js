// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const API_URL = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorDiv = document.getElementById("error-message");

// Step 1: fetch alerts
function fetchWeatherAlerts(state) {
  return fetch(`${API_URL}${state}`)
    .then(response => {
      return response.json().then(data => {
        // NWS returns a JSON body with `detail`/`title` on bad requests
        if (response.ok === false) {
          throw new Error(data.detail || data.title || "Failed to fetch weather alerts.");
        }
        return data;
      });
    });
}

// Step 2: display alerts
function displayAlerts(data) {
  alertsDisplay.innerHTML = ""; // Step 3: remove previous data

  const summary = document.createElement("p");
  summary.textContent = `${data.title}: ${data.features.length}`;
  alertsDisplay.appendChild(summary);

  const list = document.createElement("ul");
  data.features.forEach(alert => {
    const li = document.createElement("li");
    li.textContent = alert.properties.headline;
    list.appendChild(li);
  });
  alertsDisplay.appendChild(list);
}

// Step 4: error handling
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove("hidden");
  errorDiv.style.display = "block";
}

function clearError() {
  errorDiv.textContent = "";
  errorDiv.classList.add("hidden");
  errorDiv.style.display = "none";
}

function handleFetch() {
  const state = stateInput.value.trim();
  stateInput.value = ""; // Step 3: clear input

  if (!state) {
    showError("Please enter a state abbreviation.");
    return Promise.resolve();
  }
  // Optional: input validation
  if (!/^[A-Z]{2}$/.test(state)) {
    showError("State must be two capital letters (e.g., MN).");
    return Promise.resolve();
  }

  return fetchWeatherAlerts(state)
    .then(data => {
      console.log(data);
      clearError();
      displayAlerts(data);
    })
    .catch(error => {
      console.log(error.message);
      alertsDisplay.innerHTML = "";
      showError(error.message);
    });
}

fetchButton.addEventListener("click", handleFetch);

if (typeof module !== "undefined") {
  module.exports = { fetchWeatherAlerts, displayAlerts, showError, clearError, handleFetch };
}