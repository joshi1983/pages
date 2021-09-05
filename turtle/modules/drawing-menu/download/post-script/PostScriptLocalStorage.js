const key = 'post-script-download';

export class PostScriptLocalStorage {
	static _validate() {
		const ignoreBackgroundCheckbox = arguments[0];
		if (!(ignoreBackgroundCheckbox instanceof Element))
			throw new Error('ignoreBackgroundCheckbox must be an Element.  Not: ' + ignoreBackgroundCheckbox);
	}

	static loadFromLocalStorage(ignoreBackgroundCheckbox) {
		PostScriptLocalStorage._validate(...arguments);
		const dataStr = localStorage.getItem(key);
		if (typeof dataStr === 'string') {
			try {
				const data = JSON.parse(dataStr);
				ignoreBackgroundCheckbox.checked = data.ignoreScreenColor === true;
			}
			catch (e) {
				
			}
		}
	}

	static saveToLocalStorage(ignoreBackgroundCheckbox) {
		PostScriptLocalStorage._validate(...arguments);
		const data = {
			'ignoreScreenColor': ignoreBackgroundCheckbox.checked
		};
		localStorage.setItem(key, JSON.stringify(data));
	}
};