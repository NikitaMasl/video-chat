import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { cnb } from 'cnbuilder';
import { TextColors, TextSizes, TextWeights } from 'shared/UI/Text/TEXT_PROPS';
import { Grid } from 'shared/UI/Grid';
import { Text } from 'shared/UI/Text';
import { Message, Member } from '../types';

import styles from './TextChat.module.scss';

type Props = {
    index: number;
    message: Message;
    user?: Member;
    currentUserId?: string;
    isLoaderNeeded?: boolean;
    setRowHeight: ({ index, size }: { index: number; size: number }) => void;
};

const TextChatMessage = (props: Props) => {
    const { index, message, user, currentUserId, isLoaderNeeded, setRowHeight } = props;

    const rowRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (rowRef.current) {
            setRowHeight({ index, size: rowRef.current.clientHeight });
        }
    }, [rowRef, index, setRowHeight]);

    return (
        <div ref={rowRef}>
            {isLoaderNeeded && (
                <div className={styles.loaderContainer}>
                    {/* ToDo: change to normal loader */}
                    Loading...
                </div>
            )}
            <Grid
                container
                direction="row"
                wrap="nowrap"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={styles.messageContainer}
            >
                <Grid
                    item
                    container
                    direction="column"
                    wrap="nowrap"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    className={styles.msgContent}
                >
                    <Grid
                        item
                        container
                        direction="row"
                        wrap="nowrap"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Text color={TextColors.DARK_BLUE} size={TextSizes.S5} weight={TextWeights.MEDIUM}>
                            {user?.username}
                        </Text>
                        <Text
                            color={TextColors.DARK_BLUE}
                            size={TextSizes.S5}
                            weight={TextWeights.MEDIUM}
                            className={styles.pointDivider}
                        >
                            ·
                        </Text>
                        <Text color={TextColors.DARK_BLUE} size={TextSizes.S5} weight={TextWeights.MEDIUM}>
                            {format(message.sentAt, 'h:mm aaa')}
                        </Text>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        wrap="nowrap"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <Grid
                            item
                            container
                            direction="row"
                            wrap="nowrap"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            className={cnb(styles.msgTextContainer, {
                                [styles.myMsg]: currentUserId === user?.id,
                            })}
                        >
                            <Text
                                color={currentUserId === user?.id ? TextColors.WHITE : TextColors.DARK_BLUE}
                                size={TextSizes.S5}
                                weight={TextWeights.MEDIUM}
                            >
                                {message.text}
                            </Text>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default React.memo(TextChatMessage);
