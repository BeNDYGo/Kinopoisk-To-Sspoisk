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

    panel.innerHTML = `
        <div class="kts-watch-later-header">
            <div class="kts-tabs">
                <button type="button" class="kts-tab kts-tab--active" data-tab="list">Отложенные</button>
                <button type="button" class="kts-tab" data-tab="account">Аккаунт</button>
                <button type="button" class="kts-tab" data-tab="about">About</button>
            </div>
            <button class="kts-watch-later-close"></button>
        </div>
        <ul id="watch-later-content" class="kts-watch-later-content" data-tab-content="list"></ul>
        <div class="kts-account" data-tab-content="account" hidden></div>
        <div id="watch-later-about" class="kts-watch-later-about" data-tab-content="about" hidden>
            <div class="kts-about-container">
                <div class="kts-about-column kts-about-column--left">
                    <div class="kts-version-title">Новейшая версия:</div>
                    <a class="kts-version-box" href="https://github.com/BeNDYGo/Kinopoisk-To-Sspoisk/releases" target="_blank" id="kts-version-box">...</a>
                </div>
                <div class="kts-about-column kts-about-column--right">
                    <div class="kts-contacts-container">
                        <a href="https://t.me/KinipoiskToSspoisk" target="_blank" class="kts-contact-link">
                            <img src="https://cdn-icons-png.freepik.com/16/15047/15047595.png" alt="TG" width="16" height="16"> KinipoiskToSspoisk
                        </a>
                        <a href="mailto:bendygo6@gmail.com" class="kts-contact-link">
                            <img src="https://cdn-icons-png.freepik.com/16/5968/5968534.png" alt="Gmail" width="16" height="16"> bendygo6@gmail.com
                        </a>
                        <a href="https://boosty.to/kinopoisktosspoisk" target="_blank" class="kts-contact-link">
                            <img src="https://cdn-icons-png.magnific.com/16/10880/10880476.png" alt="Donate" width="16" height="16"> Boosty
                        </a>
                        <a href="https://www.donationalerts.com/r/pipodripo" target="_blank" class="kts-contact-link">
                            <img src="https://cdn-icons-png.magnific.com/16/10880/10880476.png" alt="Donate" width="16" height="16"> Donationalerts
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `

    // Ссылки на элементы
    const closeButton = panel.querySelector('.kts-watch-later-close')
    const tabList = panel.querySelector('[data-tab="list"]')
    const tabAccount = panel.querySelector('[data-tab="account"]')
    const tabAbout = panel.querySelector('[data-tab="about"]')
    const account = panel.querySelector('.kts-account')
    const versionBox = panel.querySelector('#kts-version-box')

    // Кнопка закрытия панели
    closeButton.addEventListener('click', () => {
        panel.classList.remove('kts-watch-later-panel--open')
        updateWhatchLaterButton()
    })

    // Контент вкладки Аккаунт
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
        container.innerHTML = `
            <div class="kts-account-user">
                <span class="kts-account-email">${email}</span>
                <button type="button" class="kts-account-btn">Выйти</button>
            </div>
        `
        container.querySelector('.kts-account-btn').addEventListener('click', () => {
            chrome.runtime.sendMessage({ type: "logout" }, () => {
                renderAccount()
            })
        })
    }

    function renderAccountLoggedOut(container) {
        container.innerHTML = `
            <div class="kts-account-btn-row">
                <button type="button" class="kts-account-tab-btn kts-account-tab-btn--active" data-auth-tab="register">Регистрация</button>
                <button type="button" class="kts-account-tab-btn" data-auth-tab="login">Войти</button>
            </div>
            <form class="kts-account-form" data-auth-form="register">
                <input type="email" class="kts-account-input" placeholder="Email" required>
                <input type="password" class="kts-account-input" placeholder="Пароль" required>
                <div class="kts-account-hint">Эти данные нужны только для входа в аккаунт, никакие уведомления на почту отсылаться не будут</div>
                <button type="submit" class="kts-account-btn">Зарегистрироваться</button>
                <div class="kts-account-status" hidden></div>
            </form>
            <form class="kts-account-form" data-auth-form="login" hidden>
                <input type="email" class="kts-account-input" placeholder="Email" required>
                <input type="password" class="kts-account-input" placeholder="Пароль" required>
                <button type="submit" class="kts-account-btn">Войти</button>
                <div class="kts-account-status" hidden></div>
            </form>
        `

        const registerTabBtn = container.querySelector('[data-auth-tab="register"]')
        const loginTabBtn = container.querySelector('[data-auth-tab="login"]')
        const registerForm = container.querySelector('[data-auth-form="register"]')
        const loginForm = container.querySelector('[data-auth-form="login"]')

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
            const emailVal = loginForm.querySelector('input[type="email"]').value.trim()
            const passwordVal = loginForm.querySelector('input[type="password"]').value.trim()
            if (!emailVal || !passwordVal) return

            const status = loginForm.querySelector('.kts-account-status')
            const submitBtn = loginForm.querySelector('button[type="submit"]')
            status.hidden = true
            submitBtn.disabled = true
            submitBtn.textContent = 'Вход...'

            chrome.runtime.sendMessage({ type: "login", email: emailVal, password: passwordVal }, (response) => {
                submitBtn.disabled = false
                submitBtn.textContent = 'Войти'
                if (response && response.success) {
                    renderAccount()
                } else {
                    status.textContent = response ? response.error : 'Ошибка соединения'
                    status.className = 'kts-account-status kts-account-status--error'
                    status.hidden = false
                }
            })
        })

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const emailVal = registerForm.querySelector('input[type="email"]').value.trim()
            const passwordVal = registerForm.querySelector('input[type="password"]').value.trim()
            if (!emailVal || !passwordVal) return

            const status = registerForm.querySelector('.kts-account-status')
            const submitBtn = registerForm.querySelector('button[type="submit"]')
            status.hidden = true
            submitBtn.disabled = true
            submitBtn.textContent = 'Регистрация...'

            chrome.runtime.sendMessage({ type: "register", email: emailVal, password: passwordVal }, (response) => {
                submitBtn.disabled = false
                submitBtn.textContent = 'Зарегистрироваться'
                if (response && response.success) {
                    renderAccount()
                } else {
                    status.textContent = response ? response.error : 'Ошибка соединения'
                    status.className = 'kts-account-status kts-account-status--error'
                    status.hidden = false
                }
            })
        })
    }

    renderAccount()

    // Получение актуальной версии проекта
    const {version, date} = await getVersion()
    if (version && date) {
        versionBox.innerHTML = `V${version}<br>– ${date}`
    } else {
        versionBox.textContent = 'Ошибка загрузки версии'
    }

    // Функция переключения вкладок
    function setPanelTab(tabName) {
        const tabs = panel.querySelectorAll('.kts-tab')
        const contents = panel.querySelectorAll('[data-tab-content]')

        tabs.forEach((tab) => {
            const isActive = tab.dataset.tab === tabName
            tab.classList.toggle('kts-tab--active', isActive)
        })

        contents.forEach((content) => {
            const isCurrent = content.dataset.tabContent === tabName
            content.hidden = !isCurrent
        })
    }
    
    tabList.addEventListener('click', () => setPanelTab('list'))
    tabAccount.addEventListener('click', () => setPanelTab('account'))
    tabAbout.addEventListener('click', () => setPanelTab('about'))
    
    setPanelTab('list')

    document.body.appendChild(panel)

    loadWatchLaterList()
    
    return panel
}

// Загрузка списка отложенных фильмов
function loadWatchLaterList() {
    const list = document.getElementById('watch-later-content')
    const watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    
    list.innerHTML = ''
    
    var count = 0
    watchLaterList.forEach((movie) => {
        const item = watchLaterItem(movie)
        list.appendChild(item)
        count++
    })
    console.log('Загружено ' + count + ' фильмов')
}

async function syncWithBackend(list) {
    try {
        const serverMovies = await chrome.runtime.sendMessage({ type: "getAllMovies" })
        if (!serverMovies) return

        const toSync = mergeWatchLaterLists(serverMovies)

        for (const movie of toSync) {
            chrome.runtime.sendMessage({ type: "addMovie", movie })
        }

        const merged = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
        list.innerHTML = ''
        merged.forEach(movie => list.appendChild(watchLaterItem(movie)))
    } catch (e) {
        // Extension context invalidated — расширение перезагрузилось
    }
}
