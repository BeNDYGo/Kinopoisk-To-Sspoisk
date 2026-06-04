/*
В файле Собраны кнопки. По названиями понятно
----функции----
- ButtonContainer
- WatchButton
- WatchLaterButton
- WatchLaterListButton

openMovie = {
    url: currentUrl,
    poster: document.querySelector('[class*="styles_posterContainer__"]').querySelector('img').src,
    title: document.querySelector('h1[itemprop="name"]').textContent
}

*/



// Контейнер кнопок на странице фильма
function ButtonContainer() {
    const container = document.createElement('div')
    container.className = 'kts-btn-container'
    return container
}

// Кнопка «Смотреть бесплатно»
function WatchButton() {
    const button = document.createElement('button')
    button.id = 'custom-watch-button'
    button.className = 'kts-watch-btn'
    button.textContent = 'Смотреть бесплатно'

    button.addEventListener('click', (e) => {
        const url = new URL(window.location.href)
        url.hostname = 'flcksbr.top'
        const target = e.ctrlKey || e.metaKey ? '_blank' : '_self'
        window.open(url.toString(), target)
    })

    return button
}

// Кнопка «Смотреть позже»
async function WatchLaterButton() {
    const button = document.createElement('button')
    button.id = 'whatch-later-button'
    button.className = 'kts-watch-later-label'
    button.type = 'button'

    const panel = await WatchLaterPanel()
    const list = panel.querySelector('#watch-later-content')

    const currentUrl = window.location.href;
    const hasMovie = isInWatchLater(currentUrl)

    if (hasMovie) {
        button.textContent = 'Не буду смотреть'
    } else {
        button.textContent = 'Смотреть позже'
    }

    button.addEventListener('click', () => {
        const currentUrl = window.location.href;
        const hasMovie = isInWatchLater(currentUrl)
        
        if (hasMovie) {
            const item = list.querySelector(`.kts-watch-later-item[data-id="${CSS.escape(currentUrl)}"]`)
            if (item) item.remove()
            removeWatchLaterLocalStorage({ url: currentUrl })
            button.textContent = 'Смотреть позже'
        } else {
            const openMovie = {
                url: currentUrl,
                poster: document.querySelector('[class*="styles_posterContainer__"]').querySelector('img').src,
                title: document.querySelector('h1[itemprop="name"]').textContent
            }
            const liMovie = watchLaterItem(openMovie)
            list.appendChild(liMovie)
            addWatchLaterLocalStorage(openMovie)
            button.textContent = 'Не буду смотреть'
        }
    })
    return button
}

// Кнопка в шапке со списком
async function WatchLaterListButton() {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'kts-header-btn'

    button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"></path>
        </svg>
    `

    button.addEventListener('click', async () => {
        const panel = await WatchLaterPanel()
        const isOpen = panel.classList.contains('kts-watch-later-panel--open')
        panel.classList.toggle('kts-watch-later-panel--open', !isOpen)
    })

    return button
}

// функция возвращает уведомление, если версия расширения устарела
async function VersionLabel(){
    const currentVersion = await getVersion()
    if (currentVersion.version === window.curentVersion) {
        return null
    } else {
        const version = document.createElement('span')
        version.className = 'kts-version'
        version.textContent = `*Вышла новая версия расширения ${currentVersion.version}. Пожалуйста, зайдите в Меню расширения -> About и скачайте новую версию.`
        return version
    }
}
