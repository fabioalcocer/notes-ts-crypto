import { AES, enc } from 'crypto-js'
import { ChangeEvent, FormEvent, useState } from 'react'
import styles from './LoginPage.module.css'
import storage from './storage'

const PASSPHRASE_STORAGE_KEY = 'passphrase'

type Props = {
  setUserData: (userData: {
    userName: string
    passphrase: string
  }) => void
}

function LoginPage({ setUserData }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <div className={styles.pageContainer}>
      <form className={styles.loginContainer} onSubmit={handleSubmit}>
        <label>
          <div className={styles.labelText}>Username</div>
          <input
            type='text'
            name='username'
            className={styles.textField}
            onChange={handleChangeUsername}
            value={username}
          />
        </label>
        <label>
          <div className={styles.labelText}>Password</div>
          <input
            type='password'
            name='Password'
            className={styles.textField}
            onChange={handleChangePassword}
            value={password}
          />
        </label>
        <div>
          <button type='submit' className={styles.button}>
            Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
