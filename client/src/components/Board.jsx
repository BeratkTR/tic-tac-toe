import React, { useEffect, useState } from 'react'
import Square from './Square'
import {useChannelStateContext, useChatContext} from "stream-chat-react"
import {patterns} from "../WinningPatterns" 

function Board({result, setResult}) {
    const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
    const [player, setPlayer] = useState("X");
    const [turn, setTurn] = useState("X");

    const {channel} = useChannelStateContext();
    const {client} = useChatContext();

    useEffect(() => {
        checkWin();
        checkTie();
    }, [board])

    const chooseSquare = async(squareIndex) => {
        if(turn === player && board[squareIndex] === ""){
            setTurn(player === "X" ?  "O" : "X");

            await channel.sendEvent({
                type: "game-move",
                data: {squareIndex, player}
            })

            setBoard(board.map((val, i) => {
                if(i === squareIndex) return player;
                return val;
            }))
        }
    } 

    channel.on((e) => {
        if(e.type === "game-move"  &&  e.user.id !== client.userID){
            const currentPlayer = e.data.player === "X" ? "O" : "X";
            setPlayer(currentPlayer);
            setTurn(currentPlayer);

            setBoard(board.map((val, i) => {
                if(i === e.data.squareIndex) return e.data.player;
                return val;
            }))
        }
    })

    const checkWin = () => {
        patterns.forEach(currPattern => { 
            const firstPlayer = board[currPattern[0]];
            if(firstPlayer == "") return;

            let foundWinningPattern = true;
            currPattern.forEach(i => {
                if(board[i] != firstPlayer) foundWinningPattern = false;
            });

            if(foundWinningPattern){
                setResult({winner: firstPlayer, state: "won"})
                alert(firstPlayer + " Won!");
                return;
            }
        });
    }
    
    const checkTie = () => {
        let full = true;
         board.forEach(square => {
            if(square == "") full = false;
         })
        
        if(full){
            setResult(r => {
                if (r.state == "won") return r;

                alert("Tie");   
                return {winner: "none", state: "tie"};
            });
        }
    }

  return (
    <div className='board'>
        <div className="row">
            <Square val={board[0]} chooseSquare={() => {chooseSquare(0)}} />
            <Square val={board[1]} chooseSquare={() => {chooseSquare(1)}} />
            <Square val={board[2]} chooseSquare={() => {chooseSquare(2)}} />
        </div>
        <div className="row">
            <Square val={board[3]} chooseSquare={() => {chooseSquare(3)}} />
            <Square val={board[4]} chooseSquare={() => {chooseSquare(4)}} />
            <Square val={board[5]} chooseSquare={() => {chooseSquare(5)}} />
        </div>
        <div className="row">
            <Square val={board[6]} chooseSquare={() => {chooseSquare(6)}} />
            <Square val={board[7]} chooseSquare={() => {chooseSquare(7)}} />
            <Square val={board[8]} chooseSquare={() => {chooseSquare(8)}} />
        </div>
    </div>
  )
}

export default Board
