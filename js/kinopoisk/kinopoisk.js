/*
Весь файл это главный скрипт.
Он находит нужные элементы для встраивания кнопок
А так же логиа постоянно запуска расширения
*/

// Приходиться использовать mtx из-за race condition
let isKinopoiskScriptRunning = false

async function KinopoiskSkript() {
    // Гонка данных
    if (isKinopoiskScriptRunning) return
    isKinopoiskScriptRunning = true
    
    try {
        const headDiv = document.querySelector('[class*="styles_userContainer__"]')
        if (!headDiv) return

        // Вставка Меню
        if (!headDiv.querySelector('.kts-header-btn')) {
            headDiv.appendChild(await WatchLaterListButton())
        }

        if (window.location.pathname === '/') return

        const h1 = document.querySelector('h1[itemprop="name"]')
        if (!h1) return

        const subDiv = h1.nextElementSibling
        if (!subDiv) return
        
        // Заполнение контейнера и вставка
        if (!document.querySelector('.kts-btn-container')) {
            const buttonContainer = ButtonContainer()
            buttonContainer.appendChild(WatchButton())
            buttonContainer.appendChild(await WatchLaterButton())
            subDiv.after(buttonContainer)
        }
    } finally {
        // Разблокировка
        isKinopoiskScriptRunning = false
    }
}

(async () => {
    try {
        await KinopoiskSkript()
        console.log('[KP] скрипт запущен')
    } catch (e) {
        console.log('[KP] Не запустился')
    }
})()

let throttleTimer

new MutationObserver(() => {
    if (throttleTimer) return
    throttleTimer = setTimeout(async () => {
        throttleTimer = null
        try {
            await KinopoiskSkript()
        } catch (e) {
            // элементы ещё не готовы
        }
    }, 300)
}).observe(document.body, { childList: true, subtree: true })
