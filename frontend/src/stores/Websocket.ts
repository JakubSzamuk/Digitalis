import { create } from "zustand";
import { BACKEND_URL } from "@env";

interface WebSocketState {
  socket: WebSocket,
  subscribeToSocket: (bind_to: (event: any) => void) => void,
  resetSocket: () => void

  connected_contact: string,
  setConnectedContact: (id: string) => void
}

const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: new WebSocket(`ws://192.168.1.63:5000/messages`),
  // socket: new WebSocket(`ws://${BACKEND_URL}/messages`),
  subscribeToSocket: (bind_to: any) => {
    get().socket.onmessage = bind_to;
  },
  resetSocket: () => set(() => ({ socket: new WebSocket(`ws://${BACKEND_URL}/messages`) })),

  connected_contact: "",
  setConnectedContact: (id: string) => {
    get().socket.send(
      JSON.stringify({
        new_recipient_id: id,
      })
    );

    set(() => ({ connected_contact: id }));
  }
}));

export default useWebSocketStore;