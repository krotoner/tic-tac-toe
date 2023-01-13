// В процессе производства мы регистрируем работника службы для обслуживания ресурсов из локального кэша.

// Это позволяет приложению быстрее загружаться при последующих посещениях в рабочей среде и дает
// это автономные возможности. Однако это также означает, что разработчики (и пользователи)
// будет видеть развернутые обновления только при посещении страницы "N+1", поскольку ранее
// кэшированные ресурсы обновляются в фоновом режиме.

// Чтобы узнать больше о преимуществах этой модели, прочитайте https://goo.gl/KwvDNy .
// Эта ссылка также содержит инструкции по отказу от такого поведения.

const isLocalhost = Boolean(
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
      // Наш сервисный работник не будет работать, если PUBLIC_URL находится в другом источнике
      // с того, на чем обслуживается наша страница. Это может произойти, если CDN используется для
      // обслуживания активов; см. https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Это выполняется на localhost. Давайте проверим, существует ли еще сервисный работник или нет.
        checkValidServiceWorker(swUrl);
      } else {
        // Не является локальным хостом. Просто зарегистрируйте сервисного работника
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
              // Это идеальное время для отображения сообщения "Новый контент
              // доступен; пожалуйста, обновите" в вашем веб-приложении.
              console.log('New content is available; please refresh.');
            } else {
              // На данный момент все было проповедано.
              // Это идеальное время для отображения сообщения
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
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
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
