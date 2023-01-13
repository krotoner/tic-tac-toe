let express = require("express");
let socket = require("socket.io");

let app = express();

let rooms = [];
let roomID;
server = app.listen(5000, function() {
  console.log("server is running on port 5000"); // инициализация сервера
});

io = socket(server);

io.on("connection", socket => {
  socket.on("CONNECT_NEW_USER", () => {
    var room = Math.round(Math.random() * 1000000); // подключенный первый пользователь
    socket.join(room); // добавить его в новую комнату
    io.emit("ADD_ROOM", { room: room });
    addRoom(room);

    socket.on("SEND_MESSAGE", data => {
      io.to(room).emit("RECEIVE_MESSAGE", data); //отправка первого пользовательского сообщения
    });
    console.log("first user add" + " " + room);

    socket.on("SEND_GAME_MAP", data => {
      io.to(room).emit("RECIVE_GAME_MAP", data); // игровая карта первого пользователя
    });

    socket.on("SEND_USERS_SEQUENCE", data => {
      io.to(room).emit("RECIVE_USERS_SEQUENCE", data); // первая пользовательская последовательность
    });
    socket.on("SEND_USERS_FIG", data => {
      io.to(room).emit("RECIVE_USERS_FIG", data); // первая пользовательская фигура
    });
  });

  socket.on("CONNECT_SECOND_USER", data => {  // подключенный второй пользователь
    let roomId = data.roomId;

    if (!containsTheRoom(roomId)) { // проверка номера
      io.emit("message", { message: "Room not found" });
    } else {
      console.log("second user add" + " " + roomId);

      io.in(data.roomId).clients((err, clients) => {
        if (clients.length < 2) {
          socket.join(roomId);
          io.to(roomId).emit("message", {
            message: "Second Player join Game",
            condition: true
          });
        }
      });


      socket.on("SEND_MESSAGE", data => { //отправка второго пользовательского сообщения
        io.to(roomId).emit("RECEIVE_MESSAGE", data);
      });

      socket.on("SEND_GAME_MAP", data => {
        io.to(roomId).emit("RECIVE_GAME_MAP", data); // вторая пользовательская игровая карта
      });

      socket.on("SEND_USERS_SEQUENCE", data => {
        io.to(roomId).emit("RECIVE_USERS_SEQUENCE", data); //второй пользователь пользовательская последовательность
      });

      socket.on("SEND_USERS_FIG", data => {
        io.to(roomId).emit("RECIVE_USERS_FIG", data);  // второй пользователь отправляет цифру
      });
    }
  });
});

function addRoom(roomId) {
  rooms.push(roomId);
}

function containsTheRoom(roomId) {
  return rooms.indexOf(roomId) !== -1 ? false : true;
}
