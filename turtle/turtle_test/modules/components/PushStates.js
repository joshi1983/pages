let id = 0;
const callbacks = [];

export class PushStates {
	static add(callback) {
		if (typeof callback !== 'function')
			throw new Error(`callback must be a function.  not: ${callback}`);
		// if-statement to avoid a JavaScript error when pushStates are not supported in the browser
		if (window.history !== undefined && typeof window.history.pushState === 'function') {
			callbacks[id] = callback;
			window.history.pushState({
				'id': id
			}, '#id='+id);
			id++;
		}
	}

	static getCallback(id) {
		return callbacks[id];
	}
};