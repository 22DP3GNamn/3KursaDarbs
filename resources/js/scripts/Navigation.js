export default function Navigation(onScrollCallback) {
    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.querySelector('#navbar');
        const hamburger = document.querySelector('#menu-btn-container');
        const sideWall = document.querySelector('.side-wall');

        let lastScrollY = window.scrollY;

        if (!navbar || !hamburger || !sideWall) return;

        document.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.remove('visible');
                sideWall.classList.add('visible');
                lastScrollY = window.scrollY;
            } else {
                navbar.classList.add('visible');
                sideWall.classList.remove('visible');
                sideWall.classList.remove('active');
                hamburger.querySelector('#menu-checkbox').checked = false;
                hamburger.classList.remove('moved');
                lastScrollY = window.scrollY;
            }

            if (onScrollCallback) {
                onScrollCallback(window.scrollY);
            }
        });

        hamburger.addEventListener('click', () => {
            if (hamburger.querySelector('#menu-checkbox').checked) {
                sideWall.classList.add('active');
                hamburger.classList.add('moved');
            } else {
                sideWall.classList.remove('active');
                hamburger.classList.remove('moved');
            }
        });
    });
}