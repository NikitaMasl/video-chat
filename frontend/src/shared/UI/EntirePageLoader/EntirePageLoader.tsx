import React from 'react';
import { Grid } from '../Grid';

import styles from './EntirePageLoader.module.scss';

const EntirePageLoader = () => {
    return (
        <Grid container justifyContent="center" alignContent="center" className={styles.container}>
            <div className={styles.ldsRing}>
                <div />
                <div />
                <div />
                <div />
            </div>
        </Grid>
    );
};

export default React.memo(EntirePageLoader);
