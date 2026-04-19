/* ============================================================
   CONFIGURAÇÕES GERAIS E ESTADO DO CARROSSEL
   ============================================================ */
let currentIndex = 0;
const mediaItems = []; 

// Referências do DOM
const modal = document.getElementById('modal');
const wrapper = document.getElementById('modal-content-wrapper');
const caption = document.getElementById('caption');
const revealElements = document.querySelectorAll('.reveal');

/* ============================================================
   1. MAPEAMENTO DA GALERIA (Fotos e Vídeos)
   ============================================================ */
const initGallery = () => {
    const cards = document.querySelectorAll('.photo-card');
    
    cards.forEach((card, index) => {
        const videoElement = card.querySelector('video');
        const isVideo = videoElement !== null;
        const title = card.querySelector('h3').innerText;
        const text = card.querySelector('p').innerText;
        let src = "";

        if (isVideo) {
            src = card.querySelector('source').src;
        } else {
            const bgImg = card.querySelector('.photo-placeholder').style.backgroundImage;
            // Limpa a string da URL do background-image
            src = bgImg.slice(5, -2).replace(/"/g, "");
        }

        mediaItems.push({ type: isVideo ? 'video' : 'img', src, title, text });

        // Clique para abrir o carrossel na posição correta
        card.onclick = () => openModal(index);
    });
};

/* ============================================================
   2. LÓGICA DO MODAL / CARROSSEL
   ============================================================ */
function openModal(index) {
    currentIndex = index;
    updateModalContent();
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Trava o scroll da página ao abrir
}

function updateModalContent() {
    const item = mediaItems[currentIndex];
    wrapper.innerHTML = ""; 

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.autoplay = true;
        video.loop = true;
        video.controls = true;
        video.className = "modal-video";
        wrapper.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.className = "modal-content";
        wrapper.appendChild(img);
    }

    caption.innerHTML = `<strong>${item.title}</strong><br>${item.text}`;
}

// Navegação Próximo/Anterior
document.querySelector('.next').onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % mediaItems.length;
    updateModalContent();
};

document.querySelector('.prev').onclick = (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    updateModalContent();
};

// Fechar Modal
document.querySelector('.close').onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
};

window.onclick = (event) => { 
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

/* ============================================================
   3. ANIMAÇÕES (Scroll, Partículas e Botão)
   ============================================================ */

// Revelar ao Scroll
const scrollReveal = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
};

// Gerador de Brilhos (Partículas)
const createParticle = () => {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particle = document.createElement('div');
    const size = Math.random() * 6 + 2; 
    const colors = ['rgba(142, 45, 54, 0.15)', 'rgba(212, 175, 55, 0.2)'];
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    particle.style.filter = 'blur(1px)';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '110vh';
    
    container.appendChild(particle);

    const duration = Math.random() * 15 + 10;
    const drift = Math.random() * 200 - 100;

    const animation = particle.animate([
        { transform: `translateY(0) translateX(0) scale(1)`, opacity: 0 },
        { opacity: 0.6, offset: 0.2 },
        { transform: `translateY(-120vh) translateX(${drift}px) scale(1.5)`, opacity: 0 }
    ], {
        duration: duration * 1000,
        easing: 'ease-in-out'
    });

    animation.onfinish = () => particle.remove();
};

/* ============================================================
   4. INICIALIZAÇÃO
   ============================================================ */
window.addEventListener('scroll', scrollReveal);
window.addEventListener('load', () => {
    initGallery();
    scrollReveal();
    setInterval(createParticle, 800);
});

// Botão Final (Abre o Carrossel do Início)
document.getElementById('btn-relembrar').addEventListener('click', () => {
    openModal(0);
});