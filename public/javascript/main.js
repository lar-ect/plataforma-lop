import { $, $$ } from './modules/bling';

const alerts = $$('.flash-message');
if (alerts.length > 0) {
  setTimeout(() => {
    alerts.forEach(alert => {
      alert.childNodes[0].click();
    });
  }, 3000);
}