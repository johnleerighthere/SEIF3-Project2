// require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
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

app.get('/', numbersControllers.showMap)

app.get('/user/signup', userControllers.showSignUpForm)

app.post('/user/signup', userControllers.signUp)

app.get('/user/login', userControllers.showLoginPage)

app.get('/user/login', userControllers.login)

app.get('/users/upload', userControllers.showUploadTable)



app.post('/users/upload', multipartMiddleware, userControllers.uploadData)

//app.post('/users/upload', userControllers.createUploads)
app.post('/users/editUpload', multipartMiddleware, userControllers.editUploads)

app.post('/users/delete', userControllers.deleteUploads)



app.listen(port, (req, res) => {
    console.log(`lotteryHeatMap app listening on port ${port}`)
})

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response => {
        // DB connected successfully
        console.log('DB connection successful')


    })