// require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const port = 4000
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: 'uploads' });

const numbersControllers = require('./controllers/numbersController')
const userControllers = require('./controllers/userController')

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(express.json()); // 
app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: "app_session",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

app.use(setUserVarMiddleware)

app.get('/', numbersControllers.showMap)

app.get('/user/signup', userControllers.showSignUpForm)

app.post('/user/signup', userControllers.signUp)

app.get('/user/login', userControllers.showLoginPage);

app.get('/user/logout', userControllers.logOut);

app.post('/user/login', userControllers.login)

app.get('/users/upload', authenticatedOnlyMiddleware, userControllers.showUploadTable)



app.post('/users/upload', multipartMiddleware, userControllers.uploadData)

//app.post('/users/upload', userControllers.createUploads)
app.post('/users/editUpload', multipartMiddleware, userControllers.editUploads)

app.post('/users/delete', userControllers.deleteUploads)

app.post('/user/searchNumber', userControllers.searchNumber);



app.listen(port, (req, res) => {
    console.log(`lotteryHeatMap app listening on port ${port}`)
})

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        // DB connected successfully
        console.log('DB connection successful')


    })

function guestOnlyMiddleware(req, res, next) {
    // check if user if logged in,
    // if logged in, redirect back to main page
    if (req.session && req.session.user) {
        res.redirect('/')
        return
    }

    next()
}

function authenticatedOnlyMiddleware(req, res, next) {
    if (!req.session || !req.session.user) {

        return res.redirect('/user/login')
    }

    next()
}

function setUserVarMiddleware(req, res, next) {
    // default user template var set to null
    res.locals.user = null

    // check if req.session.user is set,
    // if set, template user var will be set as well
    if (req.session && req.session.user) {
        res.locals.user = req.session.user
    }

    next()
}