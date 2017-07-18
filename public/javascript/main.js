import "tippy.js/dist/tippy.css";
import "tippy.js/dist/tippy.min.js";
import tippy from "tippy.js";

const alerts = $(".flash-message");
if (alerts.length > 0) {
  setTimeout(() => {
    alerts.each(alert => {
      alert.childNodes[0].click();
    });
  }, 3000);
}

tippy(".btn-tooltip");
