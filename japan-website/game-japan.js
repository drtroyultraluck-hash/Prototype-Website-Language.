(() => {
  const puzzleContainer = document.getElementById('puzzleContainer');
  const startBtn = document.getElementById('startBtn');
  const difficultySelect = document.getElementById('difficulty');
  const timerEl = document.getElementById('timer');
  const overlay = document.getElementById('messageOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlaySub = document.getElementById('overlaySub');
  const exitBtn = document.getElementById('exitBtn');
  const bgImage = document.getElementById('bgImage');
  const tryAgainBtn = document.getElementById('tryAgainBtn');
  const nextLevelBtn = document.getElementById('nextLevelBtn');

  //imageplaceholder
  const LEVEL_IMAGES = {
    easy: {
      puzzle: "mountfuji.png",
      background: "tokyo.png"
    },
    medium: {
      puzzle: "hokkaido.png",
      background: "tokyo.png"
    },
    hard: {
      puzzle: "kyoto.png",
      background: "tokyo.png"
    }
  };

  const DIFFICULTY = {
    easy: {rows: 3, cols: 3, time: 150},
    medium: {rows: 4, cols: 6, time: 180},
    hard: {rows: 6, cols: 8, time: 360}
  };

  const refWrap = document.getElementById('refWrap');
  const refImage = document.getElementById('refImage');
  const levelSelectOverlay = document.getElementById('levelSelectOverlay');
  const levelButtons = document.querySelectorAll('.level-btn');
  const refBtn = document.getElementById('refBtn');

  async function preparePreviewOnly() {
    clearInterval(timer);
    started = false;
    initFromDifficulty();
    await preloadForLevel();
    buildPieces();
    timerEl.textContent = formatTime(timeLeft);
  }

  levelButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = btn.dataset.level;
      difficultySelect.value = lvl;
      levelSelectOverlay.classList.add('hidden');
      preparePreviewOnly();
    });
  });

  let rows = 4, cols = 6, order = [], original = [];
  let selectedIndex = null;
  let timer = null;
  let timeLeft = 0;
  let started = false;
  let currentImage = "";

  function initFromDifficulty() {
    const level = difficultySelect.value;
    const d = DIFFICULTY[level];
    rows = d.rows;
    cols = d.cols;
    timeLeft = d.time;

    currentImage = LEVEL_IMAGES[level].puzzle;
    bgImage.style.backgroundImage = `url(${LEVEL_IMAGES[level].background})`;
  }

  function formatTime(s) {
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function loadImage(src){
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = src;
    });
  }

  async function preloadForLevel(){
    const level = difficultySelect.value;
    const urls = [LEVEL_IMAGES[level].puzzle, LEVEL_IMAGES[level].background];
    try{
      await Promise.all(urls.map(u => loadImage(u)));
      return true;
    }catch{
      return false;
    }
  }

  function buildPieces() {
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const total = rows * cols;
    original = Array.from({length: total}, (_, i) => i);
    order = shuffle([...original]);

    const bgSizeX = cols * 100;
    const bgSizeY = rows * 100;

    const denomX = (cols - 1) || 1;
    const denomY = (rows - 1) || 1;

    for (let i = 0; i < total; i++) {
      const piece = document.createElement('div');
      piece.className = 'piece';

      const imgIndex = order[i];
      const r = Math.floor(imgIndex / cols);
      const c = imgIndex % cols;

      const posX = (c / denomX) * 100;
      const posY = (r / denomY) * 100;

      piece.style.backgroundImage = `url(${currentImage})`;
      piece.style.backgroundSize = `${bgSizeX}% ${bgSizeY}%`;
      piece.style.backgroundPosition = `${posX}% ${posY}%`;

      piece.addEventListener('click', () => onPieceClick(i));
      puzzleContainer.appendChild(piece);
    }
  }

function onPieceClick(index) {
  if (!started) return;

  const pieces = puzzleContainer.children;

  if (selectedIndex === null) {
    selectedIndex = index;
    pieces[index].classList.add("selected");
    return;
  }

  pieces[selectedIndex].classList.remove("selected");

  if (selectedIndex === index) {
    selectedIndex = null;
    return;
  }

  swapPieces(selectedIndex, index);
  selectedIndex = null;

  if (isSolved()) win();
}

  function swapPieces(a, b) {
    const pa = puzzleContainer.children[a];
    const pb = puzzleContainer.children[b];
    const t = pa.style.backgroundPosition;
    pa.style.backgroundPosition = pb.style.backgroundPosition;
    pb.style.backgroundPosition = t;
    [order[a], order[b]] = [order[b], order[a]];
  }

  function isSolved() {
    return order.every((val, i) => val === original[i]);
  }

  function startTimer() {
    clearInterval(timer);
    timerEl.textContent = formatTime(timeLeft);
    timer = setInterval(() => {
      timeLeft--;
      timerEl.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(timer);
        lose();
      }
    }, 1000);
  }

function win() {
  started = false;
  clearInterval(timer);

  const puzzleBoard = document.getElementById("puzzleContainer");

  puzzleBoard.classList.add("win-animation");

  setTimeout(() => {
    puzzleBoard.classList.remove("win-animation");

    overlayTitle.textContent = 'Congratulations, you win!';
    overlaySub.textContent = 'You completed the puzzle successfully.';
    overlay.classList.remove('hidden');
  }, 1000);
}

  function lose() {
    started = false;
    clearInterval(timer);
    overlayTitle.textContent = 'You Lose! Try again.';
    overlaySub.textContent = 'Time ran out.';
    overlay.classList.remove('hidden');
  }

  async function startNewGame(){
    initFromDifficulty();
    await preloadForLevel();
    buildPieces();
    selectedIndex = null;
    started = true;
    startTimer();
  }

  // =============================
  // EVENT BINDINGS
  // =============================

  startBtn.addEventListener('click', () => startNewGame());

  difficultySelect.addEventListener('change', async () => {
    await preparePreviewOnly();
  });

  // ✅ TRY AGAIN
  tryAgainBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    startNewGame();
  });

  // ✅ NEXT LEVEL
  nextLevelBtn.addEventListener('click', () => {
    const currentLevel = difficultySelect.value;

    if (currentLevel === 'easy') {
      difficultySelect.value = 'medium';
    } else if (currentLevel === 'medium') {
      difficultySelect.value = 'hard';
    } else {
      difficultySelect.value = 'hard';
    }

    overlay.classList.add('hidden');
    preparePreviewOnly();
  });

  // EXIT
  exitBtn.addEventListener('click', () => {
    window.location.href = 'japan-index.html';
  });

  // Reference button
  if (refBtn && refWrap && refImage) {
    refBtn.addEventListener('click', () => {
      const level = difficultySelect.value;
      refImage.src = LEVEL_IMAGES[level].puzzle;
      refWrap.classList.toggle('hidden');
    });

    refWrap.addEventListener('click', () => {
      refWrap.classList.add('hidden');
    });
  }

  initFromDifficulty();
  buildPieces();
  timerEl.textContent = formatTime(timeLeft);

})();