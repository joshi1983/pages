const key = 'point-cloud-download';

export class PointCloudLocalStorage {
	static _validate(formatSelector, modeSelector) {
		if (!(formatSelector instanceof Element))
			throw new Error('formatSelector must be an Element.  Not: ' + formatSelector);
		if (!(modeSelector instanceof Element))
			throw new Error('modeSelector must be an Element.  Not: ' + modeSelector);
	}

	static loadFromLocalStorage(formatSelector, modeSelector) {
		PointCloudLocalStorage._validate(...arguments);
		const dataStr = localStorage.getItem(key);
		if (typeof dataStr === 'string') {
			try {
				const data = JSON.parse(dataStr);
				formatSelector.value = '' + data.formatIndex;
				modeSelector.value = '' + data.mode;
			}
			catch (e) {
				
			}
		}
	}

	static saveToLocalStorage(formatSelector, modeSelector) {
		PointCloudLocalStorage._validate(...arguments);
		const data = {
			'formatIndex': parseInt(formatSelector.value),
			'mode': parseInt(modeSelector.value)
		};
		localStorage.setItem(key, JSON.stringify(data));
	}
};