import {
  ArrayType,
  Collection,
  Entity,
  EntityDTO,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';
import slug from 'slug';

import { User } from '../user/user.entity';
import { Comment } from './comment.entity';
import { getAdditionalAuthors } from '../../../../libs/articles/data-access/src/lib/+state/article/article.selectors';

@Entity()
export class Article {
  @PrimaryKey({ type: 'number' })
  id: number;

  @Property()
  slug: string;

  @Property()
  title: string;

  @Property()
  description = '';

  @Property()
  body = '';

  @Property({ type: 'date', onUpdate: () => new Date() })
  createdAt = new Date();

  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: ArrayType })
  tagList: string[] = [];

  @ManyToOne(() => User)
  author: User;


  @ManyToMany(() => User, user => user.additionalArticles)
  //@JoinTable({ name: 'article_user' }) // Specify the join table name
  additionalAuthors = new Collection<User>(this);

  @Property({ type: 'boolean' })
  isLocked = false;

  @OneToMany(() => Comment, (comment) => comment.article, { eager: true, orphanRemoval: true })
  comments = new Collection<Comment>(this);

  @Property({ type: 'number' })
  favoritesCount = 0;

  constructor(author: User, title: string, description: string, body: string, additionalAuthors: User[] = []) {
    this.author = author;
    this.title = title;
    this.description = description;
    this.body = body;
    this.additionalAuthors = new Collection<User>(this, additionalAuthors); // Initialize with additionalAuthors directly
    this.slug = slug(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }


  toJSON(user?: User) {
    const o = wrap<Article>(this).toObject() as ArticleDTO;
    o.favorited = user && user.favorites.isInitialized() ? user.favorites.contains(this) : false;
    o.author = this.author.toJSON(user);
    o.additionalAuthors = this.additionalAuthors && this.additionalAuthors.isInitialized() ? this.additionalAuthors.getItems().map(author => author.toJSON(user)) : [];
    o.additionalAuthorsEmail = this.additionalAuthors && this.additionalAuthors.isInitialized() ? this.additionalAuthors.getItems().map(author => author.email) : [];

    return o;
  }
}

export interface ArticleDTO extends EntityDTO<Article> {
  favorited?: boolean;
  additionalAuthorsEmail?: String[];

}
