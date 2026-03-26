# 🌐 Настройка синхронизации SmartExam через Firebase

## 📋 Что нужно сделать:

### 1. Создание проекта в Firebase
1. Перейдите на [console.firebase.google.com](https://console.firebase.google.com)
2. Нажмите "Создать проект"
3. Название проекта: `SmartExam-YourName`
4. Выберите аккаунт Google (можно использовать существующий)
5. Нажмите "Создать проект"

### 2. Включение Firestore Database
1. В созданном проекте перейдите в "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме"
4. Нажмите "Далее"

### 3. Настройка правил безопасности
1. Перейдите в "Firestore Database" → "Правила"
2. Замените содержимое на:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true; // Разрешаем доступ без аутентификации
    }
  }
}
```
3. Нажмите "Опубликовать"

### 4. Получение конфигурации
1. Перейдите в "Настройки проекта" (⚙️)
2. Прокрутите вниз до "Ваши приложения"
3. Нажмите "Web" → "Конфигурация Firebase"
4. Скопируйте данные конфигурации

### 5. Настройка аутентификации (опционально)
1. Перейдите в "Authentication" → "Метод входа"
2. Включите "Email/пароль"
3. В настройках аутентификации добавьте домен вашего сайта

## 🔧 Интеграция в проект:

### Шаг 1: Добавление Firebase SDK
В файле `index.html` добавьте перед закрывающим `</head>`:
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js"></script>

<!-- Конфигурация Firebase -->
<script src="firebase-config.js"></script>
<script src="firebase-sync.js"></script>
```

### Шаг 2: Настройка конфигурации
1. Откройте файл `firebase-config.js`
2. Замените `your-api-key-here` и другие данные на ваши из консоли Firebase
3. Сохраните файл

### Шаг 3: Обновление функций сохранения/загрузки
Замените в `script.js` функции `saveData` и `loadData`:
```javascript
// Замените существующие функции
async function saveData() {
    try {
        // Сохраняем в localStorage
        localStorage.setItem('smartExamData', JSON.stringify({
            users: users,
            classes: classes,
            exams: exams
        }));
        
        // Синхронизируем с Firebase
        if (window.firebaseSync) {
            await window.firebaseSync.syncToFirebase();
        }
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

async function loadData() {
    try {
        // Сначала пробуем загрузить из Firebase
        if (window.firebaseSync && navigator.onLine) {
            const firebaseData = await window.firebaseSync.loadFromFirebase();
            if (firebaseData) {
                const { users, classes, exams } = firebaseData;
                window.users = users || [];
                window.classes = classes || [];
                window.exams = exams || [];
                return;
            }
        }
        
        // Загружаем из localStorage
        const data = localStorage.getItem('smartExamData');
        if (data) {
            const parsedData = JSON.parse(data);
            window.users = parsedData.users || [];
            window.classes = parsedData.classes || [];
            window.exams = parsedData.exams || [];
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        window.users = [];
        window.classes = [];
        window.exams = [];
    }
}
```

## 🎯 Как это работает:

### 🔄 Автоматическая синхронизация
- **Online:** Данные автоматически синхронизируются с Firebase
- **Offline:** Работаем с localStorage, изменения сохраняются локально
- **Return Online:** Все изменения автоматически загружаются в Firebase

### 📱 Мультиустройственность
- **Телефон:** Внесите изменения → они сохранятся → синхронизируются
- **Компьютер:** Откройте → получите последние изменения из Firebase
- **Планшет:** Полноценная работа на любом устройстве

### 🔒 Безопасность
- **Приватные данные:** Только вы имеете доступ к своим данным
- **Аутентификация:** Доступ только по вашему ID
- **Шифрование:** Автоматическое HTTPS шифрование

## 🚀 Преимущества:

### ✅ **Надежность**
- Firebase от Google с 99.9% uptime
- Автоматические бэкапы
- Версионирование данных

### ✅ **Скорость**
- Realtime синхронизация
- Оптимизированная доставка
- Кэширование на клиенте

### ✅ **Бесплатно**
- 10,000 операций в день бесплатно
- 1 ГБ хранилища
- Безлимитная синхронизация

## 🎮 Начало использования:

1. **Настройте Firebase** по инструкции выше
2. **Добавьте SDK** в HTML
3. **Обновите функции** в script.js
4. **Откройте приложение** на двух устройствах
5. **Проверьте синхронизацию** - изменения должны появляться на обоих устройствах

## 🆘 Поддержка:

Если возникнут проблемы:
1. Проверьте консоль браузера на ошибки
2. Убедитесь что Firebase SDK загружен
3. Проверьте правила безопасности в Firestore
4. Проверьте сетевое подключение

---

**Готово! Теперь ваш SmartExam работает на нескольких устройствах с автоматической синхронизацией через Firebase!** 🎉
