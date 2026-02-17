/*
В файле логика для Панели с отложенными фильмами. 
----функции----
- WatchLaterPanel

*/


// ПАНЕЛЬ с отложенными фильмами
function WatchLaterPanel() {
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
    about.textContent = 'Здесь можно вывести описание расширения, ссылку на репозиторий, инструкции и т.п.'
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

    return panel
}
