import { Content } from '@tiptap/react'

export type Note = {
  id: string
  title: string
  content: Content
  updatedAt: Date
}


export type UserData = {
  username: string
  passphrase: string
}