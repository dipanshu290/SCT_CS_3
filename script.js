function startMatrixAnimation() {
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$%#&!{}[]<>*+~";
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  ctx.font = `${fontSize}px monospace`;

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    drops.forEach((y, i) => {
      const char = chars.charAt(Math.floor(Math.random() * chars.length));
      const x = i * fontSize;
      ctx.fillText(char, x, y * fontSize);
      drops[i] =
        y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
    });
  }

  setInterval(drawMatrix, 50);
}

function hideSplashScreen(delay = 2500) {
  const splash = document.getElementById("splashScreen");
  const mainApp = document.getElementById("mainApp");

  if (splash && mainApp) {
    setTimeout(() => {
      splash.style.display = "none";
      mainApp.style.display = "block";
    }, delay);
  }
}

function setupPasswordToggle() {
  const toggle = document.getElementById("togglePassword");
  const input = document.getElementById("passwordInput");

  if (toggle && input) {
    toggle.addEventListener("change", () => {
      input.type = toggle.checked ? "text" : "password";
    });
  }
}

function checkStrength() {
  const password = document.getElementById("passwordInput").value;
  let strength = 0;

  const commonPasswords = [
    "password",
    "123456",
    "qwerty",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "abc123",
    "iloveyou",
  ];

  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    notCommon: !commonPasswords.includes(password.toLowerCase()),
  };

  for (let key in criteria) {
    if (criteria[key]) strength++;
  }

  const rating = !criteria.notCommon
    ? "Very Weak (Common Password)"
    : strength <= 2
    ? "Weak"
    : strength === 3
    ? "Moderate"
    : strength <= 5
    ? "Strong"
    : "Very Strong";

  let charsetSize = 0;
  if (criteria.lowercase) charsetSize += 26;
  if (criteria.uppercase) charsetSize += 26;
  if (criteria.digit) charsetSize += 10;
  if (criteria.special) charsetSize += 32;

  const entropy =
    password.length > 0
      ? Math.round(password.length * Math.log2(charsetSize))
      : 0;

  const ratingColors = {
    "Very Weak (Common Password)": "red",
    Weak: "orange",
    Moderate: "gold",
    Strong: "lime",
    "Very Strong": "lawngreen",
  };

  const strengthResult = document.getElementById("strengthResult");
  const meter = document.getElementById("strengthMeter");

  strengthResult.innerHTML = `Password Rating: <strong>${rating}</strong><br>Estimated Entropy: ${entropy} bits`;
  strengthResult.style.color = ratingColors[rating] || "white";

  if (meter) {
    meter.value = strength;
    meter.max = 6;
    meter.style.setProperty("--strength-color", ratingColors[rating] || "lime");
  }

  const criteriaList = Object.entries(criteria)
    .map(
      ([key, passed]) =>
        `${key.charAt(0).toUpperCase() + key.slice(1)}: ${passed ? "✅" : "❌"}`
    )
    .join("<br>");

  const suggestions = [];
  if (!criteria.length) suggestions.push("Use at least 8 characters.");
  if (!criteria.uppercase) suggestions.push("Add uppercase letters.");
  if (!criteria.lowercase) suggestions.push("Include lowercase letters.");
  if (!criteria.digit) suggestions.push("Include digits.");
  if (!criteria.special) suggestions.push("Include special characters.");
  if (!criteria.notCommon) suggestions.push("Avoid common passwords.");

  document.getElementById("criteriaList").innerHTML =
    criteriaList +
    (suggestions.length
      ? `<br><br><strong>Suggestions:</strong><br>${suggestions.join("<br>")}`
      : "");
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("Service Worker registered ✅"));
}

window.addEventListener("load", () => {
  hideSplashScreen();
});

document.addEventListener("DOMContentLoaded", () => {
  startMatrixAnimation();
  setupPasswordToggle();
  const passwordInput = document.getElementById("passwordInput");
  if (passwordInput) {
    passwordInput.addEventListener("input", checkStrength);
  }
});
