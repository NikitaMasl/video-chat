import React from 'react';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { useTranslation } from 'shared/lib/hooks/useTranslation';
import { Grid } from 'shared/UI/Grid';
import { Form } from 'shared/UI/Form';
import { Input } from 'shared/UI/Input';
import { Namespaces } from 'shared/const/i18n';

import styles from './LoginForm.module.scss';

const schema = Joi.object({
    username: Joi.string().trim().min(2).max(28).required(),
});

const LoginForm = () => {
    const { t } = useTranslation(Namespaces.COMMON);

    const {
        register,
        handleSubmit: onSubmitForm,
        formState: { errors: formError },
    } = useForm({
        resolver: joiResolver(schema),
    });

    const onSubmitHandler = onSubmitForm((data) => {
        console.log({ data });
    });

    return (
        <Grid
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            className={styles.container}
        >
            <Form onSubmit={onSubmitHandler} className={styles.form}>
                <Input label={t('loginForm.username.label')} register={register('username')} />
            </Form>
        </Grid>
    );
};

export default React.memo(LoginForm);
