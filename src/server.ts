import * as http from "http";
import * as path from "path";
import * as express from "express";
import * as WebSocket from "ws";
import * as favicon from "serve-favicon";

const PORT = process.env.PORT || 8999;

const app = express();

app.use(favicon(path.join(__dirname, "client", "favicon.ico")));
app.use(express.static(path.join(__dirname, "client")));

const server = http.createServer(app);

const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log("recieved: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server started 0.0.0.0:${PORT}`);
});
