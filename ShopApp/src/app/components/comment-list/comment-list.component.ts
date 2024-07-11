import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Comment, Reply } from 'src/app/models/comment';
import { UserResponse } from 'src/app/responses/user/user.response';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {
  comments: Comment[] = [];
  commentForm: FormGroup;
  replyForm!: FormGroup;
  replyingTo: number | null = null;
  userResponse?: UserResponse | null;

  constructor(private commentService: CommentService, private fb: FormBuilder, private userService: UserService) {
    this.commentForm = this.fb.group({
      userId: [''],
      content: ['']
    });
  }

  ngOnInit(): void {
    this.loadComments();
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    console.log(this.userResponse)
  }

  loadComments(): void {
    this.commentService.getComments().subscribe(comments => {
      this.comments = comments;
    });
  }

  addComment(): void {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        ...this.commentForm.value,
        id: Date.now(),
        createdAt: new Date(),
        replies: []
      };
      this.commentService.addComment(newComment);
      this.loadComments();
      this.commentForm.reset();
    }
  }

  replyTo(commentId: number): void {
    this.replyingTo = commentId;
    this.replyForm = this.fb.group({
      userId: [''],
      content: ['']
    });
  }

  addReply(commentId: number): void {
    if (this.replyForm?.valid) {
      const newReply: Reply = {
        ...this.replyForm.value,
        id: Date.now(),
        commentId: commentId,
        createdAt: new Date()
      };
      this.commentService.addReply(newReply);
      this.loadComments();
      this.replyForm.reset();
      this.replyingTo = null;
    }
  }
}
