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
    const button = document.createElement('button');
    button.className = 'kts-watch-later-label';
    button.type = 'button';
    button.textContent = 'Смотреть позже';

    button.addEventListener('click', () => {
        const panel = getOrCreateWatchLaterPanel();
        const list = panel.querySelector('#watch-later-content');
        if (!list) return;

        const li = document.createElement('li');
        li.textContent = window.location.href;
        list.appendChild(li);
    });

    return button;
}

function getOrCreateWatchLaterPanel() {
    let panel = document.getElementById('kp-watch-later-panel');
    if (panel) return panel;

    panel = document.createElement('div');
    panel.id = 'kp-watch-later-panel';
    panel.className = 'kts-watch-later-panel';

    const list = document.createElement('ul');
    list.id = 'watch-later-content';
    list.className = 'kts-watch-later-content';

    panel.appendChild(list);
    document.body.appendChild(panel);

    return panel;
}

// Кнопка списка в шапке сайта
function createWatchLaterListButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'kts-header-btn';

    button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"></path>
        </svg>
    `;

    button.addEventListener('click', () => {
        const panel = getOrCreateWatchLaterPanel();
        const isOpen = panel.classList.contains('kts-watch-later-panel--open');
        panel.classList.toggle('kts-watch-later-panel--open', !isOpen);
    });

    return button;
}
