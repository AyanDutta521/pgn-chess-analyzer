const express = require('express');
const { Chess } = require('chess.js');
const { analyzePosition } = require('./teststockfish.js')
const path = require('path')

const {analyze} = require('./controllers/analyze.js')
const app = express();
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', (req, res) => {
    res.render('home');
});
app.get('/results', (req, res) => {
    res.render('results');
});
app.post('/analysis', analyze);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
