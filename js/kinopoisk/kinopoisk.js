function KinopoiskSkript() {
    const headDiv = document.querySelector('[class*="styles_userContainer__"]')
    if (!headDiv) return

    if (!headDiv.querySelector('.kts-header-btn')) {
        headDiv.appendChild(WatchLaterListButton())
    }

    if (window.location.pathname === '/') return
    if (document.getElementById('custom-watch-button')) return

    // Поиск элементов на странице фильма
    const h1 = document.querySelector('h1[itemprop="name"]')
    if (!h1) return

    const subDiv = h1.nextElementSibling
    if (!subDiv) return

    const spans = subDiv.querySelectorAll('span')
    const ageSpan = Array.from(spans).find(span => span.textContent.match(/^\d+\+$/))
    if (!ageSpan) return

    // Контейнер с кнопками
    const buttonContainer = ButtonContainer()
    buttonContainer.appendChild(WatchButton())
    buttonContainer.appendChild(WatchLaterButton())

    ageSpan.after(buttonContainer)
}

// Первый запуск (document_idle гарантирует наличие DOM)
try {
    KinopoiskSkript()
    console.log('[KP] скрипт запущен')
} catch (e) {
    console.log('[KP] Не запустился')
}

// Отслеживание DOM-изменений для SPA-навигации и ре-рендеров React
let throttleTimer

new MutationObserver(() => {
    if (throttleTimer) return
    throttleTimer = setTimeout(() => {
        throttleTimer = null
        try {
            KinopoiskSkript()
        } catch (e) {
            // элементы ещё не готовы
        }
    }, 300)
}).observe(document.body, { childList: true, subtree: true })
