const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials'); //resuable portions of HTML similar to django.
app.set('view engine', 'hbs');

//middleware where 'next' tells middlware functoin when it's done.
//next() is required for program to move on to next lines of code
app.use((req, res, next) => {
    var now = new Date().toString();
    //console.log(req);
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log  + '\n');
    /**For node version 7.x the above line is deprecated and should use a callback
     * fs.appendFile('server.log', log  + '\n', (err) => {
     *      if (err) {
     *          console.log('Unable to append to server.log.');
     *       }
     * });
    */
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });
/*Since there is no next() in previous app.use() the next line needs to go after rendering maintenance.hbs so that it will not load when we are in maintenance mode. Middleware takes precedence.*/
app.use(express.static(__dirname + '/public')); //middleware to server static data, __dirname__ is path to the main project folder.

/** partial function that allows DRY by not having to place it into every res.render function.*/
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());

// request = incoming requrest to server.
// res = response in HTTP status codes among other stuff.
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');
    /**Express server will know this is json and will format the response as such when you view webpage result. */
    // res.send({
    //     name: 'Jairo',
    //     likes: ['boxing', 'lifting']
    // });
    res.render('home.hbs', {
        'pageTitle': 'Home Page',
        'welcomeMessage': 'Welcome to my website!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        'pageTitle': 'About Page'
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessgae: 'Unable to handle request'
    });
});

//2nd parameter is optional
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
});