document.addEventListener("DOMContentLoaded", () => {
  if (!window.CURRENT_USER_ID || window.CURRENT_USER_ID === "guest") {
    console.warn("No user logged in; watch progress tracking disabled.");
    return;
  }
  document.querySelectorAll(".cover").forEach((cover) => {
    const video = cover.querySelector(".cover-video");
    const playPause = cover.querySelector(".playPause");

    const userId = window.CURRENT_USER_ID;
    const profileName = window.CURRENT_PROFILE;
    const contentId = cover.id;

    let updateTimer;

    // === Save progress ===
    async function sendProgress() {
      if (!video.duration) return;
      const progressSeconds = video.currentTime;
      const durationSeconds = video.duration;

      try {
        await fetch("/api/watch/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            profileName,
            contentId,
            progressSeconds,
            durationSeconds,
          }),
        });
      } catch (err) {
        console.error("Error saving progress:", err);
      }
    }

    // === Resume from saved progress ===
    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/watch/progress/${userId}/${profileName}/${contentId}`
        );
        const data = await res.json();
        if (data && data.progressSeconds && data.progressSeconds > 5) {
          video.currentTime = data.progressSeconds;
          console.log(`Resuming at ${Math.floor(data.progressSeconds)}s`);
        }
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    }

    // Load progress once video metadata is ready
    video.addEventListener("loadedmetadata", loadProgress);

    // === Track progress ===
    video.addEventListener("play", () => {
      if (!updateTimer) updateTimer = setInterval(sendProgress, 10000);
    });

    video.addEventListener("pause", () => {
      sendProgress();
      clearInterval(updateTimer);
      updateTimer = null;
    });

    video.addEventListener("ended", () => {
      sendProgress();
      clearInterval(updateTimer);
      updateTimer = null;
    });

    // When tab closes
    window.addEventListener("beforeunload", sendProgress);

    // === Toggle play/pause ===
    playPause.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playPause.textContent = "⏸";
      } else {
        video.pause();
        playPause.textContent = "▶";
      }
    });
  });
});
