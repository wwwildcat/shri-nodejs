const fs = require('fs');
const path = require('path');
const {spawn} = require('child_process');

const pathToRepos = process.argv[2];

//Ручка GET /api/repos/:repositoryId/all
module.exports = function(request, response) {
	const pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
	const commitHash = 'master';
	const params = ['ls-tree', '-t', '-r', '--name-only', commitHash];
	fs.access(pathToRepo, err => { //Проверка пути к репозиторию
		if(err) {
			response.status(404).send(pathToRepo + ' not found');
		}
		else {
			let out = '';
			const gitTree = spawn('git', params, {cwd: pathToRepo});
			gitTree.stdout.on('data', chunk => {
				out += chunk.toString();
			});
			gitTree.on('close', () => {
				if(!out) { //Проверка существования ветки или хэша коммита
					response.status(404).send(commitHash + ' not found');
				}
				else {
					const names = out.split(/\n/);
					names.pop(); //Удаление последнего пустого элемента
					let promises = [];
					names.forEach(name => { //Создание промисов на каждый элемент массива, запрашивающих дополнительные данные
						const promise = new Promise (function(resolve) {
							let out = '';
							const commitInfo = spawn ('git', ['log', '-1', name], {cwd: pathToRepo});
							commitInfo.stdout.on('data', chunk => {
								out += chunk.toString();
							});
							commitInfo.on('close', () => {
								const object = {
									'name': name,
									'shortName': name.split('/').reverse()[0],
									'hash': out.match(/(?<=commit )\S{6}/)[0],
									'message': out.match(/(?<=\n\n).*/)[0].trim(),
									'commiter': out.match(/(?<=Author:).*(?=<)/)[0].trim(),
									'date': out.match(/(?<=Date:).*(?=\+)/)[0].trim(),
								};
								resolve(object);
									
							});
						});
						promises.push(promise);
					});
					const outerPromise = Promise.all(promises);
					outerPromise.then(value => response.json(value)); //Получение данных из промисов
				}
			});
		}
	});
};