// Система аутентификации для SmartExam
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.firebaseSync = null;
    }

    // Инициализация
    init(firebaseSync) {
        this.firebaseSync = firebaseSync;
        this.checkExistingSession();
    }

    // Проверка существующей сессии
    checkExistingSession() {
        const sessionData = localStorage.getItem('authSession');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                if (session.expiresAt > Date.now()) {
                    this.currentUser = session.user;
                    this.updateUI();
                    return true;
                } else {
                    localStorage.removeItem('authSession');
                }
            } catch (error) {
                localStorage.removeItem('authSession');
            }
        }
        return false;
    }

    // Регистрация нового пользователя
    async register(email, password, name) {
        try {
            email = email.toLowerCase();
            
            // Проверяем, что пользователь не существует
            if (await this.userExists(email)) {
                throw new Error('Пользователь с таким email уже существует');
            }

            // Создаем нового пользователя с ID на основе email
            const user = {
                id: 'user_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                email: email.toLowerCase(),
                name: name,
                password: this.hashPassword(password),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            // Сохраняем пользователя
            if (this.firebaseSync && this.firebaseSync.db) {
                await this.firebaseSync.db.collection('users').doc(user.id).set({
                    userData: user,
                    smartExamData: {
                        users: [],
                        classes: [],
                        exams: []
                    },
                    lastSync: new Date()
                });
            } else {
                // Fallback для localStorage
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                users.push(user);
                localStorage.setItem('registeredUsers', JSON.stringify(users));
            }

            // Автоматически входим
            return this.login(email, password);
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            // Переводим ошибку на русский
            const translatedError = this.translateError(error);
            throw new Error(translatedError);
        }
    }

    // Вход в систему
    async login(email, password) {
        try {
            email = email.toLowerCase();
            
            // Ищем пользователя
            const user = await this.findUser(email);
            if (!user) {
                throw new Error('Неверный email или пароль');
            }

            // Проверяем пароль
            if (!this.verifyPassword(password, user.password)) {
                throw new Error('Неверный email или пароль');
            }

            // Обновляем время последнего входа
            user.lastLogin = new Date().toISOString();
            
            // Сохраняем сессию
            localStorage.setItem('authSession', JSON.stringify({
                userId: user.id,
                email: user.email,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 дней
            }));

            this.currentUser = user;
            this.updateUI();
            return user;
        } catch (error) {
            console.error('Ошибка входа:', error);
            // Переводим ошибку на русский
            const translatedError = this.translateError(error);
            throw new Error(translatedError);
        }
    }

    // Выход из системы
    logout() {
        this.currentUser = null;
        localStorage.removeItem('authSession');
        localStorage.removeItem('smartExamData');
        this.updateUI();
        
        // Очищаем глобальные переменные
        if (typeof window !== 'undefined') {
            window.users = [];
            window.classes = [];
            window.exams = [];
            window.updateUI();
        }
    }

    // Проверка существования пользователя
    async userExists(email) {
        if (this.firebaseSync) {
            const users = await this.firebaseSync.db
                .collection('users')
                .where('userData.email', '==', email.toLowerCase())
                .get();
            return !users.empty;
        } else {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            return users.some(u => u.email === email.toLowerCase());
        }
    }

    // Поиск пользователя
    async findUser(email) {
        if (this.firebaseSync) {
            const users = await this.firebaseSync.db
                .collection('users')
                .where('userData.email', '==', email.toLowerCase())
                .get();
            
            if (!users.empty) {
                const doc = users.docs[0];
                return doc.data().userData;
            }
            return null;
        } else {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            return users.find(u => u.email === email.toLowerCase()) || null;
        }
    }

    // Обновление данных пользователя
    async updateUser(user) {
        if (this.firebaseSync) {
            await this.firebaseSync.db.collection('users').doc(user.id).update({
                userData: user,
                lastSync: new Date()
            });
        } else {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users[index] = user;
                localStorage.setItem('registeredUsers', JSON.stringify(users));
            }
        }
    }

    // Загрузка данных пользователя
    async loadUserData() {
        if (!this.currentUser) return;

        console.log('Загрузка данных для пользователя:', this.currentUser.email, 'ID:', this.currentUser.id);

        try {
            if (this.firebaseSync && this.firebaseSync.db) {
                console.log('Загрузка из Firebase...');
                const doc = await this.firebaseSync.db
                    .collection('users')
                    .doc(this.currentUser.id)
                    .get();
                
                if (doc.exists) {
                    const fullData = doc.data();
                    console.log('Полные данные из Firebase:', fullData);
                    
                    // Проверяем разные поля где могут быть данные
                    let data = fullData.smartExamData || fullData.data || fullData;
                    console.log('Найденные данные:', data);
                    
                    if (data && (data.users || data.classes || data.exams)) {
                        localStorage.setItem('smartExamData', JSON.stringify(data));
                        if (typeof window !== 'undefined') {
                            window.users = data.users || [];
                            window.classes = data.classes || [];
                            window.exams = data.exams || [];
                            console.log('Данные установлены в window:', {
                                users: window.users.length,
                                classes: window.classes.length,
                                exams: window.exams.length
                            });
                        }
                    } else {
                        console.log('Данные не найдены или пустые');
                    }
                } else {
                    console.log('Документ пользователя не найден в Firebase');
                }
            } else {
                console.log('Firebase не доступен, используем localStorage');
                // Fallback для localStorage
                const userData = JSON.parse(localStorage.getItem('userData_' + this.currentUser.id) || '{}');
                if (userData.users) {
                    localStorage.setItem('smartExamData', JSON.stringify(userData));
                    if (typeof window !== 'undefined') {
                        window.users = userData.users || [];
                        window.classes = userData.classes || [];
                        window.exams = userData.exams || [];
                    }
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    }

    // Сохранение данных пользователя
    async saveUserData() {
        if (!this.currentUser) return;

        console.log('Сохранение данных для пользователя:', this.currentUser.email, 'ID:', this.currentUser.id);

        try {
            const data = {
                users: typeof window !== 'undefined' ? window.users : [],
                classes: typeof window !== 'undefined' ? window.classes : [],
                exams: typeof window !== 'undefined' ? window.exams : []
            };

            console.log('Данные для сохранения:', {
                users: data.users.length,
                classes: data.classes.length,
                exams: data.exams.length
            });

            if (this.firebaseSync && this.firebaseSync.db) {
                console.log('Сохранение в Firebase...');
                await this.firebaseSync.db.collection('users').doc(this.currentUser.id).update({
                    smartExamData: data,
                    lastSync: new Date()
                });
                console.log('Данные сохранены в Firebase');
            } else {
                console.log('Firebase не доступен, сохраняем в localStorage');
                localStorage.setItem('userData_' + this.currentUser.id, JSON.stringify(data));
            }
        } catch (error) {
            console.error('Ошибка сохранения данных пользователя:', error);
        }
    }

    // Сохранение сессии
    saveSession() {
        const session = {
            user: this.currentUser,
            expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 дней
        };
        localStorage.setItem('authSession', JSON.stringify(session));
    }

    // Обновление UI
    updateUI() {
        if (typeof window === 'undefined') return;

        const loginPage = document.getElementById('loginPage');
        const dashboardPage = document.getElementById('dashboardPage');
        const userName = document.getElementById('userName');

        if (this.currentUser) {
            if (loginPage) loginPage.style.display = 'none';
            if (dashboardPage) dashboardPage.style.display = 'block';
            if (userName) userName.textContent = this.currentUser.name;
        } else {
            if (loginPage) loginPage.style.display = 'block';
            if (dashboardPage) dashboardPage.style.display = 'none';
        }
    }

    // Хеширование пароля
    hashPassword(password) {
        // Безопасное хеширование для Unicode символов
        try {
            return btoa(unescape(encodeURIComponent(password + 'smartexam_salt')));
        } catch (error) {
            // Fallback если btoa не работает
            let hash = 0;
            const str = password + 'smartexam_salt';
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash.toString();
        }
    }

    // Проверка пароля
    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    // Перевод ошибок на русский
    translateError(error) {
        const message = error.message || error.toString();
        
        // Словарь ошибок
        const errorMap = {
            'String contains an invalid character': 'Пароль содержит недопустимые символы',
            'Invalid character': 'Недопустимый символ',
            'Failed to execute': 'Ошибка выполнения',
            'Network error': 'Ошибка сети',
            'Permission denied': 'Доступ запрещен',
            'Not found': 'Не найдено',
            'Invalid email': 'Некорректный email',
            'Weak password': 'Слишком простой пароль',
            'Email already exists': 'Пользователь с таким email уже существует',
            'User not found': 'Пользователь не найден',
            'Incorrect password': 'Неверный пароль'
        };
        
        // Ищем точное совпадение
        for (const [english, russian] of Object.entries(errorMap)) {
            if (message.toLowerCase().includes(english.toLowerCase())) {
                return russian;
            }
        }
        
        // Если нет точного совпадения, возвращаем общую ошибку
        return 'Произошла ошибка. Попробуйте еще раз.';
    }

    // Получение текущего пользователя
    getCurrentUser() {
        return this.currentUser;
    }

    // Проверка авторизации
    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Создаем глобальный экземпляр
window.authSystem = new AuthSystem();
