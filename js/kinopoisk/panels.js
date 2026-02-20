/*
В файле логика для Панели с отложенными фильмами. 
----функции----
- WatchLaterPanel

*/


// ПАНЕЛЬ с отложенными фильмами
async function WatchLaterPanel() {
    // Проверка на наличие
    let panel = document.getElementById('kp-watch-later-panel')
    if (panel) {
        return panel
    }
    // Создание панели
    panel = document.createElement('div')
    panel.id = 'kp-watch-later-panel'
    panel.className = 'kts-watch-later-panel'

    // Хедер панели
    const header = document.createElement('div')
    header.className = 'kts-watch-later-header'
    
    // Блок вкладок
    const tabs = document.createElement('div')
    tabs.className = 'kts-tabs'

    // Табы
    // Отложенные 
    const tabList = document.createElement('button')
    tabList.type = 'button'
    tabList.className = 'kts-tab kts-tab--active'
    tabList.dataset.tab = 'list'
    tabList.textContent = 'Отложенные'
    // About
    const tabAbout = document.createElement('button')
    tabAbout.type = 'button'
    tabAbout.className = 'kts-tab'
    tabAbout.dataset.tab = 'about'
    tabAbout.textContent = 'About'

    // Кнопка закрытия панели
    const closeButton = document.createElement('button')
    closeButton.className = 'kts-watch-later-close'
    closeButton.addEventListener('click', () => {
        // Удаление
        panel.classList.remove('kts-watch-later-panel--open')
        // Обновление надписи на кнопке
        updateWhatchLaterButton()
    })

    tabs.appendChild(tabList)
    tabs.appendChild(tabAbout)
    header.appendChild(tabs)
    header.appendChild(closeButton)
    panel.appendChild(header)

    // Контент вкладки Отложенные
    const list = document.createElement('ul')
    list.id = 'watch-later-content'
    list.className = 'kts-watch-later-content'
    list.dataset.tabContent = 'list'
    
    // Контент вкладки About
    const about = document.createElement('div')
    about.id = 'watch-later-about'
    about.className = 'kts-watch-later-about'
    about.dataset.tabContent = 'about'
    
    // Создаем двухколоночный контейнер
    const aboutContainer = document.createElement('div')
    aboutContainer.className = 'kts-about-container'
    
    // Левая колонка
    const leftColumn = document.createElement('div')
    leftColumn.className = 'kts-about-column kts-about-column--left'
    
    const versionTitle = document.createElement('div')
    versionTitle.className = 'kts-version-title'
    versionTitle.textContent = 'Новейшая версия:'
    
    const versionBox = document.createElement('a')
    versionBox.className = 'kts-version-box'
    versionBox.href = 'https://github.com/BeNDYGo/Kinopoisk-To-Sspoisk/releases'
    versionBox.target = '_blank'
    // Получения актуальной версии проекта
    try {
        const response = await fetch('https://bendygo.github.io/Kinopoisk-To-Sspoisk-VersionAPI/version.json')
        const respons = await response.json()
        const version = respons.version
        const date = respons.date
        versionBox.innerHTML = `V${version}<br>– ${date}`
    } catch (error) {
        versionBox.textContent = 'Ошибка загрузки версии'
        console.error('Failed to fetch version:', error)
    }
    
    leftColumn.appendChild(versionTitle)
    leftColumn.appendChild(versionBox)
    
    // Правая колонка с контактами
    const rightColumn = document.createElement('div')
    rightColumn.className = 'kts-about-column kts-about-column--right'
    
    // Контактные ссылки
    const contactsContainer = document.createElement('div')
    contactsContainer.className = 'kts-contacts-container'
    
    const telegramLink = document.createElement('a')
    telegramLink.href = 'https://t.me/KinipoiskToSspoisk'
    telegramLink.target = '_blank'
    telegramLink.className = 'kts-contact-link'
    telegramLink.innerHTML = '<img src="https://cdn-icons-png.freepik.com/16/15047/15047595.png" alt="TG" width="16" height="16"> KinipoiskToSspoisk'
    
    const emailLink = document.createElement('a')
    emailLink.href = 'mailto:bendygo6@gmail.com'
    emailLink.className = 'kts-contact-link'
    emailLink.innerHTML = '<img src="https://cdn-icons-png.freepik.com/16/5968/5968534.png?ga=GA1.1.1230537149.1769259151" alt="Gmail" width="16" height="16"> bendygo6@gmail.com'
    
    contactsContainer.appendChild(telegramLink)
    contactsContainer.appendChild(emailLink)
    
    rightColumn.appendChild(contactsContainer)
    
    // Собираем контейнер
    aboutContainer.appendChild(leftColumn)
    aboutContainer.appendChild(rightColumn)
    about.appendChild(aboutContainer)
    
    about.hidden = true

    // Добавление в панель
    panel.appendChild(list)
    panel.appendChild(about)

    // Функция переключения вкладок
    function setPanelTab(tabName) {
        const tabs = panel.querySelectorAll('.kts-tab')
        const contents = panel.querySelectorAll('[data-tab-content]')

        // Переключаем активный таб
        tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabName
            tab.classList.toggle('kts-tab--active', isActive)
        })

        // Показываем только соответствующий контент
        contents.forEach((content) => {
            const isCurrent = content.dataset.tabContent === tabName
            content.hidden = !isCurrent
        })
    }
    
    tabList.addEventListener('click', () => setPanelTab('list'))
    tabAbout.addEventListener('click', () => setPanelTab('about'))
    
    // Инициализация
    setPanelTab('list')

    document.body.appendChild(panel)

    loadWatchLaterList() // Загрузка фильмов из localStorage
    
    return panel
}

// Загрузка списка отложенных фильмов
function loadWatchLaterList() {
    const list = document.getElementById('watch-later-content')
    const watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    
    // Очищаем список
    list.innerHTML = ''
    
    // Добавляем элементы в список и счет
    var count = 0
    watchLaterList.forEach((movie) => {
        const item = watchLaterItem(movie)
        list.appendChild(item)
        count++
    })
    console.log('Загружено ' + count + ' фильмов')
}
