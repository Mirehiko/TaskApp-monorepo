import { Injectable } from '@angular/core';
import { CustomSocket } from './custom-socket';
import { Observable } from 'rxjs';


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

  sendTaskChangedNotification(data: any): void {
    this.socket.emit('taskChanged', data);
  }

  getTaskChangedNotification(): Observable<any> {
    return this.socket.fromEvent<any>('taskUpdated');
  }

  getNotifications(): Observable<any> {
    return this.socket.fromEvent<any>('')
  }
}

