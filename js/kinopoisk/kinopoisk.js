/*
Весь файл это главный скрипт.
Он находит нужные элементы для встраивания кнопок
А так же логиа постоянно запуска расширения
*/



async function KinopoiskSkript() {
    const headDiv = document.querySelector('[class*="styles_userContainer__"]')
    if (!headDiv) return

    if (!headDiv.querySelector('.kts-header-btn')) {
        headDiv.appendChild(await WatchLaterListButton())
    }

    if (window.location.pathname === '/') return
    if (document.getElementById('custom-watch-button')) return

    // Поиск элементов на странице фильма
    const h1 = document.querySelector('h1[itemprop="name"]')
    if (!h1) return

    const subDiv = h1.nextElementSibling
    if (!subDiv) return
    
    // Проверка на наличие контейнера с кнопками
    if (document.querySelector('.kts-btn-container')) return
    
    // Контейнер с кнопками
    const buttonContainer = ButtonContainer()
    buttonContainer.appendChild(WatchButton())
    buttonContainer.appendChild(await WatchLaterButton())

    subDiv.after(buttonContainer)
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
