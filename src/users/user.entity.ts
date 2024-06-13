import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from 'src/posts/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  googleId: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
