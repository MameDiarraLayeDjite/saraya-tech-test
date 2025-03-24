import { createApp } from 'vue'
import { createPinia } from 'pinia' // Nous utiliserons Pinia pour le state management
import App from './App.vue'

const app = createApp(App)

// Configuration de Pinia
app.use(createPinia())

app.mount('#app')