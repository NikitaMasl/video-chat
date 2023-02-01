import React, { ReactElement } from 'react';
import { Grid } from 'shared/UI/Grid';

import styles from './MainContainer.module.scss';

type Props = {
    children: ReactElement;
};

const MainContainer = (props: Props) => {
    const { children } = props;

    return (
        <Grid container justifyContent="center" alignItems="center" className={styles.container}>
            {children}
        </Grid>
    );
};

export default React.memo(MainContainer);
