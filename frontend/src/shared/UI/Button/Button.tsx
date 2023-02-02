import React, { useMemo, forwardRef } from 'react';
import ButtonMui from '@mui/material/Button';
import CircularProgressMui from '@mui/material/CircularProgress';
import { cnb } from 'cnbuilder';
import { TextColors, TextSizes, TextVariants, TextWeights } from '../Text/TEXT_PROPS';
import { Text } from '../Text';
import { VariantButton, ColorButton, TypeButton } from './const';

import styles from './Button.module.scss';

type Props = {
    fullWidth?: boolean;
    disabled?: boolean;
    disableRipple?: boolean;
    variant?: VariantButton;
    color?: ColorButton;
    className?: string;
    classes?: {
        disabled?: string;
        text?: string;
    };
    text?: string;
    type?: TypeButton;
    isProcessing?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    textClassName?: string;
    textVariant?: TextVariants;
    textSize?: TextSizes;
    textWeight?: TextWeights;
    textColor?: TextColors;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
    const {
        text,
        fullWidth = true,
        variant = VariantButton.CONTAINED,
        color = ColorButton.INHERIT,
        className,
        disabled = false,
        type = TypeButton.BUTTON,
        isProcessing = false,
        disableRipple = false,
        startIcon,
        endIcon,
        textClassName,
        textVariant = TextVariants.SPAN,
        textSize = TextSizes.S4,
        textWeight,
        textColor,
        children,
        onClick,
        classes,
    } = props;

    const content = useMemo(() => {
        if (children) {
            return children;
        }

        if (text) {
            return (
                <Text
                    className={cnb(styles.text, textClassName)}
                    variant={textVariant}
                    size={textSize}
                    weight={textWeight}
                    color={textColor}
                >
                    {text}
                </Text>
            );
        }

        return null;
    }, [children, text, textClassName, textColor, textSize, textVariant, textWeight]);

    return (
        <ButtonMui
            ref={ref}
            className={cnb(styles.container, className)}
            fullWidth={fullWidth}
            variant={variant}
            color={color}
            disabled={disabled}
            disableRipple={disableRipple}
            classes={{
                containedInherit: styles.containedInherit,
                textInherit: styles.textInherit,
                disabled: cnb(styles.containerDisabled, classes?.disabled),
                outlined: styles.outlined,
                startIcon: styles.startIcon,
                text: classes?.text,
            }}
            type={type}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={onClick}
        >
            {isProcessing ? <CircularProgressMui thickness={4} size={22} className={styles.loader} /> : content}
        </ButtonMui>
    );
});

Button.displayName = 'Button';

export default React.memo(Button);
