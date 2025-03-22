import React, { useState } from 'react'
import Board from './Board';
import {Window, MessageList, MessageInput} from "stream-chat-react"
import "./Chat.css"


function Game({channel, setChannel}){
    const [playersJoined, setPlayersJoined] = useState(channel.state.watcher_count === 2);
    const [result, setResult] = useState({winner: "none", state: "none"});

    channel.on("user.watching.start", (e) => {
        setPlayersJoined(e.watcher_count === 2);
    })

    channel.on("user.watching.stop", (e) => {
        setPlayersJoined(e.watcher_count === 2);    
    })

  return (
    <>
        {
            playersJoined ?
            (
                <div className="gameContainer">
                    <Board  result={result} setResult={setResult} />

                    <Window>
                        <MessageList hideDeletedMessages disableDateSeparator messageActions={["react"]} />     
                        <MessageInput noFiles />
                    </Window>

                    <button onClick={async() => {
                        await channel.stopWatching();
                        setChannel(null);
                    }}>Leave Game</button>
                </div>
            )
            :
            (<h1>Waiting for other player...</h1>)
        }
    </>
  )
}

export default Game
