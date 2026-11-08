import { maths3e, maths2de, physics3e, biology2de } from "./quiz-data.js";

// --- Etat global de l'application ---
let index = 0;
let score = 0;
let isAnswerLocked = false; // Empêche de cliquer plusieurs fois de suite sur une réponse
let correctAnswersIndex = null; // Stocke l'index de la bonne réponse dans la liste affichée
let quizSize = 5;

// --- Configuration des thèmes et de la session active ---
const quizThemes = [maths3e];
const quiz = [];

// --- Eléments du DOM ---
const questionPara = document.getElementById("question");
const answersList = document.getElementById("answers-list");
const resultPara = document.getElementById("result");
const reviewQuizList = document.getElementById("review-quiz-list");
const reviewQuizBtn = document.getElementById("review-quiz-btn");
const restartBtn = document.getElementById("restart-btn");
const paramsBtn = document.getElementById("params-btn");
const paramsModal = document.getElementById("params-modal");
const paramsForm = document.getElementById("params-form");
const closeModalBtn = document.getElementById("close-modal-btn");

/**
 * Génère un nombre entier aléatoire compris entre 0 (inclus) et max (exclu)
 */
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Génère une session de quiz aléatoire en fonction de la taille choisie
 * et des thèmes sélectionnés par l'utilisateur
 */
function generateQuiz() {
  let randomNumbers = [];
  quiz.length = 0; // Remise à zéro du quiz (nécessaire s'il y a eu une partie avant)
  let quizThemesItems = [];
  
  // Fusionne tous les thèmes actifs choisis
  for (let i = 0; i < quizThemes.length; i++) {
    quizThemesItems = quizThemesItems.concat(quizThemes[i]);
  }

  // Sélectionne aléatoirement des questions uniques sans dépasser la taille demandée
  while (
    randomNumbers.length < quizSize &&
    randomNumbers.length < quizThemesItems.length
  ) {
    const randomNumber = getRandomNumber(quizThemesItems.length);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
      quiz.push({ ...quizThemesItems[randomNumber] });
    }
  }
}

/**
 * Réinitialise l'état du jeu pour lancer une nouvelle partie
 */
function restart() {
  restartBtn.classList.add("pressed");
  setTimeout(() => {
    restartBtn.classList.remove("pressed");
    questionPara.textContent = "";
    answersList.textContent = "";
    questionPara.classList.remove("hidden");
    answersList.classList.remove("hidden");
    reviewQuizList.innerHTML = "";
    reviewQuizList.classList.add("hidden");
    resultPara.innerHTML = "";
    resultPara.classList.add("hidden");
    reviewQuizBtn.classList.add("hidden");
    restartBtn.classList.add("hidden");

    generateQuiz();

    index = 0;
    score = 0;
    isAnswerLocked = false;
    displayQuestion(index);
    displayAnswers(index);
  }, 150);
}

/**
 * Affihce le récapitulatif complet de la partie (correction détaillée)
 */
function showAnswers() {
  reviewQuizList.textContent = "";

  for (let i = 0; i < quiz.length; i++) {
    const ul = document.createElement("ul");
    const liQuestion = document.createElement("li");
    const liRightAnswer = document.createElement("li");

    liQuestion.innerHTML = quiz[i].question;
    liRightAnswer.innerHTML = `Bonne réponse : ${quiz[i].right}`;

    if (quiz[i].answered === "correct") {
      liQuestion.classList.add("correct");
      liRightAnswer.classList.add("correct");
    } else {
      liQuestion.classList.add("incorrect");
      liRightAnswer.classList.add("incorrect");
    }

    reviewQuizList.appendChild(ul);
    ul.appendChild(liQuestion);
    ul.appendChild(liRightAnswer);
  }

  reviewQuizList.classList.remove("hidden");
  resultPara.classList.add("hidden");
  reviewQuizBtn.classList.add("hidden");
}

/**
 * Gère la logique lorsqu'un utilisateur clique sur une proposition de réponse
 */
function selectAnswer() {
  if (isAnswerLocked) return;

  isAnswerLocked = true;
  this.classList.add("pressed");

  // Vérifie si l'index de la réponse cliquée correspond à la bonne réponse
  if (Number(this.dataset.answerIndex) === correctAnswersIndex) {
    this.classList.add("right");
    quiz[index].answered = "correct";
    score++;
  } else {
    this.classList.add("wrong");
    quiz[index].answered = "incorrect";
  }

  // Passage à la question suivante ou à la fin du jeu
  setTimeout(() => {
    index++;

    if (index < quiz.length) {
      displayQuestion(index);
      answersList.textContent = "";
      displayAnswers(index);
      isAnswerLocked = false;
    } else {
      questionPara.textContent = "";
      answersList.textContent = "";
      questionPara.classList.add("hidden");
      answersList.classList.add("hidden");
      resultPara.innerText = `Votre score : ${score} sur ${quiz.length}`;
      resultPara.classList.remove("hidden");
      reviewQuizBtn.classList.remove("hidden");
      restartBtn.classList.remove("hidden");
    }
  }, 150);
}

/**
 * Affiche la question courante dans le DOM
 */
function displayQuestion(questionIndex) {
  questionPara.innerHTML = quiz[questionIndex].question;
}

/**
 * Mélange la bonne réponse et les mauvaises réponses de manière aléatoire,
 * puis les affiche sous forme de liste cliquable.
 */
function displayAnswers(questionIndex) {
  const wrongAnswers = quiz[questionIndex].wrong;
  const totalAnswersCount = wrongAnswers.length + 1;
  const randomNumber = getRandomNumber(totalAnswersCount);

  correctAnswersIndex = randomNumber;

  // Inère la bonne réponse à une position aléatoire parmi les mauvaises réponses
  const answers = wrongAnswers.toSpliced(randomNumber, 0, quiz[questionIndex].right);

  for (let i = 0; i < answers.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = answers[i];

    li.dataset.answerIndex = i;

    li.addEventListener("click", selectAnswer);
    answersList.appendChild(li);
  }
}

// ===========================================
// GESTION DES EVENEMENTS (EventListeners)
// ===========================================

// Gestion de la modale pour les paramètres du quiz
paramsBtn.addEventListener("click", () => {
  paramsModal.showModal();
});

closeModalBtn.addEventListener("click", () => {
  paramsModal.close();
});

paramsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(paramsForm);
  const selectedSize = formData.get("size");
  const selectedTheme1 = formData.get("theme1");
  const selectedTheme2 = formData.get("theme2");
  const selectedTheme3 = formData.get("theme3");
  const selectedTheme4 = formData.get("theme4");

  // Validation : s'assurer qu'au moins un thème est coché
  if (!selectedTheme1 && !selectedTheme2 && !selectedTheme3 && !selectedTheme4) {
    alert("Veuillez sélectionner au moins un thème !");
    return;
  }

  paramsModal.close();

  quizSize = Number(selectedSize);

  // Met à jour dynamiquement les thèmes actifs du quiz
  quizThemes.length = 0;
  if (selectedTheme1 === "maths-3e") {quizThemes.push(maths3e);}
  if (selectedTheme2 === "maths-2de") {quizThemes.push(maths2de);}
  if (selectedTheme3 === "physics-3e") {quizThemes.push(physics3e);}
  if (selectedTheme4 === "biology-2de") {quizThemes.push(biology2de);}

  restart();
});

reviewQuizBtn.addEventListener("click", showAnswers);
restartBtn.addEventListener("click", restart);

// --- Initialisation de l'application au chargement ---
resultPara.classList.add("hidden");
reviewQuizBtn.classList.add("hidden");
restartBtn.classList.add("hidden");

generateQuiz();
displayQuestion(index);
displayAnswers(index);
