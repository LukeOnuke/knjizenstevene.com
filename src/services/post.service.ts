import { IsNull, LessThanOrEqual } from "typeorm";
import { AppDataSource } from "../db";
import { Post } from "../entities/Post";

const repo = AppDataSource.getRepository(Post)

export class PostService {
    static async getPosts() {
        return await repo.find({
            select: {
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
            },
            order: {
                postId: "DESC"
            },
            where: [{
                active: true,
                displayAt: IsNull(),
                category: {
                    active: true
                },
                author: {
                    active: true
                }
            },
            {
                active: true,
                displayAt: LessThanOrEqual(new Date()),
                category: {
                    active: true
                },
                author: {
                    active: true
                }
            }],
            relations: {
                category: true,
                author: true
            }
        })
    }

    public static async getRecommendedPosts() {
        return await repo.find({
            select: {
                postId: true,
                title: true,
                thumbnail: true,
                permalink: true,
                createdAt: true,
                displayAt: true,
                sticky: true,
                author: {
                    authorId: true,
                    name: true,
                    permalink: true
                },
                category: {
                    categoryId: true,
                    name: true,
                    permalink: true
                }
            },
            where: [
                {
                    active: true,
                    displayAt: IsNull(),
                    category: {
                        active: true
                    },
                    author: {
                        active: true
                    }
                },
                {
                    active: true,
                    displayAt: LessThanOrEqual(new Date()),
                    category: {
                        active: true
                    },
                    author: {
                        active: true
                    }
                }
            ],
            order: {
                sticky: 'DESC',
                postId: 'DESC'
            },
            take: 3,
            relations: {
                category: true,
                author: true
            }
        })
    }

    static async getPostById(id: number) {
        const data = await repo.findOne({
            select: {
                postId: true,
                title: true,
                description: true,
                thumbnail: true,
                content: true,
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
                    website: true,
                    name: true
                }
            },
            where: {
                postId: id
            },
            relations: {
                category: true,
                author: true
            }
        })

        if (data == undefined)
            throw new Error('NOT_FOUND')

        return data
    }

    static async getPostByCategoryAndPermalink(category: string, permalink: string) {
        const data = await repo.findOne({
            select: {
                postId: true,
                title: true,
                description: true,
                thumbnail: true,
                content: true,
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
                    website: true,
                    name: true
                }
            },
            where: [
                {
                    active: true,
                    permalink: permalink,
                    displayAt: IsNull(),
                    category: {
                        permalink: category,
                        active: true
                    },
                    author: {
                        active: true
                    }
                },
                {
                    active: true,
                    permalink: permalink,
                    displayAt: LessThanOrEqual(new Date()),
                    category: {
                        permalink: category,
                        active: true
                    },
                    author: {
                        active: true
                    }
                }
            ],
            relations: {
                category: true,
                author: true
            }
        })

        if (data == undefined)
            throw new Error('NOT_FOUND')

        return data
    }
}