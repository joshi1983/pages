const key = 'string-art-download';

export class StringArtLocalStorage {
	static _validate() {
		const lineHintCheckbox = arguments[0];
		if (!(lineHintCheckbox instanceof Element))
			throw new Error('lineHintCheckbox must be an Element.  Not: ' + lineHintCheckbox);
	}

	static _getData() {
		const dataStr = localStorage.getItem(key);
		if (typeof dataStr === 'string') {
			try {
				const data = JSON.parse(dataStr);
				// sanitize data.
				if (typeof data.lineHints !== 'boolean')
					data.lineHints = true;
				return data;
			}
			catch (e) {
			}
		}
		return {
			'lineHints': true
		};
	}

	static isUsingLineHints() {
		return StringArtLocalStorage._getData().lineHints;
	}

	static loadFromLocalStorage(lineHintCheckbox) {
		StringArtLocalStorage._validate(...arguments);
		const data = StringArtLocalStorage._getData();
		lineHintCheckbox.checked = data.lineHints;
	}

	static saveToLocalStorage(lineHintCheckbox) {
		StringArtLocalStorage._validate(...arguments);
		const data = {
			'lineHints': lineHintCheckbox.checked
		};
		localStorage.setItem(key, JSON.stringify(data));
	}
};