const { x } = require("pdfkit");
const socketIo = require("socket.io");
const messageModel = require("../message/schema");
const { getUser, removeUser, newUser } = require("../users/index");

const createChat = (app) => {
  const io = socketIo(app);

  io.on("connection", (socket) => {
    socket.on("newUser", async ({ username }) => {
      const user = await newUser(username, socket.id);
      const newIn = user.map((x) => x.username);
      io.emit("online", newIn);
    });
    socket.on("sendMessage", async (message) => {
      const connectedUser = await getUser();

      const newMessage = new messageModel(message);
      const save = await newMessage.save();

      const check = connectedUser.find((user) => user.username === save.to);
      if (!check) {
        const err = new Error();
        err.httpStatusCode = 404;
        err.message = "User not found";
        throw err;
      }
      io.to(check.userId).emit("message", {
        from: save.from,
        recipient: save.recipient,
        message: save.message,
      });
    });

    socket.on("disconnect", async () => {
      await removeUser(socket.id);

      const getAll = await getUser();
      const findAll = getAll.map((x) => x.username);

      io.emit("online", findAll);
    });
  });
};

module.exports = createChat;
