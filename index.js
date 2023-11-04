//packages
const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require("mongoose");
const path = require('path');
const bodyParser = require('body-parser')
const session = require("express-session");
const flash = require('connect-flash');

//static files
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: `testerrr`,
    secret: 'some-secret-example',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 600000
    }
}));


var db = mongoose.connect("mongodb+srv://admin:admin@cluster0.f8rjolj.mongodb.net/DriveTestnew?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "assignment"
});

if (!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});

    require("./routes/index")(app);


//server
app.listen(4000, () => {
    console.log('Welcome to the Driving test Website')
})
