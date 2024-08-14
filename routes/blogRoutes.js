const express = require('express');
const bodyParser = require('body-parser');
const BlogPost = require('../models/blogpost');

const router = express.Router();


router.get('/form', (req, res) => {
    res.render('newblog', { title: 'New blog' });
});

// blog routes
router.get('/', (req, res) => {
    BlogPost.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs', { title: 'All blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/fail');
        });
});


// New route to view a single blog post
router.get('/id/:id', (req, res) => {
    BlogPost.findById(req.params.id)
        .then((blog) => {
            res.render('single-blog', { title: blog.title, blog });
        })
        .catch((err) => {
            console.log(err);
            res.status(404).render('error', { title: 'Blog Not Found' });
        });
});


// Middleware to parse form data
router.use(bodyParser.json());


// POST request to add a new blog
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/', (req, res) => {
    const blog = req.body;
    const blogpost = new BlogPost(blog);
    blogpost.save()
        .then((result) => {
            console.log(`New blog added: ${result.title}`);
            res.redirect('/success');
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/fail');
        });
    console.log(`New blog added: ${blog.title}`);
});


// DELETE request to delete a blog
router.delete('/id/:id', (req, res) => {
    BlogPost.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(`Blog deleted: ${result.title}`);
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/fail');
        });
});


module.exports = router;

