const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSl4IH5DWI5qDF9LlD22xboXP95U9pbFCsSv77ftcMO7_-eayci5tTS4HMrZOB0eeARjaHfwbtiPS9m/pub?gid=0&single=true&output=csv';
const CACHE_KEY = 'subjectsData';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const subjects = {
    'TRONCALES OBLIGATORIAS': {
        'Geografía e Historia': { academic: 3, applied: 3 },
        'Lengua Castellana y Literatura': { academic: 4, applied: 4 },
        'Matemáticas': { academic: 4, applied: 4 },
        'Primera Lengua Extranjera': { academic: 4, applied: 4 }
    },
    'TRONCALES ACADÉMICAS DE OPCIÓN': {
        'Biología y Geología': { academic: 3 },
        'Física y Química': { academic: 3 },
        'Economía': { academic: 3 },
        'Latín': { academic: 3 }
    },
    'TRONCALES APLICADAS DE OPCIÓN': {
        'Ciencias Aplicadas a la Actividad Profesional': { applied: 3 },
        'Iniciación a la Actividad Emprendedora y Empresarial': { applied: 3 },
        'Tecnología': { applied: 3 }
    },
    'ESPECÍFICAS OBLIGATORIAS': {
        'Educación Física': { academic: 2, applied: 2 },
        'Religión o Valores Éticos': { academic: 1, applied: 1 }
    },
    'ESPECÍFICAS OPCIONALES/LIBRE CONFIGURACIÓN AUTONÓMICA': {
        'Educación Plástica, Visual y Audiovisual': { academic: 3, applied: 3 },
        'Segunda Lengua Extranjera': { academic: 3, applied: 3 },
        'Materia troncal no cursada': {},
        'Música': {},
        'Tecnología': {},
        'Cultura Clásica': {},
        'Filosofía': { academic: 2, applied: 2 },
        'Artes Escénicas y Danza': {},
        'Cultura Científica': {},
        'Tecnologías de la Información y la Comunicación': {}
    }
};

async function fetchCSVData() {
    // Check cache first
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }
    }

    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
        
        return data;
    } catch (error) {
        console.error('Error fetching CSV:', error);
        return null;
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
            ${hours.academic ? `Académicas: ${hours.academic}h` : ''}
            ${hours.academic && hours.applied ? ' | ' : ''}
            ${hours.applied ? `Aplicadas: ${hours.applied}h` : ''}
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
    
    detailContent.innerHTML = `
        <h2>${subject}</h2>
        <p><strong>Categoría:</strong> ${category}</p>
        <p><strong>Horas:</strong><br>
        ${hours.academic ? `Académicas: ${hours.academic}h<br>` : ''}
        ${hours.applied ? `Aplicadas: ${hours.applied}h` : ''}</p>
        ${details ? `
            <h3>Descripción:</h3>
            <p>${details.description}</p>
            <h3>Contenido:</h3>
            <p>${details.content}</p>
        ` : '<p>No hay información adicional disponible.</p>'}
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
            const card = createSubjectCard(subject, hours, category);
            container.appendChild(card);
        }
    }
    
    // Back button functionality
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('detail-view').classList.add('hidden');
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initialize);
