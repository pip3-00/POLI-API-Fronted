/**
 * MÓDULO DE NOTICIAS - Politécnico Ann y Ted Kheel
 * Maneja la funcionalidad de noticias en la página principal
 */

// ===== DATOS DE LAS NOTICIAS =====
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
            <p>Los proyectos abarcaron diversas áreas como robótica, aplicaciones móviles, sistemas de información, energías renovables y automatización industrial.</p>
            <p>Esta feria representa una oportunidad única para que los estudiantes apliquen los conocimientos adquiridos en un entorno real.</p>
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
            <p>Durante una semana completa, los equipos de diferentes cursos compitieron en un ambiente de fair play y camaradería.</p>
            <p>El evento contó con la participación de entrenadores especializados y la colaboración de padres de familia.</p>
            <p>Estos eventos deportivos fortalecen la integración entre estudiantes y promueven hábitos de vida saludable.</p>
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
            <p>El Politécnico Ann y Ted Kheel inauguró oficialmente su nuevo Laboratorio de Robótica, equipado con tecnología de vanguardia.</p>
            <p>El laboratorio cuenta con robots industriales, kits de robótica educativa, sensores avanzados y software especializado.</p>
            <p>Esta nueva infraestructura posiciona a la institución como líder en educación técnica especializada.</p>
            <p>El laboratorio será utilizado tanto para clases regulares como para proyectos de investigación estudiantil.</p>
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
            <p>El Festival Cultural Estudiantil celebró la diversidad de nuestra comunidad con presentaciones artísticas, gastronómicas y musicales.</p>
            <p>El evento incluyó presentaciones de danza folclórica, música tradicional, exposiciones de arte estudiantil y una feria gastronómica.</p>
            <p>Esta actividad promueve el respeto por la diversidad cultural y fortalece los lazos de hermandad.</p>
            <p>El festival también incluyó un concurso de talentos donde estudiantes pudieron demostrar sus habilidades artísticas.</p>
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
            <p>El Politécnico Ann y Ted Kheel lanza nuevos programas académicos especializados en tecnología y administración.</p>
            <p>Los nuevos programas incluyen: Desarrollo de Software, Administración Digital, Diseño Gráfico Digital y Técnico en Energías Renovables.</p>
            <p>Estos programas han sido desarrollados en colaboración con empresas del sector.</p>
            <p>Las inscripciones están abiertas y los nuevos estudiantes podrán acceder a becas parciales.</p>
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
            <p>Expertos internacionales compartieron las últimas tendencias en innovación educativa durante la Conferencia Magistral.</p>
            <p>La conferencia contó con ponentes de universidades prestigiosas de América y Europa.</p>
            <p>Los participantes tuvieron la oportunidad de conocer experiencias exitosas de instituciones líderes.</p>
            <p>Esta actividad forma parte del plan de mejoramiento continuo de la institución.</p>
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
            <p>El torneo anual de fútbol intercursos reuniu a más de 200 estudiantes en una competencia amistosa.</p>
            <p>El torneo se desarrolló durante dos semanas en las instalaciones deportivas de la institución.</p>
            <p>Más allá de la competencia, el evento sirvió como plataforma para que los estudiantes desarrollen habilidades de trabajo en equipo.</p>
            <p>La final se jugó ante una gran audiencia de estudiantes, profesores y familiares.</p>
        `
    }
];

// ===== VARIABLES GLOBALES =====
let currentNewsIndex = 0;
let filteredNews = [];

// Elementos del DOM
const newsModal = document.getElementById('newsModal');
const newsSearch = document.getElementById('news-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const newsItems = document.querySelectorAll('.news-item');

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNews();
    setupNewsEventListeners();
});

function initializeNews() {
    filteredNews = [...noticiasData];
    showAllNews();
    updateModalNavigation();
}

function setupNewsEventListeners() {
    if (newsSearch) {
        newsSearch.addEventListener('input', handleNewsSearch);
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleCategoryFilter(button));
    });
    
    const modalClose = document.querySelector('.news-modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeNewsModal);
    }
    
    if (newsModal) {
        newsModal.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                closeNewsModal();
            }
        });
    }
    
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    if (modalPrev) {
        modalPrev.addEventListener('click', showPreviousNews);
    }
    
    if (modalNext) {
        modalNext.addEventListener('click', showNextNews);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && newsModal && newsModal.classList.contains('active')) {
            closeNewsModal();
        }
    });
}

// ===== NOTICIAS - FUNCIONES PRINCIPALES =====
window.openNewsModal = function(newsId) {
    const newsIndex = filteredNews.findIndex(news => news.id === newsId);
    if (newsIndex === -1) return;
    
    currentNewsIndex = newsIndex;
    const noticia = filteredNews[newsIndex];
    
    updateModalContent(noticia);
    
    if (newsModal) {
        newsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    updateModalNavigation();
};

function closeNewsModal() {
    if (newsModal) {
        newsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateModalContent(noticia) {
    const modalCategory = document.getElementById('modal-category');
    const modalDate = document.getElementById('modal-date');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalBody = document.getElementById('modal-body');
    const modalAuthor = document.getElementById('modal-author');

    if (modalCategory) modalCategory.textContent = getCategoryDisplayName(noticia.categoria);
    if (modalDate) modalDate.textContent = noticia.fecha;
    if (modalTitle) modalTitle.textContent = noticia.titulo;
    if (modalImage) {
        modalImage.src = noticia.imagen;
        modalImage.alt = noticia.titulo;
    }
    if (modalBody) modalBody.innerHTML = noticia.contenido;
    if (modalAuthor) modalAuthor.innerHTML = `<i class="fas fa-user"></i> ${noticia.autor}`;
}

function getCategoryDisplayName(category) {
    const names = {
        'todas': 'Todas',
        'eventos': 'Eventos',
        'academicas': 'Académicas',
        'deportivas': 'Deportivas',
        'cultura': 'Cultura'
    };
    return names[category] || category;
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
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'todas';
    filterNews(searchTerm, activeCategory);
}

function handleCategoryFilter(button) {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    const category = button.dataset.category;
    const searchTerm = newsSearch?.value.toLowerCase().trim() || '';
    filterNews(searchTerm, category);
}

function filterNews(searchTerm = '', category = 'todas') {
    filteredNews = noticiasData.filter(noticia => {
        const matchesCategory = category === 'todas' || noticia.categoria === category;
        const matchesSearch = searchTerm === '' || 
            noticia.titulo.toLowerCase().includes(searchTerm) ||
            noticia.contenido.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });
    
    showFilteredNews(searchTerm, category);
}

function showFilteredNews(searchTerm = '', category = 'todas') {
    newsItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const itemTitle = item.querySelector('.news-title')?.textContent.toLowerCase() || '';
        const itemExcerpt = item.querySelector('.news-excerpt')?.textContent.toLowerCase() || '';
        
        const matchesCategory = category === 'todas' || itemCategory === category;
        const matchesSearch = searchTerm === '' || itemTitle.includes(searchTerm) || itemExcerpt.includes(searchTerm);
        
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

console.log('✅ News.js cargado correctamente');

