import React, { useState } from "react";
import { Channel, useChatContext } from "stream-chat-react";
import Game from "./Game";

const JoinGame = () => {
    const [rivalUsername, setRivalUsername] = useState("");
    const {client} = useChatContext();
    const [channel, setChannel] = useState("");

    const createChannel = async() => {
        const response = await client.queryUsers({name: rivalUsername });
        if(response.users.length === 0) return alert("User not found");

        const newChannel = await client.channel("messaging", {
            members: [client.userID, response.users[0].id],
        })
        await newChannel.watch();
        setChannel(newChannel);
    }

    return(
        <>
            {
                channel ? 
                (
                    <Channel channel={channel}>
                        <Game channel={channel} setChannel={setChannel}/>
                    </Channel>
                )
                :
                (
                    <div className="joinGame">
                        <h3>Create Game</h3>
                        <input type="text" placeholder="Username of rival..." onChange={(e) => {setRivalUsername(e.target.value)}} value={rivalUsername}/>
                        <button onClick={createChannel}>Join/Start Game</button>
                    </div>
                )
            }
        </>
    );
}

export default JoinGame;