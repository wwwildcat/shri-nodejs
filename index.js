const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Коллбэки
const getRepos = require('./callbacks/getRepos.js');
const getCommits = require('./callbacks/getCommits.js');
const getDiff = require('./callbacks/getDiff.js');
const getRepository = require('./callbacks/getRepository.js');
const getRepositoryAll = require('./callbacks/getRepositoryAll.js');
const getFile = require('./callbacks/getFile.js');
const deleteRepository = require('./callbacks/deleteRepository.js');
const addRepository = require('./callbacks/addRepository.js');

//Запросы
app.use(express.static(__dirname + '/pages'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Статические страницы
app.get('/1-1', function (request, response) {
	response.sendFile(__dirname + '/pages/html/arcadia_files.html');
});
app.get('/1-4', function (request, response) {
	response.sendFile(__dirname + '/pages/html/arcanum.html');
});
app.get('/1-5', function (request, response) {
	response.sendFile(__dirname + '/pages/html/ya-make_details.html');
});
app.get('/1-6', function (request, response) {
	response.sendFile(__dirname + '/pages/html/ya-make_history.html');
});
app.get('/2-1', function (request, response) {
	response.sendFile(__dirname + '/pages/html/arcadia_branches.html');
});
app.get('/3-1', function (request, response) {
	response.sendFile(__dirname + '/pages/html/commits.html');
});
//Данные с сервера
app.get('/api/repos', getRepos);

app.get('/api/repos/:repositoryId/commits/:commitHash', getCommits);

app.get('/api/repos/:repositoryId/commits/:commitHash/diff', getDiff);

app.get('/api/repos/:repositoryId', getRepository);

app.get('/api/repos/:repositoryId/all', getRepositoryAll); //Возвращает содержимое всех папок и подпапок репозитория (для поиска по файлам)

app.get('/api/repos/:repositoryId/tree/:commitHash/:path([^/]*)?', getRepository);

app.get('/api/repos/:repositoryId/blob/:commitHash/:pathToFile([^/]*)?', getFile);

app.delete('/api/repos/:repositoryId', deleteRepository);

app.post('/api/repos(/:repositoryId)?', addRepository);

app.use(function(request, response,) {
	response.status(404).send('URL not found');
});


app.listen(3000);