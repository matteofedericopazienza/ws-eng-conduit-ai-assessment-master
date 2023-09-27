import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoasterService } from './roaster.service';
import { Article } from '@realworld/core/api-types/src';
import { switchMap, tap } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


@Component({
    standalone: true,
    selector: 'app-roaster',
    templateUrl: './roaster.component.html',
    styleUrls: ['./roaster.component.css'],
    imports: [CommonModule, RouterModule],
})
export class RoasterComponent implements OnInit {
    articles: Article[] = [];
    userStats: UserStats[] = [];

    constructor(private roasterService: RoasterService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fetchAllArticles();
    }



    fetchAllArticles(): void {
        this.roasterService.fetchAllArticles()
            .pipe(
                tap(articles => {
                    this.articles = articles.articles;
                    this.calculateUserStats(); // Call the method to calculate userStats
                })
            )
            .subscribe();
    }

    calculateUserStats(): void {
        const userMap = new Map<string, UserStats>();

        if (this.articles) {
            for (const article of this.articles) {
                let username = article.author.username;

                if (!userMap.has(username)) {
                    const userStats: UserStats = {
                        username: username,
                        profileLink: article.author.image,
                        totalArticlesAuthored: 0,
                        totalLikesReceived: 0,
                        firstArticleDate: '',
                    };

                    userMap.set(username, userStats);
                }

                let userStats = userMap.get(username);

                if (!userStats) {
                    userStats = {
                        username: username,
                        profileLink: article.author.image,
                        totalArticlesAuthored: 0,
                        totalLikesReceived: 0,
                        firstArticleDate: '',
                    };

                    userMap.set(username, userStats);
                }

                userStats.totalArticlesAuthored++;
                userStats.totalLikesReceived += article.favoritesCount;

                if (userStats.firstArticleDate === '' || article.createdAt < userStats.firstArticleDate) {
                    userStats.firstArticleDate = article.createdAt;
                }
                userMap.set(username, userStats);
            }
        }


        this.userStats = Array.from(userMap.values()).sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
        this.cdr.detectChanges();
    }
}

interface UserStats {
    username: string;
    profileLink: string;
    totalArticlesAuthored: number;
    totalLikesReceived: number;
    firstArticleDate: string;
}