import { IsNull, LessThanOrEqual } from "typeorm";
import { AppDataSource } from "../db";
import { Tag } from "../entities/Tag";

const repo = AppDataSource.getRepository(Tag)

export class TagService {
    static async getTags() {
        return await repo.find({
            select: {
                tagId: true,
                permalink: true,
                name: true
            },
            where: {
                active: true
            },
            order: {
                tagId: 'DESC'
            }
        })
    }

    static async getTagByPermalink(str: string) {
        const data = await repo.findOne({
            select: {
                tagId: true,
                permalink: true,
                name: true,
                description: true,
                keywords: true,
                postTags: {
                    postTagId: true,
                    postId: true,
                    post: {
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
                }
            },
            where: {
                permalink: str,
                active: true,
                postTags: {
                    post: [
                        {
                            displayAt: LessThanOrEqual(new Date()),
                            active: true,
                            author: {
                                active: true
                            },
                            category: {
                                active: true
                            }
                        },
                        {
                            displayAt: IsNull(),
                            active: true,
                            author: {
                                active: true
                            },
                            category: {
                                active: true
                            }
                        }
                    ]
                }
            },
            order: {
                postTags: {
                    postId: 'DESC'
                }
            },
            relations: {
                postTags: {
                    post: {
                        author: true,
                        category: true
                    }
                }
            }
        })

        if (data == undefined)
            throw new Error('NOT_FOUND')

        return data
    }
}