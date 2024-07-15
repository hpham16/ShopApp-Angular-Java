import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  user: User;
  updated_at: Date;
  replies: Reply[];
}

export interface Reply {
  id: number;
  content: string;
  user: User;
  updated_at: Date;
}
