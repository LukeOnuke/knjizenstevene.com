import { PostService } from "./services/post.service"
import express, { Request, Response } from "express";
import dotenv from "dotenv"
import morgan from "morgan"
import { AppDataSource } from "./db"
import { CategoryService } from "./services/category.service"
import { AuthorService } from "./services/author.service"
import { TagService } from "./services/tag.service"
import { ShortService } from "./services/short.service"
import { create } from "xmlbuilder";

const app = express()

dotenv.config()
app.use(morgan("tiny"))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get("/", async function (req, res) {
    try {
        const recommended = await PostService.getRecommendedPosts()

        res.render("index", {
            data: {
                posts: await PostService.getPosts(),
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: 'Početna',
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: recommended[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/posts", async function (req, res) {
    try {
        const posts = await PostService.getPosts()
        res.render("posts", {
            data: {
                posts: posts,
                postsTrimmed: posts.slice(3),
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: 'Postovi',
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: posts[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.status(500).send()
    }
})

app.get("/about", async function (req, res) {
    try {
        const recommended = await PostService.getRecommendedPosts()

        res.render("about", {
            data: {
                // top: recommended[0],
                // recommended: recommended,
                // categories: await CategoryService.getCategories(),
                // authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: 'O nama',
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: recommended[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/terms", async function (req, res) {
    try {
        const recommended = await PostService.getRecommendedPosts()

        res.render("terms", {
            data: {
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: 'Uslovi korišćenja',
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: recommended[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/category/:permalink", async function (req, res) {
    try {
        const permalink = req.params.permalink
        const category = await CategoryService.getCategoryByPermalink(permalink)
        const recommended = await PostService.getRecommendedPosts()

        res.render("category", {
            data: {
                category: category,
                posts: category.posts,
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: category.name,
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: category.description,
                tags: category.keywords,
                author: process.env.WEBSITE_AUTHOR,
                img: category.posts[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/tag/:permalink", async function (req, res) {
    try {
        const permalink = req.params.permalink
        const tag = await TagService.getTagByPermalink(permalink)
        const posts = tag.postTags.map(pt => pt.post)
        const recommended = await PostService.getRecommendedPosts()

        res.render("tag", {
            data: {
                tag: tag,
                posts: posts,
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: tag.name,
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: tag.description,
                tags: tag.keywords,
                author: process.env.WEBSITE_AUTHOR,
                img: posts[0].thumbnail,
                type: 'website'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/preview/:id", async function (req, res) {
    try {
        const id = Number.parseInt(req.params.id)
        const post = await PostService.getPostById(id)
        const recommended = await PostService.getRecommendedPosts()

        res.render("post", {
            data: {
                post: post,
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: post.title,
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: post.description,
                tags: post.keywords,
                author: post.author.name,
                img: post.thumbnail,
                type: 'article'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/link/:permalink", async function (req, res) {
    try {
        const perma = req.params.permalink
        const short = await ShortService.getShortUrl(perma)
        res.redirect(short.url)
    } catch (e) {
        res.redirect('/')
    }
})

app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
        // Fetch all posts
        const posts = await PostService.getPosts()

        // Base URL of the site (ensure it is set correctly for your app)
        const baseUrl = "https://jezikufokusu.rs"

        // Create XML root
        const urlset = create("urlset", { version: "1.0", encoding: "UTF-8" })
            .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
            .att(
                "xmlns:xsi",
                "http://www.w3.org/2001/XMLSchema-instance"
            )
            .att(
                "xsi:schemaLocation",
                "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
            )

        // Add static pages
        const staticPages = [
            { loc: `${baseUrl}/`, priority: 1.0 },
            { loc: `${baseUrl}/terms`, priority: 0.7 },
            { loc: `${baseUrl}/about`, priority: 0.7 },
        ]
        staticPages.forEach(({ loc, priority }) => {
            urlset
                .ele("url")
                .ele("loc", loc).up()
                .ele("priority", priority.toString())
        })

        // Add dynamic posts
        posts.forEach((post: any) => {
            const postUrl = `${baseUrl}/${post.category?.permalink}/${post.permalink}`;
            urlset
                .ele("url")
                .ele("loc", postUrl).up()
                .ele("lastmod", post.updatedAt ? post.updatedAt.toISOString() : post.createdAt.toISOString()).up()
                .ele("priority", "0.8")
        })

        // Convert XML to string
        const sitemapXml = urlset.end({ pretty: true })

        // Set headers and send response
        res.header("Content-Type", "application/xml")
        res.status(200).send(sitemapXml)
    } catch (error) {
        res.status(500).send()
    }
})

app.get("/:cateogry/:post", async function (req, res) {
    try {
        const categoryPermalink = req.params.cateogry
        const postPermalink = req.params.post
        const post = await PostService.getPostByCategoryAndPermalink(categoryPermalink, postPermalink)
        const recommended = await PostService.getRecommendedPosts()

        res.render("post", {
            data: {
                post: post,
                top: recommended[0],
                recommended: recommended,
                categories: await CategoryService.getCategories(),
                authors: await AuthorService.getAuthors(),
                tags: await TagService.getTags()
            },
            site: {
                page: post.title,
                name: process.env.WEBSITE_NAME,
                logo: process.env.WEBSITE_LOGO,
                desc: post.description,
                tags: post.keywords,
                author: post.author.name,
                img: post.thumbnail,
                type: 'article'
            }
        })
    } catch (e) {
        res.redirect('/')
    }
})

app.get("*", async function (req, res) {
    res.redirect('/')
})

// Connect to database
AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database');
        const port = process.env.SERVER_PORT || 3000
        app.listen(port, () => console.log(`Listening on port ${port}`));
    })
    .catch((error) => console.log(error))