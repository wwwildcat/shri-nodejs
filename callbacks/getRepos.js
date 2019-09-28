const fs = require('fs');
const path = require('path');

const pathToRepos = process.argv[2];

//Ручка GET /api/repos
module.exports = function (request, response) {
	let repos = null;
	fs.readdir(pathToRepos, (err, items) => {
		if (err) {
			response.status(404).send(pathToRepos + ' not found');
		} //Оставить только директории
		repos = items.filter(item => fs.statSync(path.resolve(pathToRepos, item)).isDirectory());
		response.json(repos);
	});
};