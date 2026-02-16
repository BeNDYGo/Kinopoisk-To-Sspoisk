function createBackButton() {
    const button = document.createElement('button');
    button.id = 'kts-back-button';
    button.className = 'kts-back-btn';
    button.textContent = '← Назад';

    button.addEventListener('click', (e) => {
        const url = new URL(window.location.href);
        url.hostname = 'www.kinopoisk.ru';
        const target = e.ctrlKey || e.metaKey ? '_blank' : '_self';
        window.open(url.toString(), target);
    });

    return button;
}

const tgWrapper = document.getElementById('tgWrapper');
if (tgWrapper) {
    const parent = tgWrapper.parentElement;
    tgWrapper.remove();
    parent.appendChild(createBackButton());
}
