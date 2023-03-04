import React, { useContext } from 'react';
import LinkIcon from 'shared/icons/LinkIcon';
import { Grid } from 'shared/UI/Grid';
import { useTranslation } from 'shared/lib/hooks/useTranslation';
import { Namespaces } from 'shared/const/i18n';
import { IconButton } from 'shared/UI/IconButton';
import MicIcon from 'shared/icons/MicIcon';
import CamIcon from 'shared/icons/CamIcon';
import { CallActionsContext } from 'widgets/CallComponentPage/api/CallActionsContext';

import styles from './ActionPanel.module.scss';

const ActionPanel = () => {
    const {
        state: { isCamMuted, isMicMuted },
        actions: { copyLinkHandler, muteUnmuteCamera, muteUnmuteMic },
    } = useContext(CallActionsContext);

    const { t } = useTranslation(Namespaces.COMMON);

    return (
        <Grid container direction="row" justifyContent="center" alignItems="center" className={styles.container}>
            <IconButton
                tooltipText={!isMicMuted ? t('tooltips.muteMic') : t('tooltips.unMuteMic')}
                tooltipPlacement="top"
                classes={{ btn: styles.btn }}
                actionHandler={muteUnmuteMic}
            >
                <MicIcon muted={!isMicMuted} className={styles.icon} />
            </IconButton>
            <IconButton
                tooltipText={!isCamMuted ? t('tooltips.muteCam') : t('tooltips.unMuteCam')}
                tooltipPlacement="top"
                classes={{ btn: styles.btn }}
                actionHandler={muteUnmuteCamera}
            >
                <CamIcon muted={isCamMuted} className={styles.icon} />
            </IconButton>
            <IconButton
                tooltipText={t('tooltips.linkCopy')}
                tooltipPlacement="top"
                classes={{ btn: styles.btn }}
                actionHandler={copyLinkHandler}
            >
                <LinkIcon className={styles.icon} />
            </IconButton>
        </Grid>
    );
};

export default React.memo(ActionPanel);
