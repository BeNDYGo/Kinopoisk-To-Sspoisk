function KinopoiskSkript(){

    // Кнопка "Смотреть потом"
    const headDiv = document.querySelector('[class*="styles_userContainer__"]');

    const watchLaterListButton = createWatchLaterListButton();
    headDiv.appendChild(watchLaterListButton);

    // Проверка на страницу с тайтлом
    const url = window.location.href

    if (url === "https://www.kinopoisk.ru/"){
        return
    }
    if (document.getElementById('custom-watch-button')) {
        return;
    }
    // Создание div рядом с названием тайтла
    const h1 = document.querySelector('h1[itemprop="name"]');
    const subDiv = h1.nextElementSibling;
    const spans = subDiv.querySelectorAll('span');
    const ageSpan = Array.from(spans).find(span => span.textContent.match(/^\d+\+$/));

    const buttonContainer = createButtonContainer();

    // Кнопка "Смотреть бесплатно"
    const watchButton = createWatchButton();
    buttonContainer.appendChild(watchButton);

    // Кнопка "Сохранить в список"
    const watchLaterButton = createWatchLaterButton();
    buttonContainer.appendChild(watchLaterButton);

    // Обновление
    ageSpan.after(buttonContainer);
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('custom-watch-button')) {
        KinopoiskSkript();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
