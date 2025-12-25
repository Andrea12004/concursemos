let socket: WebSocket | null = null;

export const getSocket = (): WebSocket | null => {
  const authString = localStorage.getItem("authResponse");
  const authResponse = authString ? JSON.parse(authString) : null;

  if (!authResponse) {
    console.log("❌ No se puede conectar el socket: no se encontró authResponse");
    return null;
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  if (socket && socket.readyState === WebSocket.CONNECTING) {
    return socket;
  }

  const SOCKET_SERVER_URL = `ws://localhost:3000/ws`;
  socket = new WebSocket(SOCKET_SERVER_URL);

  socket.addEventListener("open", () => {
    console.log("✅ Conectado al WebSocket server");
  });

  socket.addEventListener("close", () => {
    console.log("🔌 Conexión cerrada");
  });

  socket.addEventListener("error", (err) => {
    console.error("❗ Error en WebSocket:", err);
  });

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.close();
    socket = null;
    console.log("🔌 Socket desconectado manualmente");
  }
};
