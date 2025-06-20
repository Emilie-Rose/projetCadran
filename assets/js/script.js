let password = generatePassword();
let remainingAttempts = 10;
let enteredPasswords = [];
let timer = 0;
let interval;
let minAttempts = Infinity;
let playerName = "";

const clickSound = new Audio("assets/audio/son_toucheMachAEcrire.mp3");

// Génère un mot de passe unique à 3 chiffres
function generatePassword() {
  const digits = ["0","1","2","3","4","5","6","7","8","9"];
  let pwd = "";
  for (let i = 0; i < 3; i++) {
    const randIndex = Math.floor(Math.random() * digits.length);
    pwd += digits[randIndex];
    digits.splice(randIndex, 1);
  }
  return pwd;
}

// Gère l'affichage des chiffres saisis
function dial(number) {
  const input = document.getElementById("input");
  clickSound.play();
  if (input.value.length < 3) input.value += number;
}

// Vérifie le mot de passe saisi
function checkPassword() {
  const input = document.getElementById("input");
  const result = document.getElementById("result");
  const value = input.value;

  if (value.length !== 3) return;
  if (enteredPasswords.includes(value)) {
    result.textContent = "Vous avez déjà entré ce mot de passe!";
    result.style.color = "maroon";
    input.value = "";
    return;
  }

  enteredPasswords.push(value);
  let displayPassword = "";

  for (let i = 0; i < 3; i++) {
    const digit = value.charAt(i);
    if (password.includes(digit)) {
      displayPassword += digit === password.charAt(i)
        ? `<span class='correct-position'>${digit}</span>`
        : `<span class='correct'>${digit}</span>`;
    } else {
      displayPassword += `<span class='incorrect'>${digit}</span>`;
    }
  }

  if (value === password) {
    winGame();
  } else {
    remainingAttempts--;
    if (remainingAttempts === 0) {
      loseGame();
    } else {
      result.innerHTML = `Mot de passe incorrect!<br> ${displayPassword}`;
      result.style.color = "maroon";
      input.value = "";
      document.getElementById("remaining").textContent = remainingAttempts;
      document.getElementById("progressBar").value = remainingAttempts;
    }
  }

  if (remainingAttempts === 0 || value === password) {
    minAttempts = Math.min(minAttempts, 10 - remainingAttempts);
    saveScore();
    clearInterval(interval);
  }

  // Ajoute à l'historique visuel
  const listItem = document.createElement("div");
  listItem.style.textAlign = "center";
  listItem.innerHTML = displayPassword;
  document.getElementById("passwordHistory").appendChild(listItem);
}

function winGame() {
  const result = document.getElementById("result");
  result.textContent = "Mot de passe correct!";
  result.style.color = "green";
  document.getElementById("input").disabled = true;
  document.getElementById("remaining").textContent = "0";
  document.getElementById("suiteButton").style.display = "block";
}

function loseGame() {
  const result = document.getElementById("result");
  result.innerHTML = `Nombre maximal d'essais atteint. Le mot de passe était : <b>${password}</b>`;
  result.style.color = "maroon";
  document.getElementById("input").disabled = true;
  document.getElementById("remaining").textContent = "0";
  document.getElementById("suiteButton").style.display = "block";
}

function redirectToOtherPage() {
  alert("Bravo !!! Fermez cette fenêtre pour découvrir la surprise !");
  window.location.href = "assets/img/bravo.gif";
}

function resetGame() {
  password = generatePassword();
  remainingAttempts = 10;
  enteredPasswords = [];
  timer = 0;

  document.getElementById("timer").textContent = "0";
  clearInterval(interval);
  startTimer();

  document.getElementById("input").value = "";
  document.getElementById("input").disabled = false;
  document.getElementById("remaining").textContent = remainingAttempts;
  document.getElementById("progressBar").value = 10;
  document.getElementById("result").innerHTML = "";
  document.getElementById("suiteButton").style.display = "none";
  document.getElementById("passwordHistory").innerHTML = "<h3>Historique :</h3>";
}

function showInfo() {
  alert("Instructions :\n\n1. Devinez un mot de passe à 3 chiffres.\n2. 10 essais maximum.\n3. Vert = chiffre bien placé, Orange = mal placé, Rouge = absent.");
}

function clearInput() {
  document.getElementById("input").value = "";
}

function setupButtonListeners() {
  const box = document.getElementById("box");
  for (let i = 1; i <= 9; i++) {
    const button = document.createElement("div");
    button.classList.add("button");
    button.textContent = i;
    box.appendChild(button);
  }
const zeroButton = document.createElement("div");
zeroButton.classList.add("button");
zeroButton.setAttribute("id", "zero"); // ← nécessaire pour le ciblage CSS
zeroButton.textContent = "0";
box.appendChild(zeroButton);


  const buttons = document.getElementsByClassName("button");
  for (let btn of buttons) {
    btn.addEventListener("click", () => dial(btn.textContent));
  }

  document.getElementById("suiteButton").addEventListener("click", redirectToOtherPage);
}

function startGame() {
  const nameField = document.getElementById("playerName");
  if (nameField.value.trim() === "") {
    alert("Veuillez entrer un pseudo.");
    return;
  }
  playerName = nameField.value.trim();
  document.getElementById("pseudoInput").style.display = "none";
  document.getElementById("gameZone").style.display = "block";
  resetGame();
}

function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

function saveScore() {
  const scores = JSON.parse(localStorage.getItem("cadran_scores")) || [];
  scores.push({
    name: playerName,
    attempts: 10 - remainingAttempts,
    time: timer,
    date: new Date().toLocaleDateString("fr-FR")
  });
  scores.sort((a, b) => a.attempts - b.attempts || a.time - b.time);
  localStorage.setItem("cadran_scores", JSON.stringify(scores.slice(0, 10)));
}

window.addEventListener("DOMContentLoaded", () => {
  setupButtonListeners();

  // Appliquer le thème sombre si sauvegardé
  const currentMode = localStorage.getItem("theme");
  if (currentMode === "dark") {
    document.body.classList.add("dark-mode");
  }

  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const mode = document.body.classList.contains("dark-mode") ? "dark" : "light";
      localStorage.setItem("theme", mode);
    });
  }
});
