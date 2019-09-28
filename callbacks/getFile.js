const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

const pathToRepos = process.argv[2];

//Ручка GET /api/repos/:repositoryId/blob/:commitHash/:pathToFile
module.exports = function(request, response) {
	const pathToFile = path.join(pathToRepos, request.params['repositoryId']);
	fs.access(pathToFile, err => { //Проверка пути к файлу
		if(err) {
			response.status(404).send(pathToFile + ' not found');
		}
		else {
			let out = '';
			const gitBlob = spawn('git', ['show', request.params['commitHash'] + ':' + request.params['pathToFile']], {cwd: pathToFile});
			gitBlob.stdout.on('data', chunk => {
				out += chunk.toString();
			});
			gitBlob.on('close', () => {
				if(!out) { //Проверка существования ветки или хэша коммита
					response.status(404).send(request.params['commitHash'] + ' not found');
				}
				else {
					response.send(out);
				}
			});
		}
	});
};