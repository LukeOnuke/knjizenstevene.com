import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PostTag } from "./PostTag";

@Index("uq_tag_permalink", ["permalink"], { unique: true })
@Entity("tag", { schema: "zsor_blog" })
export class Tag {
  @PrimaryGeneratedColumn({ type: "int", name: "tag_id", unsigned: true })
  tagId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "permalink", unique: true, length: 255 })
  permalink: string;

  @Column("varchar", { name: "keywords", length: 45 })
  keywords: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
