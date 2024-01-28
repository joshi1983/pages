import { fetchJson } from '../../../fetchJson.js';
const data = await fetchJson('json/pointCloudFormats.json');

export class PointCloudFileFormats {
	static getAllData() {
		return data;
	}

	static getFormatInfoAtIndex(index) {
		if (typeof index === 'string')
			index = parseInt(index);
		return data[index];
	}

	static populateSelect(selectElement) {
		selectElement.innerText = '';
		data.forEach(function(formatInfo, index) {
			const option = document.createElement('option');
			option.innerText = formatInfo.name;
			option.setAttribute('value', index);
			if (formatInfo.description !== undefined)
				option.setAttribute('title', formatInfo.description);
			selectElement.appendChild(option);
		});
	}
};