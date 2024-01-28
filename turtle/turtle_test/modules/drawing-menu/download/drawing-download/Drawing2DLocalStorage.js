const keyPrefix = 'drawing2ddownload-';
const fileFormatKey = keyPrefix + 'file-format';

export class Drawing2DLocalStorage {
	static getFileFormatMime() {
		return localStorage.getItem(fileFormatKey);
	}

	static saveFileFormatMime(name) {
		localStorage.setItem(fileFormatKey, name);
	}
};