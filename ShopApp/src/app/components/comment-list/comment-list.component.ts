import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppPage } from 'src/app/app.base';
import { Comment, Reply } from 'src/app/models/comment';
import { UserResponse } from 'src/app/responses/user/user.response';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent extends AppPage implements OnInit {
  comments: Comment[] = [];
  commentForm: FormGroup;
  replyForm!: FormGroup;
  replyingTo: number | null = null;
  userResponse?: UserResponse | null;
  productId!: string;
  collectionSize = 0;

  constructor(private commentService: CommentService, private fb: FormBuilder, private userService: UserService, private route: ActivatedRoute) {
    super();
    this.commentForm = this.fb.group({
      userId: [''],
      content: ['']
    });
  }

  override ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id')!;
      console.log('Product ID from URL:', this.productId);
    });
    this.loadComments(Number(this.productId), this.page, this.pageSize)
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    console.log(this.userResponse);
  }

  loadComments(productId: number,
    page: number,
    limit: number): void {
    this.commentService.getCommentByProductId(productId, page, limit).subscribe(comments => {
      this.comments = comments;
      this.collectionSize = comments.length;
    });
  }

  get paginatedComments(): Comment[] {
    return this.comments.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
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
    if (this.replyForm.valid) {
      const newReply = {
        ...this.replyForm.value,
        user: {
          id: 1, // Example user ID, replace with actual user data
          fullname: 'Your Name',
          avatar_url: 'your-avatar-url' // Example avatar URL, replace with actual user data
        },
        updated_at: new Date()
      };
      const comment = this.comments.find(c => c.id === commentId);
      if (comment) {
        comment.replies.push(newReply);
      }
      this.replyingTo = null;
      this.replyForm.reset();
    }
  }
}
