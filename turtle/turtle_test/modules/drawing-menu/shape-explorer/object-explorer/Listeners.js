import { Listener } from './Listener.js';

export class Listeners {
	constructor() {
		this._listeners = [];
	}

	add(listener) {
		if (!(listener instanceof Listener))
			throw new Error('listener must be a Listener.  Not: ' + listener);
		this._listeners.push(listener);
	}

	unbind(div) {
		for (let i = 0; i < this._listeners.length; i++) {
			const listener = this._listeners[i];
			const e = listener.e === undefined ? div : listener.e;
			e.removeEventListener(listener.key, listener.callback);
		}
		this._listeners.length = 0;
	}
};