import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#3b82f6",
          secondary: "#64748b",
          accent: "#10b981",
          error: "#dc2626",
          warning: "#f59e0b",
          info: "#0ea5e9",
          success: "#10b981",
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount("#app");
