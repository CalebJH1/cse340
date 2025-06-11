const nav = document.querySelector('nav');
const navButton = document.getElementById('navButton');

navButton.addEventListener('click', () => {
    nav.classList.toggle('show');
});