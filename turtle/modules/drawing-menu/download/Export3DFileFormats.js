export class Export3DFileFormats {
	constructor(data) {
		this.data = data;
	}

	getAllData() {
		return this.data;
	}

	getFormatInfoAtIndex(index) {
		if (typeof index === 'string')
			index = parseInt(index);
		return this.data[index];
	}

	populateSelect(selectElement) {
		selectElement.innerText = '';
		this.data.forEach(function(formatInfo, index) {
			const option = document.createElement('option');
			option.innerText = formatInfo.name;
			option.setAttribute('value', index);
			if (formatInfo.description !== undefined)
				option.setAttribute('title', formatInfo.description);
			selectElement.appendChild(option);
		});
	}
};