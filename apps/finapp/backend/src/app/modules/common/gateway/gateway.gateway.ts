import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { TaskService } from '../../tasks/task/task.service';
import { ConnectedUserService } from './connected-user.service';
import { JwtService } from '@nestjs/jwt';
import { Task } from '../../tasks/task/schemas/task.entity';


@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private connectedUserService: ConnectedUserService,
    private jwtService: JwtService,
  ) {
  }

  afterInit(server: Server) {
    this.logger.log('Socket-server up');
  }

  @SubscribeMessage('commentChanged')
  commentChanged(client: Socket, comment: any): void {
    // TODO: Create comments API
    // const users = [task.createdBy, task.reviewer, task.assignee];
    // // users = users.filter(u => u.connections[0].socketId !== client.id);
    // const notifyUsers = await this.connectedUserService.getUsers(users);
    // for (const user of notifyUsers) {
    //   // TODO: Is it need to change 'Task' to 'TaskResponseDto'?
    //   await this.server.to(user.socketId).emit('taskUpdated', { updatedBy: task.updatedBy, task });
    // }
  }

  @SubscribeMessage('taskChanged')
  async taskChanged(client: Socket, task: Task): Promise<void> {
    const users = [task.createdBy, task.reviewer, task.assignee];
    // users = users.filter(u => u.connections[0].socketId !== client.id);
    const notifyUsers = await this.connectedUserService.getUsers(users);
    for (const user of notifyUsers) {
      // TODO: Is it need to change 'Task' to 'TaskResponseDto'?
      await this.server.to(user.socketId).emit('taskUpdated', { updatedBy: task.updatedBy, task });
    }
    // TODO: save changes to database
  }

  async handleDisconnect(client: Socket) {
    await this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const tokenUser = await this.jwtService.verify(client.handshake.headers.authorization);
      const user = await this.userService.getByID(tokenUser.id, ['roles']);
      if (!user) {
        return this.disconnect(client);
      }
      this.logger.log(`Client connected: ${client.id}`);
      client.data.user = user;
      await this.connectedUserService.create(client.id, user);
      // return this.server.to(client.id).emit('notifications', notifications);
    }
    catch(err) {
      console.log(err)
      return this.disconnect(client);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
    this.logger.log(`Client disconnected: ${socket.id}`);
  }
}
