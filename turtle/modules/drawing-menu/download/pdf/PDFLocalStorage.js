import { isNumber } from '../../../isNumber.js';
import { PageSize } from '../../../drawing/drawers/post-script/PageSize.js';

const key = 'pdf-download';

function getData() {
	const defaultPageSize = PageSize.getDefaultPageSize();
	let data = localStorage.getItem(key);
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data);
			if (typeof data === 'object') {
				// sanitize, if not yet valid.
				if (!isNumber(data.size))
					data.size = defaultPageSize.index;
				if (typeof data.ignoreScreenColor !== 'boolean')
					data.ignoreScreenColor = true;
				return data;
			}
		}
		catch (e) {
			// ignore possible parse error.
		}
	}
	return {
		'size': defaultPageSize.index,
		'ignoreScreenColor': true
	};
}

export class PDFLocalStorage {
	static load(pageSizeSelect, ignoreScreenColorCheckbox) {
		const data = getData();
		pageSizeSelect.value = data.size;
		ignoreScreenColorCheckbox.checked = (data.ignoreScreenColor === true);
	}

	static save(pageSizeSelect, ignoreScreenColorCheckbox) {
		localStorage.setItem(key, JSON.stringify({
			'size': parseInt(pageSizeSelect.value),
			'ignoreScreenColor': ignoreScreenColorCheckbox.checked
		}));
	}
};