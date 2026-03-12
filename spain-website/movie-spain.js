const modal = document.getElementById("animeModal");
const closeBtn = document.querySelector(".close-btn");

const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");
const modalLink = document.getElementById("modalLink");


const trailerLinks = {
    "Your Name (Kimi no Na wa)": "https://www.youtube.com/watch?v=xU47nhruN-Q",
    "Demon Slayer": "https://www.youtube.com/watch?v=VQGCKyvzIM4",
    "Attack on Titan": "https://www.youtube.com/watch?v=MGRm4IzK1SQ"
};

/* OPEN MODAL WHEN CARD IS CLICKED */
document.querySelectorAll(".anime-card").forEach(card => {

    card.addEventListener("click", function () {
        modalTitle.innerHTML = this.dataset.title;
        modalDetails.innerHTML = this.dataset.details;
        modalLink.href = this.dataset.link;

        modal.classList.add("active");
    });

    /* WATCH TRAILER BUTTON */
    const trailerBtn = card.querySelector(".watch-btn");

    trailerBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // prevents modal from opening

        const title = card.dataset.title;
        const trailerURL = trailerLinks[title];

        if (trailerURL) {
            window.open(trailerURL, "_blank");
        }
    });
});

/* CLOSE MODAL FUNCTION */
function closeModal() {
    modal.classList.remove("active");
}

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});