const slides = document.querySelectorAll('.slide');
const title = document.getElementById('countryTitle');
const toggle = document.querySelector('.theme-toggle');

/* ========================= */
/* ✅ ADDED: CENTER QUOTE ELEMENT */
/* ========================= */
const quote = document.getElementById('countryQuote');

/* ========================= */
/* ✅ ADDED: COUNTRY QUOTES DATA */
/* ========================= */
const countryQuotes = {
  Japan: `"The soul of language lives in silence."`,
  France: `"Language is the poetry of a nation."`,
  Spain: `"Every word carries fire and rhythm."`
};

let current = 0;

/* ========================= */
/* SLIDE + TEXT TRANSITION */
/* ========================= */
function changeSlide() {

  slides[current].classList.remove('active');

  current = (current + 1) % slides.length;

  slides[current].classList.add('active');

  /* Animate title OUT */
  title.style.opacity = 0;
  title.style.transform = "translateY(20px)";

  /* Animate quote OUT */
  quote.style.opacity = 0;
  quote.style.transform = "translate(-50%, -40%)";

  setTimeout(() => {

    /* Update country name */
    title.textContent = slides[current].dataset.country;

    /* Update quote */
    quote.textContent = countryQuotes[slides[current].dataset.country];

    /* Animate title IN */
    title.style.opacity = 1;
    title.style.transform = "translateY(0)";

    /* Animate quote IN */
    quote.style.opacity = 1;
    quote.style.transform = "translate(-50%, -50%)";

  }, 400);
}

/* Auto change every 5 seconds */
setInterval(changeSlide, 5000);

/* ========================= */
/* THEME TOGGLE */
/* ========================= */
toggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
});