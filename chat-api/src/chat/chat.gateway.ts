import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface IMessage {
  username: string;
  content: string;
  timeSent: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Socket;

  clients: { client: Socket; username?: string }[] = [];
  chatMessages: IMessage[] = [];

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    this.server.emit('message', payload);
    console.log({ payload });
    return 'Hello world!';
  }

  @SubscribeMessage('send-message')
  handleChatMessage(client: any, payload: IMessage): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c.username) {
      this.server.emit('send-message', {
        ...payload,
      });

      this.chatMessages.push({
        ...payload,
      });

      console.log('chatMessages', this.chatMessages);
    }
  }

  @SubscribeMessage('set-username')
  handleUsernameSet(client: any, payload: any): void {
    const c = this.clients.find((c) => c.client.id === client.id);
    if (c) {
      c.username = payload.username;
    }
  }

  @SubscribeMessage('check-username-exist')
  handleCheckUsernameExist(client: any, payload: any): void {
    client.emit(
      'username-exist',
      this.clients.some(({ username: u }) => u === payload.username),
    );
  }

  handleConnection(client: Socket) {
    console.log('client connected ', client.id);
    this.clients.push({
      client,
      username: '',
    });
    client.emit('send-old-messages', this.chatMessages);
    console.log({ id: client.id });
  }

  handleDisconnect(client: any) {
    console.log('client disconnected ', client.id);
    this.clients = this.clients.filter((c) => c.client.id !== client.id);
  }
}
