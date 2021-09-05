import { scrapeAttributeValue } from './scrapeAttributeValue.js';

export function scrapeRotationAngleFrom(svgMarkup) {
	const transformValue = scrapeAttributeValue(svgMarkup, 'transform');
	if (transformValue === undefined)
		return 0; // the default rotation
	const key = 'rotate(';
	let index = transformValue.indexOf(key);
	if (index !== -1) {
		index += key.length;
		const endIndex = transformValue.indexOf(')', index);
		if (endIndex !== -1) {
			const val = transformValue.substring(index, endIndex).trim();
			return parseFloat(val);
		}
	}
	return 0;
};