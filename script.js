import { maths3e, maths2de, physics3e, biology2de } from "./quiz-data.js";
import { quizCatalog } from "./quiz-catalog.js";

// --- Etat global de l'application ---
let index = 0;
let score = 0;
let isAnswerLocked = false; // Empêche de cliquer plusieurs fois de suite sur une réponse
let correctAnswersIndex = null; // Stocke l'index de la bonne réponse dans la liste affichée
let quizSize = 5;

// --- Configuration des thèmes et de la session active ---
// const quizTopics = [maths3e];
const selectedTopicIds = [quizCatalog[0].topics[0].id];
console.log("Topic de départ : ", quizCatalog[1].topics[0].file);
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
const quizSizeParamGroup = document.getElementById("quiz-size-params-group");
const topicsParamGroup = document.getElementById("topics-params-group");
const closeModalBtn = document.getElementById("close-modal-btn");

/**
 * Génère un nombre entier aléatoire compris entre 0 (inclus) et max (exclu)
 */
function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Fonction pour ajouter plusieurs attributs d'un coup
 * @param {HTMLElement} element
 * @param {Object} attributes
 */
function setAttributes(element, attributes) {
  if (!element || typeof attributes !== "object" || attributes === null) return;

  for (const [key, value] of Object.entries(attributes)) {
    if (value !== null && value !== undefined) {
      element.setAttribute(key, value);
    }
  }
}

/**
 * Chargement des questions correspondant aux sujets choisis
 */
async function loadSelectedQuestions() {
  /**
   * TO DO !!!!!!!!!!!!!!!!!!!
   * Function à créer pour fetch les questions correspondant aux topics choisis
   * -> doit retourner un tableau avec toutes les questions des thèmes choisis
   * (ce tableau sera ensuite exploité par la fonction generateQuiz() qui génèrera
   * un quiz en fonction du nombre de questions et des sujets choisis par
   * l'utilisateur)
   */
}

/**
 * Création dynamique du formulaire pour choisir les paramètres du quiz
 * (nombre de questions & thème(s))
 */
function createParamsForm() {
  // Nombre de questions (taille du quiz)
  const numberOfQuestions = [5, 10, 20];

  numberOfQuestions.forEach((element) => {
    let label = document.createElement("label");
    let input = document.createElement("input");
    label.textContent = element + " questions";
    label.classList.add("questions-group");
    setAttributes(input, {
      type: "radio",
      name: "size",
      value: element,
    });

    if (element == quizSize) {
      input.checked = true;
    }

    label.insertAdjacentElement("afterbegin", input);

    quizSizeParamGroup.insertAdjacentElement("beforeend", label);
  });

  // Choix des sujets (topics)
  quizCatalog.forEach((element) => {
    let divCategoryGroup = document.createElement("div");
    divCategoryGroup.classList.add("category-group");

    let h3 = document.createElement("h3");
    h3.textContent = element.label;

    let divCheckboxGroup = document.createElement("div");
    divCheckboxGroup.classList.add("checkbox-group");

    divCategoryGroup.insertAdjacentElement("afterbegin", h3);
    divCategoryGroup.insertAdjacentElement("beforeend", divCheckboxGroup);
    topicsParamGroup.insertAdjacentElement("beforeend", divCategoryGroup);

    element.topics.forEach((topic) => {
      let labelTopic = document.createElement("label");
      labelTopic.textContent = topic.label;

      let inputTopic = document.createElement("input");
      setAttributes(inputTopic, {
        type: "checkbox",
        name: "topic",
        value: topic.id,
      });

      if (selectedTopicIds.includes(topic.id)) {
        inputTopic.checked = true;
      }

      labelTopic.insertAdjacentElement("afterbegin", inputTopic);
      divCheckboxGroup.insertAdjacentElement("beforeend", labelTopic);
    });
  });
}

/**
 * Génère une session de quiz aléatoire en fonction de la taille choisie
 * et des sujets sélectionnés par l'utilisateur
 */
async function generateQuiz() {
  const allQuestions = await loadSelectedQuestions();

  if (allQuestions.length === 0) {
    throw new Error("Aucune question n'est disponible sur ce sujet.");
  }

  // Mélane aléatoire avec la méthode de Fisher Yates
  for (let i = allQuestions.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i+1));
    let k = allQuestions[i];
    allQuestions[i] = allQuestions[j];
    allQuestions[j] = k;
  }

  // Remise à zéro du quiz (nécessaire s'il y a eu une partie avant)
  quiz.length = 0;

  // Ajout des questions sélectionnées au quiz
  const selectedQuestions = allQuestions.slice(0, quizSize);

  quiz.push(...selectedQuestions.map((question) => ({ ...question })));
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

  // Insère la bonne réponse à une position aléatoire parmi les mauvaises réponses
  const answers = wrongAnswers.toSpliced(
    randomNumber,
    0,
    quiz[questionIndex].right,
  );

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
  // 1. Application visuelle au formulaire de l'état réel des paramètres du quiz
  // Pour le nombre de questions
  const sizeRadios = paramsForm.querySelectorAll("input[name='size']");
  sizeRadios.forEach((radio) => {
    radio.checked = Number(radio.value) === quizSize;
  });

  // Pour le(s) thème(s)

  const topicCheckboxes = paramsForm.querySelectorAll('input[name="topic"]');
  topicCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectedTopicIds.includes(checkbox.value);
  });
  // document.getElementById("theme1").checked = quizTopics.includes(maths3e);
  // document.getElementById("theme2").checked = quizTopics.includes(maths2de);
  // document.getElementById("theme3").checked = quizTopics.includes(physics3e);
  // document.getElementById("theme4").checked = quizTopics.includes(biology2de);

  // 2. Ouverture de la modale
  paramsModal.showModal();
});

closeModalBtn.addEventListener("click", () => {
  paramsModal.close();
});

paramsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(paramsForm);
  const selectedSize = formData.get("size");
  const selectedTopics = formData.getAll("topic");
  // const selectedTheme1 = formData.get("theme1");
  // const selectedTheme2 = formData.get("theme2");
  // const selectedTheme3 = formData.get("theme3");
  // const selectedTheme4 = formData.get("theme4");

  // Validation : s'assurer qu'au moins un thème est coché
  if (selectedTopics.length === 0
    // !selectedTheme1 &&
    // !selectedTheme2 &&
    // !selectedTheme3 &&
    // !selectedTheme4
  ) {
    alert("Veuillez sélectionner au moins un sujet !");
    return;
  }

  quizSize = Number(selectedSize);

  // Met à jour dynamiquement les thèmes actifs du quiz
  selectedTopicIds.splice(0, selectedTopicIds.length, ...selectedTopics);
  // quizTopics.length = 0;
  // if (selectedTheme1 === "maths-3e") {
  //   quizTopics.push(maths3e);
  // }
  // if (selectedTheme2 === "maths-2de") {
  //   quizTopics.push(maths2de);
  // }
  // if (selectedTheme3 === "physics-3e") {
  //   quizTopics.push(physics3e);
  // }
  // if (selectedTheme4 === "biology-2de") {
  //   quizTopics.push(biology2de);
  // }

  paramsModal.close();
  restart();
});

reviewQuizBtn.addEventListener("click", showAnswers);
restartBtn.addEventListener("click", restart);

// --- Initialisation de l'application au chargement ---
resultPara.classList.add("hidden");
reviewQuizBtn.classList.add("hidden");
restartBtn.classList.add("hidden");

createParamsForm();
/**
 * ATTENTION : 3 FONCTIONS COMMENTEES TEMPORAIREMENT
 * (Utile pendant l'étape de la refactorisation consistant à
 * mettre au point et tester la génération automatique du choix
 * des matières dans la modale)
 */
// generateQuiz();
// displayQuestion(index);
// displayAnswers(index);

// --- Enregistrement du Service Worker (PWA) ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker enregistré avec succès, scope : ",
          registration.scope,
        );

        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateBanner(newWorker);
            }
          });
        });

        if (registration.waiting && navigator.serviceWorker.controller) {
          showUpdateBanner(registration.waiting);
        }
      })
      .catch((error) => {
        console.error("Echec de l'enregistrement du ServiceWorker : ", error);
      });
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

// Affiche la bannière de mise à jour et gère le clic de l'utilisateur
function showUpdateBanner(worker) {
  const updateBanner = document.getElementById("update-banner");
  const updateBtn = document.getElementById("update-btn");

  if (updateBanner) {
    updateBanner.classList.remove("hidden");

    updateBtn.addEventListener("click", () => {
      worker.postMessage({ type: "SKIP_WAITING" });
    });
  }
}
