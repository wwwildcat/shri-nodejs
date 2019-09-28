const fs = require('fs');
const path = require('path');

const pathToRepos = process.argv[2];

//Вспомогательная функция для удаления непустой директории
const deleteDir = function(pathToDir) {
	fs.readdirSync(pathToDir).forEach(item => {
		const pathToItem = path.resolve(pathToDir, item);
		if (fs.statSync(pathToItem).isFile()) {
			fs.unlinkSync(pathToItem);
		}
		else {
			deleteDir(pathToItem);
		}
	});
	fs.rmdirSync(pathToDir);
};
//Ручка DELETE /api/repos/:repositoryId
module.exports = function(request, response) {
	const pathToRepo = path.join(pathToRepos, request.params['repositoryId']);
	fs.access(pathToRepo, err => { //Проверка пути к репозиторию
		if(err) {
			response.status(404).send(pathToRepo + ' not found');
		}
		else {
			deleteDir(pathToRepo);
			response.send(request.params['repositoryId'] + ' has been deleted succesfully');
		}
	});
};