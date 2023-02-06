import { JSONContent } from '@tiptap/react'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import styles from './NotesPage.module.css'
import NoteEditor from './NoteEditor'
import debounce from './utils/debounce'
import storage from './utils/storage'
import { Note, UserData } from './types'
import { AES, enc } from 'crypto-js'

type Props = {
  userData: UserData
}

const STORAGE_KEY = 'notes'

const loadNotes = ({ username, passphrase }: UserData) => {
  const noteIds = storage.get<string[]>(
    `${username}:${STORAGE_KEY}`,
    []
  )
  const notes: Record<string, Note> = {}
  noteIds.forEach((id) => {
    const encryptedNote = storage.get<string>(
      `${username}:${STORAGE_KEY}:${id}`
    )

    const note: Note = JSON.parse(
      AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8)
    )

    notes[note?.id] = {
      ...note,
      updatedAt: new Date(note?.updatedAt),
    }
  })
  return notes
}

const saveNote = debounce(
  (note: Note, { username, passphrase }: UserData) => {
    const noteIds = storage.get<string[]>(
      `${username}:${STORAGE_KEY}`,
      []
    )
    const noteIdsWithoutNote = noteIds.filter((id) => id !== note.id)
    storage.set(`${username}:${STORAGE_KEY}`, [
      ...noteIdsWithoutNote,
      note.id,
    ])

    const encryptedNote = AES.encrypt(
      JSON.stringify(note),
      passphrase
    ).toString()

    storage.set(
      `${username}:${STORAGE_KEY}:${note.id}`,
      encryptedNote
    )
  },
  200
)

function NotesPage({ userData }: Props) {
  const [active, setActive] = useState<boolean>(false)
  const [notes, setNotes] = useState<Record<string, Note>>(() =>
    loadNotes(userData)
  )
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    null
  )
  const activeNote = activeNoteId ? notes[activeNoteId] : null

  const handleChangeNoteContent = (
    noteId: string,
    content: JSONContent,
    title = 'New Note'
  ) => {
    const updatedNote = {
      ...notes[noteId],
      updatedAt: new Date(),
      content,
      title,
    }

    setNotes((notes) => ({
      ...notes,
      [noteId]: updatedNote,
    }))

    saveNote(updatedNote, userData)
  }

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: 'New Note',
      content: `<h1>New Note</h1>`,
      updatedAt: new Date(),
    }

    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote,
    }))
    setActiveNoteId(newNote.id)
    saveNote(newNote, userData)
  }

  const handleChangeActiveNote = (id: string) => {
    setActiveNoteId(id)
  }

  const notesList = Object.values(notes).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  )

  return (
    <div className={styles.pageContainer}>
      <div
        className={
          active
            ? `${styles.sidebar} ${styles.active}`
            : styles.sidebar
        }
      >
        <button
          className={styles.sidebarButton}
          onClick={handleCreateNewNote}
        >
          +
        </button>
        <button
          onClick={() => setActive(!active)}
          className={styles.moveSidebar}
        >
          &gt;
        </button>
        <div className={styles.sidebarList}>
          {notesList.map((note) => (
            <div
              className={
                note.id === activeNoteId
                  ? styles.sidebarItemActive
                  : styles.sidebarItem
              }
              key={note.id}
              role='button'
              tabIndex={0}
              onClick={() => handleChangeActiveNote(note.id)}
            >
              <p>{note.title}</p>
            </div>
          ))}
        </div>
      </div>
      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) =>
            handleChangeNoteContent(activeNote.id, content, title)
          }
        />
      ) : (
        <div className={styles.emptyNoteText}>
          Create a new note or select an existing one.
        </div>
      )}
    </div>
  )
}

export default NotesPage
