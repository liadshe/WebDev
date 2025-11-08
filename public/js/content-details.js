  const modal = document.getElementById("contentModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalCover = document.getElementById("modalCover");
  const modalDescription = document.getElementById("modalDescription");
  const modalExtra = document.getElementById("modalExtra");
  const modalClose = document.getElementById("modalClose");

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
//         modalExtra.innerHTML = `
//   <strong>Genre:</strong> ${content.genre.join(", ")}<br>
//   <strong>Year:</strong> ${content.releaseYear || "N/A"}<br>
//   <strong>Director:</strong> ${content.director || "N/A"}<br>
//   <strong>Cast:</strong> ${content.cast.join(", ")}
// `;

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
