export class ChatMessage {
  userId: number;
  user: string;
  message: string;
  room: string;

  constructor(userId: number = 0, user: string = '', message: string = '', room: string = '') {
    this.userId = userId;
    this.user = user;
    this.message = message;
    this.room = room;
  }
}
