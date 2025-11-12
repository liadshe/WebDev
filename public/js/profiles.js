document.addEventListener("DOMContentLoaded", () => {
  const profiles = document.querySelectorAll(".profile");

  profiles.forEach(profile => {
    const editBtn = profile.querySelector(".edit-btn");
    const saveBtn = profile.querySelector(".save-btn");
    const cancelBtn = profile.querySelector(".cancel-btn");
    const nameInput = profile.querySelector(".profile-name");

    const profileId = profile.dataset.id;
    const originalName = nameInput.value;

    editBtn.addEventListener("click", () => {
      nameInput.removeAttribute("readonly");
      nameInput.focus();
      editBtn.style.display = "none";
      saveBtn.style.display = "inline";
      cancelBtn.style.display = "inline";
    });

    cancelBtn.addEventListener("click", () => {
      nameInput.value = originalName;
      nameInput.setAttribute("readonly", true);
      editBtn.style.display = "inline";
      saveBtn.style.display = "none";
      cancelBtn.style.display = "none";
    });

    saveBtn.addEventListener("click", async () => {
      const newName = nameInput.value.trim();
      if (!newName) {
        alert("Profile name cannot be empty.");
        return;
      }

      try {
        const res = await fetch(`/api/profiles/update/${profileId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update_name",
            displayName: newName
          })
        });

        if (res.ok) {
          nameInput.setAttribute("readonly", true);
          editBtn.style.display = "inline";
          saveBtn.style.display = "none";
          cancelBtn.style.display = "none";
        } else {
          alert("Error updating profile name");
        }
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update profile name");
      }
    });
  });
});
