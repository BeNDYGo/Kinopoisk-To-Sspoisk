const VERSION_API_URL = 'https://bendygo.github.io/Kinopoisk-To-Sspoisk-VersionAPI/version.json'

async function initPopup() {
    const installedVersion = chrome.runtime.getManifest().version
    const installedVersionElement = document.getElementById('installed-version')
    const updateNotice = document.getElementById('update-notice')

    installedVersionElement.textContent = `V${installedVersion}`

    try {
        const response = await fetch(VERSION_API_URL)
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const { version: latestVersion } = await response.json()
        if (latestVersion && latestVersion !== installedVersion) {
            updateNotice.textContent = `Вышла новая версия V${latestVersion}`
            updateNotice.hidden = false
        }
    } catch (error) {
        console.error('Ошибка получения актуальной версии:', error)
    }
}

initPopup()
