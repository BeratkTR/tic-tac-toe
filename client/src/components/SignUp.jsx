import React, { useState, useTransition } from "react";
import axios from "axios"
import Cookies from "universal-cookie"

const cookies = new Cookies();

const SignUp = ({setIsAuth, serverIP}) => {
    const [user, setUser] = useState({})

    const handleSignUp  = async(e) => {
        try{
            const response = await axios.post(`http://${serverIP}:3000/signup`, user)
            const {token, userId, firstName, lastName, username, hashedPassword} = response.data;

            cookies.set("token", token);
            cookies.set("userId", userId);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("username", username);
            cookies.set("hashedPassword", hashedPassword); 
            setIsAuth(true);
        }
        catch(err) {
            console.log(err)
        }
    }

    return(
        <div className="signUp">
            <label>Sign Up</label>
            <input type="text" placeholder="First Name" onChange={(e) => {setUser({...user, firstName: e.target.value})}}/>
            <input type="text" placeholder="Last Name" onChange={(e) => {setUser({...user, lastName: e.target.value})}}/>
            <input type="text" placeholder="Username" onChange={(e) => {setUser({...user, username: e.target.value})}}/>
            <input type="password" placeholder="Password" onChange={(e) => {setUser({...user, password: e.target.value})}}/>
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    )
}

export default SignUp;