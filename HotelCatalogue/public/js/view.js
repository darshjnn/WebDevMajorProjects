const ratingInp = document.getElementById('ratingInp');
const ratingVal = document.getElementById('ratingVal');

// Update the displayed value when the range input changes
ratingInp.addEventListener('input', function () {
    ratingVal.textContent = ratingInp.value + ' star';
});