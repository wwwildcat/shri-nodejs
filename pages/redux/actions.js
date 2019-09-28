export function receiveListOfRepositories(json) {
	return {
		type: 'RECEIVE_LIST_OF_REPOSITORIES',
		content: json
	};
}
export function receiveRepositoryContent(json) {
	return {
		type: 'RECEIVE_REPOSITORY_CONTENT',
		content: json
	};
}
export function receiveRepositoryContentAll(json) {
	return {
		type: 'RECEIVE_REPOSITORY_CONTENT_ALL',
		content: json
	};
}
export function submitSearchForm(inputValue) {
	return {
		type: 'SUBMIT_SEARCH_FORM',
		content: inputValue
	};
}