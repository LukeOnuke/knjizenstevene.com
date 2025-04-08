import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";

@Index("uq_category_permalink", ["permalink"], { unique: true })
@Entity("category", { schema: "zsor_blog" })
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column("varchar", { name: "permalink", unique: true, length: 255 })
  permalink: string;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "keywords", length: 255 })
  keywords: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;

  @OneToMany(() => Post, (post) => post.category)
  posts: Post[];
}
