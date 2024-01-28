const breakpointsKey = 'breakpoints';
const codeKey = 'sourceCode';
const filenameKey = 'filename';
const editorOpenedKey = 'editorOpened';

export class EditorLocalStorage {
	static breakpointsUsed() {
		localStorage.setItem(breakpointsKey, '1');
	}

	static editorOpened() {
		localStorage.setItem(editorOpenedKey, '1');
	}

	static getCode() {
		const result = localStorage.getItem(codeKey);
		if (result === null)
			return '';
		else
			return result;
	}

	static getFileName() {
		const result = localStorage.getItem(filenameKey);
		if (result === null)
			return 'turtle.lgo';
		else
			return result;
	}

	static saveCode(s) {
		if (typeof s !== 'string')
			throw new Error('s must be a string');
		localStorage.setItem(codeKey, s);
	}

	static setFileName(s) {
		if (typeof s !== 'string')
			throw new Error('s must be a string');
		localStorage.setItem(filenameKey, s);
	}

	static wasEditorOpened() {
		return localStorage.getItem(editorOpenedKey) !== null;
	}

	static wereBreakpointsUsed() {
		return localStorage.getItem(breakpointsKey) !== null;
	}
};