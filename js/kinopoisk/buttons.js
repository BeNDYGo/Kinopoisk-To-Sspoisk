/*
В файле Собраны кнопки. По названиями понятно
----функции----
- ButtonContainer
- WatchButton
- WatchLaterButton
- WatchLaterListButton
- 
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
function WatchLaterButton() {
    const button = document.createElement('button')
    button.id = 'whatch-later-button'
    button.className = 'kts-watch-later-label'
    button.type = 'button'
    
    // Проверка на наличие фильма в списке
    const panel = WatchLaterPanel()
    const list = panel.querySelector('#watch-later-content')

    const currentUrl = window.location.href;
    const existingItem = Array.from(list.querySelectorAll('.kts-watch-later-item'))
        .find(item => item.dataset.id === currentUrl)

    // Текст в зависимости от наличия
    if (existingItem) {
        button.textContent = 'Не буду смотреть'
    } else {
        button.textContent = 'Смотреть позже'
    }

    // Обработчик
    button.addEventListener('click', () => {
        // Проверка на наличие в списке
        const currentUrl = window.location.href;
        const existingItem = Array.from(list.querySelectorAll('.kts-watch-later-item'))
            .find(item => item.dataset.id === currentUrl)
        
        if (existingItem) {
            // Удаление из списка
            existingItem.remove()
            removeWatchLaterLocalStorage({ url: currentUrl })
            button.textContent = 'Смотреть позже'
        } else {
            // Добавление в список
            const openMovie = {
                url: currentUrl,
                poster: document.querySelector('[class*="styles_posterContainer__"]').querySelector('img').src,
                title: document.querySelector('h1[itemprop="name"]').textContent
            }
            const moviesList = document.getElementById('watch-later-content')
            const liMovie = watchLaterItem(openMovie)
            moviesList.appendChild(liMovie)
            addWatchLaterLocalStorage(openMovie)
            button.textContent = 'Не буду смотреть'
        }
    })
    return button
}

// Кнопка в шапке со списком
function WatchLaterListButton() {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'kts-header-btn'

    button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"></path>
        </svg>
    `

    button.addEventListener('click', () => {
        const panel = WatchLaterPanel()
        const isOpen = panel.classList.contains('kts-watch-later-panel--open')
        panel.classList.toggle('kts-watch-later-panel--open', !isOpen)
    })

    return button
}
