/* eslint-disable @typescript-eslint/no-var-requires */
const NextI18Next = require('next-i18next').default;

const NextI18NextInstance = new NextI18Next({
    defaultLanguage: 'en',
    localePath: 'public/translations',
});

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line global-require,import/no-extraneous-dependencies
    const { applyClientHMR } = require('i18next-hmr');
    applyClientHMR(NextI18NextInstance.i18n);
}

module.exports = NextI18NextInstance;

exports.useTranslation = NextI18NextInstance.useTranslation;
exports.withTranslation = NextI18NextInstance.withTranslation;
exports.appWithTranslation = NextI18NextInstance.appWithTranslation;
