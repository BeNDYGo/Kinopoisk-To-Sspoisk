/*
Определение почты аккаунта Кинопоиска.
Почта сохраняется в localStorage под ключом email.
*/

const EMAIL_STORAGE_KEY = 'email'

// Очистка для теста
localStorage.removeItem(EMAIL_STORAGE_KEY)

const PROFILE_BUTTON_SELECTOR = 'button[aria-label="Меню профиля"]'
const PROFILE_DROPDOWN_SELECTOR = 'div[class*="styles_dropdown"]'

let emailDetectionTimer = null
let isProfileHovered = false
let isDropdownLogged = false

// Извлекает email из текста формата "***‒** • example@mail.com"
function extractEmailFromText(text) {
    if (!text.includes('***‒**') || !text.includes('•')) return null

    return text.split('•').pop().trim() || null
}

// Ищет email в span элементах внутри dropdown
function findEmail(dropdown) {
    const spans = dropdown.querySelectorAll('span')
    console.log('[KTS email] найдено span элементов:', spans.length)
    
    if (spans.length === 0) {
        console.log('[KTS email] innerHTML dropdown:', dropdown.innerHTML)
    }

    for (const span of spans) {
        console.log('[KTS email] текст span:', span.textContent.trim())
        const email = extractEmailFromText(span.textContent.trim())
        if (email) return email
    }

    return null
}

// Открывает меню профиля кликом, затем закрывает через 1 секунду
function expandProfileMenu(button) {
    console.log('[KTS email] клик по кнопке профиля')
    button.click()
    
    setTimeout(() => {
        console.log('[KTS email] закрытие меню профиля')
        button.click()
    }, 100)
}

// Останавливает интервал проверки email
function stopEmailDetection() {
    clearInterval(emailDetectionTimer)
    emailDetectionTimer = null
}

// Проверяет наличие email в dropdown, если dropdown пустой - открывает меню профиля
function checkEmail() {
    if (localStorage.getItem(EMAIL_STORAGE_KEY)) {
        stopEmailDetection()
        return
    }

    const button = document.querySelector(PROFILE_BUTTON_SELECTOR)
    if (!button) return

    const dropdown = document.querySelector(PROFILE_DROPDOWN_SELECTOR)
    if (!dropdown) return

    if (!isDropdownLogged) {
        isDropdownLogged = true
        console.log('[KTS email] dropdown найден, дочерних элементов:', dropdown.children.length)
    }

    const innerMenu = dropdown.querySelector('div[class*="styles_dropdownMenu"]')
    if (!innerMenu || !innerMenu.children.length) {
        if (!isProfileHovered) {
            isProfileHovered = true
            expandProfileMenu(button)
        }
        return
    }
    
    expandProfileMenu(button)
    const email = findEmail(dropdown)
    console.log('[KTS email] поиск email, результат:', email)
    if (!email) return

    localStorage.setItem(EMAIL_STORAGE_KEY, email)
    console.log('[KTS email] сохранено', email)
    stopEmailDetection()
}

// Запускает процесс определения и сохранения email с интервалом 300ms
function detectAndSaveEmail() {
    if (localStorage.getItem(EMAIL_STORAGE_KEY)) return
    if (emailDetectionTimer) return

    console.log('[KTS email] запуск определения email')
    checkEmail()
    emailDetectionTimer = setInterval(checkEmail, 300)
}
