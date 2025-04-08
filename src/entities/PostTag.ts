import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Post } from "./Post";
import { Tag } from "./Tag";

@Index("fk_post_tag_post_idx", ["postId"], {})
@Index("fk_post_tag_tag_idx", ["tagId"], {})
@Entity("post_tag", { schema: "zsor_blog" })
export class PostTag {
  @PrimaryGeneratedColumn({ type: "int", name: "post_tag_id", unsigned: true })
  postTagId: number;

  @Column("int", { name: "post_id", unsigned: true })
  postId: number;

  @Column("int", { name: "tag_id", unsigned: true })
  tagId: number;

  @ManyToOne(() => Post, (post) => post.postTags, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "postId" }])
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "tag_id", referencedColumnName: "tagId" }])
  tag: Tag;
}
