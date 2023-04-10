/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { muiTheme } from 'shared/const/MuiTheme';

class MyDocument extends Document {
    render(): ReactElement {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="utf-8" />
                    <noscript id="jss-insertion-point" />
                    <link rel="shortcut icon" href="/favicon.svg" />
                    <link rel="icon" href="/img/favicon.svg" />
                    <meta name="theme-color" content={muiTheme.palette.primary.main} />

                    {/* Use minimum-scale=1 to enable GPU rasterization */}
                    <meta
                        key="viewport"
                        name="viewport"
                        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        namespacesRequired: ['common'],
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles)],
    };
};

export default MyDocument;
