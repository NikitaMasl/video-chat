/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { I18NextHMRPlugin } = require('i18next-hmr/plugin');
const { i18n } = require('./next-i18next.config');

require('dotenv').config();

const publicRuntimeConfig = {
    apiUrl: process.env.CORE_URL || 'http://localhost:3000/api',
    socketUrl: process.env.SOCKET_URL || 'http://localhost:3000',
};

module.exports = {
    publicRuntimeConfig,
    distDir: '.next',
    i18n,
    webpack(config, options) {
        if (!options.isServer) {
            config.plugins.push(
                new I18NextHMRPlugin({
                    localesDir: path.resolve(__dirname, 'public/locales'),
                }),
            );
        }
        const oneOf = config.module.rules.find((rule) => typeof rule.oneOf === 'object');
        const fixUse = (use) => {
            if (use.loader && use.loader.indexOf('css-loader') >= 0 && use.options.modules) {
                use.options.modules.mode = 'local';
            }
        };

        if (oneOf) {
            oneOf.oneOf.forEach((rule) => {
                if (Array.isArray(rule.use)) {
                    rule.use.map(fixUse);
                } else if (rule.use && rule.use.loader) {
                    fixUse(rule.use);
                }
            });
        }
        return config;
    },
};
