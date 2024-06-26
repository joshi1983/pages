import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/resolutions.json');

class PrivateResolutions {
	addOptionsToSelect(selectElement) {
		data.forEach(function(resolution, index) {
			const option = document.createElement('option');
			option.setAttribute('value', index);
			option.innerText = resolution.name + ` (${resolution.width}x${resolution.height})`;
			selectElement.appendChild(option);
		});
	}

	getData() {
		return data;
	}

	indexOf(width, height) {
		return ArrayUtils.indexOfMatch(data, (info) => info.width === width && info.height === height);
	}

	isStandard(width, height) {
		return data.some(resolution => resolution.width === width && resolution.height === height);
	}

	optionValueToDimensions(index) {
		index = parseInt(index);
		if (isNaN(index))
			throw new Error('index must be a number or something that can be parsed to an int.  Got: ' + index);

		const p = data[index];
		return {'width': p.width, 'height': p.height};
	}

	resolutionInfoToOption(resolutionInfo) {
		const result = document.createElement('option');
		const nameSpan = document.createElement('span');
		nameSpan.classList.add('name');
		nameSpan.innerText = resolutionInfo.name;
		result.appendChild(nameSpan);
		const span = document.createElement('span');
		span.innerText = '(' + resolutionInfo.width + ' by ' + resolutionInfo.height + ')';
		result.appendChild(span);
		return result;
	}
}

const Resolutions = new PrivateResolutions();
export { Resolutions };