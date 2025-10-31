document.addEventListener("DOMContentLoaded", () => {
  if (!window.CURRENT_USER_ID || window.CURRENT_USER_ID === "guest") {
    console.warn("No user logged in; watch progress tracking disabled.");
    return;
  }

  console.log(
    "✅ Watch tracking initialized for user:",
    window.CURRENT_USER_ID,
    "| profile:",
    window.CURRENT_PROFILE
  );

  document.querySelectorAll(".cover").forEach((cover) => {
    const img = cover.querySelector(".cover-image");
    const btn = cover.querySelector(".play-overlay");
    const videoWrapper = cover.querySelector(".video-wrapper");
    const video = cover.querySelector(".cover-video");
    const controls = cover.querySelector(".controls");
    const playPause = cover.querySelector(".playPause");
    const backward = cover.querySelector(".backward");
    const forward = cover.querySelector(".forward");
    const timeline = cover.querySelector(".timeline");
    const fullscreenBtn = cover.querySelector(".fullscreen");
    const timeDisplay = cover.querySelector(".time-display");

    const userId = window.CURRENT_USER_ID;
    const profileName = window.CURRENT_PROFILE;
    const contentId = cover.id;

    // === Reveal and play ===
    function playTransition() {
      videoWrapper.classList.remove("hidden");
      cover.classList.add("playing");
      video.muted = true;
      video.play().catch(console.error);
    }

    img.addEventListener("click", playTransition);
    btn.addEventListener("click", playTransition);

    // === Load saved progress ===
    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/watch/progress/${userId}/${profileName}/${contentId}`
        );
        const data = await res.json();
        if (data && data.progressSeconds && data.progressSeconds > 5) {
          video.currentTime = data.progressSeconds;
          console.log(`⏪ Resuming at ${Math.floor(data.progressSeconds)}s`);
        }
      } catch (err) {
        console.error("❌ Error loading progress:", err);
      }
    }
    video.addEventListener("loadedmetadata", loadProgress);

    // === Save progress ===
    let updateTimer;
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
        console.error("❌ Error saving progress:", err);
      }
    }

    // === Format time (helper) ===
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
        2,
        "0"
      )}`;
    }

    // === Update time display ===
    function updateTimeDisplay() {
      const current = video.currentTime || 0;
      const total = video.duration || 0;
      if (timeDisplay)
        timeDisplay.textContent = `${formatTime(current)} / ${formatTime(
          total
        )}`;
    }

    // === Progress events ===
    video.addEventListener("play", () => {
      cover.classList.remove("paused");
      playPause.textContent = "⏸";
      if (!updateTimer) updateTimer = setInterval(sendProgress, 10000);
    });
    video.addEventListener("pause", () => {
      cover.classList.add("paused");
      playPause.textContent = "▶";
      sendProgress();
      clearInterval(updateTimer);
      updateTimer = null;
    });
    video.addEventListener("ended", () => {
      sendProgress();
      clearInterval(updateTimer);
      updateTimer = null;
    });
    window.addEventListener("beforeunload", sendProgress);

    // === Hover controls ===
    let controlsTimeout;
    function showControls() {
      controls.classList.add("show");
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (!video.paused) controls.classList.remove("show");
      }, 2500);
    }
    cover.addEventListener("mousemove", showControls);
    cover.addEventListener("mouseenter", showControls);
    cover.addEventListener("mouseleave", () => {
      if (!video.paused) controls.classList.remove("show");
    });

    // === Play/pause toggle ===
    playPause.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
      showControls();
    });

    // === Click video to toggle play/pause ===
    video.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
      showControls();
    });

    // === Backward / Forward buttons ===
    backward.addEventListener("click", () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    });
    forward.addEventListener("click", () => {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showControls();
    });

    // === Timeline progress & time update ===
    video.addEventListener("timeupdate", () => {
      if (!video.duration) return;
      const percent = (video.currentTime / video.duration) * 100;
      timeline.value = percent;
      timeline.style.setProperty("--progress", `${percent}%`);
      updateTimeDisplay();
    });

    video.addEventListener("loadedmetadata", updateTimeDisplay);

    // === Scrubbing ===
    let isScrubbing = false;
    timeline.addEventListener("input", () => {
      const seekTime = (timeline.value / 100) * video.duration;
      isScrubbing = true;
      video.currentTime = seekTime;
      timeline.style.setProperty("--progress", `${timeline.value}%`);
      updateTimeDisplay();
    });
    timeline.addEventListener("change", () => {
      if (isScrubbing) {
        video.currentTime = (timeline.value / 100) * video.duration;
        isScrubbing = false;
      }
    });

    // === Fullscreen ===
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        cover.requestFullscreen().catch(console.error);
      } else {
        document.exitFullscreen();
      }
      showControls();
    });
  });
});
