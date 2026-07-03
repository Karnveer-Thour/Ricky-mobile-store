import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class AppGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(AppGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Bidirectional chat messaging
  @SubscribeMessage('chat:message')
  handleChatMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received message: ${JSON.stringify(data)}`);
    // Broadcast to all connected clients (e.g. admin chat list updates)
    this.server.emit('chat:message', data);
  }

  // Customer typing indicators
  @SubscribeMessage('chat:typing')
  handleTyping(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.emit('chat:typing', data);
  }

  // Method to trigger checkout failure alert from backend controllers
  emitCheckoutFailed(orderId: string, customerId: string, failedLender: string) {
    const payload = { orderId, customerId, failedLender, timestamp: new Date().toISOString() };
    this.logger.log(`Emitting checkout:failed alert: ${JSON.stringify(payload)}`);
    this.server.emit('checkout:failed', payload);
  }

  // Method to trigger status changes
  emitOrderStatusChanged(orderId: string, newStatus: string) {
    const payload = { orderId, newStatus, timestamp: new Date().toISOString() };
    this.logger.log(`Emitting order:status_changed: ${JSON.stringify(payload)}`);
    this.server.emit('order:status_changed', payload);
  }
}
