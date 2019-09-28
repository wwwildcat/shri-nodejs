//Типы Action
const Types = {
	RECEIVE_LIST_OF_REPOSITORIES: 'RECEIVE_LIST_OF_REPOSITORIES',
	RECEIVE_REPOSITORY_CONTENT: 'RECEIVE_REPOSITORY_CONTENT',
	RECEIVE_REPOSITORY_CONTENT_ALL: 'RECEIVE_REPOSITORY_CONTENT_ALL',
	SUBMIT_SEARCH_FORM: 'SUBMIT_SEARCH_FORM',
	DEFAULT: 'default'
};
//Reducer
export function reducer (state, action) {
	if (action.type == Types.RECEIVE_LIST_OF_REPOSITORIES) {//Получение списка репозиториев
		const data = action.content;
		let newState = {
			allRepositories: data,
			currentRepository: data[1],
			viewFiles: 'root'
		};
		return Object.assign({}, state, newState);
	}
	else if (action.type == Types.RECEIVE_REPOSITORY_CONTENT) {//Получение содержимого корневой папки репозитория
		const data = action.content;
		let newState = {};
		const repositoryID = state.currentRepository;
		newState[repositoryID] = {
			rootFiles: data,
			rootFilesFilter: data
		};
		return Object.assign({}, state, newState);
	}
	else if (action.type == Types.RECEIVE_REPOSITORY_CONTENT_ALL) {//Получение содержимого всех папок и подпапок репозитория
		const data = action.content;
		let newState = {};
		const repositoryID = state.currentRepository;
		newState[repositoryID] = state[repositoryID];
		newState[repositoryID].allFiles = data;
		newState[repositoryID].allFilesFilter = data;
		return Object.assign({}, state, newState);
	}
	else if (action.type == Types.SUBMIT_SEARCH_FORM) {//Поиск файлов, содержащих в названии ключевое слово
		let searchInput = action.content.toLowerCase();
		let newState = {};
		const repositoryID = state.currentRepository;
		newState[repositoryID] = state[repositoryID];
		let allFilesFilter = state[repositoryID].allFiles.filter(file => file.shortName.toLowerCase().indexOf(searchInput) !== -1);
		newState[repositoryID].allFilesFilter = allFilesFilter;
		newState.viewFiles = 'all';
		return Object.assign({}, state, newState);
	}
	else {
		return state;
	}
}

