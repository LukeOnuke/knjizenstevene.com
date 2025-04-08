import { IsNull, LessThanOrEqual } from "typeorm";
import { AppDataSource } from "../db";
import { Category } from "../entities/Category";

const repo = AppDataSource.getRepository(Category)

export class CategoryService {
    static async getCategories() {
        return await repo.find({
            select: {
                categoryId: true,
                permalink: true,
                name: true
            },
            where: {
                active: true
            },
            order: {
                categoryId: 'DESC'
            }
        })
    }

    static async getCategoryByPermalink(str: string) {
        const data = await repo.findOne({
            select: {
                categoryId: true,
                permalink: true,
                name: true,
                description: true,
                keywords: true,
                posts: {
                    postId: true,
                    title: true,
                    description: true,
                    thumbnail: true,
                    permalink: true,
                    createdAt: true,
                    displayAt: true,
                    category: {
                        categoryId: true,
                        permalink: true
                    },
                    author: {
                        authorId: true,
                        permalink: true,
                        name: true
                    }
                }
            },
            where: {
                permalink: str,
                active: true,
                posts: [
                    {
                        displayAt: LessThanOrEqual(new Date()),
                        active: true,
                        author: {
                            active: true
                        }
                    },
                    {
                        displayAt: IsNull(),
                        active: true,
                        author: {
                            active: true
                        }
                    },
                ]
            },
            order: {
                posts: {
                    postId: 'DESC'
                }
            },
            relations:{
                posts:{
                    author: true,
                    category: true
                }
            }
        })

        if (data == undefined)
            throw new Error('NOT_FOUND')

        return data
    }
}