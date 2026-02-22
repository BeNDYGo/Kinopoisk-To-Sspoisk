/*
Весь файл это главный скрипт.
Он находит нужные элементы для встраивания кнопок
А так же логиа постоянно запуска расширения
Так же тут происходит обработка race condition
Получения актуальной версии проекта
*/

// Приходиться использовать mtx из-за race condition
let isKinopoiskScriptRunning = false

// Переменные версии
let curentVersion = null
const manifest = chrome.runtime.getManifest() // получение версии
curentVersion = manifest.version // получение версии
console.log('V', curentVersion)
window.curentVersion = curentVersion 
let latestVersion = {version: null, date: null}

// функция возвращает актуальную версию расширения и кеширует ее
async function getVersion(){
    if (latestVersion.version === null) {
        try {
            const response = await fetch('https://bendygo.github.io/Kinopoisk-To-Sspoisk-VersionAPI/version.json')
            const respons = await response.json()
            const version = respons.version
            const date = respons.date
            latestVersion = {version, date}
            return latestVersion
        } catch (error) {
            console.error('Ошибка получения версии:', error)
            return {version: null, date: null}
        }
    } else {
        return latestVersion
    }
}
window.getVersion = getVersion

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
            const versionLabel = await VersionLabel()
            if (versionLabel) {
                buttonContainer.appendChild(versionLabel)
            }
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
        console.error('[KP] Не запустился', e)
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
