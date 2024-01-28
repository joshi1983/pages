import { getCamelCaseQuality } from './getCamelCaseQuality.js';

export function getBestCase(vals) {
	if (!(vals instanceof Array))
		throw new Error(`vals must be an Array.  Not: ${vals}`);
	const cases = new Map();
	vals.forEach(function(val) {
		if (!cases.has(val))
			cases.set(val, 1);
		else
			cases.set(val, cases.get(val) + 1);
	});
	const maximumCount = Math.max(...Array.from(new Set(cases.values())));
	const maxCases = Array.from(cases.keys()).filter(key => cases.get(key) === maximumCount);
	if (maxCases.length === 1)
		return maxCases[0];
	else {
		let maxResult = getCamelCaseQuality(maxCases[0]);
		let result = maxCases[0];
		for (let i = 1; i < maxCases.length; i++) {
			const nameCase = maxCases[i];
			const quality = getCamelCaseQuality(nameCase);
			if (quality > maxResult) {
				maxResult = quality;
				result = nameCase;
			}
		}
		return result;
	}
};