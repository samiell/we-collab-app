import Vuetify from 'vuetify/lib/framework'
import { opts } from "./plugins/vuetify"
require('typeface-roboto')
import '@mdi/font/css/materialdesignicons.min.css'
import DefaultLayout from '~/layouts/Default.vue'

export default function(Vue, { appOptions, router, head, isClient }) {

    Vue.use(Vuetify)
    appOptions.vuetify = new Vuetify(opts)

    Vue.component('Layout', DefaultLayout)
}