const express = require('express');
const axios = require('axios');
const app = express();
const port = 3322;

let fileList = {};

function generateUrl(urlSuffix, token) {
	return axios.get(urlSuffix, {
		headers: {
			Authorization: 'Bearer ' + token
		}
	});
}

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/file-name', (request, response) => {
	const urlSuffix = 'https://api.ciscospark.com/v1/contents/' + request.param('suffix');
	const token = request.param('token');

	if (fileList[urlSuffix] == undefined) {
		generateUrl(urlSuffix, token)
			.then((result) => {
				response.send(result.headers);
				fileList[urlSuffix] = result.headers;
			})
			.catch((err) => {
				response.send(err);
			});
	} else {
		response.send(fileList[urlSuffix]);
	}
});

app.listen(port, (err) => {
	if (err) {
		return console.log('something bad happened', err);
	}
	console.log(`server is listening on ${port}`);
});
