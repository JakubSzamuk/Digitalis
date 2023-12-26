// import { create } from "zustand";

// interface WebSocketState {
  //   socket: WebSocket,
  //   subscribeToSocket: (bind_to: (event: any) => void) => void,
  //   resetSocket: () => void
  // }
  
  // const useWebSocketStore = create<WebSocketState>((set, get) => ({
    //   socket: new WebSocket(`ws://192.168.1.63:5000/messages`),
    //   // 
    //   subscribeToSocket: (bind_to: any) => {
      //     get().socket.onmessage = bind_to;
      //   },
      //   resetSocket: () => set(() => ({ socket: new WebSocket(`ws://${BACKEND_URL}/messages`) })),
      // }));
      
      // export default useWebSocketStore;
      


// using singleton to try and preserve the websockets connection between screens on the app
      
import { BACKEND_URL } from "@env";
let instance = null;
class WebSocketController {
  constructor() {
    if (!instance) {
      instance = this;
      this.ws = new WebSocket(`ws://${BACKEND_URL}/messages`);
    }
    return instance;
  }
}

export default WebSocketController;