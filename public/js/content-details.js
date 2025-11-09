document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("contentModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCover = document.getElementById("modalCover");
  const modalDescription = document.getElementById("modalDescription");
  const modalExtra = document.getElementById("modalExtra");
  const modalClose = document.getElementById("modalClose");

  let modalEpisodes = document.getElementById("modalEpisodes");
  if (!modalEpisodes) {
    modalEpisodes = document.createElement("div");
    modalEpisodes.id = "modalEpisodes";
    modalExtra.parentNode.appendChild(modalEpisodes);
  }

  // helper: render content in modal
  async function renderModalContent(title) {
    try {
      const res = await fetch(`/api/contentDetails/${encodeURIComponent(title)}`);
      if (!res.ok) throw new Error("Content not found");
      const content = await res.json();

      modalTitle.textContent = content.title;
      modalCover.src = content.coverImagePath;
      modalCover.alt = content.title;
      modalDescription.textContent = content.description || "No description available.";

      // Generate cast links
      const castLinks = (content.cast || []).map(actor => {
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(actor.replace(/\s+/g, "_"))}`;
        return `<a href="${wikiUrl}" target="_blank" rel="noopener noreferrer">${actor}</a>`;
      }).join(", ");

      modalExtra.innerHTML = `
        <strong>Genre:</strong> ${content.genre.join(", ")}<br>
        <strong>Year:</strong> ${content.releaseYear || "N/A"}<br>
        <strong>Director:</strong> ${content.director || "N/A"}<br>
        <strong>Cast:</strong> ${castLinks}
      `;

      // Episodes section (for series)
      if (content.episodes && content.episodes.length > 0) {
        const episodeCards = content.episodes.map(ep => `
          <div class="episode-card">
            <div class="episode-number">Ep ${ep.episodeNumber || "?"}</div>
            <div class="episode-title">${ep.title}</div>
            ${ep.duration ? `<div class="episode-duration">${ep.duration} min</div>` : ""}
          </div>
        `).join("");

        modalEpisodes.innerHTML = `
          <h3 style="margin-top: 1rem;">Episodes:</h3>
          <div class="episodes-container">
            ${episodeCards}
          </div>
        `;
      } else {
        modalEpisodes.innerHTML = "";
      }

      // Remove previous similar section (if exists)
      const oldSimilar = document.getElementById("modalSimilar");
      if (oldSimilar) oldSimilar.remove();

      // Similar Content section
      if (content.similarFromSameGenre && content.similarFromSameGenre.length > 0) {
        const modalSimilar = document.createElement("div");
        modalSimilar.id = "modalSimilar";

        // exclude current item from similar list
        const filteredSimilar = content.similarFromSameGenre.filter(sim => sim.title !== content.title);

        if (filteredSimilar.length > 0) {
          const similarCards = filteredSimilar.map(sim => `
            <div class="similar-card" data-title="${sim.title}">
              <img src="${sim.coverImagePath}" alt="${sim.title}" class="similar-image" />
              <div class="similar-title">${sim.title}</div>
            </div>
          `).join("");

          modalSimilar.innerHTML = `
            <h3 style="margin-top: 1rem;">Similar Content:</h3>
            <div class="similar-container">
              ${similarCards}
            </div>
          `;

          modalExtra.parentNode.appendChild(modalSimilar);

          // Add click event to open the modal for the similar content
          modalSimilar.querySelectorAll(".similar-card").forEach(card => {
            card.addEventListener("click", () => {
              const title = card.dataset.title;
              renderModalContent(title);
            });
          });
        }
      }

      modal.style.display = "block";
    } catch (err) {
      console.error(err);
    }
  }

  // Add click listener to each movie cover
  document.querySelectorAll(".cover-image").forEach(img => {
    img.addEventListener("click", () => {
      const title = img.alt.trim();
      renderModalContent(title);
    });
  });

  // close modal
  modalClose.onclick = () => (modal.style.display = "none");
  window.onclick = event => {
    if (event.target === modal) modal.style.display = "none";
  };
});
