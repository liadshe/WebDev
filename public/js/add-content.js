// hide upload status banner after few seconds
  setTimeout(() => {
    const banner = document.querySelector('.banner');
    if (banner) banner.style.display = 'none';
  }, 4000); // hide after 4 seconds


// previewing the cover image before upload
  const coverInput = document.getElementById('coverImageFile');
  const coverPreview = document.createElement('img');
  coverPreview.id = 'coverPreview';
  coverInput.parentNode.insertBefore(coverPreview, coverInput.nextSibling);

  coverInput.addEventListener('change', function(){
    const file = this.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = function(e){
        coverPreview.src = e.target.result;
      }
      reader.readAsDataURL(file);
    }
  });

// dynamic form fields based on content type
document.addEventListener("DOMContentLoaded", () => {
  const typeRadios = document.querySelectorAll('input[name="type"]');
  const movieSeriesFields = document.querySelectorAll('.movie-series-field');
  const episodeFields = document.getElementById('episode-fields');
  const seriesSelect = document.getElementById('seriesSelect');
  const videoFile = document.getElementById('videoFile');
  const coverImageFile = document.getElementById('coverImageFile');

  function loadSeriesList() {
    try {
      seriesSelect.innerHTML = '<option value="">Select Series</option>';
      series.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.title;
        opt.textContent = s.title;
        seriesSelect.appendChild(opt);
      });
    } catch (err) {
      console.log('Error loading series:', err);
      seriesSelect.innerHTML = '<option value="">Error loading series!!!</option>';
    }
  }

  function toggleFields(selectedType) {
    // Hide everything initially
    movieSeriesFields.forEach(el => el.style.display = 'none');
    episodeFields.style.display = 'none';

    // Always show video + cover uploads for all types
    coverImageFile.closest('.form-row').style.display = 'block';
    videoFile.closest('.form-row').style.display = 'block';

    // Show depending on type
    if (selectedType === 'movie' || selectedType === 'series') {
      movieSeriesFields.forEach(el => el.style.display = 'block');
      if (selectedType === 'series') {
        // If you want, you can disable genre/cast/director for series
        // For example:
        // document.querySelector('.movie-series-field input[name="cast"]').closest('.form-row').style.display = 'none';
      }
    } 
    else if (selectedType === 'episode') {
      episodeFields.style.display = 'block';
      loadSeriesList();
    }
  }

  typeRadios.forEach(radio => {
    radio.addEventListener('change', e => toggleFields(e.target.value));
  });
});
