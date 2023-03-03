import React, { useContext } from 'react';
import LinkIcon from 'shared/icons/LinkIcon';
import { Grid } from 'shared/UI/Grid';
import { useTranslation } from 'shared/lib/hooks/useTranslation';
import { Namespaces } from 'shared/const/i18n';
import { IconButton } from 'shared/UI/IconButton';
import { CallActionsContext } from 'widgets/CallComponentPage/api/CallActionsContext';

import styles from './ActionPanel.module.scss';

const ActionPanel = () => {
    const {
        actions: { copyLinkHandler },
    } = useContext(CallActionsContext);

    const { t } = useTranslation(Namespaces.COMMON);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" className={styles.container}>
            <IconButton
                tooltipText={t('tooltips.linkCopy')}
                tooltipPlacement="top"
                classes={{ btn: styles.btn }}
                actionHandler={copyLinkHandler}
            >
                <LinkIcon className={styles.linkIcon} />
            </IconButton>
        </Grid>
    );
};

export default React.memo(ActionPanel);
