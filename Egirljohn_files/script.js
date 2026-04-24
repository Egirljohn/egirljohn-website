function initSkinViewers() {
    const cards = document.querySelectorAll('.skin-viewer-card');

    cards.forEach(card => {
        const username = card.getAttribute('data-username') || '';
        const viewerContainer = card.querySelector('.skin-viewer-canvas');
        const loadingText = card.querySelector('.viewer-loading');

        if (!username || !viewerContainer || !loadingText) {
            return;
        }

        const showError = () => {
            loadingText.textContent = '3D viewer unavailable right now.';
        };

        if (!window.skinview3d) {
            showError();
            return;
        }

        if (!(viewerContainer instanceof HTMLCanvasElement)) {
            showError();
            console.error('Skin viewer mount is not a canvas element.');
            return;
        }

        try {
            const skinViewer = new window.skinview3d.SkinViewer({
                canvas: viewerContainer,
                width: viewerContainer.clientWidth,
                height: viewerContainer.clientHeight,
                skin: `https://mc-heads.net/skin/${encodeURIComponent(username)}`
            });

            skinViewer.fov = 50;
            skinViewer.zoom = 0.9;
            skinViewer.animation = new window.skinview3d.WalkingAnimation();
            skinViewer.controls.enableZoom = false;
            skinViewer.controls.rotateSpeed = 0.7;
            skinViewer.autoRotate = true;
            skinViewer.autoRotateSpeed = 0.7;

            loadingText.textContent = 'Drag to rotate.';

            window.addEventListener('resize', () => {
                skinViewer.width = viewerContainer.clientWidth;
                skinViewer.height = viewerContainer.clientHeight;
            });
        } catch (error) {
            showError();
            console.error(`Failed to initialize skin viewer for ${username}:`, error);
        }
    });
}


document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');

        const href = link.getAttribute('href') || '';
        const hash = href.includes('#') ? href.substring(href.indexOf('#') + 1) : '';
        if (hash === current) {
            link.classList.add('active');
        }
    });
});

initSkinViewers();
