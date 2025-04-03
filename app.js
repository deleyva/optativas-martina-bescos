const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl4IH5DWI5qDF9LlD22xboXP95U9pbFCsSv77ftcMO7_-eayci5tTS4HMrZOB0eeARjaHfwbtiPS9m/pub?gid=0&single=true&output=csv';
const CACHE_KEY = 'subjectsData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const subjects3ESO = {
    'MATERIAS COMUNES': {
        'Geografía e Historia': { hours: 3, brit: true, nobit: true },
        'Lengua Castellana': { hours: 4, brit: true, nobit: true },
        'Matemáticas': { hours: 3, brit: true, nobit: true },
        'Física y Química': { hours: 2, brit: true, nobit: true },
        'Biología y Geología': { hours: 2, brit: true, nobit: true },
        'Educación Física': { hours: 2, brit: true, nobit: true, div: true },
        'Educación Valores Cívicos y Éticos': { hours: 1, brit: true, nobit: true, div: true },
        'Tutoría': { hours: 1, brit: true, nobit: true, div: true }
    },
    'MATERIAS ESPECÍFICAS': {
        'Inglés': { hours: 3, brit: 'Brit', nobit: 'No Brit' },
        'Tecnología': { hours: 3, brit: 'Inglés', nobit: true },
        'Música': { hours: 3, brit: 'Inglés', nobit: true, div: true }
    },
    'ÁMBITOS': {
        'Ámbito lingüístico y social': { hours: 10, div: true },
        'Ámbito científico-tecnológico': { hours: 7, div: true },
        'Ámbito práctico': { hours: 3, div: true }
    },
    'OPTATIVAS': {
        'Religión Cristiana/Evangélica/Islámica/Atención Educativa': { hours: 1, brit: 'Elegir 1', nobit: 'Elegir 1', div: 'Elegir 1' },
        'Francés/Alemán': { hours: 2, brit: 'Elegir 1', nobit: 'Elegir 1' },
        'Economía Social/Iniciación Filosofía/Programación y Robótica/Cultura Clásica': { hours: 2, nobit: 'Elegir 1' }
    }
};

const subjects4ESO = {
    'TRONCALES OBLIGATORIAS': {
        'Geografía e Historia': { hours: 3, common: true },
        'Lengua Castellana y Literatura': { hours: 4, common: true },
        'Inglés Brit/No Brit': { hours: 4, common: true },
        'Matemáticas': { 
            'Matemáticas B': { hours: 4, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales'] },
            'Matemáticas A': { hours: 4, paths: ['Formación Profesional'] }
        },
        'Educación Física': { hours: 2, common: true },
        'Tutoría': { hours: 1, common: true }
    },
    'TRONCAL DE MODALIDAD 1': {
        'Física y Química': { hours: 3, paths: ['Ciencias de la Salud', 'Tecnológico'] },
        'Economía y Empresa': { hours: 3, paths: ['Humanidades y Ciencias Sociales'] },
        'Formación y Orientación Profesional': { hours: 3, paths: ['Formación Profesional', 'Diversificación Curricular'] }
    },
    'TRONCAL DE MODALIDAD 2': {
        'Biología y Geología': { hours: 3, paths: ['Ciencias de la Salud'] },
        'Tecnología brit/ no brit': { hours: 3, paths: ['Tecnológico', 'Formación Profesional'] },
        'Latín': { hours: 3, paths: ['Humanidades y Ciencias Sociales'] },
        'Economía y Empresa': { hours: 3, paths: ['Formación Profesional'] }
    },
    'TRONCAL DE MODALIDAD 3': {
        'Cultura Científica': { hours: 2, common: true },
        'Cultura Clásica': { hours: 2, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales', 'Formación Profesional'] },
        'Filosofía': { hours: 2, paths: ['Ciencias de la Salud', 'Tecnológico', 'Humanidades y Ciencias Sociales', 'Formación Profesional'] },
        'Artes escénicas y danza': { hours: 2, common: true },
        'Matemáticas Aplicadas a la toma de decisiones': { hours: 2, common: true }
    },
    'OPTATIVAS': {
        'Francés': { hours: 3, common: true },
        'Alemán': { hours: 3, common: true },
        'Música Brit/ no Brit': { hours: 3, common: true },
        'Digitalización Brit /no Brit': { hours: 3, common: true },
        'Expresión artística': { hours: 3, common: true },
        'Tecnología Brit /no Brit': { hours: 3, paths: ['Ciencias de la Salud'] },
        'Biología': { hours: 3, paths: ['Tecnológico'] }
    }
};

const subjectsByGrade = {
    '3eso': subjects3ESO,
    '4eso': subjects4ESO,
    '1bach': {},  // Por implementar
    '2bach': {}   // Por implementar
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
    let currentGrade = '3eso';
    
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
