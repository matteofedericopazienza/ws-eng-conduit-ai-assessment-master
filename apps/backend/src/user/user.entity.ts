import { IsEmail } from 'class-validator';
import crypto from 'crypto';
import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property,
  wrap,
} from '@mikro-orm/core';
import { Article } from '../article/article.entity';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: 'number' })
  id: number;

  @Property()
  username: string;

  @Property({ hidden: true })
  @IsEmail()
  email: string;

  @Property()
  bio = '';

  @Property()
  image = '';

  @Property({ hidden: true })
  password: string;

  @ManyToMany({ entity: () => Article, hidden: true })
  favorites = new Collection<Article>(this);



  @ManyToMany({
    entity: () => User,
    inversedBy: (u) => u.followed,
    owner: true,
    pivotTable: 'user_to_follower',
    joinColumn: 'follower',
    inverseJoinColumn: 'following',
    hidden: true,
  })
  followers = new Collection<User>(this);

  @ManyToMany(() => User, (u) => u.followers, { hidden: true })
  followed = new Collection<User>(this);

  @OneToMany(() => Article, (article) => article.author || article.additionalAuthors, { hidden: true })
  authoredArticles = new Collection<Article>(this);

  @ManyToMany(() => Article,)
  additionalArticles = new Collection<Article>(this);



  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = crypto.createHmac('sha256', password).digest('hex');
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO;
    o.image = this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
    o.following = user && user.followers.isInitialized() ? user.followers.contains(this) : false;


    o.additionalArticles = this.additionalArticles && this.additionalArticles.isInitialized() ? this.additionalArticles.getItems().map(article => article.toJSON(user)) : [];

    return o;
  }
}

interface UserDTO extends EntityDTO<User> {
  following?: boolean;


}
