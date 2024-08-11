const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// express app
const app = express();

const blogs = [
    { id: 1, title: 'Blog Title 1', summary: 'Summary of blog 1', content: 'Content of blog 1', author: 'Author 1', time: 'Time 1' },
    { id: 2, title: 'Blog Title 2', summary: 'Summary of blog 2', content: 'Content of blog 2', author: 'Author 2', time: 'Time 2' },
    { id: 3, title: 'Blog Title 3', summary: 'Summary of blog 3', content: 'Content of blog 3', author: 'Author 3', time: 'Time 3' }
];

const port = 3040;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

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

// write a function to get the blog by id
function getBlogById(id) {
    return blogs.find(blog => blog.id === id);
}

// New route to view a single blog post
app.get('/blogs/id/:id', (req, res) => {
    const blogId = parseInt(req.params.id, 10);
    const blog = getBlogById(blogId);
    if (blog) {
        res.render('single-blog', { title: blog.title, blog });
    } else {
        res.status(404).render('error', { title: 'Blog Not Found' });
    }
});

// write a function to add a new blog
function addBlog(blog) {
    blogs.push(blog);
}

// Middleware to parse form data
app.use(bodyParser.json());

// POST request to add a new blog
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/blogs', (req, res) => {
    const blog = req.body;
    blog.id = blogs.length + 1;
    blog.time = new Date().toLocaleString();
    console.log(`New blog added: ${blog.title}`);
    addBlog(blog);
    res.redirect('/success');
});

// DELETE request to delete a blog
app.delete('/blogs/id/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    deleteBlog(blogId);
    if(getBlogById(blogId)) {
        // Case: Blog not deleted
        res.redirect('/fail');
    } else {
        // Case: Blog deleted successfully
        res.json({ redirect: '/success' });
    }
}
);

// write a function to delete a blog by id
function deleteBlog(id) {
    const index = blogs.findIndex(blog => blog.id === id);
    if (index !== -1) {
        blogs.splice(index, 1);
    }
}

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