import React, { useState, useCallback } from 'react';
import Joi from 'joi';
import { useForm } from 'react-hook-form';
import Editor from 'draft-js-plugins-editor';
import { joiResolver } from '@hookform/resolvers/joi';
import { cnb } from 'cnbuilder';
import { Grid } from 'shared/UI/Grid';
import { Input } from 'shared/UI/Input';
import { InputTypes } from 'shared/UI/Input/const';
import { Button, TypeButton } from 'shared/UI/Button';
import SendIcon from 'shared/icons/SendIcon';
import { ContentEditableInput } from 'shared/UI/ContentEditableInput';
import { useTranslation } from 'shared/lib/hooks/useTranslation';
import { Namespaces } from 'shared/const/i18n';

import styles from './TextChat.module.scss';

const MAX_TEXT_CHAT_INPUT_LENGTH = 500;

const schema = Joi.object({
    text: Joi.string().required().trim().allow(''),
});

type Props = {
    editorRef: React.MutableRefObject<Editor | null>;
    onSendMessage: (text: string) => void;
};

type MessageFormData = {
    text: string;
};

const TextChatInput = (props: Props) => {
    const { editorRef, onSendMessage } = props;

    const { t } = useTranslation(Namespaces.COMMON);

    const [isNeedToCleareEditorState, setIsNeedToClearEditorState] = useState<boolean>(false);

    const { watch, register, handleSubmit, setValue, reset } = useForm({
        resolver: joiResolver(schema),
        defaultValues: {
            text: '',
        },
    });

    const watchValues = {
        text: watch('text'),
    };

    const changeEditorCleareState = useCallback(() => setIsNeedToClearEditorState((p) => !p), []);

    const onSubmit = handleSubmit(({ text }: MessageFormData) => {
        if (!text.length) {
            return;
        }
        onSendMessage(text);
        reset();
        changeEditorCleareState();
    });

    const editorKeyDownHandler = useCallback((event: React.KeyboardEvent) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            onSubmit();
        }
    }, []);

    const addTextToState = useCallback((text: string) => setValue('text', text), []);

    return (
        <Grid item container justifyContent="center" alignItems="center" className={styles.contentEditableWrapper}>
            <form className={styles.form} onSubmit={onSubmit}>
                <Input type={InputTypes.HIDDEN} value={watchValues.text} register={register('text')} />
                <ContentEditableInput
                    ref={editorRef}
                    maxInputLength={MAX_TEXT_CHAT_INPUT_LENGTH}
                    isNeedToCleareEditorState={isNeedToCleareEditorState}
                    onKeyDownHandler={editorKeyDownHandler}
                    changeEditorCleareState={changeEditorCleareState}
                    addTextToState={addTextToState}
                    placeholder={t('textChat.inputPlaceholder')}
                    classes={{
                        root: styles.contentEditableInput,
                    }}
                    buttonComponent={
                        <Button
                            type={TypeButton.SUBMIT}
                            className={cnb(styles.sendBtn, {
                                [styles.disabled]: !watchValues.text.length,
                            })}
                        >
                            <SendIcon className={styles.sendIcon} />
                        </Button>
                    }
                />
            </form>
        </Grid>
    );
};

export default React.memo(TextChatInput);
