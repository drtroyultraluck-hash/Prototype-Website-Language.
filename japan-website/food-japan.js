//ABOUT FOOD SECTION
const expandBtn = document.getElementById("expandBtn");
const aboutCard = document.getElementById("aboutCard");

expandBtn.addEventListener("click", () => {
  aboutCard.classList.toggle("expanded");
  expandBtn.textContent =
    aboutCard.classList.contains("expanded") ? "Collapse" : "Expand";
});

//FOOD SWIPER SECTION
document.querySelectorAll(".autoplay-section").forEach(section => {
  const swiperEl = section.querySelector(".autoplay-swiper");
  const wrapper = swiperEl.querySelector(".swiper-wrapper");

  /* SETTINGS */
  const speed = 1;
  const direction = section.dataset.direction === "reverse" ? 1 : -1;

  let currentSpeed = speed;
  let translateX = 0;
  let isPaused = false;

  /* INIT SWIPER (LAYOUT ONLY) */
  new Swiper(swiperEl, {
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: false,
    allowTouchMove: false,
  });

  /* DUPLICATE CONTENT ONCE (KEY FIX) */
  const originalSlides = Array.from(wrapper.children);
  originalSlides.forEach(slide => {
    wrapper.appendChild(slide.cloneNode(true));
  });

  /* WIDTH OF ONE SET ONLY */
  const getLoopWidth = () =>
    originalSlides.reduce(
      (total, slide) => total + slide.offsetWidth + 30,
      0
    );

  function tick() {
    currentSpeed += (isPaused ? 0 - currentSpeed : speed - currentSpeed) * 0.1;
    translateX += currentSpeed * direction;

    const loopWidth = getLoopWidth();

    /* PERFECT SEAMLESS LOOP */
    if (direction === -1 && translateX <= -loopWidth) {
      translateX += loopWidth;
    }

    if (direction === 1 && translateX >= 0) {
      translateX -= loopWidth;
    }

    wrapper.style.transform = `translate3d(${translateX}px,0,0)`;
    requestAnimationFrame(tick);
  }

  tick();

  /* PAUSE / RESUME */
wrapper.addEventListener("pointerenter", () => {
  isPaused = true;
});

wrapper.addEventListener("pointerleave", () => {
  isPaused = false;
});


  /* LIKE BUTTONS */
  section.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      btn.classList.toggle("active");
      btn.classList.add("pulse");
      setTimeout(() => btn.classList.remove("pulse"), 800);
    });
  });
});

//INNER MODAL
const modalOverlay = document.getElementById('foodModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalInfo = document.getElementById('modalInfo');
const closeBtn = document.querySelector('.modal-close');

/* OPEN MODAL */
document.querySelectorAll('.swiper-slide').forEach(slide => {
  slide.addEventListener('click', () => {
    modalImg.src = slide.dataset.image;
    modalTitle.textContent = slide.dataset.title;
    modalInfo.textContent = slide.dataset.info;

    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
  });
});

/* CLOSE FUNCTIONS */
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.classList.remove('modal-open');
}

/* close button */
closeBtn.addEventListener('click', closeModal);

/* click outside modal */
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

/* ESC key */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});







