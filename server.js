var fs = require("fs");
var path = require("path");
var http = require("http");
var url = require("url");

// Local:
var mime = require("mime-types");

// External:
var multiparty = require("multiparty");

var port = 8013;
var public_dir = path.join(__dirname, "public");

var server = http.createServer((req, res) => {
	// This called every time someone makes a request
	var req_url = url.parse(req.url);
	var filename = req_url.pathname.substring(1);
	if(filename === "") { filename = "index.html";	}

	if(req.method === "GET") {
		fs.readFile(path.join(public_dir, filename), (err, data) => {
			if(err) {
				res.writeHead(404, {"Content-Type": "text/plain"});
				res.write("Oh no!  Couldn\'t find that page!");
				res.end();
			} else {
				var ext = path.extname(filename).substring(1); // removes the dot
				// The following evaluates to true if the particular type exists,
				// and if it doesn't, we choose the "or" condition:
				res.writeHead(200, {"Content-Type": mime.lookup(ext) || "text/plain"});
				res.write(data);
				res.end();
			}
		}); // readFile
	}

	//console.log(req.method, path.join(public_dir, filename));
});

console.log("Now listening on port " + port);
server.listen(port, "0.0.0.0"); // This means "listen on all interfaces" - don't worry about it.
