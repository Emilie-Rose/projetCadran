//var password = generatePassword();
var password = "221"
var remainingAttempts = 10;
var enteredPasswords = [];
var passwordHistory = document.getElementById("passwordHistory");

// génère un mot de passe à 3 chiffres aléatoire en sélectionnant des chiffres de manière aléatoire et en les supprimant de la liste des chiffres disponibles.
function generatePassword() {
    var password = "";
    var digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    for (var i = 0; i < 3; i++) {
        var randomIndex = Math.floor(Math.random() * digits.length);
        password += digits[randomIndex];
        digits.splice(randomIndex, 1);
    }
    return password;
}
// lorsque l'utilisateur clique sur l'un des boutons du cadran. Elle ajoute le chiffre sélectionné au champ de texte d'entrée, sauf si le mot de passe est déjà complet
function dial(number) {
    var input = document.getElementById("input");
    if (input.value.length < 3) {
        input.value += number;
    }
}
// lorsque l'utilisateur clique sur le bouton "Vérifier". Elle vérifie si le mot de passe entré est correct et met à jour le résultat en conséquence. Elle gère également les cas où le mot de passe est incorrect ou lorsque le nombre d'essais restants atteint zéro.
function checkPassword() {
    var input = document.getElementById("input");
    var result = document.getElementById("result");
    var enteredPassword = input.value;
    var displayPassword = "";

    if (enteredPassword.length === 3) {
        if (enteredPasswords.includes(enteredPassword)) {
            result.innerHTML = "Vous avez déjà entré ce mot de passe!";
            result.style.color = "maroon";
            input.value = "";
            return;
        }

        enteredPasswords.push(enteredPassword);

        for (var i = 0; i < enteredPassword.length; i++) {
            var digit = enteredPassword.charAt(i);
            if (password.includes(digit)) {
                if (digit === password.charAt(i)) {
                    displayPassword += '<span class="correct-position">' + digit + '</span>';
                } else {
                    displayPassword += '<span class="correct">' + digit + '</span>';
                }
            } else {
                displayPassword += digit;
            }
        }

        if (enteredPassword === password) {
            result.innerHTML = "Mot de passe correct!";
            result.style.color = "black";
            input.disabled = true;
            document.getElementById("remaining").innerHTML = "0";
            document.getElementById("suiteButton").style.display = "block";
        } else {
            remainingAttempts--;
            if (remainingAttempts === 0) {
                result.innerHTML = "Nombre maximal d'essais atteint. Le mot de passe était : " + password;
                result.style.color = "black";
                input.disabled = true;
                document.getElementById("remaining").innerHTML = "0";
                document.getElementById("suiteButton").style.display = "block";
            } else {
                result.innerHTML = "Mot de passe incorrect! " + "<br> Mot de passe entré : " + displayPassword;
                result.style.color = "black";
                input.value = "";
                document.getElementById("remaining").innerHTML = remainingAttempts;
            }
        }
        if (remainingAttempts === 0 || enteredPassword === password) {
            minAttempts = Math.min(minAttempts, 10 - remainingAttempts);
        }
        function displayMinAttemptsHistory() {
            var historique = document.getElementById("historique");
            historique.innerHTML = "Nombre minimum de coups pour trouver le bon mot de passe : " + minAttempts;
        }
        var passwordHistory = document.getElementById("passwordHistory");
        var listItem = document.createElement("div");
        listItem.innerHTML = enteredPassword;
        passwordHistory.appendChild(listItem);
    }
}
// lorsque l'utilisateur clique sur le bouton "Suite". Elle redirige l'utilisateur vers une autre page (autre-page.html).
function redirectToOtherPage() {
    displayMinAttemptsHistory();
    window.location.href = "autre-page.html";
}

var minAttempts = Infinity; // Initialise le nombre minimum de coups à une valeur très élevée pour commencer.