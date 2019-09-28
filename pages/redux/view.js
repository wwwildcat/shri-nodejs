import {submitSearchForm} from './actions.js';

// View общий
class View {
	constructor(elem, store) {
		this._elem = elem;
		this._store = store;
		this._prepareRender(store.getState());
		this._store.subscribe(this._prepareRender.bind(this));
		this._unsubscribe = this._store.unsubscribe;
	}

	_prepareRender(state) {
		this._elem.innerHTML = this.render(state);
	}

	render() {}

	destroy() {
		this._elem.innerHTML = '';
		this._unsubscribe(this._prepareRender.bind(this));
	}
}
// View формы поиска
export class FormView extends View {
	constructor(elem, store) {
		super(elem, store);
		this._onSubmit = this._onSubmit.bind(this);
		this._elem.addEventListener('submit', this._onSubmit);
	}

	_onSubmit(event) {
		event.preventDefault();
		this._store.dispatch(submitSearchForm(event.target.searchInput.value));
	}

	render() {
		return `<form class="Search-form">
		<input type="search" placeholder="Найти файлы..." name="searchInput" class="Search-input">
		<button type="submit" class="Search-button">
			<span class="Icon Icon-search"></span>
		</button>
	</form>`;
	}
    
	destroy() {
		super.destroy();
		this._elem.removeEventListener('submit', this._onSubmit);
	}
}
// View таблицы
export class TableView extends View {
	constructor(elem, store) {
		super(elem, store);
	}

	render(state) {
		if (state) {
			const repositoryID = state.currentRepository;
			let resultHTML = `<div class="Table-row Text Text_style_bold Text_color_gray_5">
            <div class="Table-cell">Name</div>
            <div class="Table-cell">Last commit</div>
            <div class="Table-cell">Commit message</div>
            <div class="Table-cell">Commiter</div>
            <div class="Table-cell">Updated</div>
		</div>`;
			if (state.viewFiles === 'root') { //Отображается содержимое корневой папки репозитория
				if (state[repositoryID] && state[repositoryID].rootFilesFilter) {
					state[repositoryID].rootFilesFilter.forEach(obj => {
						resultHTML += `<div class="Table-row Text">
				<div class="Table-cell">
					<span class="Icons Icon-folder"></span>
					<span class="Table-name Text Text_style_bold">${obj.name}</span>
				</div>
				<div class="Table-cell">
					<a class="Text Text_color_lightBlue">${obj.hash}</a>
				</div>
				<div class="Table-cell">${obj.message}</div>
				<div class="Table-cell Commiter">${obj.commiter}</div>
				<div class="Table-cell">${obj.date}</div>
				<div class="Table-button"></div>
			</div>`;
					});
				}
				return resultHTML;
			}
			else if (state.viewFiles === 'all') { //Отображаются результаты поиска по всем папкам и подпапкам репозитория
				if (state[repositoryID] && state[repositoryID].allFilesFilter) {
					state[repositoryID].allFilesFilter.forEach(obj => {
						resultHTML += `<div class="Table-row Text">
					<div class="Table-cell">
						<span class="Icons Icon-folder"></span>
						<span class="Table-name Text Text_style_bold">${obj.name}</span>
					</div>
					<div class="Table-cell">
						<a class="Text Text_color_lightBlue">${obj.hash}</a>
					</div>
					<div class="Table-cell">${obj.message}</div>
					<div class="Table-cell Commiter">${obj.commiter}</div>
					<div class="Table-cell">${obj.date}</div>
					<div class="Table-button"></div>
				</div>`;
					});
				}
				return resultHTML;
			}
		}
	}

	destroy() {
		super.destroy();
	}
}