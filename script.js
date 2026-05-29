// Все 7 фотографий
const imagePaths = [
    './birthday_prank/1.jpg', 
    './birthday_prank/2.jpg',  
    './birthday_prank/3.png',  
    './birthday_prank/4.jpg',
    './birthday_prank/5.jpg',
    './birthday_prank/6.jpg',
    './birthday_prank/7.jpg'  
];

// Установка аватарки в баннер (берется Фото 3)
window.addEventListener('DOMContentLoaded', () => {
    const bannerImg = document.getElementById('banner-thumb');
    if (bannerImg && imagePaths[2]) {
        bannerImg.src = imagePaths[2];
        bannerImg.onerror = function() {
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23ff0055"/><text x="50%" y="55%" font-family="Arial" font-weight="bold" font-size="11" fill="white" text-anchor="middle">НЕТ ФОТО 3</text></svg>';
        };
    }
});

const startBtn = document.getElementById('start-btn');
const prankScreen = document.getElementById('prank-screen');
const birthdayScreen = document.getElementById('birthday-screen');
const fallingContainer = document.getElementById('falling-container');

// Переключение экранов по клику
startBtn.addEventListener('click', () => {
    prankScreen.classList.add('hidden');
    birthdayScreen.classList.remove('hidden');
    startFallingSequence();
});

// Создание падающего стикера
function createFallingSticker() {
    if (document.hidden) return;

    const img = document.createElement('img');
    const randomPath = imagePaths[Math.floor(Math.random() * imagePaths.length)];
    img.src = randomPath;
    img.className = 'falling-sticker';

    img.onerror = function() {
        const num = imagePaths.indexOf(randomPath) + 1;
        this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%2338ef7d"/><text x="50%" y="55%" font-family="Arial" font-weight="bold" font-size="14" fill="white" text-anchor="middle">Фото ${num || '?'}</text></svg>`;
    };

    let minSize = 110;
    let maxSize = 175;

    if (window.innerWidth < 600) {
        minSize = 85;
        maxSize = 130;
    }

    const size = Math.random() * (maxSize - minSize) + minSize;
    img.style.width = `${size}px`;
    img.style.height = `${size}px`;

    const startPosX = Math.random() * 80;
    img.style.left = `${startPosX}vw`;

    const driftX = (Math.random() - 0.5) * 160; 
    const startRotation = (Math.random() - 0.5) * 80;
    const endRotation = startRotation + (Math.random() - 0.5) * 200;

    const normSize = (size - minSize) / (maxSize - minSize); 
    const blurAmount = (1 - normSize) * 3; 
    
    let zIndex = Math.floor(normSize * 5) + 1; 
    if (normSize > 0.5) {
        zIndex += 10; 
    } else {
        zIndex = 1; 
    }
    
    const duration = 3400 + (1 - normSize) * 3600; 

    img.style.filter = `blur(${blurAmount}px) drop-shadow(0 12px 25px rgba(0,0,0,0.25))`;
    img.style.zIndex = zIndex;

    fallingContainer.appendChild(img);

    const fallAnimation = img.animate([
        { transform: `translate3d(0, -220px, 0) rotate(${startRotation}deg)`, opacity: 1 },
        { transform: `translate3d(${driftX}px, 115vh, 0) rotate(${endRotation}deg)`, opacity: 0.4 }
    ], {
        duration: duration,
        easing: 'linear'
    });

    let isPopping = false;

    function popSticker(e) {
        if (isPopping) return;
        isPopping = true;
        e.preventDefault();

        fallAnimation.cancel();
        const currentMatrix = window.getComputedStyle(img).transform;
        
        img.animate([
            { transform: `${currentMatrix} scale(1)`, opacity: 1 },
            { transform: `${currentMatrix} scale(1.7)`, opacity: 0 }
        ], {
            duration: 160,
            easing: 'ease-out',
            fill: 'forwards'
        }).onfinish = () => { img.remove(); };
    }

    img.addEventListener('click', popSticker);
    img.addEventListener('touchstart', popSticker, { passive: false });

    fallAnimation.onfinish = () => {
        if (!isPopping) img.remove();
    };
}

function spawnLoop() {
    createFallingSticker();
    const nextDelay = Math.random() * 350 + 250;
    setTimeout(spawnLoop, nextDelay);
}

function startFallingSequence() {
    for (let i = 0; i < 6; i++) {
        setTimeout(createFallingSticker, i * 150);
    }
    spawnLoop();
}
