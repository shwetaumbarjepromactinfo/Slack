export interface Message {
  MessageId: number;
  WorkspaceId: number;
  SentBy: number;
  ReceivedBy: number;
  MessageDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
}
