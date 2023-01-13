import React, {Component} from "react";
import io from "socket.io-client";
import Chat from './Chat';
import Game from './Game';
import calculateWinner from './functions/calculateWinner.js'



class Link extends Component {
  constructor(props) {
    super(props);
    this.path = window.location.search;

    this.state = {
      message: "",
      messages: [],
      gameMap: Array(9).fill(null),
      firstUserFig: "X",
      userSeq: 0,
      userId: this.path === "" ? 0 : 1,
      secondUserInGame: false,
      secondUserFig: "O",
      room: "",
      winnerArr: []
    };

    this.socket = io("localhost:5000");
    this.socket.on("RECEIVE_MESSAGE", data => {
      addMessage(data);
    });
    this.socket.on("RECIVE_GAME_MAP", data => {
      addGameMap(data);
    });
    this.socket.on("RECIVE_USERS_SEQUENCE", data => {
      addUserSeq(data);
    });
    this.socket.on("message", data => {
      secondUserAdd(data.condition);
    });
    this.socket.on("RECIVE_USERS_FIG", data => {
      chooseFig(data);
    });
    this.socket.on("ADD_ROOM", data => {
      addRoom(data);
    });
    this.socket.on("message", data => {
      console.log(data);
    });

    if (this.path === "") {
      this.socket.emit("CONNECT_NEW_USER");
    } else {
      this.socket.emit("CONNECT_SECOND_USER", { roomId: this.path.substr(1) });
    }

    const addMessage = data => {
      this.setState({ messages: [...this.state.messages, data] });
    };

    const addGameMap = data => {
      this.setState({
        gameMap: data.gameMap
      });
    };

    const addUserSeq = data => {
      this.setState({
        userSeq: data.userSeq
      });
    };

    const secondUserAdd = data => {
      this.setState({
        secondUserInGame: data
      });
    };
    const chooseFig = data => {
      this.setState({
        firstUserFig: data.firstUserFig,
        secondUserFig: data.secondUserFig
      });
    };

    const addRoom = data => {
      this.setState({
        room: data.room
      });
    };
  }

  sendMessage = ev => {
    ev.preventDefault();
    this.socket.emit("SEND_MESSAGE", {
      author: this.state.userId,
      message: this.state.message
    });
    this.setState({ message: "" });
  };

  gameMapHandler = i => {
    let { firstUserFig, gameMap, secondUserFig } = this.state;
    const squares = gameMap.slice();
    if (squares[i]) {
      return;
    }
    squares[i] = this.path === "" ? firstUserFig : secondUserFig;

    this.socket.emit("SEND_GAME_MAP", {
      gameMap: squares
    });

    this.socket.emit("SEND_USERS_SEQUENCE", {
      userSeq: !this.state.userSeq
    });

    this.socket.emit("SEND_USERS_FIG", {
      firstUserFig: firstUserFig,
      secondUserFig: secondUserFig
    });
  };

  render() {
    let {
      username,
      message,
      messages,
      gameMap,
      userSeq,
      userId,
      firstUserFig,
      secondUserInGame,
      secondUserFig,
      room
    } = this.state;
    let isFirstUser = this.path==='';

    let winner = calculateWinner(this.state.gameMap);
    let youWin =
      userId === 0 ? winner === firstUserFig : winner === secondUserFig;

    const props ={
      squares:gameMap,
      draw: winner === 1,
      room,
      isYourMove:!isFirstUser ? userSeq : !userSeq,
      isFirstUser,
      secondUserInGame,
      winner:youWin,
      gameOver: winner !== null,
      clickHandler:this.gameMapHandler,
      choosedFig: firstUserFig,
      username,
      message,
      messages,
      sendMessage:this.sendMessage,
      userId
  }

    return (
      <div className="box">
        <Game {...props}
          oneMoreHandler={el =>
            this.setState({
              gameMap: Array(9).fill(null),
              gameOver: false
            })
          }
          figChoose={el => {
            this.setState({
              firstUserFig: el,
              secondUserFig: el === "X" ? "O" : "X"
            });
          }}
        />

        <Chat {...props}
          messageChange={ev =>
            this.setState({
              message: ev
            })
          }
        />
      </div>
    );
  }
}

export default Link;
