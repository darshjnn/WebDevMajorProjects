const flashDiv = document.getElementById('flashDiv');
const closeFlash = document.getElementById('closeFlash');

closeFlash.addEventListener('click', () => {
    flashDiv.style.display = 'none';
});