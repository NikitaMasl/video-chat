import React, { useCallback, forwardRef } from 'react';

interface IProps {
    children?: any;
    className?: string;
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => void;
    onReset?: (ev: React.FormEvent<HTMLFormElement>) => void;
    autoComplete?: string;
    id?: string;
}

const Form = forwardRef<HTMLFormElement, IProps>((props, ref) => {
    const { children, className, onSubmit, autoComplete, id } = props;

    const handleSubmit = useCallback(
        (ev: any) => {
            ev.preventDefault();
            onSubmit(ev);
        },
        [onSubmit],
    );

    return (
        <form id={id} className={className} onSubmit={handleSubmit} ref={ref} autoComplete={autoComplete}>
            {children}
        </form>
    );
});

Form.defaultProps = {
    className: '',
    autoComplete: 'off',
};

Form.displayName = 'Form';

export default React.memo(Form);
