/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = await User.findById(body.userId)

    const blog = new Blog({
        title: body.title === undefined ? response.status(400).end() : body.title,
        author: body.author,
        url: body.url === undefined ? response.status(400).end() : body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
    const actualBlog = await Blog.findById(request.params.id)
    const newBlog = {
        title: body.title === undefined ? actualBlog.title : body.title,
        author: body.author === undefined ? actualBlog.author : body.author,
        likes: body.likes === undefined ? actualBlog.likes : body.likes,
        url: body.url === undefined ? actualBlog.url : body.url
    }

    const blog = await Blog
        .findByIdAndUpdate(request.params.id, newBlog, {
            new: true
        })
    response.json(blog.toJSON())

})

/* blogsRouter.delete('/', async(request, response) => {
    await Blog.deleteMany({})
    response.status(200).end()
}) */

module.exports = blogsRouter



