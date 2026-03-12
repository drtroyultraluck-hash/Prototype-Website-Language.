document.querySelectorAll(".word-card").forEach(card => {
  const toggleBtn = card.querySelector(".toggle-btn");
  const audioBtn = card.querySelector(".audio-btn");
  const translation = card.querySelector(".translation");
  const image = card.querySelector(".word-image");
  const audio = card.querySelector(".audio-player");

  audioBtn.style.display = "none";

  toggleBtn.addEventListener("click", () => {
    translation.classList.toggle("show");
    image.classList.toggle("expanded");

    const active = translation.classList.contains("show");

    audioBtn.style.display = active ? "inline-flex" : "none";
    toggleBtn.textContent = active ? "Hide Translation" : "See Translation";
  });

  audioBtn.addEventListener("click", () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  });
});

const modal = document.getElementById("videoModal");
const video = document.getElementById("mainVideo");
const playBtn = document.querySelector(".video-btn");
const closeBtn = document.querySelector(".close-video");

playBtn.onclick = () => {
  modal.classList.add("active");
  video.play();
};

closeBtn.onclick = () => {
  modal.classList.remove("active");
  video.pause();
  video.currentTime = 0;
};

modal.onclick = (e) => {
  if(e.target === modal){
    modal.classList.remove("active");
    video.pause();
    video.currentTime = 0;
  }
};

document.querySelectorAll(".video-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    const card = btn.closest(".video-card");
    const video = card.querySelector(".video-thumb");

    const src = video.currentSrc || video.src;

    mainVideo.src = src;

    modal.classList.add("active");
    mainVideo.play();

  });

});

