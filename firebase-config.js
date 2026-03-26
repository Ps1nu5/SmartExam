// Конфигурация Firebase для SmartExam
const firebaseConfig = {
    // Замените на ваши данные из консоли Firebase
    apiKey: "AIzaSyCYrQTqOahcTn_WxK-Z5iLqCaXpukczYoQ",

    authDomain: "smartexam-b7c50.firebaseapp.com",

    projectId: "smartexam-b7c50",

    storageBucket: "smartexam-b7c50.firebasestorage.app",

    messagingSenderId: "726790042881",

    appId: "1:726790042881:web:6554f61f2628cb0981d700"

};

// Инициализация Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { firebaseConfig };
}
