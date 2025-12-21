// ===== NAVEGACIÓN SUAVE ENTRE SECCIONES =====
document.addEventListener('DOMContentLoaded', function() {
    // Esperar a que el DOM esté completamente cargado
    initializeNavigation();
    initializeGallery();
    initializeNews();
    initializeVidaEstudiantilCarousel();
});

function initializeNavigation() {
    const links = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('.section');

    if (sections.length === 0) return;

    links.forEach(link => {
        link.addEventListener('click', e => {
            const destino = link.getAttribute('href');

            if (!destino.startsWith('#')) return;
            e.preventDefault();

            const id = destino.substring(1);
            const sectionDestino = document.getElementById(id);
            if (!sectionDestino) return;

            // Quitar .active de TODAS
            sections.forEach(sec => sec.classList.remove('active'));

            // Activar la correcta
            sectionDestino.classList.add('active');

            // Scroll suave
            sectionDestino.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ===== FUNCIONALIDAD DE GALERÍA =====
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length === 0 || !lightbox) return;

    let currentImageIndex = 0;
    let galleryImages = Array.from(galleryItems).map(item => item.getAttribute('data-src'));
    let galleryTitles = Array.from(galleryItems).map(item => item.getAttribute('data-title'));

    // Abrir lightbox al hacer clic en una imagen
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    // Cerrar lightbox
    const lightboxClose = document.querySelector('.lightbox-close');
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Navegación con botones
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', previousImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }

    // Cerrar con tecla Escape
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

    // Cerrar al hacer clic fuera de la imagen
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

// ===== FUNCIONALIDAD DE NOTICIAS =====
function initializeNews() {
    const newsData = [
        {
            id: 1,
            categoria: 'academicas',
            titulo: 'Ceremonia de Graduación 2024: 150 Nuevos Profesionales',
            fecha: '15 de Enero, 2025',
            autor: 'Departamento Académico',
            imagen: './assets/images/poli-img-13.jpeg',
            contenido: 'El Politécnico Ann y Ted Kheel Celebró con gran orgullo la ceremonia de graduación de 150 estudiantes que culminaron exitosamente sus estudios en diversas áreas técnicas y profesionales.'
        },
        {
            id: 2,
            categoria: 'eventos',
            titulo: 'Feria Tecnológica Anual 2025',
            fecha: '12 de Enero, 2025',
            autor: 'Coordinación de Eventos',
            imagen: './assets/images/poli-img-2.png',
            contenido: 'La Feria Tecnológica Anual 2025 del Politécnico Ann y Ted Kheel se realizó con gran éxito, contando con la participación de más de 80 proyectos innovadores.'
        },
        {
            id: 3,
            categoria: 'deportivas',
            titulo: 'Campeonato Deportivo Intercursos',
            fecha: '10 de Enero, 2025',
            autor: 'Departamento de Deportes',
            imagen: './assets/images/poli-img-12.jpeg',
            contenido: 'El Campeonato Deportivo Intercursos 2025 reunió a más de 300 estudiantes en competencias de fútbol, baloncesto, voleibol y atletismo.'
        }
    ];

    const newsModal = document.getElementById('newsModal');
    if (!newsModal) return;

    // Función para abrir modal de noticias
    window.openNewsModal = function(newsId) {
        const noticia = newsData.find(n => n.id === newsId);
        if (!noticia) return;

        // Actualizar contenido del modal
        const modalCategory = document.getElementById('modal-category');
        const modalDate = document.getElementById('modal-date');
        const modalTitle = document.getElementById('modal-title');
        const modalImage = document.getElementById('modal-image');
        const modalBody = document.getElementById('modal-body');
        const modalAuthor = document.getElementById('modal-author');

        if (modalCategory) modalCategory.textContent = noticia.categoria;
        if (modalDate) modalDate.textContent = noticia.fecha;
        if (modalTitle) modalTitle.textContent = noticia.titulo;
        if (modalImage) {
            modalImage.src = noticia.imagen;
            modalImage.alt = noticia.titulo;
        }
        if (modalBody) modalBody.textContent = noticia.contenido;
        if (modalAuthor) modalAuthor.innerHTML = `<i class="fas fa-user"></i> ${noticia.autor}`;

        // Mostrar modal
        newsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Cerrar modal
    const modalClose = document.querySelector('.news-modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            newsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && newsModal.classList.contains('active')) {
            newsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Cerrar al hacer clic fuera
    newsModal.addEventListener('click', (e) => {
        if (e.target === newsModal) {
            newsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Filtros de noticias
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón seleccionado
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Filtrar noticias
            newsItems.forEach(item => {
                if (category === 'todas' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Búsqueda de noticias
    const newsSearch = document.getElementById('news-search');
    if (newsSearch) {
        newsSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
        });
    }
    
    // Precargar cuando se abre una imagen
    const originalOpenLightbox = openLightbox;
    openLightbox = function(index) {
        originalOpenLightbox(index);
        preloadAdjacentImages(index);
    };
}


// Inicializar optimizaciones - comentar hasta implementar
// document.addEventListener('DOMContentLoaded', optimizeGalleryPerformance);

/* ===== FUNCIONALIDAD DE NOTICIAS ===== */

// Datos de las noticias
const noticiasData = [
    {
        id: 1,
        categoria: 'academicas',
        titulo: 'Ceremonia de Graduación 2024: 150 Nuevos Profesionales',
        fecha: '15 de Enero, 2025',
        autor: 'Departamento Académico',
        imagen: './assets/images/poli-img-13.jpeg',
        contenido: `
            <p>El Politécnico Ann y Ted Kheel Celebró con gran orgullo la ceremonia de graduación de 150 estudiantes que culminaron exitosamente sus estudios en diversas áreas técnicas y profesionales.</p>
            
            <p>Esta ceremonia marca un hito importante en la historia institucional, ya que representa la mayor cantidad de graduandos en un solo evento. Los nuevos profesionales provienen de programas en ingeniería, administración, tecnología de la información y áreas técnicas especializadas.</p>
            
            <p>Durante el evento, el Director General destacó el compromiso de la institución con la excelencia académica y la formación integral de profesionales capaces de enfrentar los desafíos del mundo moderno.</p>
            
            <p>Los graduandos han demostrado no solo conocimientos técnicos sólidos, sino también valores humanos que los convertirán en agentes de cambio positivos en sus respectivas comunidades.</p>
        `
    },
    {
        id: 2,
        categoria: 'eventos',
        titulo: 'Feria Tecnológica Anual 2025',
        fecha: '12 de Enero, 2025',
        autor: 'Coordinación de Eventos',
        imagen: './assets/images/poli-img-2.png',
        contenido: `
            <p>La Feria Tecnológica Anual 2025 del Politécnico Ann y Ted Kheel se realizó con gran éxito, contando con la participación de más de 80 proyectos innovadores presentados por estudiantes de todas las carreras.</p>
            
            <p>Los proyectos abarcaron diversas áreas como robótica, aplicaciones móviles, sistemas de información, energías renovables y automatización industrial. Los estudiantes pudieron mostrar sus innovaciones ante unpanel de expertos y empresarios del sector tecnológico.</p>
            
            <p>Esta feria representa una oportunidad única para que los estudiantes apliquen los conocimientos adquiridos en un entorno real, desarrollando soluciones tecnológicas que responden a necesidades específicas del mercado.</p>
            
            <p>Los tres mejores proyectos recibieron premios y la oportunidad de ser incubados en el centro de innovación de la institución.</p>
        `
    },
    {
        id: 3,
        categoria: 'deportivas',
        titulo: 'Campeonato Deportivo Intercursos',
        fecha: '10 de Enero, 2025',
        autor: 'Departamento de Deportes',
        imagen: './assets/images/poli-img-12.jpeg',
        contenido: `
            <p>El Campeonato Deportivo Intercursos 2025 reunió a más de 300 estudiantes en competencias de fútbol, baloncesto, voleibol y atletismo, demostrando el espíritu deportivo y de superación que caracteriza a nuestra comunidad estudiantil.</p>
            
            <p>Durante una semana completa, los equipos de diferentes cursos compitieron en un ambiente de fair play y camaradería, donde lo más importante fue promover la actividad física y los valores del deporte.</p>
            
            <p>El evento contó con la participación de entrenadores especializados y la colaboración de padres de familia quienes apoyaron a sus hijos durante las competencias.</p>
            
            <p>Estos eventos deportivos fortalecen la integración entre estudiantes y promueven hábitos de vida saludable que complementan su formación académica.</p>
        `
    },
    {
        id: 4,
        categoria: 'academicas',
        titulo: 'Inauguración del Nuevo Laboratorio de Robótica',
        fecha: '8 de Enero, 2025',
        autor: 'Facultad de Ingeniería',
        imagen: './assets/images/poli-img-11.jpeg',
        contenido: `
            <p>El Politécnico Ann y Ted Kheel inauguró oficialmente su nuevo Laboratorio de Robótica, equipado con tecnología de vanguardia para fortalecer la formación en ingeniería y tecnología.</p>
            
            <p>El laboratorio cuenta con robots industriales, kits de robótica educativa, sensores avanzados y software especializado que permitirá a los estudiantes desarrollar proyectos de automatización e inteligencia artificial.</p>
            
            <p>Esta nueva infraestructura posiciona a la institución como líder en educación técnica especializada, ofreciendo a los estudiantes acceso a herramientas que utilizan las empresas más avanzadas del sector.</p>
            
            <p>El laboratorio será utilizado tanto para clases regulares como para proyectos de investigación estudiantil y desarrollo de soluciones tecnológicas para la industria local.</p>
        `
    },
    {
        id: 5,
        categoria: 'cultura',
        titulo: 'Festival Cultural Estudiantil',
        fecha: '5 de Enero, 2025',
        autor: 'Coordinación Cultural',
        imagen: './assets/images/poli-img15.jpeg',
        contenido: `
            <p>El Festival Cultural Estudiantil celebró la diversidad de nuestra comunidad con presentaciones artísticas, gastronómicas y musicales que reflejaron las diferentes tradiciones de nuestros estudiantes.</p>
            
            <p>El evento incluyó presentaciones de danzafolclórica, música tradicional, exposiciones de arte estudiantil y una feria gastronómica donde los estudiantes compartieron platillos típicos de sus regiones de origen.</p>
            
            <p>Esta actividad promueve el respeto por la diversidad cultural y fortalece los lazos de hermandad entre miembros de nuestra comunidad educativa, creando un ambiente de inclusión y valoración de nuestras raíces.</p>
            
            <p>El festival también incluyó un concurso de talentos donde estudiantes pudieron demostrar sus habilidades artísticas en diferentes disciplinas.</p>
        `
    },
    {
        id: 6,
        categoria: 'academicas',
        titulo: 'Nuevos Programas Académicos 2025',
        fecha: '3 de Enero, 2025',
        autor: 'Dirección Académica',
        imagen: './assets/images/poli-img-17.jpeg',
        contenido: `
            <p>El Politécnico Ann y Ted Kheel lanza nuevos programas académicos especializados en tecnología y administración, diseñados para responder a las demandas del mercado laboral actual.</p>
            
            <p>Los nuevos programas incluyen: Desarrollo de Software, Administración Digital, Diseño Gráfico Digital y Técnico en Energías Renovables, todos con enfoque práctico y vinculación directa con la industria.</p>
            
            <p>Estos programas han sido desarrollados en colaboración con empresas del sector, asegurando que los contenidos académicos estén alineados con las competencias más demandadas en el mercado laboral.</p>
            
            <p>Las inscripciones están abiertas y los nuevos estudiantes podrán acceder a becas parciales basadas en mérito académico y situación socioeconómica.</p>
        `
    },
    {
        id: 7,
        categoria: 'eventos',
        titulo: 'Conferencia Magistral de Innovación',
        fecha: '1 de Enero, 2025',
        autor: 'Vicerrectoría Académica',
        imagen: './assets/images/poli-img-16.jpeg',
        contenido: `
            <p>Expertos internacionales en educación técnica compartieron las últimas tendencias en innovación educativa durante la Conferencia Magistral de Innovación del Politécnico Ann y Ted Kheel.</p>
            
            <p>La conferencia contó con ponentes de universidades prestigiosas de América y Europa, quienes abordaron temas como metodologías activas, tecnología educativa y competencias del siglo XXI.</p>
            
            <p>Los participantes tuvieron la oportunidad de conocer experiencias exitosas de instituciones líderes en educación técnica y establecer redes de colaboración académica internacional.</p>
            
            <p>Esta actividad forma parte del plan de mejoramiento continuo de la institución, buscando mantener estándares de calidad académica de nivel internacional.</p>
        `
    },
    {
        id: 8,
        categoria: 'deportivas',
        titulo: 'Torneo de Fútbol Intercursos',
        fecha: '28 de Diciembre, 2024',
        autor: 'Departamento de Deportes',
        imagen: './assets/images/poli-img-18.jpeg',
        contenido: `
            <p>El torneo anual de fútbol intercursos reunió a más de 200 estudiantes en una competencia amistosa que promote el espíritu deportivo y la integración entre diferentes cursos.</p>
            
            <p>El torneo se desarrolló durante dos semanas en las instalaciones deportivas de la institución, con equipos representando a cada uno de los cursos de la carrera.</p>
            
            <p>Más allá de la competencia, el evento sirvió como plataforma para que los estudiantes desarrollen habilidades de trabajo en equipo, liderazgo y fair play.</p>
            
            <p>La final se jugó ante una gran audiencia de estudiantes, profesores y familiares, culminando con la entrega de trofeos al equipo campeón y reconocimientos especiales.</p>
        `
    }
];

// Variables para el modal de noticias
let currentNewsIndex = 0;
let filteredNews = [];

// Elementos del DOM
const newsModal = document.getElementById('newsModal');
const newsSearch = document.getElementById('news-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const newsItems = document.querySelectorAll('.news-item');

// Inicializar funcionalidades de noticias
document.addEventListener('DOMContentLoaded', function() {
    initializeNews();
    setupNewsEventListeners();
});

function initializeNews() {
    // Inicializar noticias filtradas con todas las noticias
    filteredNews = [...noticiasData];
    
    // Mostrar todas las noticias inicialmente
    showAllNews();
    
    // Configurar índice inicial del modal
    updateModalNavigation();
}

function setupNewsEventListeners() {
    // Búsqueda de noticias
    if (newsSearch) {
        newsSearch.addEventListener('input', handleNewsSearch);
    }
    
    // Filtros por categoría
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleCategoryFilter(button));
    });
    
    // Cerrar modal de noticias
    const modalClose = document.querySelector('.news-modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeNewsModal);
    }
    
    // Cerrar modal al hacer clic fuera
    if (newsModal) {
        newsModal.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                closeNewsModal();
            }
        });
    }
    
    // Navegación en el modal
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    if (modalPrev) {
        modalPrev.addEventListener('click', showPreviousNews);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', showNextNews);
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && newsModal.classList.contains('active')) {
            closeNewsModal();
        }
    });
}

function openNewsModal(newsId) {
    // Encontrar el índice de la noticia
    const newsIndex = filteredNews.findIndex(news => news.id === newsId);
    if (newsIndex === -1) return;
    
    currentNewsIndex = newsIndex;
    const noticia = filteredNews[newsIndex];
    
    // Actualizar contenido del modal
    updateModalContent(noticia);
    
    // Mostrar modal
    newsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Actualizar navegación
    updateModalNavigation();
}

function closeNewsModal() {
    newsModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}


function updateModalContent(noticia) {
    // Actualizar elementos del modal
    document.getElementById('modal-category').textContent = getCategoryDisplayName(noticia.categoria);
    document.getElementById('modal-date').textContent = noticia.fecha;
    document.getElementById('modal-title').textContent = noticia.titulo;
    document.getElementById('modal-image').src = noticia.imagen;
    document.getElementById('modal-image').alt = noticia.titulo;
    document.getElementById('modal-body').innerHTML = noticia.contenido;
    document.getElementById('modal-author').innerHTML = `<i class="fas fa-user"></i> ${noticia.autor}`;
    
    // Añadir evento click a la imagen para abrirla en tamaño completo
    const modalImage = document.getElementById('modal-image');
    modalImage.onclick = () => openImageFullscreen(noticia.imagen, noticia.titulo);
}

function getCategoryDisplayName(category) {
    const categoryNames = {
        'todas': 'Todas',
        'eventos': 'Eventos',
        'academicas': 'Académicas',
        'deportivas': 'Deportivas',
        'cultura': 'Cultura'
    };
    return categoryNames[category] || category;
}

function showPreviousNews() {
    if (currentNewsIndex > 0) {
        currentNewsIndex--;
        updateModalContent(filteredNews[currentNewsIndex]);
        updateModalNavigation();
    }
}

function showNextNews() {
    if (currentNewsIndex < filteredNews.length - 1) {
        currentNewsIndex++;
        updateModalContent(filteredNews[currentNewsIndex]);
        updateModalNavigation();
    }
}

function updateModalNavigation() {
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    if (modalPrev) {
        modalPrev.disabled = currentNewsIndex === 0;
    }
    
    if (modalNext) {
        modalNext.disabled = currentNewsIndex === filteredNews.length - 1;
    }
}

function handleNewsSearch() {
    const searchTerm = newsSearch.value.toLowerCase().trim();
    const activeCategory = document.querySelector('.filter-btn.active').dataset.category;
    
    filterNews(searchTerm, activeCategory);
}

function handleCategoryFilter(button) {
    // Remover clase active de todos los botones
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Añadir clase active al botón seleccionado
    button.classList.add('active');
    
    const category = button.dataset.category;
    const searchTerm = newsSearch.value.toLowerCase().trim();
    
    filterNews(searchTerm, category);
}

function filterNews(searchTerm = '', category = 'todas') {
    // Filtrar noticias
    filteredNews = noticiasData.filter(noticia => {
        const matchesCategory = category === 'todas' || noticia.categoria === category;
        const matchesSearch = searchTerm === '' || 
            noticia.titulo.toLowerCase().includes(searchTerm) ||
            noticia.contenido.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    // Mostrar/ocultar noticias en el DOM
    showFilteredNews(searchTerm, category);
    
    // Si no hay resultados, mostrar mensaje
    if (filteredNews.length === 0) {
        showNoResultsMessage();
    }
}

function showFilteredNews(searchTerm = '', category = 'todas') {
    newsItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const itemTitle = item.querySelector('.news-title').textContent.toLowerCase();
        const itemExcerpt = item.querySelector('.news-excerpt').textContent.toLowerCase();
        
        const matchesCategory = category === 'todas' || itemCategory === category;
        const matchesSearch = searchTerm === '' || 
            itemTitle.includes(searchTerm) ||
            itemExcerpt.includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            item.classList.remove('hidden');
            item.classList.add('visible');
        } else {
            item.classList.add('hidden');
            item.classList.remove('visible');
        }
    });
}

function showAllNews() {
    newsItems.forEach(item => {
        item.classList.remove('hidden');
        item.classList.add('visible');
    });
}

function showNoResultsMessage() {
    // Crear mensaje de "no resultados" si no existe
    let noResultsMsg = document.querySelector('.no-results-message');
    if (!noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">No se encontraron noticias</h4>
                <p class="text-muted">Intenta con otros términos de búsqueda o categorías</p>
            </div>
        `;
        document.getElementById('news-grid').appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = 'block';
}

// Ocultar mensaje de no resultados cuando hay resultados
function hideNoResultsMessage() {
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
    
    // Ocultar también el mensaje de comentarios vacíos
    const commentsEmpty = document.getElementById('comments-empty');
    if (commentsEmpty) {
        commentsEmpty.style.display = 'none';
    }
}


// Optimización: actualizar el filtrado cuando se escribe en la búsqueda
const originalFilterNews = filterNews;
filterNews = function(searchTerm = '', category = 'todas') {
    originalFilterNews(searchTerm, category);
    if (filteredNews.length > 0) {
        hideNoResultsMessage();
    }
};

/* ===== FUNCIONALIDAD PARA IMAGEN AMPLIADA ===== */

// Elementos del modal de imagen ampliada
const imageFullModal = document.getElementById('news-modal-image-full');
const imageFullModalImg = document.getElementById('news-modal-image-full-img');
const imageFullModalClose = document.getElementById('news-modal-image-full-close');

// Inicializar eventos para el modal de imagen ampliada
document.addEventListener('DOMContentLoaded', function() {
    setupImageFullModalEvents();
});

function setupImageFullModalEvents() {
    // Cerrar modal con el botón X
    if (imageFullModalClose) {
        imageFullModalClose.addEventListener('click', closeImageFullscreen);
    }
    
    // Cerrar modal al hacer clic fuera de la imagen
    if (imageFullModal) {
        imageFullModal.addEventListener('click', (e) => {
            if (e.target === imageFullModal) {
                closeImageFullscreen();
            }
        });
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageFullModal.classList.contains('active')) {
            closeImageFullscreen();
        }
    });
    
    // Prevenir clic en la imagen para cerrar el modal
    if (imageFullModalImg) {
        imageFullModalImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

function openImageFullscreen(imageSrc, imageAlt = '') {
    if (!imageFullModal || !imageFullModalImg) return;
    
    // Mostrar modal
    imageFullModal.classList.add('active');
    
    // Cargar imagen
    imageFullModalImg.src = imageSrc;
    imageFullModalImg.alt = imageAlt;
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Animación de entrada
    setTimeout(() => {
        imageFullModalImg.style.opacity = '1';
        imageFullModalImg.style.transform = 'scale(1)';
    }, 50);
}

function closeImageFullscreen() {
    if (!imageFullModal || !imageFullModalImg) return;
    
    // Animación de salida
    imageFullModalImg.style.opacity = '0';
    imageFullModalImg.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        // Ocultar modal
        imageFullModal.classList.remove('active');
        
        // Restaurar scroll del body
        document.body.style.overflow = 'auto';
        
        // Limpiar imagen
        imageFullModalImg.src = '';
    }, 300);
}

// Añadir estilos para la animación de la imagen ampliada
document.addEventListener('DOMContentLoaded', function() {
    const imageFullStyles = `
        <style>
            #news-modal-image-full-img {
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.4s ease;
            }
            
            #news-modal-image-full-img.loaded {
                opacity: 1;
                transform: scale(1);
            }
            
            #news-modal-image-full {
                backdrop-filter: blur(10px);
            }
            
            #news-modal-image-full img {
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: imageZoomIn 0.4s ease;
            }
            
            @keyframes imageZoomIn {
                from {
                    transform: scale(0.7);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            /* Efecto de carga */
            #news-modal-image-full::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: -1;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', imageFullStyles);
    

    // Manejar carga de imagen
    if (imageFullModalImg) {
        imageFullModalImg.onload = function() {
            this.classList.add('loaded');
        };
    }
});

/* ===== FUNCIONALIDAD DE COMENTARIOS ===== */

// Variables para comentarios
let comentarios = [];

// Elementos del DOM para comentarios
const commentForm = document.getElementById('commentForm');
const commentName = document.getElementById('commentName');
const commentEmail = document.getElementById('commentEmail');
const commentMessage = document.getElementById('commentText');
const commentsList = document.getElementById('commentsList');
const commentsEmpty = null; // Este elemento no existe en el HTML

// Inicializar comentarios
document.addEventListener('DOMContentLoaded', function() {
    initializeComments();
    setupCommentsEventListeners();
});

function initializeComments() {
    // Cargar comentarios del localStorage
    const savedComments = localStorage.getItem('polipi-comentarios');
    if (savedComments) {
        comentarios = JSON.parse(savedComments);
    }
    
    // Renderizar comentarios
    renderComments();
}

function setupCommentsEventListeners() {
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }
    
    // Validación en tiempo real
    if (commentName) {
        commentName.addEventListener('blur', () => validateField(commentName, 'nombre'));
    }
    
    if (commentEmail) {
        commentEmail.addEventListener('blur', () => validateField(commentEmail, 'email'));
    }
    
    if (commentMessage) {
        commentMessage.addEventListener('blur', () => validateField(commentMessage, 'mensaje'));
    }
}

function handleCommentSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isNameValid = validateField(commentName, 'nombre');
    const isEmailValid = validateField(commentEmail, 'email');
    const isMessageValid = validateField(commentMessage, 'mensaje');
    
    if (!isNameValid || !isEmailValid || !isMessageValid) {
        return;
    }
    
    // Mostrar estado de carga
    const submitBtn = commentForm.querySelector('.btn-comment');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    // Simular envío (aquí podrías integrar con un backend real)
    setTimeout(() => {
        // Crear nuevo comentario
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
        
        // Agregar al inicio del array (más recientes primero)
        comentarios.unshift(nuevoComentario);
        
        // Guardar en localStorage
        localStorage.setItem('polipi-comentarios', JSON.stringify(comentarios));
        
        // Renderizar comentarios
        renderComments();
        
        // Limpiar formulario
        commentForm.reset();
        clearValidation();
        
        // Restaurar botón
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Mostrar mensaje de éxito
        showSuccessMessage();
        
        // Scroll suave a los comentarios
        scrollToComments();
        
    }, 1500); // Simular delay de red
}

function validateField(field, type) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Limpiar validación anterior
    field.classList.remove('is-invalid');
    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.remove();
    }
    
    switch (type) {
        case 'nombre':
            if (!value) {
                isValid = false;
                message = 'El nombre es obligatorio';
            } else if (value.length < 2) {
                isValid = false;
                message = 'El nombre debe tener al menos 2 caracteres';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                message = 'El email es obligatorio';
            } else if (!isValidEmail(value)) {
                isValid = false;
                message = 'Ingresa un email válido';
            }
            break;
            
        case 'mensaje':
            if (!value) {
                isValid = false;
                message = 'El mensaje es obligatorio';
            } else if (value.length < 10) {
                isValid = false;
                message = 'El mensaje debe tener al menos 10 caracteres';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('is-invalid');
        
        // Crear elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = message;
        field.parentNode.appendChild(feedback);
    }
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function clearValidation() {
    const fields = [commentName, commentEmail, commentMessage];
    fields.forEach(field => {
        field.classList.remove('is-invalid');
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    });
}

function renderComments() {
    if (!commentsList) return;
    
    if (comentarios.length === 0) {
        // Mostrar estado vacío - crear si no existe
        let commentsEmpty = document.getElementById('comments-empty');
        if (!commentsEmpty) {
            commentsEmpty = document.createElement('div');
            commentsEmpty.id = 'comments-empty';
            commentsEmpty.className = 'text-center py-4';
            commentsEmpty.innerHTML = '<p class="text-muted">No hay comentarios aún. ¡Sé el primero en comentar!</p>';
            commentsList.parentNode.insertBefore(commentsEmpty, commentsList);
        }
        commentsEmpty.style.display = 'block';
        commentsList.innerHTML = '';
        return;
    }
    
    // Ocultar estado vacío
    if (commentsEmpty) {
        commentsEmpty.style.display = 'none';
    }
    
    // Crear HTML para comentarios
    const commentsHTML = comentarios.map(comentario => `
        <div class="comment-item" data-id="${comentario.id}">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="comment-avatar">
                        ${getInitials(comentario.nombre)}
                    </div>
                    <div>
                        <h5 class="comment-name">${escapeHtml(comentario.nombre)}</h5>
                        <div class="comment-date">
                            <i class="fas fa-calendar-alt"></i>
                            ${comentario.fecha}
                        </div>
                    </div>
                </div>
            </div>
            <p class="comment-text">${escapeHtml(comentario.mensaje)}</p>
        </div>
    `).join('');
    
    commentsList.innerHTML = commentsHTML;
}

function getInitials(nombre) {
    return nombre
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccessMessage() {
    // Crear notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <div>
                <strong>¡Comentario enviado!</strong>
                <div>Gracias por compartir tu opinión con nosotros.</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

function scrollToComments() {
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Funciones adicionales para comentarios
function deleteComment(commentId) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
        comentarios = comentarios.filter(c => c.id !== commentId);
        localStorage.setItem('polipi-comentarios', JSON.stringify(comentarios));
        renderComments();
    }
}

function loadMoreComments() {
    // Función para cargar más comentarios si hay paginación
    // Por ahora, simplemente scroll hacia arriba
    const commentsSection = document.querySelector('.comments-section');
    if (commentsSection) {
        commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Funciones de utilidad para comentarios
function getCommentStats() {
    return {
        total: comentarios.length,
        thisWeek: getCommentsThisWeek(),
        thisMonth: getCommentsThisMonth()
    };
}

function getCommentsThisWeek() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return comentarios.filter(comentario => 
        new Date(comentario.timestamp) > oneWeekAgo
    ).length;
}

function getCommentsThisMonth() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return comentarios.filter(comentario => 
        new Date(comentario.timestamp) > oneMonthAgo
    ).length;
}

// Exportar funciones para uso global si es necesario
window.ComentariosManager = {
    getStats: getCommentStats,
    deleteComment: deleteComment,
    getAll: () => [...comentarios],
    clearAll: () => {
        if (confirm('¿Estás seguro de que quieres eliminar TODOS los comentarios?')) {
            comentarios = [];
            localStorage.removeItem('polipi-comentarios');
            renderComments();
        }
    }
};

/* ===== FUNCIONALIDAD AVANZADA DEL CARRUSEL VIDA ESTUDIANTIL ===== */

function initializeVidaEstudiantilCarousel() {
    const carousel = document.getElementById('carouselExampleAutoplaying');
    if (!carousel) return;
    
    // Inicializar variables
    let isPaused = false;
    let currentSlide = 0;
    let totalSlides = 3;
    let autoPlayInterval;
    
    // Elementos del carrusel
    const pausePlayBtn = document.getElementById('carouselPausePlay');
    const pausePlayIcon = pausePlayBtn?.querySelector('i');
    
    // Función de utilidad segura para manejar Bootstrap Carousel
    function safeCarouselAction(carouselElement, action, params = null) {
        try {
            // Verificar que Bootstrap está disponible
            if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) {
                console.warn('Bootstrap Carousel no está disponible');
                return false;
            }
            
            // Obtener instancia del carrusel
            const carouselInstance = bootstrap.Carousel.getInstance(carouselElement);
            
            if (!carouselInstance) {
                console.warn('No se pudo obtener la instancia del carrusel');
                return false;
            }
            
            // Ejecutar la acción solicitada
            switch(action) {
                case 'prev':
                    carouselInstance.prev();
                    break;
                case 'next':
                    carouselInstance.next();
                    break;
                case 'pause':
                    carouselInstance.pause();
                    break;
                case 'cycle':
                    carouselInstance.cycle();
                    break;
                case 'to':
                    if (params !== null && typeof params === 'number') {
                        carouselInstance.to(params);
                    }
                    break;
                default:
                    console.warn(`Acción de carrusel no reconocida: ${action}`);
                    return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error al ejecutar acción del carrusel:', error);
            return false;
        }
    }
    
    // Inicializar funcionalidad
    setupCarouselControls();
    setupAutoPlay();
    setupKeyboardNavigation();
    setupTouchGestures();
    setupIntersectionObserver();
    
    function setupCarouselControls() {
        // Control play/pause
        if (pausePlayBtn && pausePlayIcon) {
            pausePlayBtn.addEventListener('click', toggleAutoPlay);
        }
        
        // Auto-pause al hover
        carousel.addEventListener('mouseenter', pauseCarousel);
        carousel.addEventListener('mouseleave', resumeCarousel);
        
        // Event listener para cambio de slide
        carousel.addEventListener('slide.bs.carousel', handleSlideChange);
        carousel.addEventListener('slid.bs.carousel', handleSlideChanged);
    }
    
    function setupAutoPlay() {
        startAutoPlay();
    }
    
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Solo activar si el carrusel está visible
            if (!isElementInViewport(carousel)) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    safeCarouselAction(carousel, 'prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    safeCarouselAction(carousel, 'next');
                    break;
                case ' ':
                    e.preventDefault();
                    toggleAutoPlay();
                    break;
            }
        });
    }
    
    function setupTouchGestures() {
        let startX = 0;
        let endX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const threshold = 50; // Mínimo movimiento para swipe
            const diff = startX - endX;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe izquierda - siguiente slide
                    safeCarouselAction(carousel, 'next');
                } else {
                    // Swipe derecha - slide anterior
                    safeCarouselAction(carousel, 'prev');
                }
            }
        }
    }
    
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    resumeCarousel();
                } else {
                    pauseCarousel();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(carousel);
    }
    
    function toggleAutoPlay() {
        if (isPaused) {
            resumeCarousel();
        } else {
            pauseCarousel();
        }
        updatePausePlayButton();
    }
    
    function pauseCarousel() {
        isPaused = true;
        safeCarouselAction(carousel, 'pause');
        clearInterval(autoPlayInterval);
    }
    
    function resumeCarousel() {
        if (!isPaused) return;
        isPaused = false;
        safeCarouselAction(carousel, 'cycle');
        startAutoPlay();
    }
    
    function startAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (!isPaused) {
                safeCarouselAction(carousel, 'next');
            }
        }, 5000); // 5 segundos
    }
    
    function updatePausePlayButton() {
        if (!pausePlayIcon) return;
        
        if (isPaused) {
            pausePlayIcon.className = 'fas fa-play';
            pausePlayBtn.setAttribute('title', 'Reproducir carrusel');
        } else {
            pausePlayIcon.className = 'fas fa-pause';
            pausePlayBtn.setAttribute('title', 'Pausar carrusel');
        }
    }
    
    function handleSlideChange(e) {
        // Se ejecuta ANTES del cambio de slide
        currentSlide = e.to;
        updateSlideIndicators();
        animateSlideContent();
    }
    
    function handleSlideChanged(e) {
        // Se ejecuta DESPUÉS del cambio de slide
        updateProgressBar();
    }
    
    function updateSlideIndicators() {
        const indicators = document.querySelectorAll('.custom-carousel-indicators button');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.removeAttribute('aria-current');
            }
        });
    }
    
    function animateSlideContent() {
        const activeItem = carousel.querySelector('.carousel-item.active');
        const textoPrincipal = activeItem?.querySelector('.texto-principal');
        const textoSecundario = activeItem?.querySelector('.texto-secundario');
        
        if (textoPrincipal) {
            textoPrincipal.style.animation = 'none';
            // Trigger reflow
            textoPrincipal.offsetHeight;
            textoPrincipal.style.animation = 'textoSlideIn 0.8s ease-out';
        }
        
        if (textoSecundario) {
            textoSecundario.style.animation = 'none';
            textoSecundario.offsetHeight;
            textoSecundario.style.animation = 'textoSlideIn 1s ease-out 0.3s both';
        }
    }
    
    function updateProgressBar() {
        // Crear barra de progreso si no existe
        let progressBar = document.querySelector('.carousel-progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'carousel-progress-bar';
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(90deg, var(--azul-claro), var(--blanco-gris));
                transition: width 0.3s ease;
                z-index: 3;
                border-radius: 0 2px 2px 0;
            `;
            carousel.appendChild(progressBar);
        }
        
        // Animar barra de progreso
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 100);
    }
    
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Cleanup function para cuando se leave la página
    window.addEventListener('beforeunload', () => {
        clearInterval(autoPlayInterval);
    });
}

// Funciones de utilidad adicionales para el carrusel
window.CarouselUtils = {
    // Función para saltar a un slide específico
    goToSlide: function(slideIndex) {
        const carousel = document.getElementById('carouselExampleAutoplaying');
        if (carousel && slideIndex >= 0 && slideIndex < 3) {
            // Verificar que Bootstrap está disponible
            if (typeof bootstrap === 'undefined' || !bootstrap.Carousel) {
                console.warn('Bootstrap Carousel no está disponible');
                return false;
            }
            
            try {
                const carouselInstance = bootstrap.Carousel.getInstance(carousel);
                if (carouselInstance) {
                    carouselInstance.to(slideIndex);
                    return true;
                } else {
                    console.warn('No se pudo obtener la instancia del carrusel');
                    return false;
                }
            } catch (error) {
                console.error('Error al navegar al slide:', error);
                return false;
            }
        }
        return false;
    },
    
    // Función para obtener el slide actual
    getCurrentSlide: function() {
        const activeSlide = document.querySelector('.carousel-item.active');
        return activeSlide ? Array.from(document.querySelectorAll('.carousel-item')).indexOf(activeSlide) : 0;
    },
    
    // Función para reproducir/pausar programáticamente
    togglePlayPause: function() {
        const pausePlayBtn = document.getElementById('carouselPausePlay');
        if (pausePlayBtn) {
            pausePlayBtn.click();
        }
    },
    
    // Función para cambiar el intervalo de autoplay
    setAutoPlayInterval: function(milliseconds) {
        const carousel = document.getElementById('carouselExampleAutoplaying');
        if (carousel) {
            carousel.setAttribute('data-bs-interval', milliseconds);
        }
    }
};
