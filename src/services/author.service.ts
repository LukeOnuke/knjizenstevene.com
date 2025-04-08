import { AppDataSource } from "../db";
import { Author } from "../entities/Author";

const repo = AppDataSource.getRepository(Author)

export class AuthorService {
    static async getAuthors() {
        return await repo.find({
            select: {
                authorId: true,
                name: true,
                website: true
            },
            where: {
                active: true
            },
            order: {
                authorId: 'DESC'
            }
        })
    }
}