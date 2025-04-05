const flashDiv = document.getElementById('flashDiv');
const closeFlash = document.getElementById('closeFlash');

if (flashDiv) {
    closeFlash.addEventListener('click', () => {
        flashDiv.style.display = 'none';
    });
}