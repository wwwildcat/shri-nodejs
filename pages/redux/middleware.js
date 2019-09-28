import {receiveListOfRepositories, receiveRepositoryContent, receiveRepositoryContentAll} from './actions.js';
//Получение списка репозиториев
export function getListOfRepositories () {
	return function (dispatch) {
		return fetch('http://localhost:3000/api/repos')
			.then(response => response.json())
			.then(json => dispatch(receiveListOfRepositories(json)));
	};
}
//Получение содержимого корневой папки репозитория
export function getRepositoryContent (repositoryId) {
	return function (dispatch) {
		return fetch(`http://localhost:3000/api/repos/${repositoryId}`)
			.then(response => response.json())
			.then(json => dispatch(receiveRepositoryContent(json)));
	};
}
//Получение содержимого всех папок и подпапок репозитория
export function getRepositoryContentAll (repositoryId) {
	return function (dispatch) {
		return fetch(`http://localhost:3000/api/repos/${repositoryId}/all`)
			.then(response => response.json())
			.then(json => dispatch(receiveRepositoryContentAll(json)));
	};
}