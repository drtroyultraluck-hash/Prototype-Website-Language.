// Utility functions
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// QUESTIONS
const QUESTIONS_MASTER = [
  {
    id: 1,
    q: "How do you say “thank you” in French?",
    choices: ["Merci", "Salamat", "Gracias", "Spasibo"],
    answer: "Merci",
    hasImage: false
  },
  {
    id: 2,
    q: "Where is this place located?",
    choices: ["Paris", "Lyon", "Nice", "Basilica of Notre-Dame de Fouviere"],
    answer: "Nice",
    hasImage: true,
    imageSrc: "nice.png",
    imageAlt: "placephotos/hokkaido.png"
  },
  {
    id: 3,
    q: "What is the most famous French bread that is long and thin with a crispy crust and a soft inside?",
    choices: ["Pandesal", "Pan de Coco", "Brioche", "Baguette"],
    answer: "Brioche",
    hasImage: false
  },
  {
    id: 4,
    q: "In France, is it considered rude to start a conversation without saying “Bonjour” first, even in shops?",
    choices: ["Yes, you should always say bonjour first, especially in restaurants", "No, it's okay not to say bonjour, it only means hello", "Yes, because in France saying “Bonjour” is a basic sign of respect and politeness.", "No, because you can alternatively say  hello in English, it doesn't matter." ],
    answer: "Yes, because in France saying “Bonjour” is a basic sign of respect and politeness.",
    hasImage: false
  },
  {
    id: 5,
    q: "What is this food called?",
    choices: ["Vichyssoise", "Camembert", "Fougasse", "Brie"],
    answer: "Camembert",
    hasImage: true,
    imageSrc: "camembert.jpg",
    imageAlt: "shoyu.png"
  },
  {
    id: 6,
    q: 'What is the meaning of France national motto, “Liberté, Égalité, Fraternité”?',
    choices: ["Liberty, Equality, Brotherhood", "Liberality, Equity, Bromance", "Liberspread, Equalizer, Brother-in-law", "Liver, Esophagus, Bread"],
    answer: "Liberty, Equality, Brotherhood",
    hasImage: false
  },
  {
    id: 7,
    q: "In what year did the French Revolution happen?",
    choices: ["1789", "1978", "1897", "1798"],
    answer: "1789",
    hasImage: false
  },
  {
    id: 8,
    q: "What do you call this food?",
    choices: ["Macarons", "Macaroons", "Macaroni", "Maki"],
    answer: "Macarons",
    hasImage: true,
    imageSrc: "macarons.jpg",
    imageAlt: "tonkatsu.png"
  },
  {
    id: 9,
    q: "The Eiffel Tower is located in ______.",
    choices: ["Paris", "Lyon", "Nice", "Camembert"],
    answer: "Paris",
    hasImage: false
  },
  {
    id: 10,
    q: "Where is this place located?",
    choices: ["Eiffel Tower in Paris", "Louvre Museum", "Basilica of Notre-Dame de Fouviere", "Vieux Lyon"],
    answer: "Louvre Museum",
    hasImage: true,
    imageSrc: "louvremuseum.webp",
    imageAlt: ""
  }
];

// DOM elements
const startBtn = document.getElementById('startBtn');
const introModal = document.getElementById('introModal');
const quizCard = document.getElementById('quizCard');
const questionText = document.getElementById('questionText');
const imgHolder = document.getElementById('imgHolder');
const questionImage = document.getElementById('questionImage');
const choicesContainer = document.getElementById('choices');
const checkBtn = document.getElementById('checkBtn');
const progressText = document.getElementById('progressText');

const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const scoreText = document.getElementById('scoreText');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const exitBtn = document.getElementById('exitBtn');

// State
let questions = [];
let currentIndex = 0;
let score = 0;
let selectedChoiceIndex = null;
let autoNextTimer = null;
let currentChoices = [];

// Initialize
function initQuiz(){
  questions = JSON.parse(JSON.stringify(QUESTIONS_MASTER));
  shuffleArray(questions);
  currentIndex = 0;
  score = 0;
  selectedChoiceIndex = null;
  updateProgress();
  showQuestion();
}

// Update header progress
function updateProgress(){
  progressText.textContent = `Quiz ${currentIndex + 1}/${questions.length}`;
}

// Show current question
function showQuestion(){
  clearAutoTimer();
  const q = questions[currentIndex];

  // Set question text
  questionText.textContent = q.q;

  // Image
  if (q.hasImage) {
    imgHolder.classList.remove('hidden');
    if (!q.imageSrc) {
      questionImage.src = '';
      questionImage.alt = q.imageAlt || 'Image placeholder — add your image by setting imageSrc in the question object';
      questionImage.style.minHeight = '120px';
      questionImage.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    } else {
      questionImage.src = q.imageSrc;
      questionImage.alt = q.imageAlt || '';
      questionImage.style.background = '';
    }
  } else {
    imgHolder.classList.add('hidden');
    questionImage.src = '';
  }

  // Prepare choices: shuffle choices and keep track which is correct
  currentChoices = q.choices.map(choiceText => ({ text: choiceText }));
  shuffleArray(currentChoices);

  // Render choices
  choicesContainer.innerHTML = '';
  currentChoices.forEach((c, idx) => {
    const card = document.createElement('button');
    card.className = 'choice';
    card.type = 'button';
    card.setAttribute('data-index', idx);

    // Letter label A-D
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = String.fromCharCode(65 + idx);
    const strong = document.createElement('strong');
    strong.textContent = c.text;

    card.appendChild(label);
    card.appendChild(strong);

    // click handler
    card.addEventListener('click', () => {
      if (card.classList.contains('correct') || card.classList.contains('wrong')) return;
      document.querySelectorAll('.choice').forEach(el => el.classList.remove('selected'));
      card.classList.add('selected');
      selectedChoiceIndex = idx;
      checkBtn.disabled = false;
    });

    choicesContainer.appendChild(card);
  });

  // reset button state
  checkBtn.disabled = true;
  checkBtn.textContent = (currentIndex === questions.length - 1) ? 'Finish' : 'Check and proceed';
  updateProgress();
}

// Evaluate selection
function evaluateAndProceed(){
  if (selectedChoiceIndex === null) return;
  const q = questions[currentIndex];

  const correctText = q.answer;
  let correctIdx = currentChoices.findIndex(c => c.text === correctText);

  // mark correct and wrong
  const choiceEls = document.querySelectorAll('.choice');
  choiceEls.forEach((el, idx) => {
    el.classList.remove('selected');
    if (idx === correctIdx) {
      el.classList.add('correct');
    }
    if (idx === selectedChoiceIndex && idx !== correctIdx) {
      el.classList.add('wrong');
    }

    el.disabled = true;
  });

  // update score
  if (selectedChoiceIndex === correctIdx) {
    score += 1;
  }

  // after 3 seconds, go to next or finish
  autoNextTimer = setTimeout(() => {
    if (currentIndex === questions.length - 1) {
      showResults();
    } else {
      currentIndex += 1;
      selectedChoiceIndex = null;
      showQuestion();
    }
  }, 3000);
}

// show results modal
function showResults(){
  const s = score;
  let title = '';
  let msg = '';

  if (s <= 4) {
    title = 'Need Improvement';
    msg = 'Keep studying — you can do better! Review a few topics and try again.';
  } else if (s <= 7) {
    title = 'Good Job';
    msg = 'Nice work — you have a solid base. A little more review and you\'ll be even better.';
  } else if (s <= 9) {
    title = 'Very Good!';
    msg = 'Great job — you\'re well prepared!';
  } else { // 10
    title = 'Excellent!';
    msg = 'You are now truly ready to meet France!';
  }

  resultTitle.textContent = title;
  resultMessage.textContent = msg;
  scoreText.textContent = `${s} / ${questions.length}`;

  // show result modal
  resultModal.classList.remove('hidden');
  resultModal.classList.add('active');
  resultModal.setAttribute('aria-hidden', 'false');
}

// clear timer if any
function clearAutoTimer(){
  if (autoNextTimer) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

// Event listeners
startBtn.addEventListener('click', () => {
  introModal.classList.remove('active');
  introModal.classList.add('hidden');
  initQuiz();
});

checkBtn.addEventListener('click', () => {
  // disable check button to prevent re-clicks
  checkBtn.disabled = true;
  evaluateAndProceed();
});

// Try again
tryAgainBtn.addEventListener('click', () => {
  resultModal.classList.remove('active');
  resultModal.classList.add('hidden');
  resultModal.setAttribute('aria-hidden', 'true');
  // reshuffle and reset
  initQuiz();
});

// Exit
exitBtn.addEventListener('click', () => {
  window.location.href = 'france-index.html';
});

// Accessibility: allow Enter to check
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !checkBtn.disabled) {
    checkBtn.click();
  }
});

// initialize intro state (we keep quiz hidden until start)
(function onLoad(){
})();