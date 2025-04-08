import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("local_UNIQUE", ["local"], { unique: true })
@Entity("image", { schema: "zsor_blog" })
export class Image {
  @PrimaryGeneratedColumn({ type: "int", name: "image_id", unsigned: true })
  imageId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "local", unique: true, length: 255 })
  local: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;
}
