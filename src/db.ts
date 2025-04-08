import dotenv from "dotenv"
import { DataSource } from "typeorm"
import { Category } from "./entities/Category";
import { Post } from "./entities/Post";
import { ShortUrl } from "./entities/ShortUrl";
import { Author } from "./entities/Author";
import { Image } from "./entities/Image";
import { Tag } from "./entities/Tag";
import { PostTag } from "./entities/PostTag";

// Connecting to database
dotenv.config();
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Category, Post, ShortUrl, Author, Image, Tag, PostTag],
    logging: false,
})