import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Author } from "./Author";
import { Category } from "./Category";
import { PostTag } from "./PostTag";

@Index("fk_author_post_idx", ["authorId"], {})
@Index("fk_category_post_idx", ["categoryId"], {})
@Index("uq_post_permalink", ["permalink"], { unique: true })
@Entity("post", { schema: "zsor_blog" })
export class Post {
  @PrimaryGeneratedColumn({ type: "int", name: "post_id", unsigned: true })
  postId: number;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("varchar", { name: "permalink", unique: true, length: 255 })
  permalink: string;

  @Column("varchar", { name: "thumbnail", length: 255 })
  thumbnail: string;

  @Column("varchar", { name: "keywords", length: 255 })
  keywords: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("longtext", { name: "content" })
  content: string;

  @Column("int", { name: "category_id", unsigned: true })
  categoryId: number;

  @Column("int", { name: "author_id", unsigned: true })
  authorId: number;

  @Column("datetime", { name: "created_at" })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "display_at", nullable: true })
  displayAt: Date | null;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;

  @Column("bool", { name: "sticky", default: () => "'false'" })
  sticky: boolean;

  @ManyToOne(() => Author, (author) => author.posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "author_id", referencedColumnName: "authorId" }])
  author: Author;

  @ManyToOne(() => Category, (category) => category.posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];
}
