const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const manageFiles = require('./src/manageFiles.js');
console.log(manageFiles.getAllFileNames('./public'));

var root = '/';
var public_path = path.join(__dirname, 'public');

app.use(express.static(public_path));
app.get(root, (req, res) => {
    res.sendFile(path.join(public_path,'index.html'));
});

app.get('*', (req, res) => {
    console.log("404 : don't know this request ");
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

