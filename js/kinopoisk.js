const hostname = window.location.hostname;

function WatchButton(){
    const button = document.createElement('button');
      button.id = 'custom-watch-button';
      button.textContent = 'Смотреть бесплатно';
      button.style.color = '#fff';
      button.style.background = 'linear-gradient(135deg, #f50 69.93%, #d6bb00 100%)';
      button.style.transition = 'background 0.3s ease, transform 0.3s ease';
      button.style.border = 'none';
      button.style.borderRadius = '8px';
      button.style.padding = '16px 32px';
      button.style.fontSize = '20px';
      button.style.fontWeight = 'bold';
      button.style.cursor = 'pointer';
      button.style.display = 'inline-block';

    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
    });
    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
    });
    button.addEventListener('click', (e) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.hostname = 'flcksbr.top';
    const target = e.ctrlKey || e.metaKey ? '_blank' : '_self';
    window.open(currentUrl.toString(), target);
    });
    return button
}

function KinopoiskSkript(){
    const url = window.location.href
    if (url === "https://www.kinopoisk.ru/"){
        return
    }
    if (document.getElementById('custom-watch-button')) {
        return;
    }
    const h1 = document.querySelector('h1[itemprop="name"]');
    const subDiv = h1.nextElementSibling;
    const spans = subDiv.querySelectorAll('span');
    const ageSpan = Array.from(spans).find(span => span.textContent.match(/^\d+\+$/));
    const button = WatchButton()
    const buttonContainer = document.createElement('div');

    buttonContainer.style.marginTop = '16px';
    buttonContainer.appendChild(button);
    if (ageSpan) {
        ageSpan.after(buttonContainer);
    } else {
        subDiv.after(buttonContainer);
    }
    console.log('Info: Button successfully added');
}

const observer = new MutationObserver(() => {
    if (!document.getElementById('custom-watch-button')) {
        KinopoiskSkript();
    }
});
observer.observe(document.body, { childList: true, subtree: true });
