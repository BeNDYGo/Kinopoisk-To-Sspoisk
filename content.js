(function() {
  const hostname = window.location.hostname;

  let checkTimer = null;

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
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.marginTop = '16px';

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

      if (ageSpan) {
        ageSpan.after(buttonContainer);
        console.log('Info: Button successfully added after age span!');
      } else {
        subDiv.after(buttonContainer);
        console.log('Info: Age span not found, but button added after subDiv!');
      }
    }

    if (checkTimer) clearTimeout(checkTimer);
    checkTimer = setTimeout(checkElements, 300);
  }

  if (hostname.includes('kinopoisk.ru')) {
    addWatchButtonIfNeeded();

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

    const observer = new MutationObserver(() => {
      addWatchButtonIfNeeded();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

  } else if (hostname.includes('flcksbr.top')) {
    const tgWrapper = document.getElementById('tgWrapper');
    if (tgWrapper) {
      tgWrapper.remove();
      console.log('Info: tgWrapper removed from page.');
    } else {
      console.log('Info: tgWrapper not found, nothing to remove.');
    }
  }
})();
