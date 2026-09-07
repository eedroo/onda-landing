/* ====================================
   LOAD COMPONENTS
==================================== */

async function loadComponents() {

    try {

        const headerResponse =
            await fetch('/diego/components/header.html');

        const footerResponse =
            await fetch('/diego/components/footer.html');

        const headerHTML =
            await headerResponse.text();

        const footerHTML =
            await footerResponse.text();

        document
            .getElementById('header-placeholder')
            .innerHTML = headerHTML;

        document
            .getElementById('footer-placeholder')
            .innerHTML = footerHTML;

        initMenu();
        initAnimations();
        initBalls();

    }

    catch (error) {

        console.error(
            'Erro ao carregar componentes:',
            error
        );

    }

}


/* ====================================
   MOBILE MENU
==================================== */

function initMenu() {

    const menuToggle =
        document.querySelector('.menu-toggle');

    const closeMenu =
        document.querySelector('.close-menu');

    const mobileMenu =
        document.querySelector('.mobile-menu');

    if (!menuToggle ||
        !closeMenu ||
        !mobileMenu) return;

    menuToggle.addEventListener('click', () => {

        mobileMenu.classList.add('active');

    });

    closeMenu.addEventListener('click', () => {

        mobileMenu.classList.remove('active');

    });

}


/* ====================================
   BALL ANIMATION
==================================== */

function initBalls() {

    const mainBall =
        document.querySelector('.ball-main');

    if (!mainBall) return;

    let currentScroll = 0;
    let targetScroll = 0;

    window.addEventListener('scroll', () => {

        targetScroll = window.scrollY;

    });

    function animateBall() {

        currentScroll +=
            (targetScroll - currentScroll) * 0.08;

        const scaleMain =
            1 + currentScroll * 0.0007;

        const rotateMain =
            currentScroll * 0.12;

        const translateMain =
            currentScroll * 0.35;

        mainBall.style.transform = `
            translate3d(
                0,
                ${translateMain}px,
                0
            )
            rotate(${rotateMain}deg)
            scale(${scaleMain})
        `;

        requestAnimationFrame(
            animateBall
        );

    }

    animateBall();

}


/* ====================================
   SCROLL ANIMATIONS
==================================== */

function initAnimations() {

    const animatedElements =
        document.querySelectorAll(
            '.fade-up, .fade-left'
        );

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                             .classList
                             .add('active');

                    }

                });

            },

            {
                threshold: 0.15
            }

        );

    animatedElements.forEach(el => {

        observer.observe(el);

    });

}


/* ====================================
   INIT
==================================== */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        loadComponents();

    }
);