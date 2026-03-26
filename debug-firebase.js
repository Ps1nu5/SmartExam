// Отладочная функция для проверки Firebase
async function debugFirebase() {
    console.log('=== DEBUG FIREBASE ===');
    
    if (!window.authSystem || !window.authSystem.isAuthenticated()) {
        console.log('Пользователь не авторизован');
        return;
    }
    
    const user = window.authSystem.getCurrentUser();
    console.log('Текущий пользователь:', user);
    
    if (window.authSystem.firebaseSync && window.authSystem.firebaseSync.db) {
        try {
            console.log('Проверка Firebase...');
            
            // Проверяем все документы в коллекции users
            const allUsers = await window.authSystem.firebaseSync.db.collection('users').get();
            console.log('Все пользователи в Firebase (' + allUsers.docs.length + '):');
            allUsers.docs.forEach(doc => {
                const data = doc.data();
                console.log(`ID: ${doc.id}`);
                console.log(`Email: ${data.userData?.email}`);
                console.log(`Имя: ${data.userData?.name}`);
                console.log(`Данные классов:`, data.smartExamData?.classes || data.data?.classes || 'нет');
                console.log('---');
            });
            
            // Проверяем конкретный документ пользователя
            console.log('Проверка документа текущего пользователя...');
            const userDoc = await window.authSystem.firebaseSync.db.collection('users').doc(user.id).get();
            if (userDoc.exists) {
                const docData = userDoc.data();
                console.log('✅ Документ текущего пользователя найден');
                console.log('Полная структура:', docData);
                console.log('UserData:', docData.userData);
                console.log('SmartExamData:', docData.smartExamData);
                console.log('Data:', docData.data);
            } else {
                console.log('❌ Документ текущего пользователя НЕ найден');
                console.log('Ищем документ с email:', user.email);
                
                // Ищем по email
                const emailQuery = await window.authSystem.firebaseSync.db
                    .collection('users')
                    .where('userData.email', '==', user.email)
                    .get();
                    
                console.log('Найдено по email:', emailQuery.docs.length);
                emailQuery.docs.forEach(doc => {
                    console.log(`Найден документ: ID=${doc.id}, Email=${doc.data().userData?.email}`);
                });
            }
        } catch (error) {
            console.error('Ошибка проверки Firebase:', error);
        }
    } else {
        console.log('❌ Firebase не доступен');
        console.log('firebaseSync:', window.authSystem.firebaseSync);
        console.log('db:', window.authSystem.firebaseSync?.db);
    }
    
    console.log('=== END DEBUG ===');
}

// Добавляем функцию в глобальную область
window.debugFirebase = debugFirebase;

// Автоматически запускаем проверку при входе
setTimeout(() => {
    if (window.authSystem && window.authSystem.isAuthenticated()) {
        debugFirebase();
    }
}, 2000);
