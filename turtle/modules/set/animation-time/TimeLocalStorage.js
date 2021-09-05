const key = 'set-time-used';

export class TimeLocalStorage {
	static saveUsed() {
		localStorage.setItem(key, '1');
	}

	static isUsed() {
		return localStorage.getItem(key) !== null;
	}
};