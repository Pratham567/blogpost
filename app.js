const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// express app
const app = express();

const blogs = [
    { id: 1, title: 'Blog Title 1', summary: 'Summary of blog 1', content: 'Content of blog 1', author: 'Author 1', time: 'Time 1' },
    { id: 2, title: 'Blog Title 2', summary: 'Summary of blog 2', content: 'Content of blog 2', author: 'Author 2', time: 'Time 2' },
    { id: 3, title: 'Blog Title 3', summary: 'Summary of blog 3', content: 'Content of blog 3', author: 'Author 3', time: 'Time 3' },
    { id: 4, title: 'Blog Title 4', summary: 'Summary of blog 4', content: 'Content of blog 4', author: 'Author 4', time: 'Time 4' },
    { id: 5, title: 'Blog Title 5', summary: 'Summary of blog 5', content: 'Content of blog 5', author: 'Author 5', time: 'Time 5' }
];

const port = 3040;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Q: url encoding
// Middleware to parse form data
// app.use(bodyParser.urlencoded({ extended: true }));

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
    res.render('blogs', { title: 'All blogs', blogs });
});

app.get('/newblog', (req, res) => {
    res.render('newblog', { title: 'New blog' });
});

// New route to view a single blog post
app.get('/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id, 10);
    const blog = getBlogById(blogId);
    if (blog) {
        res.render('single-blog', { title: blog.title, blog });
    } else {
        res.status(404).render('error', { title: 'Blog Not Found' });
    }
});

// 404 page
app.use((req, res) => {
    res.status(404).render('error', { title: 'Error' });
});











// write a function to get the blog by id
function getBlogById(id) {
    return blogs.find(blog => blog.id === id);
}

// write a function to add a new blog
function addBlog(blog) {
    blogs.push(blog);
}

// write a function to delete a blog by id
function deleteBlog(id) {
    blogs = blogs.filter(blog => blog.id !== id);
}




app.get('/success', (req, res) => {
    res.render('success', { title: 'Contact' });
}
);

app.get('/fail', (req, res) => {
    res.render('fail', { title: 'Contact' });
});