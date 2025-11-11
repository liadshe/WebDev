// hide upload status banner after few seconds
setTimeout(() => {
  const banner = document.querySelector('.banner');
  if (banner) banner.style.display = 'none';
}, 4000);

// previewing the cover image before upload
const coverInput = document.getElementById('coverImageFile');
if (coverInput) {
  const coverPreview = document.createElement('img');
  coverPreview.id = 'coverPreview';
  coverInput.parentNode.insertBefore(coverPreview, coverInput.nextSibling);

  coverInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        coverPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// dynamic form fields based on content type
document.addEventListener("DOMContentLoaded", () => {
  const typeRadios = document.querySelectorAll('input[name="type"]');
  const movieSeriesFields = document.querySelectorAll('.movie-series-field');
  const episodeFields = document.getElementById('episode-fields');
  const seriesSelect = document.getElementById('seriesSelect');
  const videoFileRow = document.getElementById('videoFile').closest('.form-row');
  const coverFileRow = document.getElementById('coverImageFile').closest('.form-row');

  function loadSeriesList() {
    try {
      const serverSeries = Array.isArray(window.series) ? window.series : [];
      seriesSelect.innerHTML = '<option value="">Select Series</option>';

      if (serverSeries.length === 0) {
        const noOpt = document.createElement('option');
        noOpt.value = '';
        noOpt.textContent = 'No series available';
        seriesSelect.appendChild(noOpt);
        return;
      }

      serverSeries.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s._id || s.title;
        opt.textContent = s.title || 'Untitled Series';
        seriesSelect.appendChild(opt);
      });
    } catch (err) {
      console.log('Error loading series:', err);
      seriesSelect.innerHTML = '<option value="">Error loading series</option>';
    }
  }

  function toggleFields(selectedType) {
    // hide all by default
    movieSeriesFields.forEach(el => el.style.display = 'none');
    episodeFields.style.display = 'none';

    // Show based on type
    if (selectedType === 'movie') {
      movieSeriesFields.forEach(el => el.style.display = 'block');
      coverFileRow.style.display = 'block';
      videoFileRow.style.display = 'block';
    } else if (selectedType === 'series') {
      movieSeriesFields.forEach(el => el.style.display = 'block');
      coverFileRow.style.display = 'block';
      videoFileRow.style.display = 'none'; // series doesn’t need a video
    } else if (selectedType === 'episode') {
      episodeFields.style.display = 'block';
      loadSeriesList();
      coverFileRow.style.display = 'none';
      videoFileRow.style.display = 'block';
    }
  }

  typeRadios.forEach(radio => {
    radio.addEventListener('change', e => toggleFields(e.target.value));
  });

  // hide optional fields initially
  movieSeriesFields.forEach(el => el.style.display = 'none');
  episodeFields.style.display = 'none';
  coverFileRow.style.display = 'none';
  videoFileRow.style.display = 'none';
});
