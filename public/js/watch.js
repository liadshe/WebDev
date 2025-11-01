document.addEventListener("DOMContentLoaded", () => {
  if (!window.CURRENT_USER_ID || window.CURRENT_USER_ID === "guest") {
    console.warn("No user logged in; watch progress tracking disabled.");
    return;
  }

  console.log(
    "✅ Watch tracking initialized for user:",
    window.CURRENT_USER_ID
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
    const volumeControl = cover.querySelector(".volume-control");
    const volumeToggle = cover.querySelector(".volumeToggle");
    const volumeSlider = cover.querySelector(".volumeSlider");

    const userId = window.CURRENT_USER_ID;
    const profileName = window.CURRENT_PROFILE;
    const contentId = cover.id;

    /* --- Play video --- */
    function playTransition() {
      videoWrapper.classList.remove("hidden");
      cover.classList.add("playing");
      video.muted = false;
      video.play().catch(console.error);
    }
    img.addEventListener("click", playTransition);
    btn.addEventListener("click", playTransition);

    /* --- Load watch progress --- */
    async function loadProgress() {
      try {
        const res = await fetch(
          `/api/watch/progress/${userId}/${profileName}/${contentId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.progressSeconds > 0) {
          const resume = Math.floor(data.progressSeconds);
          const setWhenReady = () => {
            if (video.readyState >= 1 && video.duration > 0) {
              video.currentTime = resume;
              console.log(`✅ Resumed playback at ${resume}s`);
            } else setTimeout(setWhenReady, 150);
          };
          setWhenReady();
        }
      } catch (err) {
        console.error("❌ Error loading progress:", err);
      }
    }
    video.addEventListener("loadedmetadata", loadProgress);

    /* --- Save watch progress --- */
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
    window.addEventListener("beforeunload", sendProgress);

    /* --- Format time --- */
    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    function updateTimeDisplay() {
      const c = video.currentTime || 0;
      const t = video.duration || 0;
      if (timeDisplay) timeDisplay.textContent = `${fmt(c)} / ${fmt(t)}`;
    }

    /* --- Hover controls --- */
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

    /* --- Play/Pause --- */
    function togglePlay() {
      video.paused ? video.play() : video.pause();
      showControls();
    }

    playPause.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

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

    /* --- Seek --- */
    backward.addEventListener("click", () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    });
    forward.addEventListener("click", () => {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showControls();
    });

    video.addEventListener("timeupdate", () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      timeline.value = pct;
      timeline.style.setProperty("--progress", `${pct}%`);
      updateTimeDisplay();
    });

    timeline.addEventListener("input", () => {
      if (!video.duration) return;
      const seek = (timeline.value / 100) * video.duration;
      video.currentTime = seek;
      updateTimeDisplay();
    });

    /* --- Fullscreen --- */
    fullscreenBtn.addEventListener("click", () => {
      if (!document.fullscreenElement)
        cover.requestFullscreen().catch(console.error);
      else document.exitFullscreen();
      showControls();
    });

    /* --- Volume --- */
    let lastVolume = parseFloat(localStorage.getItem("lastVolume")) ?? 1.0;
    video.volume = lastVolume;
    volumeSlider.value = lastVolume;
    paintVolumeBar();
    updateVolumeIcon();

    function updateVolumeIcon() {
      if (video.muted || video.volume === 0) volumeToggle.textContent = "🔇";
      else if (video.volume < 0.5) volumeToggle.textContent = "🔉";
      else volumeToggle.textContent = "🔊";
    }

    function paintVolumeBar() {
      const vol = video.muted ? 0 : video.volume;
      const pct = Math.round(vol * 100);
      volumeSlider.style.background = `linear-gradient(to right, red 0%, red ${pct}%, rgba(255,255,255,0.3) ${pct}%, rgba(255,255,255,0.3) 100%)`;
    }

    volumeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = lastVolume || 1.0;
        volumeSlider.value = video.volume;
      } else {
        video.muted = true;
      }
      updateVolumeIcon();
      paintVolumeBar();
      localStorage.setItem("lastVolume", video.volume);
    });

    volumeSlider.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      video.volume = val;
      video.muted = val === 0;
      lastVolume = val;
      updateVolumeIcon();
      paintVolumeBar();
      localStorage.setItem("lastVolume", val);
    });

    video.addEventListener("volumechange", () => {
      volumeSlider.value = video.muted ? 0 : video.volume;
      updateVolumeIcon();
      paintVolumeBar();
    });
  });
});
