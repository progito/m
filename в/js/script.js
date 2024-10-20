document.addEventListener('DOMContentLoaded', () => {
    let modules;

    // Загрузка модулей из JSON
    readJsonModules().then(loadedModules => {
        modules = loadedModules;
        initializeModuleIndicators(modules);
        initializeMeetingIndicators(); // Инициализация индикаторов встреч
    }).catch(error => {
        console.error("Ошибка при загрузке модулей:", error);
        alert("Не удалось загрузить модули. Пожалуйста, обновите страницу.");
    });

    // Инициализация глобальных функций
    window.openModule = openModule;
    window.closeModal = closeModal;
    window.openModal = openModal;
    window.completeTest = completeTest;
    window.nextSection = nextSection;
    window.returnToMain = returnToMain;
});

// Асинхронная функция для загрузки JSON
async function readJsonModules() {
    const response = await fetch('modules.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

let courseProgress = loadProgress() || {};
let meetingsProgress = loadMeetingsProgress() || {}; // Прогресс встреч
let currentModuleId = null;
let currentSectionIndex = 0;

// Встречи
const meetings = [
    { title: 'Встреча с Андреем', id: 1 },
    { title: 'Встреча с Ольгой', id: 2 },
    { title: 'Встреча с Иваном', id: 3 },
    { title: 'Встреча с Натальей', id: 4 },
    { title: 'Премиум встреча с Сергеем', id: 5 },
    { title: 'Премиум встреча с Анастасией', id: 6 }
];

// Инициализация индикаторов при загрузке страницы
function initializeModuleIndicators(modules) {
    let previousCompleted = true; // Используем флаг для отслеживания завершенности предыдущего модуля
    
    for (let moduleId in modules) {
        const moduleIndicator = document.getElementById(`module${moduleId}`);
        const meetingIndicator = document.getElementById(`meeting${moduleId}`); // Индикатор встречи (если есть)
        
        if (courseProgress[moduleId]?.completed) {
            updateModuleIndicator(moduleId, true); // Модуль завершен
            previousCompleted = true; // Обновляем флаг
        } else if (previousCompleted && courseProgress[moduleId]?.inProgress) {
            updateModuleIndicator(moduleId, false, true); // Модуль в процессе
            previousCompleted = false; // Модуль еще не завершен, но в процессе
        } else {
            const completedCount = Object.values(courseProgress).filter(module => module.completed === true).length;

            if (moduleId > completedCount + 1){
                moduleIndicator.classList.add('disabled'); // Модуль недоступен
                if (meetingIndicator) {
                    meetingIndicator.classList.add('disabled'); // Блокируем встречу, если модуль недоступен
                }
                previousCompleted = false; // Модуль недоступен, поэтому последующие тоже должны быть заблокированы
            }
            
        }
    }
}


// Инициализация индикаторов встреч при загрузке страницы
function initializeMeetingIndicators() {
    meetings.forEach(meeting => {
        const meetingId = meeting.id; // Получаем идентификатор встречи
        if (meetingsProgress[meetingId]?.booked) {
            updateMeetingIndicator(meetingId);
        }
    });
}

// Открытие модуля
function openModule(moduleId) {
    if (!canAccessModule(moduleId)) {
        alert('Сначала завершите предыдущий модуль!');
        return;
    }
    currentModuleId = moduleId;
    displayModuleSections(modules[moduleId]);
    document.getElementById('course-container').style.display = 'none';
    document.getElementById('module-content').style.display = 'block';
}

// Проверка, можно ли открыть модуль
function canAccessModule(moduleId) {
    if (moduleId === 1) return true; // Первый модуль всегда доступен
    const prevModule = modules[moduleId - 1];
    return prevModule && courseProgress[moduleId - 1]?.completed;
}

// Обновление индикатора модуля
function updateModuleIndicator(moduleId) {
    const moduleIndicator = document.getElementById(`module${moduleId}`).querySelector('.indicator');
    if (moduleIndicator) {
        moduleIndicator.classList.remove('gray'); // Убираем серый цвет
        moduleIndicator.classList.add('green'); // Добавляем зеленый цвет
    }
}

// Показать разделы модуля
function displayModuleSections(module) {
    const moduleTitle = document.getElementById('module-title');
    if (!moduleTitle) {
        console.error("Element with ID 'module-title' not found.");
        return; // Выход, если элемент не найден
    }

    moduleTitle.textContent = module.title; // Устанавливаем заголовок модуля
    const sectionsContainer = document.getElementById('module-sections-container');
    sectionsContainer.innerHTML = '<a href="#" onclick="returnToMain()">Вернуться в главное меню</a>';

    module.sections.forEach((section, index) => {
        const sectionPanel = document.createElement('div');
        sectionPanel.classList.add('panel');
        sectionPanel.textContent = section.name;
        sectionPanel.onclick = () => openSection(index);

        if (courseProgress[currentModuleId]?.sections?.[section.id]?.completed) {
            sectionPanel.classList.add('success');
            sectionPanel.innerHTML += ' <span class="status-green">✔️</span>'; // Галочка для завершенного раздела
        } else {
            sectionPanel.innerHTML += ' <span class="status-grey">🔒</span>'; // Заблокированный раздел
        }

        sectionsContainer.appendChild(sectionPanel);
    });

    // Тестовый панель
    const testPanel = document.createElement('div');
    testPanel.classList.add('panel');
    testPanel.textContent = 'Пройти тест';

    // Проверка, завершён ли тест
    const allSectionsCompleted = module.sections.every((section, index) => 
        courseProgress[currentModuleId]?.sections?.[section.id]?.completed);

    if (allSectionsCompleted) {
        testPanel.onclick = openTest; // Позволяем открыть тест, если все разделы завершены
        sectionsContainer.appendChild(testPanel);
    }
}

function openSection(sectionIndex) {
    currentSectionIndex = sectionIndex;
    const section = modules[currentModuleId].sections[sectionIndex];

    document.getElementById('module-content').style.display = 'none';
    document.getElementById('section-content').style.display = 'block';
    document.getElementById('section-title').textContent = section.name;

    // Отображаем видео
    document.getElementById('section-videos').innerHTML = section.videos
        ? section.videos.map(video => `<video src="${video}" controls></video>`).join('')
        : '';

    // Отображаем комментарий с учетом абзацев
    if (section.comment) {
        // Заменяем символы новой строки на <br> и устанавливаем как HTML
        document.getElementById('section-comment').innerHTML = section.comment.replace(/\n/g, '<br>');
    } else {
        document.getElementById('section-comment').textContent = '';
    }

    const nextButton = document.getElementById('next-section');
    // Если это последний раздел, изменяем текст кнопки
    if (sectionIndex === modules[currentModuleId].sections.length - 1) {
        nextButton.textContent = 'Перейти к тесту';
        nextButton.onclick = () => {
            nextSection(); // Сначала вызываем nextSection
            openTest(); // Затем вызываем openTest
        };
    } else {
        nextButton.textContent = 'Следующий раздел';
        nextButton.onclick = nextSection; // Обычный переход к следующему разделу
    }
    nextButton.style.display = 'inline-block'; // Всегда отображаем кнопку
}


// Переход к следующему разделу
function nextSection() {
    markSectionComplete(currentSectionIndex);
    if (currentSectionIndex < modules[currentModuleId].sections.length - 1) {
        openSection(currentSectionIndex + 1);
    } else {
        // Показать тест если все разделы завершены
        displayModuleSections(modules[currentModuleId]);
    }
}

// Отметить раздел завершённым
// Отметить раздел завершённым
function markSectionComplete(sectionIndex) {
    const section = modules[currentModuleId].sections[sectionIndex];

    // Убедимся, что у текущего модуля есть объект прогресса
    if (!courseProgress[currentModuleId]) {
        courseProgress[currentModuleId] = { sections: {} };
    }

    // Убедимся, что у текущего модуля есть объект прогресса для разделов
    if (!courseProgress[currentModuleId].sections) {
        courseProgress[currentModuleId].sections = {};
    }

    // Отмечаем секцию как завершённую
    courseProgress[currentModuleId].sections[section.id] = { completed: true };

    // Сохраняем прогресс
    saveProgress();

    // Обновляем индикатор модуля
    updateModuleIndicator(currentModuleId); 
}

function updateModuleProgress(moduleId) {
    const module = modules[moduleId];
    const completedSections = module.sections.filter(section => 
        courseProgress[moduleId]?.sections?.[section.id]?.completed
    ).length;

    const totalSections = module.sections.length;
    const progressPercentage = (completedSections / totalSections) * 100;

    // Находим элемент прогресса и обновляем его
    const progressBar = document.getElementById(`progress-bar${moduleId}`);
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.textContent = `${Math.round(progressPercentage)}% завершено`;
    }
}
// Открытие теста
function openTest() {
    const sections = modules[currentModuleId].sections;
    const allSectionsCompleted = sections.every((section, index) => {
        return courseProgress[currentModuleId].sections?.[section.id]?.completed;
    });

    if (!allSectionsCompleted) {
        alert('Вы должны завершить все разделы перед прохождением теста!');
        return;
    }

    markSectionComplete(sections.length - 1); // Отмечаем последний раздел как завершённый
    document.getElementById('module-content').style.display = 'none';
    document.getElementById('test-content').style.display = 'block';
    document.getElementById('test-iframe').src = modules[currentModuleId].testUrl;
}



// Завершение теста
function completeTest() {
    if (!courseProgress[currentModuleId]) {
        courseProgress[currentModuleId] = {};
    }
    courseProgress[currentModuleId].completed = true; // Отмечаем модуль как завершённый
    saveProgress(); // Сохраняем прогресс
    updateModuleIndicator(currentModuleId); // Обновляем индикатор модуля
    alert('Поздравляем! Тест завершён.');
    returnToMain(); // Возвращаемся в главное меню
}

// Возвращение в главное меню
function returnToMain() {
    document.getElementById('module-content').style.display = 'none';
    document.getElementById('section-content').style.display = 'none';
    document.getElementById('test-content').style.display = 'none';
    document.getElementById('course-container').style.display = 'block';
}

// Открытие встречи
function openModal(meetingId) {
    const requiredModuleId = meetingId - 1; // Предыдущий модуль перед встречей

    // Проверяем, завершен ли предыдущий модуль
    if (!courseProgress[requiredModuleId] || !courseProgress[requiredModuleId].completed) {
        alert('Сначала завершите предыдущий модуль!');
        return;
    }

    const modal = document.getElementById('code-modal');
    modal.style.display = 'block';
}

// Закрытие встречи
function closeModal() {
    const modal = document.getElementById('code-modal');
    modal.style.display = 'none';
}

// Обновление индикатора встреч
function updateMeetingIndicator(meetingId) {
    const meetingPanel = document.getElementById(`meeting${meetingId}`);
    const indicator = meetingPanel.querySelector('.indicator');
    if (indicator) {
        indicator.classList.remove('blue');
        indicator.classList.add('green'); // Зеленый индикатор для встречи
    }
}

// Сохранение прогресса в localStorage
function saveProgress() {
    localStorage.setItem('courseProgress', JSON.stringify(courseProgress));
}

function loadProgress() {
    return JSON.parse(localStorage.getItem('courseProgress')) || {};
}

// Сохранение прогресса встреч в localStorage
function saveMeetingsProgress() {
    localStorage.setItem('meetingsProgress', JSON.stringify(meetingsProgress));
}

function loadMeetingsProgress() {
    return JSON.parse(localStorage.getItem('meetingsProgress')) || {};
}
