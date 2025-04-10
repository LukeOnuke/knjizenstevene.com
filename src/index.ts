import { PostService } from "./services/post.service"
import express, { Request, Response } from "express";
import dotenv from "dotenv"
import morgan from "morgan"
import { AppDataSource } from "./db"
import { ShortService } from "./services/short.service"
import { create } from "xmlbuilder";

const app = express()

dotenv.config()
app.use(morgan("tiny"))
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get("/", async function (req, res) {
    try {
        res.render("index", {
            site: {
                page: 'Početna',
                name: process.env.WEBSITE_NAME,
                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: '#',
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
        res.render("page", {
            data: {
                posts: posts,
                content: 'Our most recent posts'
            },
            site: {
                page: 'Posts',
                name: process.env.WEBSITE_NAME,
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

registerPage('/about', 5)
registerPage('/members', 6)
registerPage('/workshops', 7)
registerPage('/projects', 8)
registerPage('/contact', 9)

function registerPage(link: string, id: number) {
    app.get(link, async function (req, res) {
        try {
            const post = await PostService.getSimplePostById(id)
    
            res.render("page", {
                data: {
                    content: post.content
                },
                site: {
                    page: post.title,
                    name: process.env.WEBSITE_NAME,
                    desc: process.env.WEBSITE_DESC,
                    tags: process.env.WEBSITE_TAGS,
                    author: process.env.WEBSITE_AUTHOR,
                    img: post.thumbnail,
                    type: 'website'
                }
            })
        } catch (e) {
            res.redirect('/')
        }
    })
}

app.get("/terms", async function (req, res) {
    try {
        res.render("terms", {
            site: {
                page: 'Uslovi korišćenja',
                name: process.env.WEBSITE_NAME,

                desc: process.env.WEBSITE_DESC,
                tags: process.env.WEBSITE_TAGS,
                author: process.env.WEBSITE_AUTHOR,
                img: '#',
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

        res.render("post", {
            data: {
                post: post
            },
            site: {
                page: post.title,
                name: process.env.WEBSITE_NAME,
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
        const baseUrl = "https://knjizenstvene.com"

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
            { loc: `${baseUrl}/posts`, priority: 0.8 },
            { loc: `${baseUrl}/about`, priority: 0.7 },
            { loc: `${baseUrl}/members`, priority: 0.7 },
            { loc: `${baseUrl}/workshops`, priority: 0.7 },
            { loc: `${baseUrl}/projects`, priority: 0.7 },
            { loc: `${baseUrl}/contact`, priority: 0.7 },
            { loc: `${baseUrl}/terms`, priority: 0.7 }
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

app.get("/posts/:post", async function (req, res) {
    try {
        const post = await PostService.getPostByPermalinkAndCateogryId(req.params.post, 1)

        res.render("post", {
            data: {
                post: post
            },
            site: {
                page: post.title,
                name: process.env.WEBSITE_NAME,
                desc: post.description,
                tags: post.keywords,
                author: post.author.name,
                img: post.thumbnail,
                type: 'article'
            }
        })
    } catch (e) {
        console.log(e)
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