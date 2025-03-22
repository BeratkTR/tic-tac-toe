import React, { useState } from "react";
import axios from "axios"
import Cookies from "universal-cookie"

const cookies = new Cookies();

const Login = ({setIsAuth}) => {
    const [username, setUserName] = useState("")
    const [password, setPassword] = useState("")
    
    const handleLogin = async() => {
        try{
            const response = await axios.post("http://localhost:3000/login", {
                username, 
                password,
            })
            const {token, userId, firstName, lastName, username: apiUsername} = response.data;

            cookies.set("token", token);
            cookies.set("userId", userId);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("username", apiUsername);
            setIsAuth(true);
        }
        catch(err) {
            console.log(err)
        }
    }

    return(
        <div className="login">
            <label>Login</label>
            <input type="text" placeholder="Username" onChange={(e) => {setUserName(e.target.value)}} value={username}/>
            <input type="password" placeholder="Password" onChange={(e) => {setPassword(e.target.value)}} value={password}/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login;