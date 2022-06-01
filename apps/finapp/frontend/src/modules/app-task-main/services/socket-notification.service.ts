import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketNotificationService {
  constructor(private socket: Sock) {
  }
}
