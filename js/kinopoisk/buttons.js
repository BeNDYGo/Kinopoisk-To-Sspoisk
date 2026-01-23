export { watchButton, createWatchLaterButton };

function watchButton(){
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
    label.className = "btn-fav";
    const style = document.createElement("style");
    style.id = "watch-later-styles";

    label.innerHTML = `
        <input type="checkbox" hidden>
        <span class="icon">★</span>
        <span class="text-off">Смотреть позже</span>
        <span class="text-on">Сохранено</span>
  `;

    style.id = "watch-later-styles";
    style.textContent = `
        .btn-fav {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-radius: 999px;
        background: #222;
        color: #ccc;
        font-family: system-ui, sans-serif;
        font-size: 15px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
        }

        .btn-fav:hover {
        background: #333;
        }

        .btn-fav .icon {
        font-size: 20px;
        color: #777;
        transition: all 0.3s;
        }

        .btn-fav .text-on  { display: none; }
        .btn-fav input:checked ~ .text-off { display: none; }
        .btn-fav input:checked ~ .text-on  { display: inline; }
        .btn-fav input:checked ~ .icon {
        color: #ffcd32;
        animation: beat 0.6s ease;
        }

        @keyframes beat {
        0%, 100% { transform: scale(1);   }
        40%      { transform: scale(1.4); }
        }
    `;

    return label;
}