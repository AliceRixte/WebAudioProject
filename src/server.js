var http = require("http"),
    fs = require("fs");

function start() {
    fs.readFile('./src/index.html', function (err, html) {
        if (err) {
            throw err;
        }
        http.createServer(function (request, response) {
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        }).listen(1337);
    });
}

exports.start = start;