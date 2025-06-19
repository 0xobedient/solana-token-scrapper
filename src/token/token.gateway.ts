import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import WebSocket, { Server } from 'ws';

@WebSocketGateway()
export class TokenGateway {
  @WebSocketServer()
  server: Server;

  handleConnect(client: WebSocket) {
    let payload = {
      method: 'subscribeNewToken',
    };
    client.send(JSON.stringify(payload));
  }

  handleDisconnect() {}
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
