const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

//TODO: clean this 💩
/**
 * Parse url
 * @param {*string} url 
 */
function parseurl(url) {
	var path = url.split("/");
	var last = path[path.length - 1].split("?");
	var name = last[0];
	var fpath = path.slice(1, path.length - 1);
	var query = new Array();

	if (last[1]) {
		var qstr = last[1].split("&");
		qstr.forEach(item => {
			var t = item.split("=");
			query.push({
				"name": t[0],
				"value": t[1],
			})
		});
	}

	return {
		host: path[0],
		path: fpath,
		name: name,
		query: query
	};
}

//TODO: clean this 💩
/**
 * Return a svg HTML string
 * TODO: clean this 💩
 * @param {*array} data 
 */
function createbadge ({
	color = "green",
	subject = "sample",
	status = "text",
}) {
	const clist = {
		"green": "#97CA00",
		"yellow": "#dfb317",
		"orange": "#fe7d37",
		"red": "#e05d44",
		"blue": "#007ec6",
		"pink": "ff69b4",
		"brightgreen": "#4c1",
		"yellowgreen": "#a4a61d",
		"lightgrey": "#9f9f9f"
	}
	const boxpadding = 8;
	var ccode = (clist[color] ? clist[color] : "#000");
	var sulen = subject.length * 7;
	var stlen = status.length * 7;
	var box1 = sulen + boxpadding;
	var box2 = stlen + boxpadding;
	var suanchor = (box1/2)*10;
	var stanchor = (box1 + box2/2)*10;

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${box1 + box2}" height="20">`,
			`<g shape-rendering="crispEdges">`,
				`<path fill="#555" d="M0 0h${box1}v20H0z"/>`,
				`<path fill="${ccode}" d="M${box1} 0h${box2}v20H${box1}z"/>`,
			`</g>`,
			`<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110">`,
				`<text x="${suanchor}" y="140" transform="scale(.1)">`,
					subject,
				`</text>
				<text x="${stanchor}" y="140" transform="scale(.1)">`,
					status,
				`</text>`,
			`</g>`,
		`</svg>`,
	].join("\n");
}

//TODO: clean this 💩, too
const server = http.createServer((req, res) => {
	var url = parseurl(req.url);
	res.statusCode = 200;

	if (url.name == "favicon.ico")
		return true;

	res.setHeader("Content-Type", "image/svg+xml;charset=utf-8");
	res.setHeader("server", `node/${process.version}`);
	res.write(createbadge({
		color: url.path[2] ? url.path[2] : url.name,
		subject: url.path[0] ? url.path[0] : url.name,
		status: url.path[1] ? url.path[1] : url.name
	}));
	res.end();
});

server.on("error", e => {
	console.log(e);
});

server.listen(port, hostname, () => {
	let bind = `${hostname}:${port}`;
	console.log(`Listening on ${bind}. Ctrl-C to stop the server.`);
});