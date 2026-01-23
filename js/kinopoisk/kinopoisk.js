//const hostname = window.location.hostname;

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

    const button = watchButton();
    const watchLaterButton = createWatchLaterButton();
    const buttonContainer = createButtonContainer();

    buttonContainer.appendChild(button);
    ageSpan.after(buttonContainer);
    console.log('Info: Button successfully added');

    buttonContainer.appendChild(watchLaterButton);
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('custom-watch-button')) {
        KinopoiskSkript();
    }
});

observer.observe(document.body, { childList: true, subtree: true });
