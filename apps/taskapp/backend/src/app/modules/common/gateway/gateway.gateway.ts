import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { TaskService } from '../../tasks/task/task.service';
import { ConnectedUserService } from './connected-user.service';
import { JwtService } from '@nestjs/jwt';
import { Task } from '../../tasks/task/schemas/task.entity';
import { TaskCommentService } from '../../tasks/task-comment/task-comment.service';
import { TaskCommentEntity } from '../../tasks/task-comment/schemas/task-comment.entity';
import { User } from '../user/schemas/user.entity';


@WebSocketGateway({ cors: { origin: ['http://localhost:5000', 'http://localhost:3000', 'http://localhost:4200'] } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private taskCommentService: TaskCommentService,
    private connectedUserService: ConnectedUserService,
    private jwtService: JwtService,
  ) {
  }

  afterInit(server: Server) {
    this.logger.log('Socket-server up');
  }

  @SubscribeMessage('createComment')
  async commentChanged(client: Socket, comment: TaskCommentEntity): Promise<void> {
    let userIds = [comment.task.createdBy, comment.task.reviewer, comment.task.assignee,
      ...comment.notifyUsers].filter(u => !!u).map(u => u.id);
    const notifyUsers = await this.connectedUserService.getUsers(userIds);

    for (const user of notifyUsers) {
      await this.sendNotification<{updatedBy: User, comment: TaskCommentEntity}>(user.socketId, 'commentAdded', { updatedBy: comment.updatedBy, comment });
    }
  }

  @SubscribeMessage('taskChanged')
  async taskChanged(client: Socket, task: Task): Promise<void> {
    let userIds = [task.createdBy, task.reviewer, task.assignee].filter(u => !!u).map(u => u.id);

    const notifyUsers = await this.connectedUserService.getUsers(userIds);
    for (const user of notifyUsers) {
      await this.sendNotification<{updatedBy: User, task: Task}>(user.socketId, 'taskUpdated', { updatedBy: task.updatedBy, task });
    }
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

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

  private async sendNotification<T>(socketId: string, eventType: string, data: T): Promise<void> {
    // TODO: Is it need to change 'Task' to 'TaskResponseDto'?
    await this.server.to(socketId).emit(eventType, data);
    // TODO: save changes to database
  }
}
