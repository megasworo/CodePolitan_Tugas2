const express = require('express')
const app = express()
const db = require('./models')
const port = process.env.PORT || 8080

app.use(express.urlencoded({ extended: true }))
app.use('/uploads/thumbnail', express.static('uploads/thumbnail'))
app.use('/uploads/banner', express.static('uploads/banner'))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server Blog Codepolitan')
})

// Routers for Category
const CategoryRouter = require('./routers/categoryRoutes')
app.use('/category', CategoryRouter)

// Router for User
const UserRouter = require('./routers/userRoutes')
app.use('/user', UserRouter)

// Router for Post
const PostRouter = require('./routers/postRoutes')
app.use('/post', PostRouter)

// define error
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
        message: error.message,
        },
    });
});

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`listening on: http://localhost:${port}`)
    })
})