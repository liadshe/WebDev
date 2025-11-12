document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("contentModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCover = document.getElementById("modalCover");
  const modalDescription = document.getElementById("modalDescription");
  const modalExtra = document.getElementById("modalExtra");
  const modalClose = document.getElementById("modalClose");
  const modalPlayBtn = document.getElementById("modalPlayBtn");
  const watchStatusContainer = document.getElementById("modalWatchStatus");
  let currentMovieId = null;

  let modalEpisodes = document.getElementById("modalEpisodes");
  if (!modalEpisodes) {
    modalEpisodes = document.createElement("div");
    modalEpisodes.id = "modalEpisodes";
    modalExtra.parentNode.appendChild(modalEpisodes);
  }

  async function renderModalContent(title) {
    try {
      const res = await fetch(`/api/contentDetails/${encodeURIComponent(title)}`);
      if (!res.ok) throw new Error("Content not found");
      const content = await res.json();

      currentMovieId = content._id;
      modalTitle.textContent = content.title;
      modalCover.src = `/${content.coverImagePath}`;
      modalCover.alt = content.title;
      modalDescription.textContent = content.description || "No description available.";

      // 🎬 Show Play button and watch progress only for MOVIES
      if (content.type === "movie") {
        modalPlayBtn.style.display = "block";

        if (watchStatusContainer) {
          let statusHTML = "";
          const history = content.history;
          if (!history || history.length === 0) {
            statusHTML = `<span class="status not-started">⏺ Not started yet</span>`;
          } else if (history[0].finished) {
            statusHTML = `<span class="status finished">✔ Finished watching</span>`;
          } else if (history[0].progressPercent > 0) {
            statusHTML = `<span class="status in-progress">⏯ In progress (${Math.round(
              history[0].progressPercent
            )}%)</span>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${Math.round(
                history[0].progressPercent
              )}%;"></div>
            </div>`;
          } else {
            statusHTML = `<span class="status not-started">⏺ Not started yet</span>`;
          }

          watchStatusContainer.innerHTML = `<h4>Watch Status:</h4>${statusHTML}`;
          watchStatusContainer.style.display = "block";
        }
      } else {
        modalPlayBtn.style.display = "none";
        if (watchStatusContainer) {
          watchStatusContainer.style.display = "none";
        }
      }

      // 🎭 Cast, Genre, etc.
      const castLinks = (content.cast || [])
        .map((actor) => {
          const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            actor.replace(/\s+/g, "_")
          )}`;
          return `<a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">${actor}</a>`;
        })
        .join(", ");

      modalExtra.innerHTML = `
        <strong>Rating:</strong> ${content.rating || "N/A"}<br> 
        <strong>Genre:</strong> ${content.genre.join(", ")}<br>
        <strong>Year:</strong> ${content.releaseYear || "N/A"}<br>
        <strong>Director:</strong> ${content.director || "N/A"}<br>
        <strong>Cast:</strong> ${castLinks}
      `;

      // 📺 EPISODES (Series only)
      if (content.type === "series") {
        let episodesHTML = '';
        if (content.hasFinished) {
          episodesHTML += `
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h3 style="margin-top: 1rem;">Episodes:</h3>
              <button id="rewatchBtn" class="rewatch-btn" style="margin-left: auto; padding: 5px 10px; border: none; background-color: #f0ad4e; color: white; border-radius: 4px; cursor: pointer;">Rewatch</button>
            </div>
          `;
        } else {
          episodesHTML += '<h3 style="margin-top: 1rem;">Episodes:</h3>';
        }

        if (content.history && content.history.length > 0) {
          const episodeCards = content.history
            .map((ep) => {
              let progressHTML = "";
              let statusText = "⚪ Not started";

              if (ep.history && ep.history.length > 0) {
                const h = ep.history[0];
                if (h.finished) {
                  statusText = "🟩 Finished";
                } else if (h.progressPercent > 0) {
                  const rounded = Math.round(h.progressPercent);
                  statusText = `🟨 In progress (${rounded}%)`;
                  progressHTML = `
                    <div class="progress-bar">
                      <div class="progress-fill" style="width:${rounded}%;"></div>
                    </div>`;
                }
              }

              return `
                <div class="episode-card" data-episode-id="${ep.episodeId}">
                  <div class="episode-number">S${ep.seasonNumber || "?"}:E${ep.episodeNumber || "?"}</div>
                  <div class="episode-title">${ep.title || "Untitled Episode"}</div>
                  <div class="episode-status">${statusText}</div>
                  ${progressHTML}
                  ${
                    ep.durationSeconds
                      ? `<div class="episode-duration">${Math.round(ep.durationSeconds)} seconds</div>`
                      : ""
                  }
                  <button class="episode-play-btn">▶ Play</button>
                </div>
              `;
            })
            .join("");

          episodesHTML += `<div class="episodes-container">${episodeCards}</div>`;
        } else if (!content.hasFinished) {
          episodesHTML += `
            <div class="no-episodes-message" style="color: #888; font-style: italic; margin-top: .5rem;">
              No episodes uploaded yet. Check back soon!
            </div>
          `;
        }
        
        modalEpisodes.innerHTML = episodesHTML;

        if (content.hasFinished) {
          const rewatchButton = document.getElementById("rewatchBtn");
          rewatchButton.onclick = async () => {
            try {
              const res = await fetch("/api/watch/reset-series", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seriesId: content._id }),
              });
              if (res.ok) {
                // Find the first episode (Season 1, Episode 1)
                const firstEpisode = content.history
                  .map(ep => ({
                    episodeId: ep.episodeId,
                    seasonNumber: ep.seasonNumber,
                    episodeNumber: ep.episodeNumber
                  }))
                  .sort((a, b) => {
                    if (a.seasonNumber !== b.seasonNumber) {
                      return a.seasonNumber - b.seasonNumber;
                    }
                    return a.episodeNumber - b.episodeNumber;
                  })[0];

                if (firstEpisode) {
                  modal.style.display = "none";
                  setTimeout(() => {
                    window.location.href = `/watch/${firstEpisode.episodeId}`;
                  }, 150);
                } else {
                  console.warn("No episodes found for this series to rewatch.");
                  renderModalContent(content.title); // Refresh modal even if no episodes
                }
              } else {
                console.error("Failed to reset watch history");
              }
            } catch (err) {
              console.error("Error resetting watch history:", err);
            }
          };
        }
      } else {
        modalEpisodes.innerHTML = "";
      }

      // 🎥 Similar Content
      const oldSimilar = document.getElementById("modalSimilar");
      if (oldSimilar) oldSimilar.remove();

      if (content.similarFromSameGenre && content.similarFromSameGenre.length > 0) {
        const modalSimilar = document.createElement("div");
        modalSimilar.id = "modalSimilar";

        const filteredSimilar = content.similarFromSameGenre.filter(
          (sim) => sim.title !== content.title
        );

        if (filteredSimilar.length > 0) {
          const similarCards = filteredSimilar
            .map(
              (sim) => `
                <div class="similar-card" data-title="${sim.title}">
                  <img src="/${sim.coverImagePath}" alt="${sim.title}" class="similar-image" />
                  <div class="similar-title">${sim.title}</div>
                </div>
              `
            )
            .join("");

          modalSimilar.innerHTML = `
            <h3 style="margin-top: 1rem;">Similar Content:</h3>
            <div class="similar-container">${similarCards}</div>
          `;

          modalExtra.parentNode.appendChild(modalSimilar);
        }
      }

      modal.style.display = "block";
    } catch (err) {
      console.error("Error rendering modal:", err);
    }
  }

  // Cover click → open modal
  document.addEventListener("click", (event) => {
    const img = event.target.closest(".cover-image");
    if (!img) return;
    const title = img.alt.trim();
    renderModalContent(title);
  });

  // Similar content click → open modal
  document.addEventListener("click", (event) => {
    const card = event.target.closest(".similar-card");
    if (!card) return;
    const title = card.dataset.title;
    renderModalContent(title);
  });

  // Close modal
  modalClose.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };

  // ▶ Play movie
  modalPlayBtn.addEventListener("click", () => {
    if (!currentMovieId) return;
    modal.style.display = "none";
    setTimeout(() => {
      window.location.href = `/watch/${currentMovieId}`;
    }, 150);
  });

  // ▶ Play episode
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".episode-play-btn");
    if (!btn) return;
    const episodeCard = btn.closest(".episode-card");
    const episodeId = episodeCard?.dataset.episodeId;
    if (!episodeId) return;
    modal.style.display = "none";
    setTimeout(() => {
      window.location.href = `/watch/${episodeId}`;
    }, 150);
  });
});
