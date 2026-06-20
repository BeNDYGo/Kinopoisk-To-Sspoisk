const manifest = chrome.runtime.getManifest()
const currentVersion = manifest.version

const versionEl = document.getElementById('popup-version')
const updateNote = document.getElementById('popup-update-note')
const updateVersion = document.getElementById('popup-update-version')

versionEl.textContent = `V${currentVersion}`

fetch('https://bendygo.github.io/Kinopoisk-To-Sspoisk-VersionAPI/version.json')
    .then(res => res.json())
    .then(data => {
        if (data.version !== currentVersion) {
            updateVersion.textContent = `V${data.version}`
            updateNote.hidden = false
        }
    })
    .catch(() => {})

// Auth state
const authButtons = document.getElementById('popup-auth-buttons')
const userInfo = document.getElementById('popup-user-info')
const userEmail = document.getElementById('popup-user-email')
const logoutBtn = document.getElementById('popup-logout-btn')

function checkAuthState() {
    chrome.storage.sync.get(["kts-userEmail"], (result) => {
        const email = result["kts-userEmail"]
        if (email) {
            authButtons.hidden = true
            userInfo.hidden = false
            userEmail.textContent = email
        } else {
            authButtons.hidden = false
            userInfo.hidden = true
        }
    })
}

checkAuthState()

logoutBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: "logout" }, () => {
        checkAuthState()
    })
})

// Registration
const registerBtn = authButtons.querySelectorAll('.popup-btn')[1]
const registerForm = document.getElementById('popup-register-form')
const registerEmail = document.getElementById('popup-register-email')
const registerPassword = document.getElementById('popup-register-password')
const registerStatus = document.getElementById('popup-register-status')

registerBtn.addEventListener('click', () => {
    const willOpen = registerForm.hidden
    registerForm.hidden = !willOpen
    loginForm.hidden = true
    registerStatus.hidden = true
    loginStatus.hidden = true
})

registerForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = registerEmail.value.trim()
    const password = registerPassword.value.trim()

    if (!email || !password) return

    registerStatus.hidden = true

    chrome.runtime.sendMessage({ type: "register", email, password }, (response) => {
        if (response && response.success) {
            registerStatus.textContent = response.message || 'Регистрация успешна'
            registerStatus.className = 'popup-form-status popup-form-status--success'
            registerStatus.hidden = false
            registerForm.hidden = true
            checkAuthState()
        } else {
            registerStatus.textContent = response ? response.error : 'Ошибка соединения'
            registerStatus.className = 'popup-form-status popup-form-status--error'
            registerStatus.hidden = false
        }
    })
})

// Login
const loginBtn = authButtons.querySelectorAll('.popup-btn')[0]
const loginForm = document.getElementById('popup-login-form')
const loginEmail = document.getElementById('popup-login-email')
const loginPassword = document.getElementById('popup-login-password')
const loginStatus = document.getElementById('popup-login-status')

loginBtn.addEventListener('click', () => {
    const willOpen = loginForm.hidden
    loginForm.hidden = !willOpen
    registerForm.hidden = true
    loginStatus.hidden = true
    registerStatus.hidden = true
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginEmail.value.trim()
    const password = loginPassword.value.trim()

    if (!email || !password) return

    loginStatus.hidden = true

    chrome.runtime.sendMessage({ type: "login", email, password }, (response) => {
        if (response && response.success) {
            loginStatus.textContent = response.message || 'Вход выполнен'
            loginStatus.className = 'popup-form-status popup-form-status--success'
            loginStatus.hidden = false
            loginForm.hidden = true
            checkAuthState()
        } else {
            loginStatus.textContent = response ? response.error : 'Ошибка соединения'
            loginStatus.className = 'popup-form-status popup-form-status--error'
            loginStatus.hidden = false
        }
    })
})
