const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const BlogPost = require('./models/blogpost');
const mongoose = require('mongoose');

// CONSTANTS
const USER_NAME = 'mituser';
const PASSWORD = 'mitpassword';
const DB_NAME = 'merndb';
const DB_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@merncluster.xtjdu.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=mernMongoose`;
const PORT = 3040;

// express app
const app = express();


mongoose.connect(DB_URI)
    .then((result) => {
        console.log('Connected to database');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err));


// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs', (req, res) => {
    BlogPost.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('blogs', { title: 'All blogs', blogs: result });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/fail');
        });
});

app.get('/newblog', (req, res) => {
    res.render('newblog', { title: 'New blog' });
});

// New route to view a single blog post
app.get('/blogs/id/:id', (req, res) => {
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
app.use(bodyParser.json());

// POST request to add a new blog
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/blogs', (req, res) => {
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
app.delete('/blogs/id/:id', (req, res) => {
    BlogPost.findByIdAndDelete(req.params.id)
        .then((result) => {
            console.log(`Blog deleted: ${result.title}`);
            res.json({ redirect: '/blogs' });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/fail');
        });
}
);

app.get('/success', (req, res) => {
    res.render('success', { title: 'Success' });
}
);

app.get('/fail', (req, res) => {
    res.render('fail', { title: 'Failed' });
});


// 1. Let's submit a form
// Q: What is the default method of the form?
// -> GET
// Q: What is the default path of the form?
// -> /blogs
// Q: What is the content type of the form? 
// -> application/x-www-form-urlencoded
// Q: What is url encoding?
// -> It is a way to encode the form data before sending it to the server.
// Do we need to convert this url encoded data to JSON?
// -> Yes
// How to do that?
// -> Use body-parser middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// What is the difference between body-parser.urlencoded and body-parser.json?
// -> urlencoded is used to parse the data with content type application/x-www-form-urlencoded
// -> json is used to parse the data with content type application/json


// 404 page
app.use((req, res) => {
    res.status(404).render('error', { title: 'Error' });
});