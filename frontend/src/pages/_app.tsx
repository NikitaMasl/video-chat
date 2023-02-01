import React from 'react';
import { NextPageContext } from 'next';
import { ServerResponse } from 'http';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { AppContext, AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import 'app/styles/styles.scss';

import { store } from 'app/store/store';
import { MaterialUiCore } from 'widgets/containers/MaterialUiCore';

export interface VideoChatServerResponse extends ServerResponse {
    authorized: boolean;
}

export interface VideoChatPageContext extends NextPageContext {
    res: VideoChatServerResponse;
}

export interface VideoChatAppContext extends AppContext {
    ctx: VideoChatPageContext;
}

const App = (props: AppProps) => {
    const { Component, pageProps } = props;

    return (
        <>
            <Head>Video Chat</Head>
            <Provider store={store}>
                <MaterialUiCore>
                    <Component {...pageProps} />
                </MaterialUiCore>
            </Provider>
        </>
    );
};

App.getInitialProps = async ({ Component, ctx }: VideoChatAppContext) => {
    const currentLanguage = ctx ? ctx.locale : '';
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return {
        pageProps,
        currentLanguage,
    };
};

export default appWithTranslation(App);
