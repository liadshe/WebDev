document.addEventListener("DOMContentLoaded", () => {
  const isWatchPage = document.body.classList.contains("watch-page");

  if (!window.CURRENT_USER_ID || window.CURRENT_USER_ID === "guest") {
    console.warn("No user logged in; watch progress tracking disabled.");
    return;
  }

  console.log(
    "✅ Watch tracking initialized for user:",
    window.CURRENT_USER_ID
  );

  document.querySelectorAll(".cover").forEach((cover) => {
    const videoWrapper = cover.querySelector(".video-wrapper");
    const video = cover.querySelector(".cover-video");
    const controls = cover.querySelector(".controls");
    const playPause = cover.querySelector(".playPause");
    const backward = cover.querySelector(".backward");
    const forward = cover.querySelector(".forward");
    const timeline = cover.querySelector(".timeline");
    const fullscreenBtn = cover.querySelector(".fullscreen");
    const timeDisplay = cover.querySelector(".time-display");
    const volumeToggle = cover.querySelector(".volumeToggle");
    const volumeSlider = cover.querySelector(".volumeSlider");

    if (!video || !controls) return;

    const userId = window.CURRENT_USER_ID;
    const profileName = window.CURRENT_PROFILE;
    const contentId = cover.id;

    // === VIDEO PLAY / PAUSE ===
    const playTransition = () => {
      videoWrapper.classList.remove("hidden");
      cover.classList.add("playing");
      video.muted = false;
      video.play().catch(console.error);
    };

    const togglePlay = () => {
      if (video.paused) video.play();
      else video.pause();
      showControls();
    };

    playPause.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });
    video.addEventListener("click", togglePlay);

    video.addEventListener("play", () => {
      playPause.textContent = "⏸";
      if (!updateTimer) updateTimer = setInterval(sendProgress, 10000);
    });

    video.addEventListener("pause", () => {
      playPause.textContent = "▶";
      sendProgress();
      clearInterval(updateTimer);
      updateTimer = null;
    });

    video.addEventListener("ended", async () => {
      clearInterval(updateTimer);
      updateTimer = null;
      try {
        await fetch("/api/watch/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            profileName,
            contentId,
            progressSeconds: video.duration,
            durationSeconds: video.duration,
          }),
        });
        console.log("✅ Marked video finished");
      } catch (err) {
        console.error("❌ Error marking finished:", err);
      }
    });

    // === SEEK ===
    backward.addEventListener("click", () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    });
    forward.addEventListener("click", () => {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showControls();
    });

    // === TIME & TIMELINE ===
    const fmt = (s) => {
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    const updateTimeDisplay = () => {
      const c = video.currentTime || 0;
      const t = video.duration || 0;
      timeDisplay.textContent = `${fmt(c)} / ${fmt(t)}`;
    };

    video.addEventListener("timeupdate", () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      timeline.value = pct;
      timeline.style.setProperty("--progress", `${pct}%`);
      updateTimeDisplay();
    });

    timeline.addEventListener("input", (e) => {
      e.stopPropagation();
      if (!video.duration) return;
      video.currentTime = (timeline.value / 100) * video.duration;
      updateTimeDisplay();
    });

    // === FULLSCREEN ===
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) videoWrapper.requestFullscreen();
      else document.exitFullscreen();
      showControls();
    });

    // === SHOW CONTROLS ON HOVER ===
    let controlsTimeout;
    const showControls = () => {
      controls.classList.add("show");
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (!video.paused) controls.classList.remove("show");
      }, 2500);
    };
    cover.addEventListener("mousemove", showControls);
    cover.addEventListener("mouseenter", showControls);
    cover.addEventListener("mouseleave", () => {
      if (!video.paused) controls.classList.remove("show");
    });

    // === WATCH PROGRESS ===
    let updateTimer;
    const sendProgress = async () => {
      if (!video.duration) return;
      try {
        await fetch("/api/watch/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            profileName,
            contentId,
            progressSeconds: video.currentTime,
            durationSeconds: video.duration,
          }),
        });
      } catch (err) {
        console.error("❌ Error saving progress:", err);
      }
    };
    window.addEventListener("beforeunload", sendProgress);

    // === LOAD PREVIOUS PROGRESS ===
    const loadProgress = async () => {
      try {
        const res = await fetch(
          `/api/watch/progress/${userId}/${profileName}/${contentId}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data?.progressSeconds > 0) {
          const resume = Math.min(
            Math.floor(data.progressSeconds),
            video.duration - 0.25
          );
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
    };
    video.addEventListener("loadedmetadata", loadProgress);

    // === VOLUME ===
    let lastVolume = parseFloat(localStorage.getItem("lastVolume")) ?? 1.0;
    video.volume = lastVolume;
    volumeSlider.value = lastVolume;
    const paintVolumeBar = () => {
      const vol = video.muted ? 0 : video.volume;
      const pct = Math.round(vol * 100);
      volumeSlider.style.background = `linear-gradient(to right, red 0%, red ${pct}%, rgba(255,255,255,0.3) ${pct}%, rgba(255,255,255,0.3) 100%)`;
    };
    const updateVolumeIcon = () => {
      if (video.muted || video.volume === 0) volumeToggle.textContent = "🔇";
      else if (video.volume < 0.5) volumeToggle.textContent = "🔉";
      else volumeToggle.textContent = "🔊";
    };
    paintVolumeBar();
    updateVolumeIcon();

    volumeToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = lastVolume || 1.0;
        volumeSlider.value = video.volume;
      } else video.muted = true;
      updateVolumeIcon();
      paintVolumeBar();
      localStorage.setItem("lastVolume", video.volume);
    });

    volumeSlider.addEventListener("input", (e) => {
      e.stopPropagation();
      const val = parseFloat(e.target.value);
      video.volume = val;
      video.muted = val === 0;
      lastVolume = val;
      updateVolumeIcon();
      paintVolumeBar();
      localStorage.setItem("lastVolume", val);
    });

    // === EPISODE SELECTOR ===
    const episodeSelector = document.getElementById("episodeSelector");
    const dropdown = episodeSelector?.querySelector(".episodes-dropdown");

    if (episodeSelector && dropdown) {
      fetch(
        `/api/contentDetails/${encodeURIComponent(
          document.title.replace(" - Watch", "")
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.type !== "series" || !data.episodes?.length) {
            episodeSelector.style.display = "none";
            return;
          }

          const seasons = {};
          data.episodes.forEach((ep) => {
            const s = ep.seasonNumber || 1;
            if (!seasons[s]) seasons[s] = [];
            seasons[s].push(ep);
          });

          dropdown.innerHTML = Object.keys(seasons)
            .sort((a, b) => a - b)
            .map(
              (season) => `
            <div class="season-item">
              <div class="dropdown-header">Season ${season}</div>
              <div class="episodes-submenu">
                ${seasons[season]
                  .map(
                    (ep) => `
                  <button data-path="/${ep.videoPath}">
                    E${ep.episodeNumber || "?"} — ${ep.title}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>`
            )
            .join("");

          // Handle episode clicks
          dropdown.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-path]");
            if (!btn) return;
            video.src = btn.dataset.path;
            video.currentTime = 0;
            playTransition();
            dropdown.style.display = "none";
          });
        })
        .catch((err) => console.error("Error loading episodes:", err));

      // Prevent flicker
      let hoverTimeout;
      episodeSelector.addEventListener("mouseenter", () => {
        clearTimeout(hoverTimeout);
        dropdown.style.display = "block";
      });
      episodeSelector.addEventListener("mouseleave", () => {
        hoverTimeout = setTimeout(() => {
          dropdown.style.display = "none";
        }, 250);
      });
      dropdown.addEventListener("mouseenter", () => clearTimeout(hoverTimeout));
      dropdown.addEventListener("mouseleave", () => {
        hoverTimeout = setTimeout(() => {
          dropdown.style.display = "none";
        }, 250);
      });
    }

    if (isWatchPage) playTransition();
  });
});
