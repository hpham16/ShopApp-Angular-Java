
export interface Comment {
  id: number;
  userId: string;
  content: string;
  createdAt: Date;
  replies: Reply[];
}

export interface Reply {
  id: number;
  commentId: number;
  userId: string;
  content: string;
  createdAt: Date;
}
