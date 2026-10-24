// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
/** @jest-environment jsdom */

const flush = () => new Promise(r => setTimeout(r, 0));
let app;

beforeEach(() => {
  document.body.innerHTML = `
    <input id="state-input" />
    <button id="fetch-alerts">Get Weather Alerts</button>
    <div id="alerts-display"></div>
    <div id="error-message" class="hidden"></div>`;
  jest.resetModules();
  global.fetch = jest.fn();
  app = require("../index.js");
});

const mockSuccess = () =>
  fetch.mockResolvedValue({
    ok: true,
    json: () =>
      Promise.resolve({
        title: "Current watches, warnings, and advisories for NY",
        features: [{ properties: { headline: "Flood Watch" } }]
      })
  });

test("fetch is called with the input state abbreviation", async () => {
  mockSuccess();
  document.getElementById("state-input").value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();
  expect(fetch).toHaveBeenCalledWith("https://api.weather.gov/alerts/active?area=NY");
});

test("displays title and number of alerts on success", async () => {
  mockSuccess();
  document.getElementById("state-input").value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();
  const text = document.getElementById("alerts-display").textContent;
  expect(text).toContain("Current watches, warnings, and advisories for NY: 1");
  expect(text).toContain("Flood Watch");
});

test("input clears when button is clicked", async () => {
  mockSuccess();
  const input = document.getElementById("state-input");
  input.value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();
  expect(input.value).toBe("");
});

test("displays error message on failed request", async () => {
  fetch.mockRejectedValue(new Error("Network failure"));
  document.getElementById("state-input").value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();
  const err = document.getElementById("error-message");
  expect(err.textContent).toBe("Network failure");
  expect(err.classList.contains("hidden")).toBe(false);
});

test("error is cleared and hidden after a successful request", async () => {
  fetch.mockRejectedValueOnce(new Error("Network failure"));
  const input = document.getElementById("state-input");
  input.value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();

  mockSuccess();
  input.value = "NY";
  document.getElementById("fetch-alerts").click();
  await flush();
  const err = document.getElementById("error-message");
  expect(err.textContent).toBe("");
  expect(err.classList.contains("hidden")).toBe(true);
});