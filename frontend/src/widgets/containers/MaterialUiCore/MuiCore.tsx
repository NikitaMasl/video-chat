import React, { ReactElement } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider, ThemeProvider } from '@material-ui/core';
import { muiTheme } from 'shared/const/MuiTheme';

interface IProps {
    children: ReactElement | ReactElement[];
}

const MuiCore = (props: IProps) => {
    const { children } = props;

    return (
        <StylesProvider injectFirst>
            <ThemeProvider theme={muiTheme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                {children}
            </ThemeProvider>
        </StylesProvider>
    );
};

export default React.memo(MuiCore);
