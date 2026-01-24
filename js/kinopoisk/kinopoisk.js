function KinopoiskSkript(){
    const url = window.location.href
    if (url === "https://www.kinopoisk.ru/"){
        return
    }
    if (document.getElementById('custom-watch-button')) {
        return;
    }
    // поиск нужного элемента для встраивания
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

    // Кнопка "Списки"
    const watchLaterListButton = createWatchLaterListButton();
    buttonContainer.appendChild(watchLaterListButton);
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('custom-watch-button')) {
        KinopoiskSkript();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
