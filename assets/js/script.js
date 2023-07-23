let password = generatePassword();
let remainingAttempts = 10;
let enteredPasswords = [];
let passwordHistory = document.getElementById("passwordHistory");
let clickSound = new Audio('assets/audio/son_toucheMachAEcrire.mp3'); 
// génère un mot de passe à 3 chiffres aléatoire en sélectionnant des chiffres de manière aléatoire et en les supprimant de la liste des chiffres disponibles.
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
// lorsque l'utilisateur clique sur l'un des boutons du cadran. Elle ajoute le chiffre sélectionné au champ de texte d'entrée, sauf si le mot de passe est déjà complet
function dial(number) {
  clickSound.play();
  let input = document.getElementById("input");
  if (input.value.length < 3) {
    input.value += number;
  }
}

// btn verifier : Elle vérifie si le mot de passe entré est correct et met à jour le résultat en conséquence. Elle gère également les cas où le mot de passe est incorrect ou lorsque le nombre d'essais restants atteint zéro.
function checkPassword() {
  let input = document.getElementById("input");
  let result = document.getElementById("result");
  let enteredPassword = input.value;
  console.log(enteredPassword);
  let displayPassword = "";

  if (enteredPassword.length === 3) {
    if (enteredPasswords.includes(enteredPassword)) {
      result.innerHTML = "Vous avez déjà entré ce mot de passe!";
      result.style.color = "maroon";
      input.value = "";
      return;
    }

    enteredPasswords.push(enteredPassword);
    console.log(enteredPassword);

    for (let i = 0; i < enteredPassword.length; i++) {
      let digit = enteredPassword.charAt(i);
      if (password.includes(digit)) {
        if (digit === password.charAt(i)) {
          displayPassword +=
            '<span class="correct-position">' + digit + "</span>";
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
      document.getElementById("suiteButton").style.display = "block";
    } else {
      remainingAttempts--;
      if (remainingAttempts === 0) {
        result.innerHTML =
          "Nombre maximal d'essais atteint. Le mot de passe était : " +
          password;
        
        
        result.style.color = "maroon";
        result.style.fontWeight = "bold";
        result.style.fontStyle = "italic";
        input.disabled = true;
        document.getElementById("remaining").innerHTML = "0";
        document.getElementById("suiteButton").style.display = "block";
      } else {
        result.innerHTML =
          "Mot de passe incorrect! " +
          "<br> Mot de passe entré : " +
          displayPassword;
        result.style.color = "maroon";
        result.style.fontWeight = "bold";
        result.style.fontStyle = "italic";
        input.value = "";
        document.getElementById("remaining").innerHTML = remainingAttempts;
      }
    }
    if (remainingAttempts === 0 || enteredPassword === password) {
      minAttempts = Math.min(minAttempts, 10 - remainingAttempts);
    }
// function displayMinAttemptsHistory() {
//       let historique = document.getElementById("historique");
//       historique.innerHTML =
//         "Nombre minimum de coups pour trouver le bon mot de passe : " +
//         minAttempts;
// }
    let passwordHistory = document.getElementById("passwordHistory");
    let listItem = document.createElement("div");
    listItem.style.textAlign = "center";
    listItem.innerHTML = displayPassword;
    console.log(enteredPassword);
    passwordHistory.appendChild(listItem);
    //resetInput();
  }
}

// lorsque l'utilisateur clique sur le bouton "Suite". Elle redirige l'utilisateur vers une autre page (bravo.gif).
const suiteButton = document.getElementById("suiteButton");
 const redirectToOtherPage = () => {
  alert("Bravo !!! Fermez cette fenêtre pour decouvrir la surprise ?!");
  window.location.href = "assets/img/bravo.gif";

};

// creation du cadran et des boutons cliquables
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

  // Add event listeners to the dynamically created buttons
  let buttons = document.getElementsByClassName("button");
  for (let j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener("click", function () {
      dial(this.textContent);
    });
  }

  document
    .getElementById("suiteButton")
    .addEventListener("click", redirectToOtherPage);
}

// bouton Information
function showInfo(){
  alert("Instructions  : \n\n1. Recherchez un password à 3 chiffres en selectionnant une combinaison.\n\n2. Vous aurez 10 tentatives possible. \n\n3. Attention! Lors de la selection du password: Si le chiffre est correct mais mal placé, il sera affiché en orange. Si le chiffre est correct et bien placé, il sera affiché en vert. Si le chiffre est incorrect, il sera affiché en rouge. \n\n4.  Vous avez 10 essais pour deviner le mdp. \n\n Bonne chance à vous :) \n\n");

}

function clearInput() {
  document.getElementById("input").value = "";
}

//event listener
window.addEventListener("DOMContentLoaded", function () {
  setupButtonListeners();
});

// localstorage A faire apres ou avant le timer
// function updateScore(){
// // Récupérer les scores précédents du LocalStorage
// // Ajouter le score actuel (temps écoulé) à la liste
// // Trier les scores par ordre croissant (plus petit en premier)
//   // Enregistrer seulement les 5 premiers scores (les meilleurs)
//   // Enregistrer les scores dans le LocalStorage
//   // Déterminer le classement de l'utilisateur
//   // maj le texte de l'indicateur de classement
//   // Mettre à jour le meilleur score
// }

let minAttempts = Infinity; // Initialise le nombre minimum de coups à une valeur très élevée pour commencer.
