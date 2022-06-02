import { Injectable } from '@angular/core';
import { CustomSocket } from './custom-socket';


@Injectable({
  providedIn: 'root'
})
export class SocketNotificationService {
  constructor(private socket: CustomSocket) {
  }

  connectToNotify(): void {
    this.socket.emit('addMessage', 'connectToNotify');
  }

  disconnectFromNotify(): void {
    this.socket.emit('addMessage', 'disconnectFromNotify');
  }

  sendTaskChangedNotification(): void {
    this.socket.emit('taskChanged', 'sendTaskChangedNotification');
  }

  getTaskChangedNotification(): void {
    console.log(this.socket.fromEvent<any>(''))
  }

  getNotifications(): void {
    console.log(this.socket.fromEvent<any>(''))
  }
}

