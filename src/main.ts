import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "@/assets/style.scss";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";

import pinia from "@/stores";
import router from "@/router";
import util from "@/util";
import EventBusPlugin from "@/plugins/events";
import initEventHandlers from "@/plugins/events/EventHandlers";
import "@/plugins/fontawesome";
import App from "./App.vue";

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
