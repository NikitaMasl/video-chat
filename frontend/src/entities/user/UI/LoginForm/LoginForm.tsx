import React, { useContext } from 'react';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { LoginFormContext, LoginFormContextProvider } from 'entities/user/api/LoginFormContext';
import { useTranslation } from 'shared/lib/hooks/useTranslation';
import { Grid } from 'shared/UI/Grid';
import { Form } from 'shared/UI/Form';
import { Input } from 'shared/UI/Input';
import { Namespaces } from 'shared/const/i18n';
import { Text } from 'shared/UI/Text';
import { TextColors, TextSizes, TextWeights } from 'shared/UI/Text/TEXT_PROPS';
import { Button } from 'shared/UI/Button';
import { TypeButton } from 'shared/UI/Button/const';

import styles from './LoginForm.module.scss';

type Props = {
    isJoin?: boolean;
};

const schema = Joi.object({
    username: Joi.string().trim().min(2).max(28).required(),
});

const LoginForm = (props: Props) => {
    const { isJoin = false } = props;

    const {
        actions: { registerUserRequest },
        state: { errorMessage },
    } = useContext(LoginFormContext);

    const { t } = useTranslation(Namespaces.COMMON);

    const {
        register,
        handleSubmit: onSubmitForm,
        watch,
        formState: { errors: formError },
    } = useForm({
        resolver: joiResolver(schema),
    });

    const fields = {
        username: watch('username'),
    };

    const onSubmitHandler = onSubmitForm((data) => {
        registerUserRequest(data, isJoin);
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
                <Text size={TextSizes.S4} weight={TextWeights.BOLD} className={styles.title}>
                    {t('loginForm.title')}
                </Text>
                <Input
                    label={t('loginForm.username.label')}
                    value={fields.username}
                    error={Boolean(formError.username || errorMessage)}
                    register={register('username')}
                    className={styles.userInput}
                />
                {errorMessage && (
                    <Text color={TextColors.DANGER} size={TextSizes.S6} className={styles.errorText}>
                        {errorMessage}
                    </Text>
                )}
                <Button type={TypeButton.SUBMIT} className={styles.createBtn}>
                    {isJoin ? t('loginForm.joinMeeting') : t('loginForm.createMeeting')}
                </Button>
            </Form>
        </Grid>
    );
};

const PrefetchWrapper = (props: Props) => {
    const { isJoin } = props;

    return (
        <LoginFormContextProvider isJoin={isJoin}>
            <LoginForm {...props} />
        </LoginFormContextProvider>
    );
};

export default React.memo(PrefetchWrapper);
