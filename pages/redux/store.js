export class Store {
	constructor (reducer) {
		this._reducer = reducer;
		this._state = undefined;
		this._listeners = [];
		this.dispatch = this.dispatch.bind(this);
		this.dispatch ({
			type: 'default'
		});
	}

	getState() {
		return this._state;
	}

	subscribe(callback) {
		this._listeners.push(callback);
	}

	unsubscribe(callback) {
		const index = this._listeners.indexOf(callback);
		this._listeners.splice(index, 1);
	}

	dispatch(action) {
		this._state = this._reducer(this._state, action);
		this._notifyListeners();
	}

	_notifyListeners () {
		this._listeners.forEach(listener => {
			listener(this._state);
		});
	}
}