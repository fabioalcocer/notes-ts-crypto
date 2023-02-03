import { useState } from "react"
import LoginPage from "./LoginPage"
import NotesPage from './NotesPage'
import { UserData } from './types';

function App() {
  const [userData, setUserData] = useState<UserData>()
  
  return userData ? <NotesPage userData={userData}/> : <LoginPage setUserData={setUserData} />
}

export default App