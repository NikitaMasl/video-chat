import React from 'react';
import { NextPageContext } from 'next';
import { ServerResponse } from 'http';
import { appWithTranslation } from '../../i18n';
import Head from 'next/head';
import { AppContext, AppProps } from 'next/app';

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
            <Component {...pageProps} />
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
