const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl4IH5DWI5qDF9LlD22xboXP95U9pbFCsSv77ftcMO7_-eayci5tTS4HMrZOB0eeARjaHfwbtiPS9m/pub?gid=0&single=true&output=csv';
const CACHE_KEY = 'subjectsData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const subjects3ESO = {
    'MATERIAS COMUNES': {
        'Geografía e Historia': { hours: 3, brit: true, nobit: true, id: '3mcgh' },
        'Lengua Castellana': { hours: 4, brit: true, nobit: true, id: '3mclc' },
        'Matemáticas': { hours: 3, brit: true, nobit: true, id: '3mcm' },
        'Física y Química': { hours: 2, brit: true, nobit: true, id: '3mcfq' },
        'Biología y Geología': { hours: 2, brit: true, nobit: true, id: '3mcbg' },
        'Educación Física': { hours: 2, brit: true, nobit: true, div: true, id: '3mcef' },
        'Educación Valores Cívicos y Éticos': { hours: 1, brit: true, nobit: true, div: true, id: '3mcevce' },
        'Tutoría': { hours: 1, brit: true, nobit: true, div: true, id: '3mct' }
    },
    'MATERIAS ESPECÍFICAS': {
        'Inglés': { hours: 3, brit: 'Brit', nobit: 'No Brit', id: '3mei' },
        'Tecnología': { hours: 3, brit: 'Inglés', nobit: true, id: '3met' },
        'Música': { hours: 3, brit: 'Inglés', nobit: true, div: true, id: '3mem' }
    },
    'ÁMBITOS': {
        'Ámbito lingüístico y social': { hours: 10, div: true, id: '3aals' },
        'Ámbito científico-tecnológico': { hours: 7, div: true, id: '3aact' },
        'Ámbito práctico': { hours: 3, div: true, id: '3aap' }
    },
    'OPTATIVAS': {
        'Religión Cristiana/Evangélica/Islámica/Atención Educativa': { hours: 1, brit: 'Elegir 1', nobit: 'Elegir 1', div: 'Elegir 1', id: '3orcei' },
        'Francés/Alemán': { hours: 2, brit: 'Elegir 1', nobit: 'Elegir 1', id: '3ofa' },
        'Economía Social/Iniciación Filosofía/Programación y Robótica/Cultura Clásica': { hours: 2, nobit: 'Elegir 1', id: '3oeifpcc' }
    }
};

const subjects4ESO = {
    'TRONCALES OBLIGATORIAS': {
        'Geografía e Historia': { hours: 3, common: true, id: '4togh' },
        'Lengua Castellana y Literatura': { hours: 4, common: true, id: '4tolcl' },
        'Inglés Brit/No Brit': { hours: 4, common: true, id: '4toi' },
        'Matemáticas': { 
            'Matemáticas B': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales'], id: '4tomb' },
            'Matemáticas A': { hours: 4, paths: ['Formación Profesional'], id: '4toma' }
        },
        'Educación Física': { hours: 2, common: true, id: '4toef' },
        'Tutoría': { hours: 1, common: true, id: '4tot' }
    },
    'TRONCAL DE MODALIDAD 1': {
        'Física y Química': { hours: 3, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '4tm1fq' },
        'Economía y Empresa': { hours: 3, paths: ['Humanidades y Ciencias Sociales'], id: '4tm1ee' },
        'Formación y Orientación Profesional': { hours: 3, paths: ['Formación Profesional', 'Diversificación Curricular'], id: '4tm1fop' }
    },
    'TRONCAL DE MODALIDAD 2': {
        'Biología y Geología': { hours: 3, paths: ['Ciencias de la Salud'], id: '4tm2bg' },
        'Tecnología brit/ no brit': { hours: 3, paths: ['Tecnológico', 'Formación Profesional'], id: '4tm2t' },
        'Latín': { hours: 3, paths: ['Humanidades y Ciencias Sociales'], id: '4tm2l' },
        'Economía y Empresa': { hours: 3, paths: ['Formación Profesional'], id: '4tm2ee' }
    },
    'TRONCAL DE MODALIDAD 3': {
        'Cultura Científica': { hours: 2, common: true, id: '4tm3cc' },
        'Cultura Clásica': { hours: 2, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales', 'Formación Profesional'], id: '4tm3cc' },
        'Filosofía': { hours: 2, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales', 'Formación Profesional'], id: '4tm3f' },
        'Artes escénicas y danza': { hours: 2, common: true, id: '4tm3aed' },
        'Matemáticas Aplicadas a la toma de decisiones': { hours: 2, common: true, id: '4tm3matd' }
    },
    'OPTATIVAS': {
        'Francés': { hours: 3, common: true, id: '4of' },
        'Alemán': { hours: 3, common: true, id: '4oa' },
        'Música Brit/ no Brit': { hours: 3, common: true, id: '4om' },
        'Digitalización Brit /no Brit': { hours: 3, common: true, id: '4od' },
        'Expresión artística': { hours: 3, common: true, id: '4oea' },
        'Tecnología Brit /no Brit': { hours: 3, paths: ['Ciencias de la Salud'], id: '4ot' },
        'Biología': { hours: 3, paths: ['Tecnológico'], id: '4ob' }
    }
};

const subjects1BACH = {
    'TRONCALES OBLIGATORIAS': {
        'Filosofía': { hours: 3, common: true, id: '1tof' },
        'Lengua Castellana y Literatura I': { hours: 3, common: true, id: '1tolcl' },
        'Lengua Extranjera I: Inglés': { hours: 3, common: true, id: '1tolei' },
        'Educación Física': { hours: 2, common: true, id: '1toef' },
        'Tutoría': { hours: 1, common: true, id: '1tot' }
    },
    'TRONCAL DE MODALIDAD 1': {
        'Física y Química': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '1tm1fq' },
        'Economía': { hours: 4, paths: ['Ciencias Sociales'], id: '1tm1e' },
        'Griego I': { hours: 4, paths: ['Humanidades'], id: '1tm1g' }
    },
    'TRONCAL DE MODALIDAD 2': {
        'Biología y Geología': { hours: 4, paths: ['Ciencias de la Salud'], id: '1tm2bg' },
        'Tecnología': { hours: 4, paths: ['Tecnológico'], id: '1tm2t' },
        'Historia del mundo contemporáneo': { hours: 4, paths: ['Ciencias Sociales', 'Humanidades'], id: '1tm2hmc' }
    },
    'TRONCAL DE MODALIDAD 3': {
        'Matemáticas I': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '1tm3m1' },
        'Matemáticas CC.SS I': { hours: 4, paths: ['Ciencias Sociales'], id: '1tm3mccs1' },
        'Latín I': { hours: 4, paths: ['Humanidades'], id: '1tm3l1' }
    },
    'OPTATIVA 1 (elegir 1)': {
        'Informática I': { hours: 4, paths: ['Tecnológico', 'Humanidades'], id: '1o1i' },
        'Anatomía Aplicada': { hours: 4, paths: ['Ciencias de la Salud', 'Humanidades'], id: '1o1aa' },
        'Segunda Lengua Extranjera: Francés': { hours: 4, paths: ['Ciencias Sociales', 'Humanidades'], id: '1o1slef' },
        'Segunda Lengua Extranjera: Alemán': { hours: 4, paths: ['Ciencias Sociales', 'Humanidades'], id: '1o1slea' },
        'Dibujo I': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '1o1d' },
        'Literatura Universal': { hours: 4, paths: ['Humanidades'], id: '1o1lu' }
    },
    'OPTATIVA 2 (elegir 1)': {
        'Educación para la Ciudadanía y los Derechos Humanos': { hours: 1, id: '1o2ecdh' },
        'Sociedad, Medio Ambiente y territorios sostenibles': { hours: 1, id: '1o2smats' },
        'Oratoria': { hours: 1, id: '1o2o' },
        'Cultura y Patrimonio de Aragón': { hours: 1, id: '1o2cpa' },
        'Unión Europea': { hours: 1, id: '1o2ue' }
    },
    'OPTATIVA 3': {
        'Religión Cristiana/Evangélica/Islámica': { hours: 2, id: '1o3rcei' }
    }
};

const subjects2BACH = {
    'TRONCALES OBLIGATORIAS': {
        'Historia de la Filosofía': { hours: 3, common: true, id: '2tohf' },
        'Lengua Castellana y Literatura II': { hours: 4, common: true, id: '2tolcl2' },
        'Lengua extranjera II: Inglés': { hours: 3, common: true, id: '2tolei2' },
        'Historia de España': { hours: 3, common: true, id: '2tohe' },
        'Tutoría': { hours: 1, common: true, id: '2tot' }
    },
    'TRONCAL DE MODALIDAD 1': {
        'Química': { hours: 4, paths: ['Ciencias de la Salud'], id: '2tm1q' },
        'Física': { hours: 4, paths: ['Tecnológico'], id: '2tm1f' },
        'Geografía': { hours: 4, paths: ['Ciencias Sociales'], id: '2tm1g' },
        'Historia del Arte': { hours: 4, paths: ['Humanidades'], id: '2tm1ha' }
    },
    'TRONCAL DE MODALIDAD 2': {
        'Biología': { hours: 4, paths: ['Ciencias de la Salud'], id: '2tm2b' },
        'Tecnología e Ingeniería II': { hours: 4, paths: ['Tecnológico'], id: '2tm2ti2' },
        'Empresa y diseño de modelos de negocio': { hours: 4, paths: ['Ciencias Sociales'], id: '2tm2edmn' },
        'Griego II': { hours: 4, paths: ['Humanidades'], id: '2tm2g2' }
    },
    'TRONCAL DE MODALIDAD 3': {
        'Matemáticas II': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '2tm3m2' },
        'Matemáticas CC.SS II': { hours: 4, paths: ['Ciencias Sociales'], id: '2tm3mccs2' },
        'Latín II': { hours: 4, paths: ['Humanidades'], id: '2tm3l2' }
    },
    'Optativa (elegir 1 de 4 horas)': {
        'Tecnología e Ingeniería II': { hours: 4, paths: ['Ciencias de la Salud'], id: '2oti2' },
        'Dibujo Técnico II': { hours: 4, paths: ['Tecnológico'], id: '2odt2' },
        'Fundamentos de Administración y Gestión': { hours: 4, paths: ['Ciencias Sociales', 'Humanidades'], id: '2ofag' },
        'Geología y Ciencias Ambientales': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico'], id: '2ogca' },
        'Historia del Arte': { hours: 4, paths: ['Ciencias Sociales'], id: '2oha' },
        'Geografía': { hours: 4, paths: ['Humanidades'], id: '2og' },
        'Ciencias de la Tierra y del Medioambiente': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico', 'Ciencias Sociales', 'Humanidades'], id: '2octm' },
        'Física': { hours: 4, paths: ['Ciencias de la Salud'], id: '2of' },
        'Química': { hours: 4, paths: ['Tecnológico'], id: '2oq' }
    },
    'Optativas': {
        'Psicología': { hours: 3, id: '2op' },
        'Informática II': { hours: 3, id: '2oi2' },
        'Segunda Lengua Extranjera II: Francés': { hours: 3, id: '2osle2f' },
        'Educación Física y Vida Activa': { hours: 1, id: '2oefva' },
        'Proyecto de Investigación e Innovación integrado': { hours: 1, id: '2opiii' }
    }
};

const subjectsByGrade = {
    '3eso': subjects3ESO,
    '4eso': subjects4ESO,
    '1bach': subjects1BACH,
    '2bach': subjects2BACH
};

const imagesByGrade = {
    '3eso': 'optativas3.png',
    '4eso': 'optativas4.png',
    '1bach': 'optativas1bach.png',
    '2bach': 'optativas2bach.png'
};

async function fetchCSVData() {
    try {
        const response = await fetch(CSV_URL, {
            method: "GET",
            redirect: "follow"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.warn('Error fetching CSV:', error);
        return {};
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const result = {};
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            result[values[0]] = {
                description: values[1]?.trim() || '',
                content: values[2]?.trim() || ''
            };
        }
    }
    
    return result;
}

function createSubjectCard(subject, hours, category) {
    const card = document.createElement('div');
    card.className = 'subject-card';
    
    let hoursInfo = '';
    if (hours.hours) {
        hoursInfo = `<div>Horas: ${hours.hours}h</div>`;
    }
    
    let pathsInfo = '';
    if (hours.paths) {
        pathsInfo = `<div>Itinerarios: ${hours.paths.join(', ')}</div>`;
    } else if (hours.brit || hours.nobit) {
        let groups = [];
        if (hours.brit) groups.push(hours.brit === true ? 'Brit' : hours.brit);
        if (hours.nobit) groups.push(hours.nobit === true ? 'No Brit' : hours.nobit);
        if (hours.div) groups.push('Diversificación');
        pathsInfo = `<div>Grupos: ${groups.join(', ')}</div>`;
    }
    
    card.innerHTML = `
        <div class="subject-header">${subject}</div>
        <div class="subject-hours">
            ${hoursInfo}
            ${pathsInfo}
        </div>
        <div class="subject-id">${hours.id || ''}</div>
    `;
    
    card.addEventListener('click', async () => {
        const csvData = await fetchCSVData();
        showSubjectDetail(subject, hours, category, csvData?.[subject]);
    });
    
    return card;
}

function showSubjectDetail(subject, hours, category, details) {
    const mainContent = document.getElementById('main-content');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    
    let description = '';
    let content = '';
    
    if (details) {
        description = details.description;
        content = details.content;
    } else {
        description = `Asignatura de ${category.toLowerCase()}`;
        content = generateContentDescription(hours);
    }
    
    detailContent.innerHTML = `
        <h2>${subject}</h2>
        <p><strong>Categoría:</strong> ${category}</p>
        <p><strong>Horas:</strong> ${hours.hours}h</p>
        ${generateDetailInfo(hours)}
        <h3>Descripción:</h3>
        <p>${description}</p>
        <h3>Contenido:</h3>
        <p>${content}</p>
    `;
    
    mainContent.classList.add('hidden');
    detailView.classList.remove('hidden');
}

function generateContentDescription(hours) {
    if (hours.paths) {
        return `Esta asignatura está disponible en los siguientes itinerarios: ${hours.paths.join(', ')}`;
    } else if (hours.brit || hours.nobit) {
        let groups = [];
        if (hours.brit) groups.push(hours.brit === true ? 'Brit' : hours.brit);
        if (hours.nobit) groups.push(hours.nobit === true ? 'No Brit' : hours.nobit);
        if (hours.div) groups.push('Diversificación');
        return `Esta asignatura está disponible para los siguientes grupos: ${groups.join(', ')}`;
    } else if (hours.common) {
        return 'Esta es una asignatura común para todos los itinerarios.';
    }
    return '';
}

function generateDetailInfo(hours) {
    let info = '';
    if (hours.paths) {
        info += `<p><strong>Itinerarios:</strong> ${hours.paths.join(', ')}</p>`;
    }
    if (hours.brit || hours.nobit) {
        let groups = [];
        if (hours.brit) groups.push(hours.brit === true ? 'Brit' : hours.brit);
        if (hours.nobit) groups.push(hours.nobit === true ? 'No Brit' : hours.nobit);
        if (hours.div) groups.push('Diversificación');
        info += `<p><strong>Grupos:</strong> ${groups.join(', ')}</p>`;
    }
    if (hours.common) {
        info += '<p><strong>Asignatura común</strong></p>';
    }
    return info;
}

function initialize() {
    const container = document.querySelector('.grid-container');
    const navButtons = document.querySelectorAll('.nav-btn');
    const distributionImage = document.querySelector('.distribution-image');
    const downloadButton = document.querySelector('.download-btn');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.course-nav');
    const navButtonsContainer = document.querySelector('.nav-buttons');
    let currentGrade = '3eso';
    
    // Menú hamburguesa
    menuToggle.addEventListener('click', () => {
        navButtonsContainer.classList.toggle('show');
        nav.classList.toggle('expanded');
    });
    
    // Cerrar menú al hacer clic en una opción
    navButtonsContainer.addEventListener('click', (e) => {
        if (window.innerWidth <= 512 && (e.target.classList.contains('nav-btn') || e.target.classList.contains('icon-btn'))) {
            navButtonsContainer.classList.remove('show');
            nav.classList.remove('expanded');
        }
    });
    
    // Cerrar menú al redimensionar la ventana a un tamaño grande
    window.addEventListener('resize', () => {
        if (window.innerWidth > 512) {
            navButtonsContainer.classList.remove('show');
            nav.classList.remove('expanded');
        }
    });
    
    function updateContent(grade) {
        // Limpiar el contenedor
        container.innerHTML = '';
        
        // Actualizar botones de navegación
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.course === grade);
        });
        
        // Actualizar la imagen de distribución y el enlace de descarga
        const imagePath = imagesByGrade[grade];
        distributionImage.src = imagePath;
        distributionImage.alt = `Distribución de asignaturas de ${grade.toUpperCase()}`;
        downloadButton.href = imagePath;
        downloadButton.download = `distribucion-${grade}.png`;
        
        // Obtener los datos del curso seleccionado
        const subjects = subjectsByGrade[grade];
        
        // Añadir categorías y asignaturas
        for (const [category, subjectList] of Object.entries(subjects)) {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.textContent = category;
            container.appendChild(categoryHeader);
            
            for (const [subject, hours] of Object.entries(subjectList)) {
                if (typeof hours === 'object' && !hours.hours) {
                    for (const [subSubject, subHours] of Object.entries(hours)) {
                        const card = createSubjectCard(`${subject} - ${subSubject}`, subHours, category);
                        container.appendChild(card);
                    }
                } else {
                    const card = createSubjectCard(subject, hours, category);
                    container.appendChild(card);
                }
            }
        }
    }
    
    // Event listeners para los botones de navegación
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentGrade = btn.dataset.course;
            updateContent(currentGrade);
        });
    });
    
    // Back button functionality
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('detail-view').classList.add('hidden');
    });

    // Distribution dialog functionality
    const dialog = document.getElementById('distribution-dialog');
    const showButton = document.getElementById('show-distribution');
    const closeButton = dialog.querySelector('.close-dialog');

    showButton.addEventListener('click', (e) => {
        e.preventDefault();
        dialog.showModal();
    });

    closeButton.addEventListener('click', () => {
        dialog.close();
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
    
    // Inicializar con 3º ESO
    updateContent(currentGrade);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
