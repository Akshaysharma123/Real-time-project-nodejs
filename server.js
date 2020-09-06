const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300



// set Templates engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/cart', (req, res) => {
    res.render('customers/cart')
})

app.get('/login', (req, res) => {
    res.render('auth/login');
})

app.get('/register', (req, res) => {
    res.render('auth/register');
})

// assets 
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log('listing on port 3000')
})