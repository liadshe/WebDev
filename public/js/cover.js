document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cover").forEach((cover) => {
    const img = cover.querySelector(".cover-image");
    const btn = cover.querySelector(".play-overlay");
    const video = cover.querySelector(".cover-video");

    function playTransition() {
      cover.classList.add("playing");
      video.style.visibility = "visible";
      try {
        video.currentTime = 0;
      } catch {}
      video.muted = true;

      requestAnimationFrame(() => {
        video.play().catch(() => {
          video.muted = false;
          video.controls = true;
        });
      });
    }

    img.addEventListener("click", playTransition);
    btn.addEventListener("click", playTransition);
  });
});
