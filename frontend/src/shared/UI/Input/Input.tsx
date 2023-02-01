import React, { useState, useMemo, useCallback, useRef } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { cnb } from 'cnbuilder';

import { Text } from '../Text';
import { TextVariants, TextSizes, TextColors } from '../Text/TEXT_PROPS';

import { InputTypes } from './const';

import styles from './Input.module.scss';

type Props = {
    label?: string;
    className?: string;
    error?: boolean;
    type?: InputTypes;
    endAdornment?: React.ReactNode | null;
    value?: string | number;
    maxLength?: number;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    register?: {
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
        name: string;
        ref: (node: React.ReactNode) => void;
    };
    classes?: {
        root?: string;
        input?: string;
        notchedOutline?: string;
    };
    outlinedInputClassname?: string;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isRegisterChangeDisabled?: boolean;
};

const Input = (props: Props) => {
    const {
        label,
        classes,
        className,
        error = false,
        type = InputTypes.TEXT,
        endAdornment = null,
        placeholder,
        maxLength,
        value = '',
        onChange = () => null,
        register = {
            onChange: () => null,
            onBlur: () => null,
            name: '',
            ref: useRef,
        },
        outlinedInputClassname,
        onBlur = () => null,
        onFocus = () => null,
        isRegisterChangeDisabled = false,
    } = props;

    const [values, setValues] = useState({
        amount: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const { onChange: registerOnChangeHandler, onBlur: registerOnBlurHandler, name, ref } = register;

    const inputRef = useRef();

    const isPasswordType = useMemo(() => {
        return type === InputTypes.PASSWORD ? true : false;
    }, [type]);

    const handleChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!isRegisterChangeDisabled) {
                registerOnChangeHandler(event);
            }
            onChange(event);
        },
        [registerOnChangeHandler, onChange, isRegisterChangeDisabled],
    );

    const handleBlur = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            if (!isRegisterChangeDisabled) {
                registerOnBlurHandler(event);
            }
            onBlur(event);
        },
        [registerOnBlurHandler, onBlur, isRegisterChangeDisabled],
    );

    const handleFocus = useCallback(
        (event: React.FocusEvent<HTMLInputElement>) => {
            onFocus(event);
        },
        [onFocus],
    );

    // const handleClickShowPassword = useCallback(() => {
    //     setValues({
    //         ...values,
    //         showPassword: !values.showPassword,
    //     });
    // }, [values]);

    // const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    //     event.preventDefault();
    // }, []);

    const getEndAdornment = useCallback(() => {
        if (isPasswordType) {
            // password
        } else {
            return endAdornment;
        }
    }, [isPasswordType, endAdornment]);

    return (
        <FormControl
            className={cnb(styles.formControl, className, {
                [styles.hidden]: type === InputTypes.HIDDEN,
            })}
            variant="outlined"
        >
            <InputLabel
                htmlFor="outlined-adornment-value"
                className={styles.inputLabel}
                classes={{
                    shrink: styles.shrinkInputLabel,
                    focused: styles.focusedInputLabel,
                }}
            >
                <Text
                    className={styles.inputLabelTexts}
                    variant={TextVariants.SPAN}
                    size={TextSizes.S5}
                    color={TextColors.DEFAULT}
                >
                    {label}
                </Text>
            </InputLabel>
            <OutlinedInput
                type={values.showPassword ? 'text' : type}
                value={value}
                ref={isRegisterChangeDisabled ? inputRef : ref}
                className={cnb(styles.outlinedInput, outlinedInputClassname, {
                    [styles.outlinedInputWithError]: error,
                })}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                inputProps={{
                    name,
                    maxLength,
                }}
                classes={{
                    input: cnb(styles.input, classes?.input),
                    root: cnb(styles.root, classes?.root, {
                        [styles.hidden]: type === InputTypes.HIDDEN,
                    }),
                    focused: styles.focused,
                    notchedOutline: cnb(styles.notchedOutline, classes?.notchedOutline, {
                        [styles.notchedOutlineWithError]: error,
                    }),
                }}
                endAdornment={getEndAdornment()}
                label={label}
            />
        </FormControl>
    );
};

export default React.memo(Input);
