import { useEffect, useState } from 'react'
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

const serverIP = "localhost";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getUser = async() => {
      const username = await cookies.get("username")
      setUsername(username)
      console.log(username)
    }
    getUser();
  }, [])
  

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
            <div>
              <nav>
                <div className="username">Username: <span style={{textDecoration: "underline", fontWeight: "bolder"}}>{username}</span></div>
                <button onClick={logOut} className='logout-btn'>Logout</button>
              </nav>

              <Chat client={client}> 
                <JoinGame/>
              </Chat>
            </div>
          )
          :
          (
            <div className='authentication'>
              <SignUp setIsAuth={setIsAuth} serverIP={serverIP}/>
              <Login setIsAuth={setIsAuth} serverIP={serverIP}/>
            </div>
          )
        }
      </div>
  )
}

export default App
