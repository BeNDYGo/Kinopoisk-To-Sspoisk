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
    label.style.background = '#ebebebb6';
    label.style.color = '#000000';
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

function createWatchLaterModal() {
    // затемнение фона
    const overlay = document.createElement('div');
    overlay.id = 'kp-watch-later-overlay';

    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    });

    // само окно
    const modal = document.createElement('div');

    Object.assign(modal.style, {
        width: '400px',
        height: '300px',
        background: '#1f1f1f',
        borderRadius: '12px',
        padding: '16px',
        color: '#fff',
        position: 'relative'
    });

    modal.innerHTML = `
        <h3 style="margin-top:0;">Буду смотреть</h3>
        <div id="watch-later-content">
            Пока пусто 👀
        </div>
        <button id="close-watch-later"
            style="
                position:absolute;
                top:8px;
                right:8px;
                background:none;
                border:none;
                color:#fff;
                font-size:20px;
                cursor:pointer;
            "
        >✕</button>
    `;

    overlay.appendChild(modal);

    // закрытие
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    modal.querySelector('#close-watch-later').onclick = () => {
        overlay.remove();
    };

    return overlay;
}

function createWatchLaterListButton() {
    const button = document.createElement('button');

    button.style.width = '40px';
    button.style.height = '40px';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.background = '#ff5500';
    button.style.cursor = 'pointer';

    button.style.alignSelf = 'center';
    
    button.innerHTML = `
        <svg viewBox="0 0 24 24" style="width: 28px; height: 28px; fill: #fff; pointer-events: none;">
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z"/>
        </svg>
    `;
    button.addEventListener('click', () => {
        // защита от повторного открытия
        if (document.getElementById('kp-watch-later-overlay')) return;

        document.body.appendChild(createWatchLaterModal());
    });
    
    return button;
}
