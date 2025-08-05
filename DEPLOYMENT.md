# 🚀 Инструкции по развертыванию Telegram MiniApp

## 📋 Предварительные требования

### Для локального тестирования:
- Python 3.x или Node.js
- Современный веб-браузер (Chrome, Firefox, Safari, Edge)

### Для развертывания в Telegram:
- Telegram аккаунт
- Доступ к @BotFather
- Хостинг для статических файлов

## 🔧 Локальный запуск

### Вариант 1: Python HTTP Server
```bash
# Перейдите в директорию проекта
cd doctordom

# Запустите сервер
python -m http.server 8000

# Откройте в браузере
# http://localhost:8000
```

### Вариант 2: Node.js HTTP Server
```bash
# Установите http-server глобально
npm install -g http-server

# Перейдите в директорию проекта
cd doctordom

# Запустите сервер
http-server -p 8000

# Откройте в браузере
# http://localhost:8000
```

### Вариант 3: Live Server (VS Code)
1. Установите расширение "Live Server" в VS Code
2. Откройте файл `index.html`
3. Нажмите "Go Live" в статусной строке

## 🌐 Развертывание на хостинге

### GitHub Pages

1. **Создайте репозиторий:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/telegram-miniapp.git
   git push -u origin main
   ```

2. **Настройте GitHub Pages:**
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **URL будет доступен по адресу:**
   ```
   https://username.github.io/telegram-miniapp/
   ```

### Netlify

1. **Загрузите файлы:**
   - Перетащите папку `doctordom` на [netlify.com](https://netlify.com)
   - Или подключите GitHub репозиторий

2. **Настройте домен:**
   - Netlify автоматически создаст домен вида: `random-name.netlify.app`
   - Можно настроить кастомный домен

### Vercel

1. **Установите Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Разверните проект:**
   ```bash
   cd doctordom
   vercel
   ```

3. **Следуйте инструкциям в терминале**

## 🤖 Настройка Telegram Bot

### 1. Создание бота

1. **Найдите @BotFather в Telegram**
2. **Отправьте команду:** `/newbot`
3. **Следуйте инструкциям:**
   - Введите имя бота (например: "АвтоЗапчасти")
   - Введите username бота (например: `autoparts_bot`)
4. **Сохраните токен бота**

### 2. Настройка Web App

1. **Отправьте команду:** `/setmenubutton`
2. **Выберите вашего бота**
3. **Введите текст кнопки:** "Открыть магазин"
4. **Введите URL вашего приложения:**
   ```
   https://your-domain.com/
   ```

### 3. Альтернативный способ (Inline Keyboard)

```javascript
// Пример кода для создания inline кнопки
const keyboard = {
    inline_keyboard: [[
        {
            text: "🛒 Открыть магазин",
            web_app: { url: "https://your-domain.com/" }
        }
    ]]
};
```

## 📱 Тестирование в Telegram

### 1. Проверка Web App
1. Найдите вашего бота в Telegram
2. Нажмите кнопку "Открыть магазин"
3. Приложение должно открыться в Telegram

### 2. Тестирование функций
- Проверьте навигацию между экранами
- Протестируйте добавление товаров в корзину
- Проверьте оформление заказа
- Убедитесь в работе избранного
- Протестируйте поиск товаров

### 3. Мобильное тестирование
- Проверьте на реальном мобильном устройстве
- Убедитесь в корректности touch-событий
- Проверьте адаптивность дизайна

## 🔍 Отладка

### Проблемы с загрузкой
1. **Проверьте консоль браузера** (F12)
2. **Убедитесь в корректности URL** в настройках бота
3. **Проверьте CORS настройки** на хостинге

### Проблемы с Telegram API
1. **Проверьте токен бота**
2. **Убедитесь в правильности настройки Web App URL**
3. **Проверьте права бота**

### Проблемы с производительностью
1. **Используйте инструменты разработчика**
2. **Проверьте размер файлов**
3. **Убедитесь в оптимизации изображений**

## 📊 Мониторинг

### Аналитика
- Настройте Google Analytics
- Добавьте метрики производительности
- Отслеживайте ошибки пользователей

### Логирование
```javascript
// Пример логирования ошибок
window.addEventListener('error', (e) => {
    console.error('Ошибка приложения:', e.error);
    // Отправка на сервер аналитики
});
```

## 🔒 Безопасность

### HTTPS
- **Обязательно используйте HTTPS** для продакшена
- Telegram требует HTTPS для Web Apps

### Валидация данных
- Проверяйте все пользовательские данные
- Используйте санитизацию входных данных

### CORS
- Настройте правильные CORS заголовки
- Ограничьте доступ только с Telegram доменов

## 📈 Оптимизация

### Производительность
- Минифицируйте CSS и JavaScript
- Оптимизируйте изображения
- Используйте кэширование

### SEO
- Добавьте мета-теги
- Настройте Open Graph
- Оптимизируйте для поисковых систем

## 🆘 Поддержка

### Полезные ресурсы
- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Web App Documentation](https://core.telegram.org/bots/webapps)
- [Telegram BotFather](https://t.me/botfather)

### Сообщество
- [Telegram Bot Developers](https://t.me/botdevelopers)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/telegram-bot)

---

**Удачного развертывания! 🎉** 