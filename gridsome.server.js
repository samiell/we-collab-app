const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
module.exports = function(api) {

    api.chainWebpack((config, { isServer }) => {
        config.plugin('vuetify-loader').use(VuetifyLoaderPlugin)
    })

    api.loadSource(({ addCollection }) => {

    })

    api.createPages(({ createPage }) => {

    })
}