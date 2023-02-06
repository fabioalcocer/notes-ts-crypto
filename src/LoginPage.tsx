import { AES, enc } from 'crypto-js'
import { ChangeEvent, FormEvent, useState } from 'react'
import { v4 as uuid } from 'uuid'
import styles from './LoginPage.module.css'
import storage from './utils/storage'
import { UserData } from './types'

const PASSPHRASE_STORAGE_KEY = 'passphrase'

type Props = {
  setUserData: (userData: UserData) => void
}

function LoginPage({ setUserData }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const encryptedPassphrase = storage.get<string | undefined>(
      `${username}: ${PASSPHRASE_STORAGE_KEY}`
    )
    if (!encryptedPassphrase) {
      const passphrase = uuid()
      storage.set(
        `${username}: ${PASSPHRASE_STORAGE_KEY}`,
        AES.encrypt(passphrase, password).toString()
      )
      setUserData({ username, passphrase })
      return
    }

    const passphrase = AES.decrypt(
      encryptedPassphrase,
      password
    ).toString(enc.Utf8)
    if (passphrase) {
      setUserData({ username, passphrase })
    } else {
      setErrorText('Invalid credentials for existing user')
    }
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
        {errorText}
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
          <button
            type='submit'
            className={styles.continueApplication}
          >
            <div>
              <div className={styles.pencil}></div>
              <div className={styles.folder}>
                <div className={styles.top}>
                  <svg viewBox='0 0 24 27'>
                    <path d='M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z'></path>
                  </svg>
                </div>
                <div className={styles.paper}></div>
              </div>
            </div>
            Continue Application
          </button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
