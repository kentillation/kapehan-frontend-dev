// import { createPinia } from 'pinia'
// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router';
// import vuetify from './plugins/vuetify';
// import { loadFonts } from './plugins/webfontloader';
// import './styles.css';
// import LoaderUI from '@/components/LoaderUI.vue';

// loadFonts();

// createApp(App)
//   .use(createPinia())
//   .component('LoaderUI', LoaderUI)
//   .use(router)
//   .use(vuetify)
//   .mount('#app');

import { createPinia } from 'pinia'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import './styles.css';
import LoaderUI from '@/components/LoaderUI.vue';

loadFonts();

const app = createApp(App);

app.use(createPinia());
app.component('LoaderUI', LoaderUI);
app.use(router);
app.use(vuetify);

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  vuetify.theme.global.name.value = savedTheme;
}

app.mount('#app');
