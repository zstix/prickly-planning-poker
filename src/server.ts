import * as http from "http";
import * as path from "path";
import * as express from "express";
import * as WebSocket from "ws";
import * as favicon from "serve-favicon";

interface Client {
  vote?: number | null;
}

interface AppState {
  clients: Record<string, Client>;
  voting: boolean;
}

interface AppEvent {
  type: "vote" | "flip";
  payload: number | boolean;
}

const PORT = process.env.PORT || 8999;

const app = express();

app.use(favicon(path.join(__dirname, "client", "favicon.ico")));
app.use(express.static(path.join(__dirname, "client")));

const server = http.createServer(app);

const wsServer = new WebSocket.Server({ server });

const state: AppState = {
  clients: {},
  voting: true,
};

wsServer.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
  const key = process.env.DEBUG
    ? new Date().toISOString()
    : req.socket.remoteAddress!;

  state.clients[key] = {
    vote: undefined,
  };

  const sendState = (type: string) => {
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, state }));
      }
    });
  };

  const resetVotes = () => {
    state.clients = Object.fromEntries(
      Object.entries(state.clients).map(([id, client]) => [
        id,
        { ...client, vote: null },
      ])
    );
  };

  ws.on("message", (message: string) => {
    const data = JSON.parse(message) as AppEvent;
    switch (data.type) {
      case "vote":
        state.clients[key].vote = data.payload as number;
        sendState("vote");
        break;
      case "flip":
        state.voting = data.payload as boolean;
        if (!state.voting) {
          resetVotes();
        }
        sendState("flip");
        break;
    }
  });

  ws.on("close", () => {
    delete state.clients[key];
    sendState("disconnect");
  });

  sendState("connection");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server started 0.0.0.0:${PORT}`);
});
