/**
 * APP.JS - Funcionalidad Principal
 * Politécnico Ann y Ted Kheel
 * 
 * Este archivo contiene funcionalidades compartidas de la aplicación
 */

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeNavbarCloseOnInput();
    initializeNavigation();
    initializeComments();
    initializeGallery();
    initializeVidaEstudiantilCarousel();
});

// ===== NAVBAR =====
function initializeNavbar() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (!navbarCollapse || !navbarToggler) return;
    
    function closeNavbar() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
            if (collapseInstance) {
                collapseInstance.hide();
            }
        } else {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    }
    
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show') && window.innerWidth < 992) {
                closeNavbar();
            }
        });
    });
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function initializeNavigation() {
    const links = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('.section');

    if (sections.length === 0) return;

    // Función para activar una sección
    function activateSection(sectionId) {
        const sectionDestino = document.getElementById(sectionId);
        if (!sectionDestino) return;

        sections.forEach(sec => sec.classList.remove('active'));
        sectionDestino.classList.add('active');

        sectionDestino.scrollIntoView({ behavior: 'smooth' });
    }

    // Manejar clic en los enlaces del navbar
    links.forEach(link => {
        link.addEventListener('click', e => {
            const destino = link.getAttribute('href');

            if (!destino.startsWith('#')) return;
            e.preventDefault();

            const id = destino.substring(1);
            activateSection(id);
        });
    });

    // Verificar hash en la URL al cargar la página
    handleInitialHash();
}

// ===== MANEJAR HASH INICIAL DE LA URL =====
function handleInitialHash() {
    const hash = window.location.hash;
    const sections = document.querySelectorAll('.section');
    
    // Remove active class from all sections first
    sections.forEach(sec => sec.classList.remove('active'));
    
    if (!hash || hash === '#inicio') {
        // Default to #inicio section (nosotros)
        const inicioSection = document.getElementById('inicio');
        if (inicioSection) {
            inicioSection.classList.add('active');
        }
    } else {
        // Activate the section specified in the hash
        const sectionId = hash.substring(1);
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    }
}

// ===== CERRAR NAVBAR AL INTERACTUAR =====
function initializeNavbarCloseOnInput() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (!navbarCollapse || !navbarToggler) return;
    
    function closeNavbar() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
            const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
            if (collapseInstance) {
                collapseInstance.hide();
            }
        } else {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    }
    
    const navLinks = navbarCollapse.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show') && window.innerWidth < 992) {
                closeNavbar();
            }
        });
    });
}

// ===== GALERÍA =====
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length === 0 || !lightbox) return;

    let currentImageIndex = 0;
    let galleryImages = Array.from(galleryItems).map(item => item.getAttribute('data-src'));
    let galleryTitles = Array.from(galleryItems).map(item => item.getAttribute('data-title'));

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    const lightboxClose = document.querySelector('.lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', previousImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            previousImage();
        }
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            nextImage();
        }
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    function openLightbox() {
        lightbox.classList.add('active');
        updateLightboxImage();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function previousImage() {
        currentImageIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
        updateLightboxImage();
    }

    function nextImage() {
        currentImageIndex = currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const imageSrc = galleryImages[currentImageIndex];
        const imageTitle = galleryTitles[currentImageIndex];
        const lightboxImage = document.querySelector('.lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxCounter = document.getElementById('lightbox-counter');
        
        if (lightboxImage) {
            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageTitle;
        }
        
        if (lightboxTitle) {
            lightboxTitle.textContent = imageTitle;
        }
        
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        }
    }
}

// ===== CARRUSEL VIDA ESTUDIANTIL =====
function initializeVidaEstudiantilCarousel() {
    const carousel = document.getElementById('carouselExampleAutoplaying');
    if (!carousel) return;
    
    let isPaused = false;
    let autoPlayInterval;
    const pausePlayBtn = document.getElementById('carouselPausePlay');
    const pausePlayIcon = pausePlayBtn?.querySelector('i');
    
    function safeCarouselAction(carouselElement, action) {
        if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) {
            return false;
        }
        try {
            const carouselInstance = bootstrap.Carousel.getInstance(carouselElement);
            if (!carouselInstance) return false;
            
            if (action === 'prev') carouselInstance.prev();
            else if (action === 'next') carouselInstance.next();
            else if (action === 'pause') carouselInstance.pause();
            else if (action === 'cycle') carouselInstance.cycle();
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    if (pausePlayBtn && pausePlayIcon) {
        pausePlayBtn.addEventListener('click', () => {
            if (isPaused) {
                isPaused = false;
                safeCarouselAction(carousel, 'cycle');
                pausePlayIcon.className = 'fas fa-pause';
            } else {
                isPaused = true;
                safeCarouselAction(carousel, 'pause');
                pausePlayIcon.className = 'fas fa-play';
            }
        });
    }
    
    carousel.addEventListener('mouseenter', () => {
        if (!isPaused) safeCarouselAction(carousel, 'pause');
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (!isPaused) safeCarouselAction(carousel, 'cycle');
    });
}

// ===== COMENTARIOS =====
let comentarios = [];

function initializeComments() {
    const commentForm = document.getElementById('commentForm');
    const savedComments = localStorage.getItem('polipi-comentarios');
    
    if (savedComments) {
        comentarios = JSON.parse(savedComments);
    }
    
    renderComments();
    
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
}

function handleCommentSubmit(e) {
    e.preventDefault();
    
    const commentName = document.getElementById('commentName');
    const commentEmail = document.getElementById('commentEmail');
    const commentMessage = document.getElementById('commentText');
    const commentsList = document.getElementById('commentsList');
    
    if (!commentName || !commentEmail || !commentMessage) return;
    
    const submitBtn = e.target.querySelector('.btn-comment');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const nuevoComentario = {
            id: Date.now(),
            nombre: commentName.value.trim(),
            email: commentEmail.value.trim(),
            mensaje: commentMessage.value.trim(),
            fecha: new Date().toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            timestamp: new Date().toISOString()
        };
        
        comentarios.unshift(nuevoComentario);
        localStorage.setItem('polipi-comentarios', JSON.stringify(comentarios));
        
        renderComments();
        e.target.reset();
        
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        showNotification('success', '¡Comentario enviado!', 'Gracias por compartir tu opinión.');
        
        const commentsSection = document.querySelector('.comments-section');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 1500);
}

function renderComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    if (comentarios.length === 0) {
        commentsList.innerHTML = '<p class="text-muted text-center py-4">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
        return;
    }
    
    const commentsHTML = comentarios.map(comentario => `
        <div class="comment-item mb-3 p-3 bg-light rounded">
            <div class="d-flex align-items-start">
                <div class="comment-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                    ${getInitials(comentario.nombre)}
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${escapeHtml(comentario.nombre)}</h6>
                    <p class="mb-1">${escapeHtml(comentario.mensaje)}</p>
                    <small class="text-muted">
                        <i class="fas fa-calendar-alt"></i> ${comentario.fecha}
                    </small>
                </div>
            </div>
        </div>
    `).join('');
    
    commentsList.innerHTML = commentsHTML;
}

function getInitials(nombre) {
    return nombre.split(' ').map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(type, title, message) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            <div>
                <strong>${title}</strong>
                <div>${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

console.log('✅ App.js cargado correctamente');

