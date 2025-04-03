const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl4IH5DWI5qDF9LlD22xboXP95U9pbFCsSv77ftcMO7_-eayci5tTS4HMrZOB0eeARjaHfwbtiPS9m/pub?gid=0&single=true&output=csv';
const CACHE_KEY = 'subjectsData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const subjects = {
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
    },
    'ÁMBITOS': {
        'Ámbito lingüístico y social': { hours: 11, paths: ['Diversificación Curricular'] },
        'Ámbito científico-tecnológico': { hours: 7, paths: ['Diversificación Curricular'] },
        'Ámbito práctico': { hours: 3, paths: ['Diversificación Curricular'] }
    }
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
        // Si falla la petición, devolvemos un objeto con datos por defecto
        return {
            'Geografía e Historia': {
                description: 'Asignatura troncal obligatoria',
                content: 'Estudio de la geografía y la historia.'
            },
            'Lengua Castellana y Literatura': {
                description: 'Asignatura troncal obligatoria',
                content: 'Estudio de la lengua española y su literatura.'
            },
            'Inglés Brit/No Brit': {
                description: 'Asignatura troncal obligatoria',
                content: 'Aprendizaje del idioma inglés.'
            },
            'Matemáticas B': {
                description: 'Matemáticas orientadas a Bachillerato',
                content: 'Matemáticas para itinerarios académicos.'
            },
            'Matemáticas A': {
                description: 'Matemáticas orientadas a FP',
                content: 'Matemáticas aplicadas.'
            }
        };
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
    card.innerHTML = `
        <div class="subject-header">${subject}</div>
        <div class="subject-hours">
            ${hours.hours ? `Horas: ${hours.hours}h` : ''}<br>
            ${hours.paths ? `Itinerarios: ${hours.paths.join(', ')}` : ''}
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
        // Información por defecto si no hay detalles
        description = `Asignatura de ${category.toLowerCase()}`;
        if (hours.paths) {
            content = `Esta asignatura está disponible en los siguientes itinerarios: ${hours.paths.join(', ')}`;
        } else if (hours.common) {
            content = 'Esta es una asignatura común para todos los itinerarios.';
        }
    }
    
    detailContent.innerHTML = `
        <h2>${subject}</h2>
        <p><strong>Categoría:</strong> ${category}</p>
        <p><strong>Horas:</strong> ${hours.hours}h</p>
        ${hours.paths ? `<p><strong>Itinerarios:</strong> ${hours.paths.join(', ')}</p>` : ''}
        ${hours.common ? '<p><strong>Asignatura común</strong></p>' : ''}
        <h3>Descripción:</h3>
        <p>${description}</p>
        <h3>Contenido:</h3>
        <p>${content}</p>
    `;
    
    mainContent.classList.add('hidden');
    detailView.classList.remove('hidden');
}

function initialize() {
    const container = document.querySelector('.grid-container');
    
    // Add categories and subjects
    for (const [category, subjectList] of Object.entries(subjects)) {
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.style.gridColumn = '1 / -1';
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
