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



    // Add click listener to each movie cover
    document.querySelectorAll(".cover-image").forEach(img => {
      img.addEventListener("click", async () => {
      
        const title = img.alt.trim();
        try {
          const res = await fetch(`/api/contentDetails/${encodeURIComponent(title)}`);
          if (!res.ok) throw new Error("Content not found");
          const content =   await res.json();
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

    // Display episodes if it's a series
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
          modalEpisodes.innerHTML = ""; // clear if not a series
        }

        modal.style.display = "block";
        } catch (err) {
          console.error(err);
        }
      });
    });

    modalClose.onclick = () => modal.style.display = "none";

    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = "none";
    }
