//import './assets/main.css'

//import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import App from './App.vue'
//import router from './router'
import {routes} from './router'

import { ViteSSG } from 'vite-ssg'
//import router from './router/index.js';

/*
const app = createApp(App)
const head = createHead()

app.use(head)
app.use(router)

app.mount('#app')
*/

export const createApp = ViteSSG(
    App,
    {routes},
    ({app, router, routes, isClient, initialState}) => {
        const head = createHead()
        app.use(head)
    }
);
