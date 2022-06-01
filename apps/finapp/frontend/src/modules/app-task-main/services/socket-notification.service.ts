// import { Injectable } from '@angular/core';
// import { Socket } from 'ngx-socket-io';
//
//
// @Injectable({
//   providedIn: 'root'
// })
// export class SocketNotificationService {
//   constructor(private socket: Socket) {
//   }
//
//   connectToNotify(): void {
//     this.socket.emit('addMessage', 'connectToNotify');
//   }
//
//   disconnectFromNotify(): void {
//     this.socket.emit('addMessage', 'disconnectFromNotify');
//   }
//
//   sendTaskChangedNotification(): void {
//     this.socket.emit('taskChanged', 'sendTaskChangedNotification');
//   }
//
//   getTaskChangedNotification(): void {
//     console.log(this.socket.fromEvent<any>(''))
//   }
//
//   getNotifications(): void {
//     console.log(this.socket.fromEvent<any>(''))
//   }
// }
//
