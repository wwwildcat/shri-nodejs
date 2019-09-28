const fs = require('fs');
const path = require('path');
const {execFile} = require('child_process');

const pathToRepos = process.argv[2];

//Ручка POST /api/repos + { url: ‘repo-url’ }
module.exports = function(request, response) {
	let pathToRepo = pathToRepos;
	const url = request.body.url.replace(/.*(?=:\/\/)/, 'git');
	let params = ['clone', url];
	let repoTitle = request.body.url.match(/(?<=\/)[^/]*\/?$/)[0].match(/[^/]*/)[0];
	if(request.params['repositoryId']) {
		params.push(request.params['repositoryId']);
		repoTitle = request.params['repositoryId'];
	}
	pathToRepo = path.join(pathToRepos, repoTitle);
	fs.access(pathToRepo, (err) => { //Проверка существования локального репозитория с таким же названием
		if (!err) {
			response.send(repoTitle + ' already exists');
		}
		else {
			execFile('git', params, {cwd: pathToRepos}, (err) => {
				if (err) {
					response.status(404).send(request.body.url + ' not found');
				}
				else {
					response.send(repoTitle + ' has been added succesfully');
				}
			});
		}
	});
};