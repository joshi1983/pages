import { FileExtensions } from '../drawing-menu/download/FileExtensions.js';

function getLocalStorageKey(filename) {
	return Asset.localStoragePrefix + filename;
}

function keyToFilename(key) {
	key = key.substring(Asset.localStoragePrefix.length);
	return key;
}

export class Asset {
	static localStoragePrefix = 'assets-';

	constructor(filename, data) {
		if (typeof filename !== 'string')
			throw new Error('filename must be a string.  Not: ' + filename);
		if (typeof data !== 'string')
			throw new Error('data must be a string.  Not: ' + data);
		this.filename = filename;
		this.data = data;
	}

	_getLocalStorageKey() {
		return getLocalStorageKey(this.filename);
	}

	static createFromLocalStorageKey(key) {
		const filename = keyToFilename(key);
		const val = localStorage.getItem(key);
		return new Asset(filename, val);
	}

	getBase64URI(optionalMimeOverride) {
		if (typeof optionalMimeOverride !== 'string')
			optionalMimeOverride = this.getMime();
		return `data:${optionalMimeOverride};base64,${this.data}`;
	}

	getDataSize() {
		return this.data.length;
	}

	getDataAsString() {
		return atob(this.data);
	}

	getMime() {
		return FileExtensions.getMimeFromExtension(this.filename);
	}

	getShortFilename() {
		const slashes = ['/', '\\'];
		let maxIndex = Math.max(...slashes.map(slash => this.filename.lastIndexOf(slash)));
		if (maxIndex >= 0)
			return this.filename.substring(maxIndex + 1);
		else
			return this.filename;
	}

	loadFromLocalStorage() {
		const itemVal = localStorage.getItem(this._getLocalStorageKey());
		if (typeof itemVal !== 'string')
			throw new Error(`${this._getLocalStorageKey()} not in local storage`);
		this.data = itemVal;
	}

	removeFromLocalStorage() {
		localStorage.removeItem(this._getLocalStorageKey());
	}

	saveToLocalStorage() {
		localStorage.setItem(this._getLocalStorageKey(), this.data);
	}
};