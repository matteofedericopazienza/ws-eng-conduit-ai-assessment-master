import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article, User, UserResponse } from '@realworld/core/api-types';
import { ApiService } from '@realworld/core/http-client';

@Injectable({ providedIn: 'root' })
export class RoasterService {
    constructor(private apiService: ApiService) { }

    fetchAllArticles(): Observable<{ articles: Article[] }> {
        return this.apiService.get('/articles');
    }
}


