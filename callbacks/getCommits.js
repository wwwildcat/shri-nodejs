const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

const pathToRepos = process.argv[2];

//Ручка GET /api/repos/:repositoryId/commits/:commitHash
module.exports = function(request, response) {
	const pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
	fs.access(pathToRepo, err => { //Проверка пути к репозиторию
		if(err) {
			response.status(404).send(pathToRepo + ' not found');
		}
		else {
			let out = '';
			const gitLog = spawn('git', ['log', request.params['commitHash']], {cwd: pathToRepo});
			gitLog.stdout.on('data', chunk => {
				out += chunk.toString();
			});
			gitLog.on('close', () => {
				if(!out) { //Проверка существования ветки или хэша коммита
					response.status(404).send(request.params['commitHash'] + ' not found');
				}
				else {
					const commits = out.split(/\n\n(?=\S)/);
					const commitsJSON = commits.map(commit => ({
						'SHA-1': commit.match(/[a-f0-9]{40}/)[0],
						'author': commit.match(/(?<=Author:).*/)[0].trim(),
						'date': commit.match(/(?<=Date:).*/)[0].trim(),
						'message': commit.match(/(?<=\n\n).*/)[0].trim()
					}));
					//Бонусная ручка (выдача коммитов в заданном диапазоне)
					if (request.query.from && request.query.to) {
						const from = Number(request.query.from);
						const to = Number(request.query.to);
						let start = 1;
						let end = commitsJSON.length;
						if ((from > end && to > end) || (from < start && to < start)) {
							response.status(404).send('No such commits');
						}
						//Определение границ диапазона
						else if (from >= start && from <= end) {
							if (to >= start && to <= end) {
								end = to;
							}
							else if (to < start) {
								end = start;
							}
							start = from;
						}
						else if (from > end) {
							start = end;
							if (to >= start && to <= end) {
								end = to;
							}
							else {
								end = 1;
							} 
						}
						else if (to <= end) {
							end = to;
						}
						//Преобразование и выдача массива коммитов
						if (start <= end) {
							response.json(commitsJSON.slice(start - 1, end));
						}
						else {
							response.json(commitsJSON.slice(end - 1, start).reverse());
						}
					}
					//Выдача полного списка коммитов
					else {
						response.json(commitsJSON);
					}
				}
			});
		}
		
	});
};