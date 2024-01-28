export class ValueWrapper {
	constructor(read, write) {
		if (typeof read !== 'function')
			throw new Error('read must be a function');
		if (typeof write !== 'function')
			throw new Error('write must be a function');

		this._read = read;
		this._write = write;
	}

	read() {
		return this._read();
	}

	write(newVal) {
		this._write(newVal);
	}
};