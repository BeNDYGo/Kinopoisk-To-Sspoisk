/*
В файле создание элемента с фильмом в панели с отложенными фильмами и обновление кнопки "Смотреть позже"
после действий в панели
----функции----
- watchLaterItem
- updateWhatchLaterButton
- 
*/


function watchLaterItem(movie) {
    // ID
    const li = document.createElement('li')
    li.className = 'kts-watch-later-item'
    li.dataset.id = movie.url

    // IMG
    const img = document.createElement('img')
    img.src = movie.poster
    img.alt = movie.title

    // TITLE
    const title = document.createElement('div')
    title.className = 'kts-watch-later-title'
    title.textContent = movie.title

    // Кнопка удаления
    const removeBtn = document.createElement('button')
    removeBtn.className = 'kts-watch-later-remove'


    // Кнопка удалить (останавливает всплытие события)
    removeBtn.addEventListener('click', async (e) => {
        e.stopPropagation() // Остановка обработчика перехода на тайтл
        li.remove()
        removeWatchLaterLocalStorage(movie)
        await updateWhatchLaterButton()
    })

    // Клик по элементу фильма для перехода на страницу
    li.addEventListener('click', (e) => {
        window.location.href = movie.url
    })

    li.appendChild(img)
    li.appendChild(title)
    li.appendChild(removeBtn)

    return li
}

async function updateWhatchLaterButton() {
    const button = document.getElementById('whatch-later-button')
    if (!button) return

    const panel = await WatchLaterPanel()
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
}

// Добавление фильма в localStorage
function addWatchLaterLocalStorage(movie) {
    // Текущий список localStorage
    let watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    
    // Добавляем новый фильм если его еще нет в списке
    for (let i = 0; i < watchLaterList.length; i++) {
        if (watchLaterList[i].url === movie.url) {
            return
        }
    }
    watchLaterList.push(movie)
    localStorage.setItem('kts-watch-later', JSON.stringify(watchLaterList))
}

// Удаление фильма из localStorage
function removeWatchLaterLocalStorage(movie) {
    // Текущий список localStorage
    let watchLaterList = JSON.parse(localStorage.getItem('kts-watch-later') || '[]')
    
    // Удаляем фильм из списка
    for (let i = 0; i < watchLaterList.length; i++) {
        if (watchLaterList[i].url === movie.url) {
            watchLaterList.splice(i, 1)
            break
        }
    }
    localStorage.setItem('kts-watch-later', JSON.stringify(watchLaterList))
}
