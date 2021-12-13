const http = require('http');
const fs = require('fs');
const url = require("url");

const hostname = 'localhost';
const port = 8000;

const server = http.createServer((req, res) => {


    let parsedURL = url.parse(req.url, true);
    let path = parsedURL.pathname;
    path = path.replace(/^\/+|\/+$/g, "");

	let htmlFile = '';
	switch(path) {
		case '':
			htmlFile = 'index.html';
			break;
		case 'about':
			htmlFile = 'about.html';
			break;
		case 'services':
			htmlFile = 'services.html';
			break;
		default:
			break;
	}

	if(htmlFile)
		render(res, htmlFile);
});

function render(res, htmlFile) {
  	fs.stat(`./${htmlFile}`, (err, stats) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
  		if(stats) {
		  	fs.createReadStream(htmlFile).pipe(res);
  		} else {
  			res.statusCode = 404;
  			res.end('Sorry, page not found!');
  		}
  	});
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});