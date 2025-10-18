form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Convert genre checkboxes to array
    const selectedGenres = [];
    form.querySelectorAll('input[name="genre"]:checked').forEach(cb => {
    selectedGenres.push(cb.value);
    });
    formData.set("genre", JSON.stringify(selectedGenres));

    // Convert actors to array
    const actors = formData.get("cast")?.split(",").map(a => a.trim()) || [];
    formData.set("cast", JSON.stringify(actors));

    // Send formData to backend
    const response = await fetch("/api/content", {
    method: "POST",
    body: formData
    });

    const result = await response.json();
    alert(result.message || "Content added successfully!");
    if(response.ok) form.reset();
});
