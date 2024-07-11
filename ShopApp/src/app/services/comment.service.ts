// src/app/services/comment.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment, Reply } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [
    {
      id: 1,
      userId: 'amyrobson',
      content: 'Impressive! Though it seems the drag feature could be improved. But overall it looks incredible.',
      createdAt: new Date('2023-05-01T10:00:00Z'),
      replies: []
    },
    {
      id: 2,
      userId: 'maxblagun',
      content: 'Woah, your project looks awesome! How long have you been coding for?',
      createdAt: new Date('2023-05-15T10:00:00Z'),
      replies: [
        {
          id: 1,
          commentId: 2,
          userId: 'ramsesmiron',
          content: 'If you’re still new, I’d recommend focusing on the fundamentals of HTML, CSS, and JS before considering React.',
          createdAt: new Date('2023-05-20T10:00:00Z')
        }
      ]
    }
  ];

  constructor() { }

  getComments(): Observable<Comment[]> {
    return of(this.comments);
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }

  addReply(reply: Reply): void {
    const comment = this.comments.find(c => c.id === reply.commentId);
    if (comment) {
      comment.replies.push(reply);
    }
  }
}
