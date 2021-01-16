const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/devilish-comics';
const mongoose = require('mongoose');

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//App sets and uses
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use('/public', express.static('public'));


//INSERT ROUTES HERE


//Set the catch all 404 error handler
app.all('*', (req, res, next) => {
    res.render('error')
})


//set error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    console.log(err)
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})