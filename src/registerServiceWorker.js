const ishost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] - это адрес локального хоста IPv6.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 считается локальным хостом для IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // Конструктор URL доступен во всех браузерах, поддерживающих SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      if (ishost) {
        // Это выполняется на localhost. Давайте проверим, существует ли еще сервер или нет.
        checkValidServiceWorker(swUrl);
      } else {
        // Не является локальным хостом.
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // На этом этапе старое содержимое будет удалено, и
              // новое содержимое будет добавлено в кэш.
              console.log('New content is available; please refresh.');
            } else {
              // "Содержимое кэшируется для использования в автономном режиме".
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl) {
  // Проверьте, можно ли найти сервер. Если он не может перезагрузить страницу.
  fetch(swUrl)
    .then(response => {
      // Убедитесь, что service worker существует и что мы действительно получаем JS-файл.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // Сервер не найден. Вероятно, это другое приложение. Перезагрузить страницу.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Найден сервер. Действуйте как обычно.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
