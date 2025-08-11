(function() {
  const hostname = window.location.hostname;

  // Объявляем переменную для таймера в замыкании
  let checkTimer = null;

  // Функция для добавления кнопки на kinopoisk.ru
  function addWatchButtonIfNeeded() {
    const path = window.location.pathname;
    if (!path.match(/^\/(film|series)\/\d/)) {
      console.log('Info: URL does not match film/series. Button not added.');
      return;
    }

    if (document.getElementById('custom-watch-button')) {
      console.log('Info: Button already exists. Skipping.');
      return;
    }

    // Поиск элементов с задержкой (рекурсивно)
    function checkElements() {
      const h1 = document.querySelector('h1[itemprop="name"]');
      if (!h1) {
        console.log('Info: h1 not found yet. Retrying...');
        checkTimer = setTimeout(checkElements, 300);
        return;
      }

      const subDiv = h1.nextElementSibling;
      if (!subDiv || subDiv.tagName !== 'DIV') {
        console.log('Info: Sub div not found yet. Retrying...');
        checkTimer = setTimeout(checkElements, 300);
        return;
      }

      const spans = subDiv.querySelectorAll('span');
      const ageSpan = Array.from(spans).find(span => 
        span.textContent.match(/^\d+\+$/)
      );
      
      if (!ageSpan) {
        console.log('Info: Age span not found yet. Retrying...');
        checkTimer = setTimeout(checkElements, 300);
        return;
      }

      // Создаем кнопку
      const buttonContainer = document.createElement('div');
      buttonContainer.style.marginTop = '8px';

      const button = document.createElement('button');
      button.id = 'custom-watch-button';
      button.textContent = 'Смотреть';
      button.style.color = '#fff';
      button.style.background = 'linear-gradient(135deg, #f50 69.93%, #d6bb00 100%)';
      button.style.transition = 'background 0.3s ease, transform 0.3s ease';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.padding = '8px 16px';
      button.style.fontSize = '14px';
      button.style.fontWeight = 'bold';
      button.style.cursor = 'pointer';
      button.style.display = 'inline-block';

      button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.05)';
      });
      button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
      });
      button.addEventListener('click', () => {
        const currentUrl = new URL(window.location.href);
        currentUrl.hostname = 'flcksbr.top';
        window.open(currentUrl.toString(), '_blank');
      });

      buttonContainer.appendChild(button);
      ageSpan.after(buttonContainer);
      console.log('Info: Button successfully added!');
    }

    // Очищаем предыдущий таймер
    if (checkTimer) clearTimeout(checkTimer);
    checkTimer = setTimeout(checkElements, 300);
  }

  if (hostname.includes('kinopoisk.ru')) {
    // Первоначальная проверка
    addWatchButtonIfNeeded();

    // Обработчики SPA-навигации
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      addWatchButtonIfNeeded();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      addWatchButtonIfNeeded();
    };

    window.addEventListener('popstate', () => {
      addWatchButtonIfNeeded();
    });

    // MutationObserver для динамических изменений
    const observer = new MutationObserver(() => {
      addWatchButtonIfNeeded();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else if (hostname.includes('flcksbr.top')) {
    // Логика для flcksbr.top (замена div.tgMain)
    const tgMainDiv = document.querySelector('div.tgMain');
    if (!tgMainDiv) {
      console.log('Error: div.tgMain not found on flcksbr.top page.');
      return;
    }
    console.log('Info: div.tgMain found.');

    const link = tgMainDiv.querySelector('a');
    if (!link) {
      console.log('Error: <a> element not found inside div.tgMain.');
      return;
    }
    link.href = 'https://t.me/Kinopoisk_to_Sspoisk';
    console.log('Info: Link href replaced to https://t.me/Kinopoisk_to_Sspoisk.');

    const img = tgMainDiv.querySelector('img');
    if (!img) {
      console.log('Error: <img> element not found inside div.tgMain.');
      return;
    }
    img.src = chrome.runtime.getURL('Kinopoisk_to_Sspoisk.png');
    console.log('Info: Image src replaced to extension\'s Kinopoisk_to_Sspoisk.png.');
}})();