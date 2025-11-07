function BackButton() {
    const button = document.createElement('button');
    button.id = 'back-button';
    button.textContent = '← Назад';

    // стиль
    button.style.background = '#2A3440';
    button.style.color = '#2f3640';
    button.style.border = '2px solid #444f5cff';
    button.style.borderRadius = '12px';
    button.style.padding = '10px 24px';
    button.style.fontSize = '18px';
    button.style.fontWeight = '500';
    button.style.cursor = 'pointer';
    button.style.transition = 'all 0.25s ease';
    button.style.margin = '20px';
    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';

    button.addEventListener('mouseover', () => {
        button.style.background = '#e1e4eb';
        button.style.transform = 'scale(1.07)';
        button.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
    });

    button.addEventListener('mouseout', () => {
        button.style.background = '#2A3440';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    });
    
    button.addEventListener('click', (e) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.hostname = 'www.kinopoisk.ru';
    const target = e.ctrlKey || e.metaKey ? '_blank' : '_self';
    window.open(currentUrl.toString(), target);
    });

    return button;
}


const tgWrapper = document.getElementById('tgWrapper');
const parent = tgWrapper.parentElement;
tgWrapper.remove();
parent.appendChild(BackButton());