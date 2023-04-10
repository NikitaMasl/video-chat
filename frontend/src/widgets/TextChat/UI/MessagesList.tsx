import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { ListOnItemsRenderedProps, ListOnScrollProps, VariableSizeList as List, VariableSizeList } from 'react-window';
// import AutoSizer from 'react-virtualized-auto-sizer';
import { Member, ChatHistoryState, Message } from '../types';
import TextChatMessage from './TextChatMessage';

import styles from './TextChat.module.scss';

type Props = {
    chatMessages: Message[];
    currentUserId?: string;
    usersMap: Map<string, Member>;
    requestHistoryState: ChatHistoryState;
    isGetChatMessagesInProcessing: boolean;
    onGetMoreMessages: () => void;
};

const MessagesList = (props: Props) => {
    const {
        chatMessages,
        currentUserId,
        requestHistoryState,
        usersMap,
        isGetChatMessagesInProcessing,

        onGetMoreMessages,
    } = props;

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    // const listRef = useRef<VariableSizeList<any | null>>(null);
    const listScrollTopRef = useRef<number>(0);

    const stopVisibleIndexRef = useRef<number>(0);

    const rowHeights = useRef<Record<string, number>>({});

    // const Row = ({ index, style }: { index: number; style: any }) => {
    //     return (
    //         <div key={chatMessages[index].id} style={style}>
    //             <TextChatMessage
    //                 index={index}
    //                 setRowHeight={setRowHeight}
    //                 currentUserId={currentUserId}
    //                 message={chatMessages[index]}
    //                 isLoaderNeeded={index === 0 && isGetChatMessagesInProcessing}
    //                 user={usersMap.get(chatMessages[index].senderId)}
    //             />
    //         </div>
    //     );
    // };

    const getRowHeight = useCallback((index: number) => {
        return rowHeights.current[index] + 8 || 82;
    }, []);

    // const setRowHeight = useCallback(({ index, size }: { index: number; size: number }) => {
    //     if (!listRef.current) {
    //         return;
    //     }

    //     listRef.current.resetAfterIndex(0);
    //     rowHeights.current = { ...rowHeights.current, [index]: size };
    // }, []);

    // const onListScrollHandler = useCallback(
    //     ({ scrollOffset }: ListOnScrollProps) => {
    //         listScrollTopRef.current = scrollOffset;
    //         if (scrollOffset < 200 && scrollOffset > 0 && !isGetChatMessagesInProcessing) {
    //             onGetMoreMessages();
    //         }
    //     },
    //     [isGetChatMessagesInProcessing, onGetMoreMessages],
    // );

    // const onItemsRenderedHandler = useCallback(
    //     (props: ListOnItemsRenderedProps) => {
    //         if (isFirstRender) {
    //             setIsFirstRender(false);
    //             listRef.current?.scrollToItem(chatMessages.length - 1);
    //         }

    //         stopVisibleIndexRef.current = props.visibleStopIndex;
    //     },
    //     [isFirstRender, chatMessages.length],
    // );

    // useEffect(() => {
    //     if (!chatMessages.length || !requestHistoryState.take) {
    //         return;
    //     }

    //     if (listScrollTopRef.current < 50) {
    //         listRef.current?.scrollToItem(requestHistoryState.take - 1, 'start');
    //         return;
    //     }

    //     if (chatMessages.length - stopVisibleIndexRef.current < 5) {
    //         listRef.current?.scrollToItem(chatMessages.length - 1);
    //     }
    // }, [chatMessages.length, requestHistoryState.take]);

    return <div>Messages list</div>;

    // return (
    // <AutoSizer>
    //     {({ width, height }: { width?: number; height?: number }) => (
    //         <List
    //             className={styles.list}
    //             ref={listRef}
    //             width={width as number}
    //             height={height as number}
    //             itemSize={getRowHeight}
    //             onScroll={onListScrollHandler}
    //             onItemsRendered={onItemsRenderedHandler}
    //             itemCount={chatMessages.length}
    //         >
    //             {Row}
    //         </List>
    //     )}
    // </AutoSizer>
    // );
};

export default React.memo(MessagesList);
