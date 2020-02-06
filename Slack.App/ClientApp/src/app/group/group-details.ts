import { User } from "../user/user";

export interface GroupDetails {
  WorkspaceId: number;
  GroupId: number;
  GroupName: string;
  IsActive: boolean;
  Users: Array<User>;
}
