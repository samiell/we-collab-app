const path = require('path')

function addStyleResource(rule) {
    rule.use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [
                path.resolve(__dirname, './**/*.scss'),
            ],
        })
}

module.exports = {
    siteName: 'Gridsome',
    plugins: [],
    chainWebpack(config) {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal']

        types.forEach(type => {
            addStyleResource(config.module.rule('scss').oneOf(type))
        })
    }
}