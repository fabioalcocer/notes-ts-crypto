import { JSONContent } from '@tiptap/react'
import { Note } from './types'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import styles from './NoteEditor.module.css'

const extensions = [StarterKit]

type Props = {
  note: Note
  onChange: (content: JSONContent, title?: string) => void
}

function NoteEditor({ note, onChange }: Props) {
  const editor = useEditor(
    {
      extensions,
      content: note.content,
      editorProps: {
        attributes: {
          class: styles.textEditor,
        },
      },
      onUpdate: ({ editor }) => {
        const editorContent = editor.getJSON()
        const firstNoteContent = editorContent.content?.[0]
        onChange(
          editorContent,
          firstNoteContent && generateText(firstNoteContent, extensions)
        )
      },
    },
    [note.id]
  )

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run()
  }

  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run()
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button
          className={
            editor?.isActive('bold')
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleBold}
        >
          Bold
        </button>
        <button
          className={
            editor?.isActive('italic')
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleItalic}
        >
          Italic
        </button>
      </div>
      <EditorContent
        editor={editor}
        className={styles.textEditorContent}
      />
    </div>
  )
}

export default NoteEditor
