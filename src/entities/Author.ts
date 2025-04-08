import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";

@Index("uq_author_permalink", ["permalink"], { unique: true })
@Entity("author", { schema: "zsor_blog" })
export class Author {
  @PrimaryGeneratedColumn({ type: "int", name: "author_id", unsigned: true })
  authorId: number;

  @Column("varchar", { name: "permalink", unique: true, length: 255 })
  permalink: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("varchar", { name: "avatar", length: 255 })
  avatar: string;

  @Column("varchar", { name: "website", length: 255 })
  website: string;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
