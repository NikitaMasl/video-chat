import React, { createElement, forwardRef, useMemo, ReactElement } from 'react';
import { cnb } from 'cnbuilder';
import { Translation } from '../Translation';
import { TextColors, TextDisplays, TextSizes, TextVariants, TextWeights, TextAlignments } from './TEXT_PROPS';

import styles from './Text.module.scss';

export interface IProps {
    children?: any;
    ns?: string;
    t?: string;
    postfix?: string | ReactElement;
    prefix?: string | ReactElement;
    options?: Record<string, unknown>;
    size?: TextSizes;
    weight?: TextWeights;
    color?: TextColors;
    display?: TextDisplays;
    align?: TextAlignments;
    variant?: TextVariants;
    className?: string;
    sub?: boolean;
    name?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Text = forwardRef((props: IProps, ref) => {
    const {
        children,
        ns,
        t,
        prefix,
        postfix,
        options,
        size,
        weight,
        color,
        display,
        align,
        variant,
        className,
        sub,
        name,
        onClick,
        ...other
    } = props;

    const content = useMemo(() => {
        if (children) {
            return (
                <>
                    {prefix}
                    {children}
                    {postfix}
                </>
            );
        }
        if (ns && t) {
            return (
                <>
                    {prefix}
                    <Translation ns={ns} t={t} options={options} />
                    {postfix}
                </>
            );
        }
        return null;
    }, [children, ns, t, options]);

    const textClassName = useMemo(
        () =>
            cnb(
                className,
                styles.text,
                size ? styles[size] : styles[TextSizes.S4],
                weight ? styles[weight] : styles[TextWeights.MEDIUM],
                color ? styles[color] : styles[TextColors.EMPTY],
                display ? styles[display] : styles[TextDisplays.BLOCK],
                align ? styles[align] : styles[TextAlignments.EMPTY],
                sub && styles.sub,
            ),
        [size, weight, color, className, display, align, sub],
    );

    // eslint-disable-next-line react/no-children-prop
    return createElement(variant || TextVariants.SPAN, {
        children: content,
        className: textClassName,
        ref,
        onClick,
        name,
        ...other,
    });
});

Text.displayName = 'Text';
Text.defaultProps = {
    children: null,
    ns: '',
    t: '',
    prefix: '',
    postfix: '',
    options: {},
    size: TextSizes.S5,
    weight: TextWeights.EMPTY,
    color: TextColors.EMPTY,
    display: TextDisplays.EMPTY,
    align: TextAlignments.EMPTY,
    variant: TextVariants.SPAN,
    className: '',
};

export default React.memo(Text);
