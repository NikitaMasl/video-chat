/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import { ServerStyleSheets } from '@material-ui/core/styles';
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
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        });

    const initialProps = await Document.getInitialProps(ctx);

    return {
        ...initialProps,
        // Styles fragment is rendered after the app and page rendering finish.
        styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    };
};

export default MyDocument;
