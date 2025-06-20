let password = generatePassword();
let remainingAttempts = 10;
let enteredPasswords = [];
let passwordHistory = document.getElementById("passwordHistory");
let clickSound = new Audio('assets/audio/son_toucheMachAEcrire.mp3');
let timer = 0;
let interval;
let minAttempts = Infinity; // nombre minimum de tentatives (non utilisé encore mais prêt)

// Génère un mot de passe à 3 chiffres
function generatePassword() {
  let password = "";
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  for (let i = 0; i < 3; i++) {
    let randomIndex = Math.floor(Math.random() * digits.length);
    password += digits[randomIndex];
    digits.splice(randomIndex, 1);
  }
  return password;
}

// Ajoute un chiffre à la saisie utilisateur
function dial(number) {
  clickSound.play();
  let input = document.getElementById("input");
  if (input.value.length < 3) {
    input.value += number;
  }
}

// Vérifie le mot de passe saisi
function checkPassword() {
  let input = document.getElementById("input");
  let result = document.getElementById("result");
  let enteredPassword = input.value;
  let displayPassword = "";

  if (enteredPassword.length === 3) {
    if (enteredPasswords.includes(enteredPassword)) {
      result.innerHTML = "Vous avez déjà entré ce mot de passe!";
      result.style.color = "maroon";
      input.value = "";
      return;
    }

    enteredPasswords.push(enteredPassword);

    for (let i = 0; i < enteredPassword.length; i++) {
      let digit = enteredPassword.charAt(i);
      if (password.includes(digit)) {
        if (digit === password.charAt(i)) {
          displayPassword += '<span class="correct-position">' + digit + "</span>";
        } else {
          displayPassword += '<span class="correct">' + digit + "</span>";
        }
      } else {
        displayPassword += '<span class="incorrect">' + digit + "</span>";
      }
    }

    if (enteredPassword === password) {
      result.innerHTML = "Mot de passe correct!";
      result.style.color = "black";
      result.style.fontWeight = "bold";
      result.style.fontStyle = "italic";
      input.disabled = true;
      document.getElementById("remaining").innerHTML = "0";
      document.getElementById("progressBar").value = 0;
      document.getElementById("suiteButton").style.display = "block";
      document.getElementById("resetButton").style.display = "block";
      clearInterval(interval);
      saveScore();
    } else {
      remainingAttempts--;

      if (remainingAttempts === 0) {
        result.innerHTML = "Nombre maximal d'essais atteint. Le mot de passe était : " + password;
        result.style.color = "maroon";
        result.style.fontWeight = "bold";
        result.style.fontStyle = "italic";
        input.disabled = true;
        document.getElementById("remaining").innerHTML = "0";
        document.getElementById("progressBar").value = 0;
        document.getElementById("suiteButton").style.display = "block";
        document.getElementById("resetButton").style.display = "block";
        clearInterval(interval);
        saveScore();
      } else {
        result.innerHTML = "Mot de passe incorrect! <br>Mot de passe entré : " + displayPassword;
        result.style.color = "maroon";
        result.style.fontWeight = "bold";
        result.style.fontStyle = "italic";
        input.value = "";
        document.getElementById("remaining").innerHTML = remainingAttempts;
        document.getElementById("progressBar").value = remainingAttempts;
      }
    }

    if (remainingAttempts === 0 || enteredPassword === password) {
      minAttempts = Math.min(minAttempts, 10 - remainingAttempts);
    }

    let listItem = document.createElement("div");
    listItem.style.textAlign = "center";
    listItem.innerHTML = displayPassword;
    passwordHistory.appendChild(listItem);
  }
}

// Redirection vers le gif de victoire
const suiteButton = document.getElementById("suiteButton");
const redirectToOtherPage = () => {
  alert("Bravo !!! Fermez cette fenêtre pour découvrir la surprise ?!");
  window.location.href = "assets/img/bravo.gif";
};

// Réinitialise le jeu
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
  document.getElementById("resetButton").style.display = "none";
  document.getElementById("passwordHistory").innerHTML = "<h3>Historique des mots de passe proposés :</h3>";
}

// Crée le cadran et les boutons numériques
function setupButtonListeners() {
  let box = document.getElementById("box");

  for (let i = 1; i <= 9; i++) {
    let button = document.createElement("div");
    button.classList.add("button");
    button.textContent = i;
    box.appendChild(button);
  }

  let zeroButton = document.createElement("div");
  zeroButton.classList.add("button");
  zeroButton.setAttribute("id", "btn-0");
  zeroButton.textContent = "0";
  box.appendChild(zeroButton);

  let buttons = document.getElementsByClassName("button");
  for (let j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function () {
      dial(this.textContent);
    });
  }

  document.getElementById("suiteButton").addEventListener("click", redirectToOtherPage);
}

// Affiche les règles
function showInfo() {
  alert(
    "Instructions :\n\n" +
    "1. Recherchez un mot de passe à 3 chiffres en sélectionnant une combinaison.\n" +
    "2. Vous avez 10 tentatives.\n" +
    "3. Indices :\n" +
    "- Chiffre correct et bien placé : vert\n" +
    "- Chiffre correct mais mal placé : orange\n" +
    "- Chiffre incorrect : rouge\n\n" +
    "Bonne chance !"
  );
}

// Vide le champ de saisie
function clearInput() {
  document.getElementById("input").value = "";
}

// Démarre le timer
function startTimer() {
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = timer;
  }, 1000);
}

// Initialisation
window.addEventListener("DOMContentLoaded", function () {
  setupButtonListeners();
  startTimer();
  displayScores();
});
function saveScore() {
  const newScore = {
    time: timer,
    attempts: 10 - remainingAttempts,
    date: new Date().toLocaleString()
  };

  // Récupère les anciens scores ou crée une liste vide
  let scores = JSON.parse(localStorage.getItem("cadran_scores")) || [];

  // Ajoute le nouveau score
  scores.push(newScore);

  // Trie par temps croissant
  scores.sort((a, b) => a.time - b.time);

  // Garde les 5 meilleurs
  scores = scores.slice(0, 5);

  // Sauvegarde
  localStorage.setItem("cadran_scores", JSON.stringify(scores));

  // Met à jour l'affichage
  displayScores();
}
function displayScores() {
  const scoreList = document.getElementById("scoreList");
  scoreList.innerHTML = ""; // Vide la liste

  const scores = JSON.parse(localStorage.getItem("cadran_scores")) || [];

  scores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1} – Temps : ${score.time}s | Coups : ${score.attempts} | Le ${score.date}`;
    scoreList.appendChild(li);
  });
}

