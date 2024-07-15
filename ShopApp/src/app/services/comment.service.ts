// src/app/services/comment.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment, Reply } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiBaseUrl = environment.apiBaseUrl;
  comments: Comment[] = [];

  constructor(private http: HttpClient) { }

  getCommentByProductId(productId: number, page: number, limit: number): Observable<Comment[]> {
    const params = {
      product_id: productId.toString(),
      // page: page.toString(),
      // limit: limit.toString()
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJwaG9uZU51bWJlciI6IjAyMDIyMDAyIiwidXNlcklkIjo5LCJzdWIiOiIwMjAyMjAwMiIsImV4cCI6MTcyMzU3Nzg2MH0.wOgsQ6yat6mOfWmEgGD5l8ETjftEc0h_SUQa9l6K2T8' // Add your token or any other custom header here
    });

    return this.http.get<Comment[]>(`${this.apiBaseUrl}/comments?product_id=${params.product_id}`, { headers });
  }

  addComment(comment: Comment): void {
    this.comments.push(comment);
  }

}
