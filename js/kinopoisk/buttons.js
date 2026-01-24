function createWatchButton(){
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

function createWatchLaterButton() {
    const label = document.createElement("label");
    label.style.display = 'inline-flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.padding = '8px 14px';
    label.style.borderRadius = '999px';
    label.style.background = '#222';
    label.style.color = '#ccc';
    label.style.fontFamily = 'system-ui, sans-serif';
    label.style.fontSize = '15px';
    label.style.cursor = 'pointer';
    label.style.userSelect = 'none';
    label.style.transition = 'all 0.2s ease';

    const input = document.createElement("input");
    input.type = "checkbox";
    input.hidden = true;

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = "★";
    icon.style.fontSize = '20px';
    icon.style.color = '#777';
    icon.style.transition = 'all 0.3s';

    const textOff = document.createElement("span");
    textOff.className = "text-off";
    textOff.textContent = "Смотреть позже";

    const textOn = document.createElement("span");
    textOn.className = "text-on";
    textOn.textContent = "Сохранено";
    textOn.style.display = 'none';

    label.addEventListener('mouseover', () => {
        label.style.background = '#333';
    });
    label.addEventListener('mouseout', () => {
        label.style.background = '#222';
    });

    input.addEventListener('change', () => {
        if (input.checked) {
            textOff.style.display = 'none';
            textOn.style.display = 'inline';
            icon.style.color = '#ffcd32';
            icon.style.animation = 'beat 0.6s ease';
        } else {
            textOff.style.display = 'inline';
            textOn.style.display = 'none';
            icon.style.color = '#777';
        }
    });

    label.appendChild(input);
    label.appendChild(icon);
    label.appendChild(textOff);
    label.appendChild(textOn);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes beat {
        0%, 100% { transform: scale(1);   }
        40%      { transform: scale(1.4); }
        }
    `;
    document.head.appendChild(style);

    return label;
}

function createButtonContainer(){
    const container = document.createElement("div");
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-start';
    container.style.gap = '8px';
    return container
}

function createWatchLaterListButton() {
    const button = document.createElement('button');
    
    button.style.position = 'fixed';
    button.style.bottom = '30px';
    button.style.right = '30px';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.width = '56px';
    button.style.height = '56px';
    button.style.background = 'linear-gradient(135deg, #f50, #d6bb00)';
    button.style.borderRadius = '50%';
    button.style.border = 'none';
    button.style.boxShadow = '0 4px 12px rgba(255, 85, 0, 0.4)';
    button.style.cursor = 'pointer';
    button.style.transition = 'transform 0.2s, box-shadow 0.2s';
    button.style.color = 'white';
    button.style.zIndex = '9999';

    // 2. Добавляем иконку (SVG) внутрь кнопки
    button.innerHTML = `
        <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: #fff; pointer-events: none;">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"/>
        </svg>
    `;

    // 3. Создаем элемент подсказки (вместо CSS ::after)
    const tooltip = document.createElement('span');
    tooltip.textContent = "Мой список";
    
    // Стили подсказки
    tooltip.style.position = 'absolute';
    tooltip.style.right = '70px'; // Сдвигаем влево от кнопки
    tooltip.style.background = '#333';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.color = '#fff';
    tooltip.style.opacity = '0'; // Изначально скрыта
    tooltip.style.pointerEvents = 'none';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.whiteSpace = 'nowrap';

    // Добавляем подсказку внутрь кнопки
    button.appendChild(tooltip);

    // 4. Обработчики событий (Hover эффекты через JS)
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 16px rgba(255, 85, 0, 0.6)';
        tooltip.style.opacity = '1'; // Показываем подсказку
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(255, 85, 0, 0.4)';
        tooltip.style.opacity = '0'; // Скрываем подсказку
    });

    button.addEventListener('click', () => {
        const targetUrl = 'https://www.kinopoisk.ru/mykp/folders/'; 
        window.open(targetUrl, '_blank');
    });

    return button;
}
