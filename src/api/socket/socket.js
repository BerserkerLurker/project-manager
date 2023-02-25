import { io } from "socket.io-client";
import { pathSocket, urlSocket } from "..";

function socketOps(user) {
  const socket = io(urlSocket, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: `Bearer ${globalThis.targetProxy.accessToken}`,
      user: { userId: user.userId, email: user.email, name: user.name },
    },
    path: pathSocket,
  });

  socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
  });

  socket.on("connect_error", (err) => {
    if (err.message === "Authentication invalid.") {
      console.log("Bad token");
    } else {
      console.log(err.message);
    }
  });

  socket.on("connect", () => {
    console.log("connected");
  });
  return socket;
}

export default socketOps;
