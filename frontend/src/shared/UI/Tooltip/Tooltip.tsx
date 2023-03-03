import React, { forwardRef, ForwardedRef } from 'react';
import { cnb } from 'cnbuilder';

import MuiTooltip, { TooltipProps } from '@mui/material/Tooltip';

import styles from './Tooltip.module.scss';

type Props = Pick<
    TooltipProps,
    | 'classes'
    | 'className'
    | 'title'
    | 'placement'
    | 'arrow'
    | 'components'
    | 'componentsProps'
    | 'PopperComponent'
    | 'PopperProps'
    | 'TransitionComponent'
    | 'TransitionProps'
    | 'disableInteractive'
    | 'children'
    | 'disableHoverListener'
    | 'disableFocusListener'
    | 'leaveDelay'
    | 'open'
    | 'onClose'
>;

const Tooltip = forwardRef((props: Props, ref: ForwardedRef<HTMLElement>) => {
    const {
        className,
        classes,
        title,
        placement,
        arrow,
        components,
        componentsProps,
        PopperComponent,
        PopperProps,
        TransitionComponent,
        TransitionProps,
        disableInteractive,
        children,
        disableHoverListener,
        disableFocusListener,
        leaveDelay,
        onClose,
        open,
    } = props;

    const tooltipClasses = {
        arrow: classes?.arrow || styles.arrow,
        tooltip: classes?.tooltip ? cnb(styles.tooltip, classes.tooltip) : styles.tooltip,
    };

    const tooltipComponents = components;

    return (
        <MuiTooltip
            ref={ref}
            open={open}
            onClose={onClose}
            className={cnb(styles.container, className)}
            classes={tooltipClasses}
            title={title}
            placement={placement}
            disableInteractive={disableInteractive}
            arrow={arrow}
            leaveDelay={leaveDelay}
            components={tooltipComponents}
            componentsProps={componentsProps}
            PopperComponent={PopperComponent}
            PopperProps={PopperProps}
            TransitionComponent={TransitionComponent}
            TransitionProps={TransitionProps}
            disableHoverListener={disableHoverListener}
            disableFocusListener={disableFocusListener}
        >
            {children}
        </MuiTooltip>
    );
});

Tooltip.displayName = 'Tooltip';

export default React.memo(Tooltip);
