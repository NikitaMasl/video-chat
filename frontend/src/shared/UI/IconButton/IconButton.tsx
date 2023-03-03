import React from 'react';
import { IconButton as IconButtonMUI } from '@material-ui/core';
import { Tooltip } from '../Tooltip';

type Props = {
    children: React.ReactElement;
    classes?: {
        btn?: string;
    };
    tooltipText?: string;
    tooltipPlacement?:
        | 'bottom-end'
        | 'bottom-start'
        | 'bottom'
        | 'left-end'
        | 'left-start'
        | 'left'
        | 'right-end'
        | 'right-start'
        | 'right'
        | 'top-end'
        | 'top-start'
        | 'top';
    actionHandler: () => void;
};

const IconButton = (props: Props) => {
    const { classes, tooltipText, tooltipPlacement, children, actionHandler } = props;

    return (
        <Tooltip
            title={tooltipText}
            placement={tooltipPlacement}
            disableHoverListener={!tooltipText}
            disableFocusListener={!tooltipText}
        >
            <IconButtonMUI className={classes?.btn} onClick={actionHandler}>
                {children}
            </IconButtonMUI>
        </Tooltip>
    );
};

export default React.memo(IconButton);
