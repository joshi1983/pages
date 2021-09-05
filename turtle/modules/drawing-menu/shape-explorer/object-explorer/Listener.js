export function Listener(key, callback, e) {
	if (typeof key !== 'string')
		throw new Error('key must be a string such as "click" but got ' + key);
	if (typeof callback !== 'function')
		throw new Error('callback must be a function.  Not: ' + callback);

	this.key = key;
	this.callback = callback;
	if (e !== undefined) {
		this.e = e;
		this.e.addEventListener(key, callback);
	}
};