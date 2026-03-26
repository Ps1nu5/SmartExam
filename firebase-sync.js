// Модуль синхронизации с Firebase
class FirebaseSync {
    constructor() {
        this.db = null;
        this.isOnline = navigator.onLine;
        this.syncInProgress = false;
        this.lastSyncTime = null;
    }

    // Инициализация Firebase
    async init() {
        try {
            // Проверяем доступность Firebase
            if (typeof firebase === 'undefined') {
                console.warn('Firebase SDK не загружен');
                return false;
            }

            this.db = firebase.firestore();
            this.setupEventListeners();
            console.log('Firebase инициализирован успешно');
            return true;
        } catch (error) {
            console.error('Ошибка инициализации Firebase:', error);
            return false;
        }
    }

    // Настройка слушателей событий
    setupEventListeners() {
        // Отслеживание состояния сети
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncToFirebase();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });

        // Отслеживание изменений в localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'smartExamData' && this.isOnline && !this.syncInProgress) {
                this.syncToFirebase();
            }
        });

        // Периодическая синхронизация
        setInterval(() => {
            if (this.isOnline && !this.syncInProgress) {
                this.syncToFirebase();
            }
        }, 30000); // Каждые 30 секунд
    }

    // Синхронизация данных с Firebase
    async syncToFirebase() {
        if (!this.db || !this.isOnline) return;

        this.syncInProgress = true;
        
        try {
            const localData = localStorage.getItem('smartExamData');
            if (!localData) return;

            const data = JSON.parse(localData);
            const userId = this.getUserId();
            
            // Сохраняем данные в Firebase
            await this.db.collection('users').doc(userId).set({
                data: data,
                lastSync: firebase.firestore.FieldValue.serverTimestamp(),
                device: navigator.userAgent
            }, { merge: true });

            this.lastSyncTime = new Date();
            console.log('Данные синхронизированы с Firebase');
            
            // Показываем уведомление
            this.showSyncNotification('Данные синхронизированы');
            
        } catch (error) {
            console.error('Ошибка синхронизации с Firebase:', error);
            this.showSyncNotification('Ошибка синхронизации', 'error');
        } finally {
            this.syncInProgress = false;
        }
    }

    // Загрузка данных из Firebase
    async loadFromFirebase() {
        if (!this.db) return null;

        try {
            const userId = this.getUserId();
            const doc = await this.db.collection('users').doc(userId).get();
            
            if (doc.exists) {
                const data = doc.data().data;
                if (data) {
                    // Сохраняем в localStorage
                    localStorage.setItem('smartExamData', JSON.stringify(data));
                    console.log('Данные загружены из Firebase');
                    this.showSyncNotification('Данные загружены из облака');
                    return data;
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки из Firebase:', error);
            return null;
        }
    }

    // Получение ID пользователя
    getUserId() {
        let userId = localStorage.getItem('smartExamUserId');
        if (!userId) {
            // Генерируем уникальный ID
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('smartExamUserId', userId);
        }
        return userId;
    }

    // Показ уведомлений
    showSyncNotification(message, type = 'success') {
        // Создаем или обновляем элемент уведомления
        let notification = document.getElementById('syncNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'syncNotification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                transition: all 0.3s ease;
                transform: translateX(400px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            `;
            document.body.appendChild(notification);
        }

        // Обновляем стиль в зависимости от типа
        notification.style.background = type === 'error' 
            ? 'linear-gradient(135deg, #f44336 0%, #dc3545 100%)'
            : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

        notification.textContent = message;
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Получение статуса синхронизации
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            lastSync: this.lastSyncTime,
            syncInProgress: this.syncInProgress,
            hasFirebase: !!this.db
        };
    }

    // Принудительная синхронизация
    async forceSync() {
        if (this.isOnline) {
            await this.syncToFirebase();
            return true;
        }
        return false;
    }

    // Очистка данных Firebase
    async clearFirebaseData() {
        if (!this.db) return;
        
        try {
            const userId = this.getUserId();
            await this.db.collection('users').doc(userId).delete();
            console.log('Данные в Firebase очищены');
            this.showSyncNotification('Данные в облаке очищены');
        } catch (error) {
            console.error('Ошибка очистки Firebase:', error);
        }
    }
}

// Создаем глобальный экземпляр
window.firebaseSync = new FirebaseSync();
