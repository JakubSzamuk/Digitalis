import { create } from "zustand";
import { BACKEND_URL } from "@env";

interface WebSocketState {
  socket: WebSocket,
  subscribeToSocket: (bind_to: (event: any) => void) => void,
  resetSocket: () => void
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: new WebSocket(`ws://${BACKEND_URL}/messages`),
  subscribeToSocket: (bind_to: any) => {
    get().socket.onmessage = bind_to;
  },
  resetSocket: () => set(() => ({ socket: new WebSocket(`ws://${BACKEND_URL}/messages`) })),
}));

export default useWebSocketStore;