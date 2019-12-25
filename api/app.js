const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.get('/products/:id', cors(corsOptions), (req, res, next) => {
})
app.get('/api/get', (req, res) => {
    //API logic
});
app.post('/api/post', (req, res) => {
    //API logic
});
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Listening on port', port);
});

