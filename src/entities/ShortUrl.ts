import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("uq_short_short_url", ["short"], { unique: true })
@Entity("short_url", { schema: "zsor_blog" })
export class ShortUrl {
  @PrimaryGeneratedColumn({ type: "int", name: "short_url_id", unsigned: true })
  shortUrlId: number;

  @Column("varchar", { name: "short", unique: true, length: 255 })
  short: string;

  @Column("varchar", { name: "url", length: 45 })
  url: string;

  @Column("bool", { name: "active", default: () => "'true'" })
  active: boolean;
}
