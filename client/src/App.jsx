import { useState } from 'react'
import SignUp from './components/SignUp'
import Login from './components/Login'
import {StreamChat} from "stream-chat"
import {Chat} from "stream-chat-react"
import Cookies from "universal-cookie"
import JoinGame from './components/JoinGame'
import "./app.css"
// import "stream-chat-react/dist/css/v2/index.css";


const cookies = new Cookies();
const api_key = "5hg4s6q98wqc";
const client = StreamChat.getInstance(api_key)

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("username");
    cookies.remove("hashedPassword"); 
    client.disconnectUser();
    setIsAuth(false);
  }

  const token = cookies.get("token"); 
  if(token){
    client.connectUser(
      {
        id: cookies.get("userId"),
        name: cookies.get("username"),
        firstName: cookies.get("firstName"),
        lastName: cookies.get("lastName"), 
        hashedPassword: cookies.get("hashedPassword"),
      }, token
    )
    .then((user) => {
      setIsAuth(true)
    });
  }

  return (
      <div className="App">
        {
          isAuth ? 
          (
            <Chat client={client}> 
              <JoinGame/>
              <button onClick={logOut}>Logout</button>
            </Chat>
          )
          :
          (
            <>
              <SignUp setIsAuth={setIsAuth}/>
              <Login setIsAuth={setIsAuth}/>
            </>
          )
        }
      </div>
  )
}

export default App
