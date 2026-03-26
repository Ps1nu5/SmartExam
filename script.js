// Глобальные переменные
let currentUser = null;
let classes = [];
let exams = [];
let students = [];

// Константы для экзаменов
const EXAM_TYPES = {
    OGE: 'ОГЭ',
    EGE: 'ЕГЭ'
};

// Проходные баллы 2026 года и шкалы перевода
const PASSING_SCORES = {
    OGE: {
        minPrimary: 8,      // Минимальный первичный балл
        maxPrimary: 31,     // Максимальный первичный балл
        passingPrimary: 8,   // Проходной первичный балл
        passingPercentage: 25.8, // Проходной процент (8/31 * 100)
        // Шкала перевода первичных баллов в оценку
        gradeScale: {
            2: { min: 0, max: 7 },
            3: { min: 8, max: 14 },
            4: { min: 15, max: 21 },
            5: { min: 22, max: 31 }
        }
    },
    EGE: {
        minPrimary: 0,       // Минимальный первичный балл
        maxPrimary: 32,     // Максимальный первичный балл
        passingPrimary: 5,  // Проходной первичный балл (5 первичных = 27 тестовых)
        passingPercentage: 15.625, // Проходной процент (5/32 * 100)
        // Шкала перевода первичных баллов в тестовые баллы (ЕГЭ 2026)
        testScale: {
            0: 0, 1: 6, 2: 11, 3: 17, 4: 22, 5: 27, 6: 34, 7: 40, 8: 46,
            9: 52, 10: 58, 11: 64, 12: 70, 13: 72, 14: 74, 15: 76,
            16: 78, 17: 80, 18: 82, 19: 84, 20: 86, 21: 88, 22: 90,
            23: 92, 24: 94, 25: 95, 26: 96, 27: 97, 28: 98,
            29: 99, 30: 100, 31: 100, 32: 100
        },
        // Шкала соответствия тестовых баллов школьным оценкам (информационно)
        gradeScale: {
            2: { min: 0, max: 26 },
            3: { min: 27, max: 49 },
            4: { min: 50, max: 69 },
            5: { min: 70, max: 100 }
        }
    }
};

const MATH_TASKS = {
    OGE: {
        name: 'ОГЭ по математике',
        tasks: [
            { id: 1, name: 'Задание 1', topics: ['Числа и вычисления'], primaryScore: 1 },
            { id: 2, name: 'Задание 2', topics: ['Алгебраические выражения'], primaryScore: 1 },
            { id: 3, name: 'Задание 3', topics: ['Уравнения и неравенства'], primaryScore: 1 },
            { id: 4, name: 'Задание 4', topics: ['Функции и графики'], primaryScore: 1 },
            { id: 5, name: 'Задание 5', topics: ['Геометрия'], primaryScore: 1 },
            { id: 6, name: 'Задание 6', topics: ['Теория вероятностей'], primaryScore: 1 },
            { id: 7, name: 'Задание 7', topics: ['Текстовые задачи'], primaryScore: 1 },
            { id: 8, name: 'Задание 8', topics: ['Практические задачи'], primaryScore: 1 },
            { id: 9, name: 'Задание 9', topics: ['Алгебраические уравнения'], primaryScore: 1 },
            { id: 10, name: 'Задание 10', topics: ['Геометрические задачи'], primaryScore: 1 },
            { id: 11, name: 'Задание 11', topics: ['Практическая геометрия'], primaryScore: 1 },
            { id: 12, name: 'Задание 12', topics: ['Исследования'], primaryScore: 2 },
            { id: 13, name: 'Задание 13', topics: ['Стереометрия'], primaryScore: 2 },
            { id: 14, name: 'Задание 14', topics: ['Алгебра и начала анализа'], primaryScore: 2 },
            { id: 15, name: 'Задание 15', topics: ['Геометрия'], primaryScore: 2 },
            { id: 16, name: 'Задание 16', topics: ['Геометрия'], primaryScore: 2 },
            { id: 17, name: 'Задание 17', topics: ['Геометрия'], primaryScore: 2 },
            { id: 18, name: 'Задание 18', topics: ['Геометрия'], primaryScore: 2 },
            { id: 19, name: 'Задание 19', topics: ['Геометрия'], primaryScore: 2 },
            { id: 20, name: 'Задание 20', topics: ['Геометрия'], primaryScore: 2 },
            { id: 21, name: 'Задание 21', topics: ['Геометрия'], primaryScore: 2 },
            { id: 22, name: 'Задание 22', topics: ['Геометрия'], primaryScore: 2 },
            { id: 23, name: 'Задание 23', topics: ['Геометрия'], primaryScore: 2 },
            { id: 24, name: 'Задание 24', topics: ['Геометрия'], primaryScore: 2 },
            { id: 25, name: 'Задание 25', topics: ['Геометрия'], primaryScore: 2 }
        ]
    },
    EGE: {
        name: 'ЕГЭ по математике',
        tasks: [
            { id: 1, name: 'Задание 1', topics: ['Числа и вычисления'], primaryScore: 1 },
            { id: 2, name: 'Задание 2', topics: ['Алгебраические выражения'], primaryScore: 1 },
            { id: 3, name: 'Задание 3', topics: ['Уравнения и неравенства'], primaryScore: 1 },
            { id: 4, name: 'Задание 4', topics: ['Функции и графики'], primaryScore: 1 },
            { id: 5, name: 'Задание 5', topics: ['Геометрия'], primaryScore: 1 },
            { id: 6, name: 'Задание 6', topics: ['Теория вероятностей'], primaryScore: 1 },
            { id: 7, name: 'Задание 7', topics: ['Текстовые задачи'], primaryScore: 1 },
            { id: 8, name: 'Задание 8', topics: ['Практические задачи'], primaryScore: 1 },
            { id: 9, name: 'Задание 9', topics: ['Алгебраические уравнения'], primaryScore: 1 },
            { id: 10, name: 'Задание 10', topics: ['Геометрические задачи'], primaryScore: 1 },
            { id: 11, name: 'Задание 11', topics: ['Практическая геометрия'], primaryScore: 1 },
            { id: 12, name: 'Задание 12', topics: ['Исследования'], primaryScore: 1 },
            { id: 13, name: 'Задание 13', topics: ['Стереометрия'], primaryScore: 2 },
            { id: 14, name: 'Задание 14', topics: ['Алгебра и начала анализа'], primaryScore: 3 },
            { id: 15, name: 'Задание 15', topics: ['Геометрия планиметрия'], primaryScore: 2 },
            { id: 16, name: 'Задание 16', topics: ['Практическая задача'], primaryScore: 2 },
            { id: 17, name: 'Задание 17', topics: ['Экономическая задача'], primaryScore: 3 },
            { id: 18, name: 'Задание 18', topics: ['Параметры и уравнения'], primaryScore: 4 },
            { id: 19, name: 'Задание 19', topics: ['Теория чисел'], primaryScore: 3 }
        ]
    }
};

// Простая инициализация для мобильных
function simpleInit() {
    // Показываем страницу входа если нужно
    const loginPage = document.getElementById('loginPage');
    if (loginPage && window.authSystem && window.authSystem.isAuthenticated()) {
        showDashboard();
    } else if (loginPage) {
        loginPage.style.display = 'block';
    }
    
    // Настраиваем простые обработчики
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && !loginBtn.onclick) {
        loginBtn.onclick = function() {
            showLoginForm();
        };
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем простую инициализацию сразу
    simpleInit();
    
    // Инициализация Firebase
    if (window.firebaseSync) {
        window.firebaseSync.init().then(success => {
            if (success) {
                // Инициализация системы аутентификации
                if (window.authSystem) {
                    window.authSystem.init(window.firebaseSync).then(() => {
                        checkAuthStatus();
                    }).catch(error => {
                        checkAuthStatus();
                    });
                }
            } else {
                // Инициализация системы аутентификации без Firebase
                if (window.authSystem) {
                    window.authSystem.init(null).then(() => {
                        checkAuthStatus();
                    }).catch(error => {
                        checkAuthStatus();
                    });
                }
            }
        }).catch(error => {
            if (window.authSystem) {
                window.authSystem.init(null).then(() => {
                    checkAuthStatus();
                });
            }
        });
    } else {
        // Инициализация системы аутентификации без Firebase
        if (window.authSystem) {
            window.authSystem.init(null).then(() => {
                checkAuthStatus();
            }).catch(error => {
                checkAuthStatus();
            });
        }
    }
});

function checkAuthStatus() {
    // Проверяем авторизацию сразу без задержки
    if (window.authSystem && window.authSystem.isAuthenticated()) {
        showDashboard();
    } else {
        // Показываем страницу входа только если не авторизованы
        const loginPage = document.getElementById('loginPage');
        if (loginPage) {
            loginPage.style.display = 'block';
        }
        setupAuthListeners();
    }
}

function showDashboard() {
    // console.log - отключен для продакшена('Показ дашборда...');
    
    // Скрываем страницу входа
    const loginPage = document.getElementById('loginPage');
    const dashboardPage = document.getElementById('dashboardPage');
    
    if (loginPage) loginPage.style.display = 'none';
    if (dashboardPage) dashboardPage.style.display = 'block';
    
    // Показываем главную страницу по умолчанию
    showPage('dashboard');
    
    // Загружаем данные пользователя с принудительным обновлением из Firebase
    setTimeout(async () => {
        if (window.authSystem && window.authSystem.isAuthenticated()) {
            // console.log - отключен для продакшена('Принудительная загрузка данных из Firebase...');
            await window.authSystem.loadUserData();
        }
        loadUserData();
        
        // Настраиваем слушатели для дашборда
        setTimeout(() => {
            setupEventListeners();
            updateUI();
        }, 100);
    }, 100);
}

// Функции аутентификации
function setupAuthListeners() {
    // Форма входа
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                await window.authSystem.login(email, password);
                showNotification('Вход выполнен успешно!', 'success');
                showDashboard();
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
    
    // Форма регистрации
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (password !== confirmPassword) {
                showNotification('Пароли не совпадают', 'error');
                return;
            }
            
            try {
                await window.authSystem.register(email, password, name);
                showNotification('Регистрация выполнена успешно!', 'success');
                showDashboard();
            } catch (error) {
                showNotification(error.message, 'error');
            }
        });
    }
    
    // Кнопка входа в хэдере
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showLoginForm();
        });
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function logout() {
    // console.log - отключен для продакшена('Выход из системы...');
    if (confirm('Вы уверены, что хотите выйти?')) {
        // console.log - отключен для продакшена('Подтверждение получено');
        
        if (window.authSystem) {
            // console.log - отключен для продакшена('Выход из authSystem...');
            window.authSystem.logout();
        }
        
        // Показываем страницу входа
        const loginPage = document.getElementById('loginPage');
        const dashboardPage = document.getElementById('dashboardPage');
        
        // console.log - отключен для продакшена('Страницы:', { loginPage, dashboardPage });
        
        if (loginPage) {
            loginPage.style.display = 'block';
            // console.log - отключен для продакшена('Страница входа показана');
        } else {
            console.error('Страница входа не найдена');
        }
        
        if (dashboardPage) {
            dashboardPage.style.display = 'none';
            // console.log - отключен для продакшена('Страница дашборда скрыта');
        } else {
            console.error('Страница дашборда не найдена');
        }
        
        showNotification('Вы вышли из системы', 'info');
        
        // Настраиваем слушатели для форм входа
        setTimeout(() => {
            // console.log - отключен для продакшена('Настройка слушателей для форм входа...');
            setupAuthListeners();
        }, 100);
    } else {
        // console.log - отключен для продакшена('Выход отменен');
    }
}

// Делаем функции глобальными для вызова из HTML
window.logout = logout;
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;
window.showPage = showPage;
window.showAddClassModal = showAddClassModal;
window.showAddExamModal = showAddExamModal;
window.deleteClass = deleteClass;
window.deleteExam = deleteExam;
window.showExamResults = showExamResults;
window.showExamAnalytics = showExamAnalytics;
window.toggleTaskResult = toggleTaskResult;
window.fillAllPassed = fillAllPassed;
window.fillAllFailed = fillAllFailed;
window.fillRandom = fillRandom;
window.showStatistics = showStatistics;
window.saveExamResults = saveExamResults;

function loadUserData() {
    // Загружаем данные пользователя
    const data = localStorage.getItem('smartExamData');
    if (data) {
        const parsedData = JSON.parse(data);
        window.users = parsedData.users || [];
        window.classes = parsedData.classes || [];
        window.exams = parsedData.exams || [];
        
        // Собираем всех студентов из классов
        window.students = [];
        if (window.classes) {
            window.classes.forEach(cls => {
                if (cls.students) {
                    window.students.push(...cls.students);
                }
            });
        }
        
        // Данные загружены
    } else {
        window.users = [];
        window.classes = [];
        window.exams = [];
        window.students = [];
        // Данные инициализированы как пустые
    }
}

async function loadData() {
    // Просто вызываем loadUserData для совместимости
    loadUserData();
}

// Функции управления синхронизацией
function showSyncStatus() {
    if (!window.firebaseSync) {
        showModal('Синхронизация', `
            <div style="padding: 1rem;">
                <p>🔌 Firebase SDK не загружен</p>
                <p>Добавьте Firebase SDK в index.html</p>
                <p>Следуйте инструкции в файле FIREBASE_SETUP.md</p>
            </div>
        `);
        return;
    }

    const status = window.firebaseSync.getSyncStatus();
    const currentUserName = window.firebaseSync.getCurrentUserName();
    const statusHtml = `
        <div style="padding: 1rem;">
            <div style="margin-bottom: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                <strong>📊 Статус синхронизации:</strong><br>
                👤 Пользователь: <strong>${currentUserName}</strong><br>
                🌐 Сеть: ${status.isOnline ? '✅ Онлайн' : '❌ Офлайн'}<br>
                🔥 Firebase: ${status.hasFirebase ? '✅ Подключено' : '❌ Не подключено'}<br>
                🔄 Последняя синхронизация: ${status.lastSync ? new Date(status.lastSync).toLocaleString() : 'Ещё не было'}<br>
                ⏳ Процесс: ${status.syncInProgress ? '✅ Синхронизация...' : '✅ Ожидание'}
            </div>
            <div style="margin-top: 1rem;">
                <button class="btn btn-secondary" onclick="forceSync()" style="margin-right: 0.5rem;">
                    🔄 Принудительно синхронизировать
                </button>
                <button class="btn btn-primary" onclick="loadFromFirebase()" style="margin-right: 0.5rem;">
                    ☁️ Загрузить из облака
                </button>
                <button class="btn btn-info" onclick="changeUser()" style="margin-right: 0.5rem;">
                    👤 Сменить пользователя
                </button>
                <button class="btn btn-warning" onclick="clearFirebaseData()">
                    🗑️ Очистить облако
                </button>
            </div>
            <div style="margin-top: 1rem; padding: 0.75rem; background: #fff3cd; border-radius: 5px; font-size: 0.9rem;">
                <strong>ℹ️ Важно:</strong> Для синхронизации между устройствами используйте одинаковый ID пользователя на всех устройствах.
            </div>
        </div>
    `;
    
    showModal('Синхронизация данных', statusHtml);
}

async function forceSync() {
    if (!window.firebaseSync) {
        showModal('Ошибка', 'Firebase не инициализирован. Добавьте SDK в index.html');
        return;
    }

    showModal('Синхронизация', `
        <div style="padding: 1rem; text-align: center;">
            <div style="margin-bottom: 1rem;">🔄 Синхронизация данных...</div>
            <div style="color: #666;">Пожалуйста, подождите...</div>
        </div>
    `);

    const success = await window.firebaseSync.forceSync();
    
    setTimeout(() => {
        closeModal();
        if (success) {
            showModal('✅ Успешно', `
                <div style="padding: 1rem; text-align: center;">
                    <div style="color: #28a745; font-size: 1.2rem; margin-bottom: 1rem;">✅</div>
                    <div>Данные успешно синхронизированы с Firebase</div>
                </div>
            `);
        } else {
            showModal('❌ Ошибка', `
                <div style="padding: 1rem; text-align: center;">
                    <div style="color: #dc3545; font-size: 1.2rem; margin-bottom: 1rem;">❌</div>
                    <div>Не удалось синхронизировать данные. Проверьте подключение к интернету.</div>
                </div>
            `);
        }
    }, 1000);
}

async function loadFromFirebase() {
    if (!window.firebaseSync) {
        showModal('Ошибка', 'Firebase не инициализирован');
        return;
    }

    showModal('Загрузка', `
        <div style="padding: 1rem; text-align: center;">
            <div style="margin-bottom: 1rem;">☁️ Загрузка данных из Firebase...</div>
            <div style="color: #666;">Пожалуйста, подождите...</div>
        </div>
    `);

    const data = await window.firebaseSync.loadFromFirebase();
    
    setTimeout(() => {
        closeModal();
        if (data) {
            // Обновляем глобальные переменные
            if (data.users) window.users = data.users;
            if (data.classes) window.classes = data.classes;
            if (data.exams) window.exams = data.exams;
            
            updateUI();
            showModal('✅ Успешно', `
                <div style="padding: 1rem; text-align: center;">
                    <div style="color: #28a745; font-size: 1.2rem; margin-bottom: 1rem;">✅</div>
                    <div>Данные успешно загружены из Firebase</div>
                    <div style="margin-top: 0.5rem; color: #666;">Интерфейс будет обновлен...</div>
                </div>
            `);
        } else {
            showModal('❌ Нет данных', `
                <div style="padding: 1rem; text-align: center;">
                    <div style="color: #ffc107; font-size: 1.2rem; margin-bottom: 1rem;">📭</div>
                    <div>В Firebase нет данных для загрузки</div>
                    <div style="margin-top: 0.5rem; color: #666;">Сначала создайте данные локально</div>
                </div>
            `);
        }
    }, 1000);
}

async function clearFirebaseData() {
    // Функция отключена - данные удаляются только при выходе из аккаунта
    // console.log - отключен для продакшена('Очистка данных отключена');
}

// Настройка обработчиков событий
function setupEventListeners() {
    // console.log - отключен для продакшена('Настройка обработчиков событий для дашборда...');
    
    // Навигация
    const navLinks = document.querySelectorAll('.nav-link');
    // console.log - отключен для продакшена('Найдено навигационных ссылок:', navLinks.length);
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            // console.log - отключен для продакшена('Переход на страницу:', page);
            showPage(page);
        });
    });

    // Кнопки управления
    const addClassBtn = document.getElementById('addClassBtn');
    // console.log - отключен для продакшена('Кнопка добавления класса:', addClassBtn);
    if (addClassBtn) {
        addClassBtn.addEventListener('click', showAddClassModal);
    } else {
        console.error('Кнопка добавления класса не найдена');
    }

    const addExamBtn = document.getElementById('addExamBtn');
    // console.log - отключен для продакшена('Кнопка добавления экзамена:', addExamBtn);
    if (addExamBtn) {
        addExamBtn.addEventListener('click', showAddExamModal);
    } else {
        console.error('Кнопка добавления экзамена не найдена');
    }

    // Аналитика
    const analyticsClassSelect = document.getElementById('analyticsClassSelect');
    // console.log - отключен для продакшена('Селект класса в аналитике:', analyticsClassSelect);
    if (analyticsClassSelect) {
        analyticsClassSelect.addEventListener('change', updateAnalyticsExamSelect);
    }

    const analyticsExamSelect = document.getElementById('analyticsExamSelect');
    // console.log - отключен для продакшена('Селект экзамена в аналитике:', analyticsExamSelect);
    if (analyticsExamSelect) {
        analyticsExamSelect.addEventListener('change', updateAnalytics);
    }
    
    // console.log - отключен для продакшена('Настройка обработчиков событий завершена');
}

// Функции сохранения и загрузки данных с автоматической синхронизацией
async function saveData() {
    try {
        // Сохраняем в localStorage
        const dataToSave = {
            users: users,
            classes: classes,
            exams: exams
        };
        localStorage.setItem('smartExamData', JSON.stringify(dataToSave));
        
        // Автоматическая синхронизация с Firebase (без уведомлений)
        if (window.authSystem && window.authSystem.isAuthenticated()) {
            await window.authSystem.saveUserData();
        }
        
        // console.log - отключен для продакшена('Данные сохранены');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

// Обновление интерфейса
function updateUI() {
    if (window.authSystem && window.authSystem.isAuthenticated()) {
        const user = window.authSystem.getCurrentUser();
        if (user) {
            // Скрываем кнопку входа в хэдере
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) loginBtn.style.display = 'none';
            
            // Показываем userInfo в хэдере
            const userInfo = document.getElementById('userInfo');
            if (userInfo) userInfo.style.display = 'flex';
            
            // Устанавливаем имя пользователя в хэдере
            const userNameElement = document.getElementById('userName');
            if (userNameElement) userNameElement.textContent = user.name;
        }
    } else {
        // Показываем кнопку входа
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.style.display = 'block';
        
        // Скрываем userInfo
        const userInfo = document.getElementById('userInfo');
        if (userInfo) userInfo.style.display = 'none';
    }

    // Обновляем дашборд
    updateDashboard();
    updateClassesList();
    updateExamsList();
    updateAnalyticsSelects();
}

// Показать страницу
function showPage(pageName) {
    // console.log - отключен для продакшена('Показ страницы:', pageName);
    
    // Скрываем все страницы внутри dashboardPage
    const dashboardPages = document.querySelectorAll('#dashboardPage .page');
    // console.log - отключен для продакшена('Найдено страниц дашборда:', dashboardPages.length);
    dashboardPages.forEach(page => {
        page.classList.remove('active');
        // console.log - отключен для продакшена('Скрыта страница:', page.id);
    });
    
    // Показываем нужную страницу
    if (pageName === 'dashboard') {
        // Для главной страницы используем специальный ID
        const dashboardContent = document.getElementById('dashboardPageContent');
        if (dashboardContent) {
            dashboardContent.classList.add('active');
            // console.log - отключен для продакшена('Показана главная страница');
        } else {
            console.error('Главная страница не найдена');
        }
    } else {
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.add('active');
            // console.log - отключен для продакшена('Показана страница:', targetPage.id);
        } else {
            console.error('Страница не найдена:', pageName + 'Page');
        }
    }
    
    // Обновляем навигацию
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Проверяем что главная страница видна
    if (pageName === 'dashboard') {
        const dashboardContent = document.getElementById('dashboardPageContent');
        if (dashboardContent) {
            // console.log - отключен для продакшена('Главная страница активна?', dashboardContent.classList.contains('active'));
            // console.log - отключен для продакшена('Стиль главной страницы:', window.getComputedStyle(dashboardContent).display);
        }
    }
}

// Управление классами
function showAddClassModal() {
    // console.log - отключен для продакшена('Показ модального окна добавления класса...');
    
    const modalBody = `
        <form id="addClassForm">
            <div class="form-group">
                <label for="className">Название класса</label>
                <input type="text" id="className" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="classStudents">Ученики (каждый с новой строки)</label>
                <textarea id="classStudents" class="form-control" rows="5" placeholder="Иванов Иван&#10;Петров Петр&#10;Сидорова Анна"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Создать класс</button>
        </form>
    `;

    // console.log - отключен для продакшена('Вызов showModal...');
    showModal('Добавить класс', modalBody);
    
    // Добавляем обработчик после создания модального окна
    setTimeout(() => {
        // console.log - отключен для продакшена('Настройка обработчика формы добавления класса...');
        const form = document.getElementById('addClassForm');
        if (form) {
            // console.log - отключен для продакшена('Форма найдена, добавляем обработчик...');
            form.addEventListener('submit', handleAddClass);
        } else {
            console.error('Форма добавления класса не найдена');
        }
    }, 100);
}

function handleAddClass(e) {
    // console.log - отключен для продакшена('Обработка добавления класса...');
    e.preventDefault();
    const className = document.getElementById('className').value;
    const studentsText = document.getElementById('classStudents').value;
    const studentsList = studentsText.split('\n').filter(s => s.trim()).map(s => s.trim());

    // console.log - отключен для продакшена('Данные класса:', { className, studentsCount: studentsList.length });

    const newClass = {
        id: Date.now().toString(),
        name: className,
        students: studentsList.map((name, index) => ({
            id: Date.now().toString() + index,
            name: name
        }))
    };

    window.classes.push(newClass);
    if (window.students) {
        window.students.push(...newClass.students);
    }
    
    // console.log - отключен для продакшена('Класс добавлен в window.classes. Всего классов:', window.classes.length);
    // console.log - отключен для продакшена('Добавленный класс:', newClass);
    
    saveData();
    closeModal();
    showNotification('Класс успешно добавлен!', 'success');
    updateUI();
}

function updateClassesList() {
    const container = document.getElementById('classesList');
    
    if (window.classes.length === 0) {
        container.innerHTML = '<p>У вас пока нет классов. Создайте первый класс!</p>';
        return;
    }

    container.innerHTML = window.classes.map(cls => `
        <div class="class-card">
            <div class="class-info">
                <div class="class-name">${cls.name}</div>
                <div class="class-students">${cls.students.length} учеников</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="showClassDetails('${cls.id}')">Подробнее</button>
                <button class="btn btn-secondary" onclick="editClass('${cls.id}')">Редактировать</button>
                <button class="btn btn-danger" onclick="deleteClass('${cls.id}')">Удалить</button>
            </div>
        </div>
    `).join('');
}

function deleteClass(classId) {
    if (confirm('Вы уверены, что хотите удалить этот класс?')) {
        window.classes = window.classes.filter(c => c.id !== classId);
        saveData();
        updateUI();
        showNotification('Класс удален', 'info');
    }
}

function viewClass(classId) {
    const cls = window.classes.find(c => c.id === classId);
    if (!cls) return;

    const modalBody = `
        <div style="padding: 1rem;">
            <h3>${cls.name}</h3>
            <p><strong>Количество учеников:</strong> ${cls.students.length}</p>
            <div>
                <strong>Список учеников:</strong>
                <ul>
                    ${cls.students.map(student => `<li>${student.name}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;

    showModal('Информация о классе', modalBody);
}

function editClass(classId) {
    const cls = window.classes.find(c => c.id === classId);
    if (!cls) return;

    const modalBody = `
        <form id="editClassForm">
            <div class="form-group">
                <label for="editClassName">Название класса</label>
                <input type="text" id="editClassName" class="form-control" value="${cls.name}" required>
            </div>
            <div class="form-group">
                <label for="editClassStudents">Ученики (каждый с новой строки)</label>
                <textarea id="editClassStudents" class="form-control" rows="5">${cls.students.map(s => s.name).join('\n')}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Сохранить изменения</button>
        </form>
    `;

    showModal('Редактировать класс', modalBody);
    
    document.getElementById('editClassForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newName = document.getElementById('editClassName').value;
        const newStudentsText = document.getElementById('editClassStudents').value;
        const newStudentsList = newStudentsText.split('\n').filter(s => s.trim()).map(s => s.trim());

        cls.name = newName;
        cls.students = newStudentsList.map((name, index) => ({
            id: Date.now().toString() + index,
            name: name
        }));

        saveData();
        updateUI();
        closeModal();
        showNotification('Класс обновлен!', 'success');
    });
}

// Управление экзаменами
function showAddExamModal() {
    if (!window.classes || window.classes.length === 0) {
        showNotification('Сначала создайте класс!', 'error');
        return;
    }

    const modalBody = `
        <form id="addExamForm">
            <div class="form-group">
                <label for="examClass">Класс</label>
                <select id="examClass" class="form-control" required>
                    <option value="">Выберите класс</option>
                    ${window.classes.map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="examType">Тип экзамена</label>
                <select id="examType" class="form-control" required>
                    <option value="">Выберите тип</option>
                    <option value="OGE">ОГЭ</option>
                    <option value="EGE">ЕГЭ</option>
                </select>
            </div>
            <div class="form-group">
                <label for="examDate">Дата экзамена</label>
                <input type="date" id="examDate" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Создать экзамен</button>
        </form>
    `;

    showModal('Добавить экзамен', modalBody);
    
    document.getElementById('addExamForm').addEventListener('submit', handleAddExam);
}

function handleAddExam(e) {
    e.preventDefault();
    const classId = document.getElementById('examClass').value;
    const examType = document.getElementById('examType').value;
    const examDate = document.getElementById('examDate').value;

    const cls = window.classes.find(c => c.id === classId);
    const examConfig = MATH_TASKS[examType];

    const newExam = {
        id: Date.now().toString(),
        classId: classId,
        className: cls.name,
        type: examType,
        typeName: examConfig.name,
        date: examDate,
        tasks: examConfig.tasks,
        results: cls.students.map(student => ({
            studentId: student.id,
            studentName: student.name,
            taskResults: examConfig.tasks.map(task => ({
                taskId: task.id,
                passed: false
            }))
        }))
    };

    window.exams.push(newExam);
    saveData();
    updateUI();
    closeModal();
    showNotification('Экзамен создан! Теперь вы можете добавить результаты.', 'success');
    
    // Показать форму для ввода результатов
    setTimeout(() => showExamResults(newExam.id), 500);
}

function updateExamsList() {
    const container = document.getElementById('examsList');
    
    if (!window.exams || window.exams.length === 0) {
        container.innerHTML = '<p>У вас пока нет экзаменов. Создайте первый экзамен!</p>';
        return;
    }

    container.innerHTML = window.exams.map(exam => `
        <div class="exam-card">
            <div class="exam-info">
                <div class="exam-name">${exam.className} - ${exam.typeName}</div>
                <div class="exam-date">${exam.date}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="showExamResults('${exam.id}')">Результаты</button>
                <button class="btn btn-info" onclick="showExamAnalytics('${exam.id}')">Аналитика</button>
                <button class="btn btn-danger" onclick="deleteExam('${exam.id}')">Удалить</button>
            </div>
        </div>
    `).join('');
}

function showExamResults(examId) {
    const exam = (window.exams || []).find(e => e.id === examId);
    if (!exam) return;

    const modalBody = `
        <div class="exam-table-container">
            <h3>${exam.className} - ${exam.typeName} (${exam.date})</h3>
            <div style="margin-bottom: 1rem; display: flex; gap: 1rem; align-items: center;">
                <button class="btn btn-secondary" onclick="fillAllPassed()">Заполнить все +</button>
                <button class="btn btn-secondary" onclick="fillAllFailed()">Заполнить все -</button>
                <button class="btn btn-secondary" onclick="fillRandom()">Случайные результаты</button>
                <button class="btn btn-info" onclick="showStatistics()">Показать статистику</button>
            </div>
            <div style="margin-bottom: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 5px; font-size: 0.9rem;">
                <strong>Инструкция:</strong> Кликните на ячейку для изменения результата. 
                Зеленый = сдал, красный = не сдал. 
                Проходной балл: ${PASSING_SCORES[exam.type].passingPrimary} первичных баллов
            </div>
            <table class="exam-table" data-exam-id="${exam.id}">
                <thead>
                    <tr>
                        <th>Ученик</th>
                        ${exam.tasks.map(task => `<th title="${task.topics.join(', ')}">${task.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${exam.results.map(result => `
                        <tr>
                            <td class="student-name">${result.studentName}</td>
                            ${result.taskResults.map((taskResult, index) => `
                                <td class="result-cell ${taskResult.passed ? 'passed' : 'failed'}" 
                                    onclick="toggleTaskResult('${exam.id}', '${result.studentId}', ${index})"
                                    title="${exam.tasks[index].topics.join(', ')}">
                                    ${taskResult.passed ? '+' : '-'}
                                </td>
                            `).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: space-between;">
                <div id="examStats" style="font-size: 0.9rem; color: #666;">
                    <!-- Статистика будет добавлена динамически -->
                </div>
                <button class="btn btn-primary" onclick="saveExamResults('${exam.id}')">Сохранить результаты</button>
            </div>
        </div>
    `;

    showModal('Результаты экзамена', modalBody);
    updateExamStatistics(examId);
}

function toggleTaskResult(examId, studentId, taskIndex) {
    const exam = (window.exams || []).find(e => e.id === examId);
    const result = exam.results.find(r => r.studentId === studentId);
    result.taskResults[taskIndex].passed = !result.taskResults[taskIndex].passed;
    
    // Обновить отображение
    const cell = event.target;
    cell.classList.toggle('passed');
    cell.classList.toggle('failed');
    cell.textContent = cell.classList.contains('passed') ? '+' : '-';
    
    // Обновить статистику
    updateExamStatistics(examId);
}

function saveExamResults(examId) {
    saveData();
    closeModal();
    showNotification('Результаты сохранены!', 'success');
}

// Вспомогательные функции для ввода данных
function fillAllPassed() {
    const examId = getCurrentExamId();
    const exam = (window.exams || []).find(e => e.id === examId);
    exam.results.forEach(result => {
        result.taskResults.forEach(taskResult => {
            taskResult.passed = true;
        });
    });
    refreshExamTable(examId);
    showNotification('Все результаты установлены на "сдал"', 'info');
}

function fillAllFailed() {
    const examId = getCurrentExamId();
    const exam = (window.exams || []).find(e => e.id === examId);
    exam.results.forEach(result => {
        result.taskResults.forEach(taskResult => {
            taskResult.passed = false;
        });
    });
    refreshExamTable(examId);
    showNotification('Все результаты установлены на "не сдал"', 'info');
}

function fillRandom() {
    const examId = getCurrentExamId();
    const exam = (window.exams || []).find(e => e.id === examId);
    exam.results.forEach(result => {
        result.taskResults.forEach(taskResult => {
            taskResult.passed = Math.random() > 0.3; // 70% вероятность сдачи
        });
    });
    refreshExamTable(examId);
    showNotification('Заполнены случайные результаты', 'info');
}

function showStatistics() {
    const examId = getCurrentExamId();
    const exam = (window.exams || []).find(e => e.id === examId);
    const stats = calculateExamStats(exam);
    
    const statsHtml = `
        <div style="padding: 1rem; background: #f8f9fa; border-radius: 5px;">
            <strong>Текущая статистика:</strong><br>
            Всего учеников: ${stats.totalStudents}<br>
            Средний первичный балл: ${stats.averagePrimaryScore.toFixed(1)}<br>
            ${stats.examType === 'EGE' ? `Средний тестовый балл: ${stats.averageTestScore.toFixed(1)}<br>` : ''}
            ${stats.examType === 'OGE' ? `Средняя оценка: ${calculateAverageGrade(exam, stats.averagePrimaryScore)}<br>` : ''}
            Сдали (≥${stats.passingScore} первичных): ${stats.passedStudents}<br>
            Не сдали (<${stats.passingScore} первичных): ${stats.failedStudents}
        </div>
    `;
    
    showModal('Статистика экзамена', statsHtml);
}

function getCurrentExamId() {
    // Получаем ID текущего экзамена из data атрибута таблицы
    const table = document.querySelector('.exam-table');
    return table ? table.dataset.examId : 'current';
}

function refreshExamTable(examId) {
    const exam = (window.exams || []).find(e => e.id === examId);
    const tbody = document.querySelector('.exam-table tbody');
    
    tbody.innerHTML = exam.results.map(result => `
        <tr>
            <td class="student-name">${result.studentName}</td>
            ${result.taskResults.map((taskResult, index) => `
                <td class="result-cell ${taskResult.passed ? 'passed' : 'failed'}" 
                    onclick="toggleTaskResult('${exam.id}', '${result.studentId}', ${index})"
                    title="${exam.tasks[index].topics.join(', ')}">
                    ${taskResult.passed ? '+' : '-'}
                </td>
            `).join('')}
        </tr>
    `).join('');
    
    updateExamStatistics(examId);
}

function updateExamStatistics(examId) {
    const exam = (window.exams || []).find(e => e.id === examId);
    const stats = calculateExamStats(exam);
    const statsDiv = document.getElementById('examStats');
    
    if (statsDiv) {
        statsDiv.innerHTML = `
            Ср. первичный балл: <strong>${stats.averagePrimaryScore.toFixed(1)}</strong> | 
            ${stats.examType === 'EGE' ? `Ср. тестовый балл: <strong>${stats.averageTestScore.toFixed(1)}</strong> | ` : ''}
            ${stats.examType === 'OGE' ? `Ср. оценка: <strong>${calculateAverageGrade(exam, stats.averagePrimaryScore)}</strong> | ` : ''}
            Сдали: <strong>${stats.passedStudents}/${stats.totalStudents}</strong> | 
            Не сдали: <strong>${stats.failedStudents}</strong>
        `;
    }
}

function deleteExam(examId) {
    if (confirm('Вы уверены, что хотите удалить этот экзамен?')) {
        window.exams = window.exams.filter(e => e.id !== examId);
        saveData();
        updateUI();
        closeModal();
        showNotification('Экзамен удален', 'info');
    }
}

// Аналитика
function updateAnalyticsSelects() {
    const classSelect = document.getElementById('analyticsClassSelect');
    const examSelect = document.getElementById('analyticsExamSelect');

    classSelect.innerHTML = '<option value="">Выберите класс</option>' +
        (window.classes || []).map(cls => `<option value="${cls.id}">${cls.name}</option>`).join('');
}

function updateAnalyticsExamSelect() {
    const classId = document.getElementById('analyticsClassSelect').value;
    const examSelect = document.getElementById('analyticsExamSelect');

    if (!classId) {
        examSelect.innerHTML = '<option value="">Выберите экзамен</option>';
        return;
    }

    const classExams = (window.exams || []).filter(exam => exam.classId === classId);
    examSelect.innerHTML = '<option value="">Выберите экзамен</option>' +
        classExams.map(exam => `<option value="${exam.id}">${exam.typeName} - ${exam.date}</option>`).join('');
}

function updateAnalytics() {
    const examId = document.getElementById('analyticsExamSelect').value;
    if (!examId) return;

    const exam = (window.exams || []).find(e => e.id === examId);
    if (!exam) return;

    const analyticsContent = document.getElementById('analyticsContent');
    
    // Расчет статистики
    const stats = calculateExamStats(exam);
    
    analyticsContent.innerHTML = `
        <div class="analytics-section">
            <h3>Общая статистика</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.totalStudents}</div>
                    <div class="stat-label">Всего учеников</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.averagePrimaryScore.toFixed(1)}</div>
                    <div class="stat-label">Средний первичный балл</div>
                </div>
                ${stats.examType === 'EGE' ? `
                <div class="stat-item">
                    <div class="stat-value">${stats.averageTestScore.toFixed(1)}</div>
                    <div class="stat-label">Средний тестовый балл</div>
                </div>
                ` : ''}
                ${stats.examType === 'OGE' ? `
                <div class="stat-item">
                    <div class="stat-value">${calculateAverageGrade(exam, stats.averagePrimaryScore)}</div>
                    <div class="stat-label">Средняя оценка</div>
                </div>
                ` : ''}
                <div class="stat-item">
                    <div class="stat-value">${stats.passedStudents}</div>
                    <div class="stat-label">Сдали экзамен</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.failedStudents}</div>
                    <div class="stat-label">Не сдали экзамен</div>
                </div>
            </div>
            <div style="margin-top: 1rem; padding: 1rem; background: #f8f9fa; border-radius: 5px;">
                <strong>Проходной балл ${stats.examType === 'OGE' ? 'ОГЭ' : 'ЕГЭ'} 2026:</strong> 
                ${PASSING_SCORES[stats.examType].passingPrimary} первичных баллов 
                ${stats.examType === 'EGE' ? `(${PASSING_SCORES.EGE.testScale[PASSING_SCORES.EGE.passingPrimary]} тестовых баллов)` : ''}
                ${stats.examType === 'OGE' ? `(оценка 3 и выше)` : ''}
            </div>
        </div>

        <div class="analytics-section">
            <h3>Результаты по заданиям</h3>
            <div class="chart-container">
                <canvas id="tasksChart"></canvas>
            </div>
        </div>

        <div class="analytics-section">
            <h3>Результаты по ученикам</h3>
            <div class="chart-container">
                <canvas id="studentsChart"></canvas>
            </div>
        </div>

        <div class="analytics-section">
            <h3>Проблемные темы</h3>
            <div class="topics-analysis">
                ${generateTopicsAnalysis(exam)}
            </div>
        </div>
    `;

    // Построить графики
    setTimeout(() => {
        drawTasksChart(exam);
        drawStudentsChart(exam);
    }, 100);
}

// Функции для расчета баллов
function calculatePrimaryScore(result) {
    const exam = (window.exams || []).find(e => e.results.includes(result));
    if (!exam) return 0;
    
    let totalScore = 0;
    result.taskResults.forEach(taskResult => {
        if (taskResult.passed) {
            const task = exam.tasks.find(t => t.id === taskResult.taskId);
            if (task && task.primaryScore) {
                totalScore += task.primaryScore;
            } else {
                totalScore += 1; // fallback для старых данных
            }
        }
    });
    
    return totalScore;
}

function calculateTestScore(primaryScore, examType) {
    if (examType === 'OGE') {
        // Для ОГЭ возвращаем первичный балл (оценка рассчитывается отдельно)
        return primaryScore;
    } else if (examType === 'EGE') {
        // Для ЕГЭ используем официальную шкалу перевода 2026
        const scale = PASSING_SCORES.EGE.testScale;
        return scale[primaryScore] || 0;
    }
    return 0;
}

function calculateGrade(score, examType) {
    if (examType === 'OGE') {
        const scale = PASSING_SCORES.OGE.gradeScale;
        for (const [grade, range] of Object.entries(scale)) {
            if (score >= range.min && score <= range.max) {
                return parseInt(grade);
            }
        }
    } else if (examType === 'EGE') {
        // Для ЕГЭ используем шкалу перевода тестовых баллов в оценки
        const scale = PASSING_SCORES.EGE.gradeScale;
        for (const [grade, range] of Object.entries(scale)) {
            if (score >= range.min && score <= range.max) {
                return parseInt(grade);
            }
        }
    }
    return 2; // минимальная оценка по умолчанию
}

function calculateAverageGrade(exam, averagePrimaryScore) {
    if (exam.type !== 'OGE') return null;
    
    const scale = PASSING_SCORES.OGE.gradeScale;
    for (const [grade, range] of Object.entries(scale)) {
        if (averagePrimaryScore >= range.min && averagePrimaryScore <= range.max) {
            return grade;
        }
    }
    return 2; // минимальная оценка по умолчанию
}

function calculateExamStats(exam) {
    const totalStudents = exam.results.length;
    let totalPrimaryScore = 0;
    let totalTestScore = 0;
    let passedStudents = 0;
    const passingPrimaryScore = PASSING_SCORES[exam.type].passingPrimary;

    exam.results.forEach(result => {
        const primaryScore = calculatePrimaryScore(result);
        const testScore = calculateTestScore(primaryScore, exam.type);
        
        totalPrimaryScore += primaryScore;
        totalTestScore += testScore;
        
        // Проверяем сдачу по первичному баллу
        if (primaryScore >= passingPrimaryScore) passedStudents++;
    });

    return {
        totalStudents,
        averagePrimaryScore: totalPrimaryScore / totalStudents,
        averageTestScore: totalTestScore / totalStudents,
        passedStudents,
        failedStudents: totalStudents - passedStudents,
        passingScore: passingPrimaryScore,
        examType: exam.type
    };
}

function drawTasksChart(exam) {
    const canvas = document.getElementById('tasksChart');
    if (!canvas) return;

    const taskStats = exam.tasks.map(task => {
        const passedCount = exam.results.filter(result => 
            result.taskResults.find(tr => tr.taskId === task.id && tr.passed)
        ).length;
        return {
            name: task.name,
            passed: passedCount,
            percentage: (passedCount / exam.results.length) * 100
        };
    });

    // Уничтожаем предыдущий график если он существует
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: taskStats.map(stat => stat.name),
            datasets: [{
                label: 'Процент выполнения',
                data: taskStats.map(stat => stat.percentage),
                backgroundColor: 'rgba(0, 123, 255, 0.8)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Результаты по заданиям',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333',
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(1)}% (${taskStats[context.dataIndex].passed}/${exam.results.length} учеников)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function drawStudentsChart(exam) {
    const canvas = document.getElementById('studentsChart');
    if (!canvas) return;

    const passingPrimaryScore = PASSING_SCORES[exam.type].passingPrimary;
    const studentStats = exam.results.map(result => {
        const primaryScore = calculatePrimaryScore(result);
        const testScore = calculateTestScore(primaryScore, exam.type);
        return {
            name: result.studentName,
            primaryScore: primaryScore,
            testScore: testScore,
            passed: primaryScore >= passingPrimaryScore
        };
    });

    // Уничтожаем предыдущий график если он существует
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const scoreLabel = exam.type === 'EGE' ? 'Тестовые баллы' : 'Первичные баллы';
    const scoreData = exam.type === 'EGE' 
        ? studentStats.map(stat => stat.testScore)
        : studentStats.map(stat => stat.primaryScore);

    canvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: studentStats.map(stat => stat.name),
            datasets: [{
                label: scoreLabel,
                data: scoreData,
                backgroundColor: studentStats.map(stat => 
                    stat.passed ? 'rgba(40, 167, 69, 0.8)' : 'rgba(220, 53, 69, 0.8)'
                ),
                borderColor: studentStats.map(stat => 
                    stat.passed ? 'rgba(40, 167, 69, 1)' : 'rgba(220, 53, 69, 1)'
                ),
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Результаты по ученикам',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333',
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const student = studentStats[context.dataIndex];
                            if (exam.type === 'EGE') {
                                const grade = calculateGrade(student.testScore, exam.type);
                                return `${student.testScore} тестовых баллов (${student.primaryScore} первичных) - оценка ${grade}`;
                            } else {
                                const grade = calculateGrade(student.primaryScore, exam.type);
                                return `${student.primaryScore} первичных баллов - оценка ${grade}`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: exam.type === 'EGE' ? 100 : exam.tasks.length,
                    ticks: {
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Добавляем линию проходного балла
    const chartInstance = canvas.chart;
    const originalDraw = chartInstance.draw;
    chartInstance.draw = function() {
        originalDraw.apply(this, arguments);
        
        const ctx = this.ctx;
        const yScale = this.scales.y;
        const xScale = this.scales.x;
        
        // Для ЕГЭ используем тестовые баллы для линии проходного балла
        let passingScoreValue;
        if (exam.type === 'EGE') {
            passingScoreValue = PASSING_SCORES.EGE.testScale[PASSING_SCORES.EGE.passingPrimary];
        } else {
            passingScoreValue = passingPrimaryScore;
        }
        
        const topY = yScale.getPixelForValue(passingScoreValue);
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xScale.left, topY);
        ctx.lineTo(xScale.right, topY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.8)';
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.restore();
        
        // Подпись проходного балла
        ctx.save();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'rgba(255, 193, 7, 1)';
        ctx.textAlign = 'left';
        let passingText;
        if (exam.type === 'EGE') {
            passingText = `Проходной балл: ${passingScoreValue} тестовых`;
        } else {
            passingText = `Проходной балл: ${passingPrimaryScore} первичных`;
        }
        ctx.fillText(passingText, xScale.left + 10, topY - 5);
        ctx.restore();
    };
}

function generateTopicsAnalysis(exam) {
    const topicStats = {};
    const passingScore = PASSING_SCORES[exam.type].passingPercentage;
    
    exam.tasks.forEach(task => {
        task.topics.forEach(topic => {
            if (!topicStats[topic]) {
                topicStats[topic] = { total: 0, passed: 0, tasks: [] };
            }
            topicStats[topic].total++;
            topicStats[topic].tasks.push(task.id);
        });
    });

    exam.results.forEach(result => {
        result.taskResults.forEach(taskResult => {
            const task = exam.tasks.find(t => t.id === taskResult.taskId);
            if (task) {
                task.topics.forEach(topic => {
                    if (taskResult.passed) {
                        topicStats[topic].passed++;
                    }
                });
            }
        });
    });

    const sortedTopics = Object.entries(topicStats)
        .map(([topic, stats]) => {
            const percentage = (stats.passed / (stats.total * exam.results.length)) * 100;
            let colorClass = 'success';
            if (percentage < 50) colorClass = 'danger';
            else if (percentage < 75) colorClass = 'warning';
            
            return {
                topic,
                percentage: percentage,
                problemCount: stats.total * exam.results.length - stats.passed,
                colorClass: colorClass
            };
        })
        .sort((a, b) => a.percentage - b.percentage);

    return `
        <div class="topics-list">
            ${sortedTopics.map(topic => `
                <div class="topic-item topic-${topic.colorClass}">
                    <div class="topic-name">${topic.topic}</div>
                    <div class="topic-progress">
                        <div class="topic-progress-bar" style="width: ${topic.percentage}%"></div>
                    </div>
                    <div class="topic-stats">
                        <span class="topic-percentage">${topic.percentage.toFixed(1)}%</span>
                        <span class="topic-problems">(${topic.problemCount} проблем)</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <style>
            .topics-list { display: grid; gap: 1rem; }
            .topic-item { 
                display: flex; 
                flex-direction: column;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid;
            }
            .topic-success { 
                background: #d4edda; 
                border-left-color: #28a745;
                color: #155724;
            }
            .topic-warning { 
                background: #fff3cd; 
                border-left-color: #ffc107;
                color: #856404;
            }
            .topic-danger { 
                background: #f8d7da; 
                border-left-color: #dc3545;
                color: #721c24;
            }
            .topic-name { font-weight: 600; margin-bottom: 0.5rem; font-size: 1rem; }
            .topic-progress {
                width: 100%;
                height: 8px;
                background: rgba(0,0,0,0.1);
                border-radius: 4px;
                margin-bottom: 0.5rem;
                overflow: hidden;
            }
            .topic-progress-bar {
                height: 100%;
                background: currentColor;
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            .topic-success .topic-progress-bar { background: #28a745; }
            .topic-warning .topic-progress-bar { background: #ffc107; }
            .topic-danger .topic-progress-bar { background: #dc3545; }
            .topic-stats { 
                display: flex; 
                justify-content: space-between; 
                align-items: center;
                font-size: 0.9rem;
            }
            .topic-percentage { font-weight: bold; }
            .topic-problems { opacity: 0.8; }
        </style>
    `;
}

function showExamAnalytics(examId) {
    const exam = (window.exams || []).find(e => e.id === examId);
    if (!exam) return;

    // Установить выбранные значения в селектах
    document.getElementById('analyticsClassSelect').value = exam.classId;
    updateAnalyticsExamSelect();
    document.getElementById('analyticsExamSelect').value = examId;
    
    // Перейти на страницу аналитики
    showPage('analytics');
    updateAnalytics();
}

// Обновление панели управления
function updateDashboard() {
    // console.log - отключен для продакшена('Обновление дашборда...');
    
    const totalClassesEl = document.getElementById('totalClasses');
    const totalStudentsEl = document.getElementById('totalStudents');
    const totalExamsEl = document.getElementById('totalExams');
    
    // Элементы статистики проверены
    
    // Данные для статистики получены
    
    if (totalClassesEl) {
        totalClassesEl.textContent = window.classes ? window.classes.length : 0;
    } else {
        console.error('Элемент totalClasses не найден');
    }
    
    if (totalStudentsEl) {
        totalStudentsEl.textContent = window.students ? window.students.length : 0;
    } else {
        console.error('Элемент totalStudents не найден');
    }
    
    if (totalExamsEl) {
        totalExamsEl.textContent = window.exams ? window.exams.length : 0;
    } else {
        console.error('Элемент totalExams не найден');
    }
    
    // console.log - отключен для продакшена('Статистика обновлена');
}

// Модальные окна
function showModal(title, body) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// Добавляем обработчик на крестик
document.addEventListener('DOMContentLoaded', function() {
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Закрытие по клику на оверлей
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
});

// Уведомления
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
