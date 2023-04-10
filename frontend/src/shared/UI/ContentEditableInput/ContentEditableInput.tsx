import React, { useState, useCallback, forwardRef, useEffect, useMemo } from 'react';
import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import { cnb } from 'cnbuilder';

import styles from './ContentEditableInput.module.scss';

type Props = {
  maxInputLength: number;
  placeholder?: string;
  classes?: {
    root: string;
  };
  buttonComponent?: React.ReactNode;
  isNeedToCleareEditorState: boolean;
  changeEditorCleareState: () => void;
  onKeyDownHandler: (event: React.KeyboardEvent) => void;
  addTextToState: (text: string) => void;
};

const ContentEditableInput = forwardRef<Editor | null, Props>((props, ref) => {
  const {
    maxInputLength = 500,
    placeholder,
    buttonComponent,
    isNeedToCleareEditorState,
    classes,
    changeEditorCleareState,
    onKeyDownHandler,
    addTextToState,
  } = props;

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const text = useMemo(() => editorState.getCurrentContent().getPlainText(), [editorState]);

  const handleBeforeInput = useCallback(() => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    if (currentContentLength > maxInputLength - 1) {
      return 'handled';
    } else {
      return 'not-handled';
    }
  }, [editorState, maxInputLength]);

  const addPastedContent = useCallback(
    (input: string, editorState: EditorState) => {
      const inputLength = editorState.getCurrentContent().getPlainText().length;
      const remainingLength = maxInputLength - inputLength;

      const selectionState = editorState.getSelection();

      const start = selectionState.getStartOffset();
      const end = selectionState.getEndOffset();

      const selectedTextLength = end - start;

      const newContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        selectionState,
        input.slice(0, remainingLength + selectedTextLength),
      );

      setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
    },
    [maxInputLength],
  );

  const handlePastedText = useCallback(
    (pastedText: string) => {
      const currentContent = editorState.getCurrentContent();
      const currentContentLength = currentContent.getPlainText('').length;

      if (currentContentLength + pastedText.length > maxInputLength) {
        const tempEditorState = editorState;
        addPastedContent(pastedText, tempEditorState);

        return 'handled';
      }

      return 'not-handled';
    },
    [editorState, maxInputLength, addPastedContent],
  );

  const moveSelectionToEnd = (editor: EditorState) => {
    const content = editor.getCurrentContent();
    const blockMap = content.getBlockMap();

    const key = blockMap.last().getKey();
    const length = blockMap.last().getLength();

    const selection = new SelectionState({
      anchorKey: key,
      anchorOffset: length,
      focusKey: key,
      focusOffset: length,
    });
    return EditorState.forceSelection(editor, selection);
  };

  const focusHandler = useCallback(() => {
    setEditorState(moveSelectionToEnd(editorState));
  }, [editorState]);

  const handleReturn = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.shiftKey && e.keyCode === 13) {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const textWithEntity = Modifier.splitBlock(currentContent, selection);

        setEditorState(EditorState.push(editorState, textWithEntity, 'split-block'));

        return 'not-handled';
      }

      return 'handled';
    },
    [editorState],
  );

  useEffect(() => {
    addTextToState(text || '');
  }, [text]);

  useEffect(() => {
    if (isNeedToCleareEditorState) {
      const clearedEditorState = EditorState.push(editorState, ContentState.createFromText(''), 'undo');
      setEditorState(moveSelectionToEnd(clearedEditorState));
      changeEditorCleareState();
    }
  }, [isNeedToCleareEditorState]);

  return (
    <>
      {editorState ? (
        <div
          className={cnb(classes?.root, styles.container)}
          onKeyDown={onKeyDownHandler}
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ref.current!.focus();
          }}
        >
          <Editor
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            classes={{
              root: styles.editorRoot,
            }}
            editorKey="editor"
            editorState={editorState}
            onChange={setEditorState}
            onFocus={focusHandler}
            handleBeforeInput={handleBeforeInput}
            handlePastedText={handlePastedText}
            handleReturn={handleReturn}
            placeholder={placeholder}
            ref={ref}
          />
          {buttonComponent && buttonComponent}
        </div>
      ) : null}
    </>
  );
});

ContentEditableInput.displayName = 'ContentEditableInput';

export default React.memo(ContentEditableInput);
