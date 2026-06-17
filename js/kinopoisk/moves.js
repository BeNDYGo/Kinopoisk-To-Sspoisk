/*
В файле создание элемента с фильмом в панели с отложенными фильмами и обновление кнопки "Смотреть позже"
после действий в панели
----функции----
- getFilmId
- watchLaterItem
- updateWhatchLaterButton
- isInWatchLater
- addWatchLaterLocalStorage
- removeWatchLaterLocalStorage
- mergeWatchLaterLists
*/

function getFilmId(url) {
    const match = url.match(/\/(film|series)\/(\d+)/)
    if (!match) return null
    return match[2]
}

function getContentType(url) {
    const match = url.match(/\/(film|series)\/(\d+)/)
    if (!match) return null
    return match[1]
}

function migrateWatchLaterList() {
    const list = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    let changed = false

    for (const movie of list) {
        if (!movie.filmId) {
            movie.filmId = getFilmId(movie.url)
            changed = true
        }
        if (!movie.type) {
            movie.type = getContentType(movie.url)
            changed = true
        }
    }

    if (changed) {
        localStorage.setItem('kts-watch-later', JSON.stringify(list))
    }
}

migrateWatchLaterList()

function watchLaterItem(movie) {
    const li = document.createElement('li')
    li.className = 'kts-watch-later-item'
    li.dataset.id = movie.filmId

    const img = document.createElement('img')
    img.src = movie.poster
    img.alt = movie.title

    const title = document.createElement('div')
    title.className = 'kts-watch-later-title'
    title.textContent = movie.title

    const removeBtn = document.createElement('button')
    removeBtn.className = 'kts-watch-later-remove'

    removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation()
        li.remove()
        removeWatchLaterLocalStorage(movie)
        chrome.runtime.sendMessage({ type: "delMovie", movie })
        await updateWhatchLaterButton()
    })

    li.addEventListener('click', () => {
        window.location.href = `https://www.kinopoisk.ru/${movie.type}/${movie.filmId}/`
    })

    li.appendChild(img)
    li.appendChild(title)
    li.appendChild(removeBtn)

    return li
}

async function updateWhatchLaterButton() {
    const button = document.getElementById('whatch-later-button')
    if (!button) return

    const hasMovie = isInWatchLater(window.location.href)

    if (hasMovie) {
        button.textContent = 'Не буду смотреть'
    } else {
        button.textContent = 'Смотреть позже'
    }
}

function isInWatchLater(url) {
    const filmId = getFilmId(url)
    if (!filmId) return false
    const watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    return watchLaterList.some(item => item.filmId === filmId)
}

function addWatchLaterLocalStorage(movie) {
    let watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    if (isInWatchLater(movie.url)) return
    watchLaterList.push(movie)
    localStorage.setItem('kts-watch-later', JSON.stringify(watchLaterList))
}

function removeWatchLaterLocalStorage(movie) {
    let watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    watchLaterList = watchLaterList.filter(item => item.filmId !== movie.filmId)
    localStorage.setItem('kts-watch-later', JSON.stringify(watchLaterList))
}

function mergeWatchLaterLists(serverMovies) {
    const localMovies = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    const merged = [...serverMovies]

    const serverIds = new Set(serverMovies.map(m => m.filmId))

    const toSync = []
    for (const movie of localMovies) {
        if (!serverIds.has(movie.filmId)) {
            merged.push(movie)
            toSync.push(movie)
        }
    }

    localStorage.setItem('kts-watch-later', JSON.stringify(merged))
    return toSync
}
