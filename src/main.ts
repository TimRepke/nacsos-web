import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "@/assets/style.scss";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { createApp } from "vue";

import pinia from "@/stores";
import router from "@/router";
import util from "@/util";
import EventBusPlugin from "@/plugins/events";
import initEventHandlers from "@/plugins/events/EventHandlers";
import App from "./App.vue";

// set up font awesome
library.add(fas);
library.add(fab);
library.add(far);

// initialise all global event handlers
initEventHandlers();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app = createApp(App)
  .use(util)
  .use(pinia)
  .use(EventBusPlugin)
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
