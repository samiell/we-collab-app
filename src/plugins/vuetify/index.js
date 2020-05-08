import en from 'vuetify/es5/locale/en' // english
import es from 'vuetify/es5/locale/es' // spanish
import fr from 'vuetify/es5/locale/fr' // french
import de from 'vuetify/es5/locale/de'

export const opts = {
    theme: {
        themes: {
            light: {
                primary: '#030C33',
                secondary: '#4caf50',
                tertiary: '#495057',
                accent: '#ffffff',
                error: '#f55a4e',
                info: '#00d3ee',
                success: '#5cb860',
                warning: '#ffa21a'
            }
        }
    },
    lang: {
        locales: { en, es, fr, de },
        current: 'en',
    },
}

// Change locale in component - this.$vuetify.lang.current = 'fr'