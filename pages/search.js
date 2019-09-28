import {Store} from './redux/store.js';
import {TableView, FormView} from './redux/view.js';
import {reducer} from './redux/reducer.js';
import {getListOfRepositories, getRepositoryContent, getRepositoryContentAll} from './redux/middleware.js';

let store = new Store(reducer);
//Получение данных с сервера с помощью middleware
getListOfRepositories()(store.dispatch)
	.then(() => {
		getRepositoryContent(store.getState().allRepositories[1])(store.dispatch)
			.then(() => {
				getRepositoryContentAll(store.getState().allRepositories[1])(store.dispatch);
			});
	});
//Отображение элементов
const table = document.querySelector('.Table');
const searchForm = document.querySelector('.Search-form');

let tableView = new TableView (table, store);
let formView = new FormView (searchForm, store);
