import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
export const muiTheme = createTheme({
    palette: {
        primary: {
            main: '#251F47',
        },
        secondary: {
            main: '#89A6FB',
        },
        error: {
            main: red[900],
        },
        background: {
            default: '#ECE2D0',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1480,
            xl: 1920,
        },
    },
});
