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
    // Аккаунт
    const tabAccount = document.createElement('button')
    tabAccount.type = 'button'
    tabAccount.className = 'kts-tab'
    tabAccount.dataset.tab = 'account'
    tabAccount.textContent = 'Аккаунт'
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
    tabs.appendChild(tabAccount)
    tabs.appendChild(tabAbout)
    header.appendChild(tabs)
    header.appendChild(closeButton)
    panel.appendChild(header)

    // Контент вкладки Отложенные
    const list = document.createElement('ul')
    list.id = 'watch-later-content'
    list.className = 'kts-watch-later-content'
    list.dataset.tabContent = 'list'

    // Контент вкладки Аккаунт
    const account = document.createElement('div')
    account.className = 'kts-account'
    account.dataset.tabContent = 'account'
    account.hidden = true

    function renderAccount() {
        account.innerHTML = ''
        chrome.storage.sync.get(["kts-userEmail"], (result) => {
            const email = result["kts-userEmail"]
            if (email) {
                renderAccountLoggedIn(account, email)
            } else {
                renderAccountLoggedOut(account)
            }
        })
    }

    function renderAccountLoggedIn(container, email) {
        const userBlock = document.createElement('div')
        userBlock.className = 'kts-account-user'

        const emailText = document.createElement('span')
        emailText.className = 'kts-account-email'
        emailText.textContent = email

        const logoutBtn = document.createElement('button')
        logoutBtn.type = 'button'
        logoutBtn.className = 'kts-account-btn'
        logoutBtn.textContent = 'Выйти'

        logoutBtn.addEventListener('click', () => {
            chrome.runtime.sendMessage({ type: "logout" }, () => {
                renderAccount()
            })
        })

        userBlock.appendChild(emailText)
        userBlock.appendChild(logoutBtn)
        container.appendChild(userBlock)
    }

    function renderAccountLoggedOut(container) {
        const btnRow = document.createElement('div')
        btnRow.className = 'kts-account-btn-row'

        const loginTabBtn = document.createElement('button')
        loginTabBtn.type = 'button'
        loginTabBtn.className = 'kts-account-tab-btn kts-account-tab-btn--active'
        loginTabBtn.textContent = 'Войти'

        const registerTabBtn = document.createElement('button')
        registerTabBtn.type = 'button'
        registerTabBtn.className = 'kts-account-tab-btn'
        registerTabBtn.textContent = 'Регистрация'

        btnRow.appendChild(loginTabBtn)
        btnRow.appendChild(registerTabBtn)
        container.appendChild(btnRow)

        const loginForm = document.createElement('form')
        loginForm.className = 'kts-account-form'

        const loginEmail = document.createElement('input')
        loginEmail.type = 'email'
        loginEmail.className = 'kts-account-input'
        loginEmail.placeholder = 'Email'
        loginEmail.required = true

        const loginPassword = document.createElement('input')
        loginPassword.type = 'password'
        loginPassword.className = 'kts-account-input'
        loginPassword.placeholder = 'Пароль'
        loginPassword.required = true

        const loginSubmit = document.createElement('button')
        loginSubmit.type = 'submit'
        loginSubmit.className = 'kts-account-btn'
        loginSubmit.textContent = 'Войти'

        const loginStatus = document.createElement('div')
        loginStatus.className = 'kts-account-status'
        loginStatus.hidden = true

        loginForm.appendChild(loginEmail)
        loginForm.appendChild(loginPassword)
        loginForm.appendChild(loginSubmit)
        loginForm.appendChild(loginStatus)

        const registerForm = document.createElement('form')
        registerForm.className = 'kts-account-form'
        registerForm.hidden = true

        const registerEmail = document.createElement('input')
        registerEmail.type = 'email'
        registerEmail.className = 'kts-account-input'
        registerEmail.placeholder = 'Email'
        registerEmail.required = true

        const registerPassword = document.createElement('input')
        registerPassword.type = 'password'
        registerPassword.className = 'kts-account-input'
        registerPassword.placeholder = 'Пароль'
        registerPassword.required = true

        const registerHint = document.createElement('div')
        registerHint.className = 'kts-account-hint'
        registerHint.textContent = 'Эти данные нужны только для входа, запомните их чтобы не потерять сохраненные фильмы'

        const registerSubmit = document.createElement('button')
        registerSubmit.type = 'submit'
        registerSubmit.className = 'kts-account-btn'
        registerSubmit.textContent = 'Зарегистрироваться'

        const registerStatus = document.createElement('div')
        registerStatus.className = 'kts-account-status'
        registerStatus.hidden = true

        registerForm.appendChild(registerEmail)
        registerForm.appendChild(registerPassword)
        registerForm.appendChild(registerHint)
        registerForm.appendChild(registerSubmit)
        registerForm.appendChild(registerStatus)

        container.appendChild(loginForm)
        container.appendChild(registerForm)

        loginTabBtn.addEventListener('click', () => {
            loginForm.hidden = false
            registerForm.hidden = true
            loginTabBtn.classList.add('kts-account-tab-btn--active')
            registerTabBtn.classList.remove('kts-account-tab-btn--active')
        })

        registerTabBtn.addEventListener('click', () => {
            registerForm.hidden = false
            loginForm.hidden = true
            registerTabBtn.classList.add('kts-account-tab-btn--active')
            loginTabBtn.classList.remove('kts-account-tab-btn--active')
        })

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const emailVal = loginEmail.value.trim()
            const passwordVal = loginPassword.value.trim()
            if (!emailVal || !passwordVal) return

            loginStatus.hidden = true
            loginSubmit.disabled = true
            loginSubmit.textContent = 'Вход...'

            chrome.runtime.sendMessage({ type: "login", email: emailVal, password: passwordVal }, (response) => {
                loginSubmit.disabled = false
                loginSubmit.textContent = 'Войти'
                if (response && response.success) {
                    renderAccount()
                } else {
                    loginStatus.textContent = response ? response.error : 'Ошибка соединения'
                    loginStatus.className = 'kts-account-status kts-account-status--error'
                    loginStatus.hidden = false
                }
            })
        })

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const emailVal = registerEmail.value.trim()
            const passwordVal = registerPassword.value.trim()
            if (!emailVal || !passwordVal) return

            registerStatus.hidden = true
            registerSubmit.disabled = true
            registerSubmit.textContent = 'Регистрация...'

            chrome.runtime.sendMessage({ type: "register", email: emailVal, password: passwordVal }, (response) => {
                registerSubmit.disabled = false
                registerSubmit.textContent = 'Зарегистрироваться'
                if (response && response.success) {
                    renderAccount()
                } else {
                    registerStatus.textContent = response ? response.error : 'Ошибка соединения'
                    registerStatus.className = 'kts-account-status kts-account-status--error'
                    registerStatus.hidden = false
                }
            })
        })
    }

    renderAccount()
    
    // Контент вкладки About
    // ---------------------
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
    const {version, date} = await getVersion()
    if (version && date) {
        versionBox.innerHTML = `V${version}<br>– ${date}`
    } else {
        versionBox.textContent = 'Ошибка загрузки версии'
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
    
    // ---------------------
    // Сборка контейнера
    aboutContainer.appendChild(leftColumn)
    aboutContainer.appendChild(rightColumn)
    about.appendChild(aboutContainer)
    
    about.hidden = true

    // Добавление в панель
    panel.appendChild(list)
    panel.appendChild(account)
    panel.appendChild(about)

    // Функция переключения вкладок
    function setPanelTab(tabName) {
        const tabs = panel.querySelectorAll('.kts-tab')
        const contents = panel.querySelectorAll('[data-tab-content]')

        // Скрытие
        tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabName
            tab.classList.toggle('kts-tab--active', isActive)
        })

        // Обтображение
        contents.forEach((content) => {
            const isCurrent = content.dataset.tabContent === tabName
            content.hidden = !isCurrent
        })
    }
    
    tabList.addEventListener('click', () => setPanelTab('list'))
    tabAccount.addEventListener('click', () => setPanelTab('account'))
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

async function syncWithBackend(list) {
    const serverMovies = await chrome.runtime.sendMessage({ type: "getAllMovies" })
    if (!serverMovies) return

    const toSync = mergeWatchLaterLists(serverMovies)

    // Отправляем на сервер фильмы, которых там нет
    for (const movie of toSync) {
        chrome.runtime.sendMessage({ type: "addMovie", movie })
    }

    // Перерисовываем список актуальными данными
    const merged = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    list.innerHTML = ''
    merged.forEach(movie => list.appendChild(watchLaterItem(movie)))
}
