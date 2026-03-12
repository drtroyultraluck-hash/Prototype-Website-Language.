const expandBtn = document.getElementById("expandBtn");
const aboutCard = document.getElementById("aboutCard");

expandBtn.addEventListener("click", () => {
  aboutCard.classList.toggle("expanded");
  expandBtn.textContent =
    aboutCard.classList.contains("expanded") ? "Collapse" : "Expand";
});

const cards = document.querySelectorAll('.flip-card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    const alreadyFlipped = card.classList.contains('flipped');

    // unflip all cards
    cards.forEach(c => c.classList.remove('flipped'));

    // flip only if it wasn't already flipped
    if (!alreadyFlipped) {
      card.classList.add('flipped');
    }
  });
});

let activeCard = null;
const cardModal = document.getElementById('cardModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('cardModalClose');

function openCardModal(card) {
  activeCard = card;

  modalTitle.textContent = card.dataset.title;
  modalText.textContent = card.dataset.content;

  modalImage.src = card.dataset.img;
  modalImage.alt = card.dataset.title;

  console.log(card.dataset.img);

  const cardRect = card.getBoundingClientRect();
  const modalContent = cardModal.querySelector('.card-modal-content');

  // STEP 1: Show modal instantly (no animation yet)
  cardModal.style.transition = 'none';
  modalContent.style.transition = 'none';
  cardModal.classList.add('active');
  document.body.classList.add('modal-open');

  const modalRect = modalContent.getBoundingClientRect();

  // STEP 2: FLIP math
  const scaleX = cardRect.width / modalRect.width;
  const scaleY = cardRect.height / modalRect.height;

  const translateX =
    cardRect.left + cardRect.width / 2 -
    (modalRect.left + modalRect.width / 2);

  const translateY =
    cardRect.top + cardRect.height / 2 -
    (modalRect.top + modalRect.height / 2);

  // STEP 3: Set inverted position
  modalContent.style.transform = `
    translate(${translateX}px, ${translateY}px)
    scale(${scaleX}, ${scaleY})
  `;

  modalContent.style.visibility = 'visible';
  modalContent.style.opacity = '1';


  // STEP 4: Play animation
  requestAnimationFrame(() => {
    cardModal.style.transition =
      'backdrop-filter 0.4s ease, background 0.4s ease';

    modalContent.style.transition =
      'transform 0.6s cubic-bezier(.22,1,.36,1)';

    modalContent.style.transform = 'translate(0px, 0px) scale(1)';
  });
}


function closeCardModal() {
  if (!activeCard) return;

  const modalContent = cardModal.querySelector('.card-modal-content');
  const cardRect = activeCard.getBoundingClientRect();
  const modalRect = modalContent.getBoundingClientRect();

  /* FLIP math */
  const scaleX = cardRect.width / modalRect.width;
  const scaleY = cardRect.height / modalRect.height;

  const translateX =
    cardRect.left + cardRect.width / 2 -
    (modalRect.left + modalRect.width / 2);

  const translateY =
    cardRect.top + cardRect.height / 2 -
    (modalRect.top + modalRect.height / 2);

  /* STEP 1 — Zoom back + fade content together */
  modalContent.style.transition =
    'transform 0.5s cubic-bezier(.22,1,.36,1), opacity 0.25s ease';

  modalContent.style.transform = `
    translate(${translateX}px, ${translateY}px)
    scale(${scaleX}, ${scaleY})
  `;

  modalContent.style.opacity = '0';

  /* STEP 2 — Blur fade out */
  cardModal.style.transition =
    'backdrop-filter 0.4s ease, background 0.4s ease';

  cardModal.style.background = 'rgba(0,0,0,0)';
  cardModal.style.backdropFilter = 'blur(0px)';

  /* STEP 3 — Hard hide after animation finishes */
  setTimeout(() => {
    modalContent.style.visibility = 'hidden';
  }, 500);

  /* STEP 4 — Cleanup / reset */
  setTimeout(() => {
    cardModal.classList.remove('active');

    modalContent.style.transition = '';
    modalContent.style.transform = '';
    modalContent.style.opacity = '1';
    modalContent.style.visibility = 'visible';

    modalImage.src = '';
    modalImage.alt = '';


    cardModal.style.background = '';
    cardModal.style.backdropFilter = '';

    document.body.classList.remove('modal-open');

    activeCard = null;
  }, 500);
}

document.querySelectorAll('.writing-card').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    openCardModal(card);
  });
});

modalClose.addEventListener('click', closeCardModal);

cardModal.addEventListener('click', e => {
  if (e.target === cardModal) closeCardModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activeCard) {
    closeCardModal();
  }
});
