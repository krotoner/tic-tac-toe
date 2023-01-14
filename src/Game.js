import React, {Component} from "react";
import winImg from './imgs/emoji2.svg';
import loseImg from './imgs/lose.png'
import oneMoreImg from './imgs/oneMore.png';
import handshakeImg from './imgs/Handshake.png';


const Square = ({ value,onClick })=> {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}// клетка поля

const StartGame = ({ onClick, choosedFig, room }) => {
  return (
    <div className="popup">
      <h1>Выбери сторону </h1>
      <div className="choosing-box">
        <span
          id="X"
          onClick={onClick}
          className={choosedFig === "X" ? "active" : ""}
        >
          X
        </span>

        <span
          id="O"
          onClick={onClick}
          className={choosedFig === "O" ? "active" : ""}
        >
          O
        </span>
      </div>
      <p> и отправь ссылку своему другу </p>
      <div id="output"> {window.location.href + "?" + room}</div>
    </div>
  );
}; // Окно начала игры. Выбор роли 1 игрока и присвоение оставшийся другому

const EndGameWindow = ({
  onClick,
  choosedFig,
  room,
  gameOver,
  winner,
  oneMoreHandler,
  draw
}) => {
  return (
    <div className="popup">
      {!gameOver ? (
        <StartGame onClick={onClick} choosedFig={choosedFig} room={room} />
      ) : (
        <PopupResultsWindow
          winner={winner}
          oneMoreHandler={oneMoreHandler}
          draw={draw}
        />
      )}
    </div>
  );
}; // окно конца игры

const PopupResultsWindow = ({ winner, oneMoreHandler, draw }) => {
  return (
    <div className="popup">
      {winner ? (
        <img src={winImg}
              alt ='winner'/>
      ) : draw ? (
        <img width="50px" src={handshakeImg} alt ='isDraw'/>
      ) : (
        <img width="50px" src={loseImg}  alt ='looser'/>
      )}

      <h1>{winner ? "Победа" : draw ? "Ничья" : "Поражение"} </h1>

      <img
        id={winner ? "winner" : draw ? "draw" : "loser"}
        className="one-more"
        src={oneMoreImg}
        onClick={oneMoreHandler}
        alt ='one-more'
      />
    </div>
  );
};  // окно отображения результатов игры

class Game extends Component {
  renderSquare(i) {
    let { squares, clickHandler, isYourMove } = this.props;
    return (
      <Square
        value={squares[i]}
        onClick={() => (isYourMove ? clickHandler(i) : "")}
      />
    );
  }

  render() {
    let {
      isFirstUser,
      figChoose,
      secondUserInGame,
      gameOver,
    } = this.props;
    let {...props} = this.props;
    console.log(props)
    return (
      <div className="Game">
        {(isFirstUser && !secondUserInGame) || gameOver ? (
          <EndGameWindow
            {...props}
            onClick={el => figChoose(el.target.id)}
          />
        ) : (
          ""
        )}

        <div className="info-bar">
          <div className="info">
            {this.props.isYourMove ? "Твой ход" : "Ход противника"}
          </div>
        </div>

        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}


export default Game;
