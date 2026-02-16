// Контейнер кнопок на странице фильма
function createButtonContainer() {
    const container = document.createElement('div');
    container.className = 'kts-btn-container';
    return container;
}

// Кнопка «Смотреть бесплатно»
function createWatchButton() {
    const button = document.createElement('button');
    button.id = 'custom-watch-button';
    button.className = 'kts-watch-btn';
    button.textContent = 'Смотреть бесплатно';

    button.addEventListener('click', (e) => {
        const url = new URL(window.location.href);
        url.hostname = 'flcksbr.top';
        const target = e.ctrlKey || e.metaKey ? '_blank' : '_self';
        window.open(url.toString(), target);
    });

    return button;
}

// Кнопка «Смотреть позже»
function createWatchLaterButton() {
    // Обычная кнопка вместо label, чтобы не было двойного клика
    const button = document.createElement('button');
    // Используем тот же класс, что и у старого label, чтобы размеры и внешний вид были примерно теми же
    button.className = 'kts-watch-later-label';
    button.type = 'button';
    button.textContent = 'Смотреть позже';

    button.addEventListener('click', () => {
        let overlay = document.getElementById('kp-watch-later-overlay');
        if (!overlay) {
            overlay = createWatchLaterModal();
            document.body.appendChild(overlay);
        }

        const modal = document.getElementById('kp-watch-later-modal');
        if (!modal) return;

        const content = modal.querySelector('#watch-later-content');
        if (!content) return;

        const currentUrl = window.location.href;

        // Ищем, есть ли уже эта ссылка в списке
        let existingItem = null;
        const items = content.querySelectorAll('li');
        items.forEach((item) => {
            if (item.dataset.ktsWatchLaterUrl === currentUrl) {
                existingItem = item;
            }
        });

        if (!existingItem) {
            // Добавляем фильм в список
            if (content.textContent.trim() === 'Пока пусто') {
                content.textContent = '';
            }

            const li = document.createElement('li');
            li.textContent = currentUrl;
            li.dataset.ktsWatchLaterUrl = currentUrl;
            content.appendChild(li);

            button.textContent = 'Не буду смотреть';
        } else {
            // Удаляем фильм из списка
            existingItem.remove();

            if (!content.querySelector('li')) {
                content.textContent = 'Пока пусто';
            }

            button.textContent = 'Смотреть позже';
        }

        // После добавления/удаления не открываем модалку сразу — её открывает кнопка в шапке
        overlay.style.display = 'none';
    });

    return button;
}

// Модальное окно «Буду смотреть»
function createWatchLaterModal() {
    const existing = document.getElementById('kp-watch-later-overlay');
    if (existing) return existing;

    const overlay = document.createElement('div');
    overlay.id = 'kp-watch-later-overlay';
    overlay.className = 'kts-overlay';

    const modal = document.createElement('div');
    modal.id = 'kp-watch-later-modal';
    modal.className = 'kts-modal';

    modal.innerHTML = `
        <h3>Буду смотреть</h3>
        <div id="watch-later-content">Пока пусто</div>
        <button class="kts-close-btn">✕</button>
    `;

    overlay.appendChild(modal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.style.display = 'none';
    });

    modal.querySelector('.kts-close-btn').addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    return overlay;
}

// Кнопка списка в шапке сайта
function createWatchLaterListButton() {
    const button = document.createElement('button');
    button.className = 'kts-header-btn';

    button.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"/>
        </svg>
    `;

    button.addEventListener('click', () => {
        let overlay = document.getElementById('kp-watch-later-overlay');
        if (!overlay) {
            overlay = createWatchLaterModal();
            document.body.appendChild(overlay);
        }
        overlay.style.display = '';
    });

    return button;
}
