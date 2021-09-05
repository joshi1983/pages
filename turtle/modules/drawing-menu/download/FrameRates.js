import { fetchJson } from '../../fetchJson.js';
const data = await fetchJson('json/frameRates.json');

class PrivateFrameRates {
	addOptionsToSelect(selectElement) {
		data.forEach(function(frameRateInfo) {
			const option = document.createElement('option');
			option.innerText = frameRateInfo.name + ` - ${frameRateInfo.fps}fps`;
			option.setAttribute('value', frameRateInfo.fps);
			if (frameRateInfo.isDefault)
				option.setAttribute('selected', '');
			selectElement.appendChild(option);
		});
	}
}

const FrameRates = new PrivateFrameRates();
export { FrameRates };