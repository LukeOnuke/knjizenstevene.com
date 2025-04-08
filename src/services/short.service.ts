import { AppDataSource } from "../db";
import { ShortUrl } from "../entities/ShortUrl";

const repo = AppDataSource.getRepository(ShortUrl)

export class ShortService {
    static async getShortUrl(str: string) {
        const data = await repo.findOne({
            select:{
                shortUrlId: true,
                url: true
            },
            where:{
                short: str,
                active: true
            }
        })

        if (data == undefined)
            throw new Error('NOT_FOUND')

        return data
    }
}