document.addEventListener("DOMContentLoaded", () => {
  const isWatchPage = document.body.classList.contains("watch-page");

  if (!window.CURRENT_USER_ID || window.CURRENT_USER_ID === "guest") {
    console.warn("No user logged in; watch progress tracking disabled.");
    return;
  }

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
    const nextEpBtn = document.createElement("button");

    if (!video || !controls) return;

    // Add "Next Episode" button 
    nextEpBtn.classList.add("nextEpisode");
    nextEpBtn.textContent = "Next ▶";
    nextEpBtn.style.display = "none";
    controls.appendChild(nextEpBtn);

    const userId = window.CURRENT_USER_ID;
    const profileName = window.CURRENT_PROFILE;
    const contentId = cover.id;
    let allEpisodes = [];

    // video play logic 
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

    // Progress saving
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
        console.error("Error saving progress:", err);
      }
    };
    window.addEventListener("beforeunload", sendProgress);

    // Resume from saved progress
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
            } else setTimeout(setWhenReady, 150);
          };
          setWhenReady();
        }
      } catch (err) {
        console.error("error loading progress:", err);
      }
    };
    video.addEventListener("loadedmetadata", loadProgress);

    // Time formatting & controls
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

    // Seek & fullscreen 
    backward.addEventListener("click", () => {
      video.currentTime = Math.max(0, video.currentTime - 10);
      showControls();
    });
    forward.addEventListener("click", () => {
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      showControls();
    });
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) videoWrapper.requestFullscreen();
      else document.exitFullscreen();
      showControls();
    });

    // Volume 
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

    // Show / Hide controls
    let controlsTimeout;
    const showControls = () => {
      controls.classList.add("show");
      clearTimeout(controlsTimeout);
      controlsTimeout = setTimeout(() => {
        if (!video.paused) controls.classList.remove("show");
      }, 2500);
    };
    cover.addEventListener("mousemove", showControls);

    // EPISODE SELECTOR + NEXT EPISODE
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
            nextEpBtn.style.display = "none";
            return;
          }

          allEpisodes = data.episodes.sort((a, b) => {
            if (a.seasonNumber === b.seasonNumber)
              return a.episodeNumber - b.episodeNumber;
            return a.seasonNumber - b.seasonNumber;
          });

          nextEpBtn.style.display = "inline-block";
          episodeSelector.classList.remove("hidden");

          // build dropdown
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
                  <button data-path="/${ep.videoPath}" data-ep="${
                      ep.episodeNumber
                    }" data-s="${ep.seasonNumber}">
                    E${ep.episodeNumber || "?"} — ${ep.title}
                  </button>`
                  )
                  .join("")}
              </div>
            </div>`
            )
            .join("");

          // click episode
          dropdown.addEventListener("click", (e) => {
            const btn = e.target.closest("button[data-path]");
            if (!btn) return;
            playEpisode(btn.dataset.path);
          });
        });

      // Hover delay
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

    // Helper to play episode
    const playEpisode = (path) => {
      video.src = path;
      video.currentTime = 0;
      playTransition();
    };

    // Next episode logic
    nextEpBtn.addEventListener("click", () => {
      if (!allEpisodes.length) return;
      const currentSrc = video.src.split("/").pop();
      const currentIndex = allEpisodes.findIndex((ep) =>
        ep.videoPath.includes(currentSrc)
      );
      const next = allEpisodes[currentIndex + 1];
      if (!next) {
        alert("You've reached the last episode!");
        return;
      }
      playEpisode(`/${next.videoPath}`);
    });

    if (isWatchPage) playTransition();
  });
});
