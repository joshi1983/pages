export class EventDispatcher {
	constructor(supportedEventKeys) {
		if (!(supportedEventKeys instanceof Array))
			throw new Error('The supportedEventKeys must be an Array');
		this.supportedEventKeys = new Set(supportedEventKeys);
		this.listeners = [];
	}

	_dispatchEvent(key, eventDetails) {
		if (typeof key !== 'string')
			throw new Error('The key must be a string');

		const listeners = this.listeners;
		if (listeners.length === 0)
			return;

		const eventInfo = {
			'key': key,
			'details': eventDetails
		};
		/*
		Not using forEach or filter here for performance reasons.
		forEach and filter tend to perform worse than a regular for-loop.
		*/
		for (let i = 0; i < listeners.length; i++) {
			const L = listeners[i];
			if (L.key === key) {
				L.handler(eventInfo);
			}
		}
	}

	addEventListener(key, handler) {
		if (typeof handler !== 'function')
			throw new Error('event handler must be a function');

		key = key.trim();
		if (key.indexOf(',') !== -1) {
			const keys = key.split(',');
			const outer = this;
			keys.forEach(function(k) {
				outer.addEventListener(k, handler);
			});
			return;
		}
		if (!this.supportedEventKeys.has(key))
			throw new Error('Only ' + JSON.stringify(Array.from(this.supportedEventKeys)) + ' is/are recognized but you specified ' + key);
		this.listeners.push({
			'key': key,
			'handler': handler
		});
	}

	removeAllEventListeners() {
		this.listeners.length = 0;
	}

	removeEventListener() {
		// Get the handler, optional key, and validate.
		let key = undefined;
		let handler = undefined;
		if (arguments.length === 1) {
			handler = arguments[0];
		}
		else if (arguments.length === 2) {
			if (typeof arguments[0] !== 'string')
				throw new Error('The event key must be specified as a string');
			key = arguments[0];
			handler = arguments[1];
		}
		else
			throw new Error('removeEventListener requires 1 or 2 arguments but ' + arguments.length + ' were specified');
		if (typeof handler !== 'function')
			throw new Error('A function must be specified for the handler');

		this.listeners = this.listeners.filter(function(listener) {
			if (key !== undefined && key !== listener.key)
				return true;
			return handler !== listener.handler;
		});
	}
};