// import { BACKEND_URL } from "@env";
import { create } from "zustand";

const TEMP_APP_KEY = "TEMP_APP_KEY";
const BACKEND_URL = "BACKEND_URL";


interface WebSocketState {
  socket: WebSocket,
  subscribeToSocket: (bind_to: (event: any) => void) => void,
  resetSocket: (callback: () => void) => void
}
  
const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: new WebSocket("wss://digitalis.jakubszamuk.co.uk/messages"),
  
  subscribeToSocket: (bind_to: any) => {
    get().socket.onmessage = bind_to;
  },
  resetSocket: (callback) => {set(() => ({ socket: new WebSocket("wss://digitalis.jakubszamuk.co.uk/messages") })); get().socket.onopen = () => callback()},
}));



export default useWebSocketStore;