import { mightBeNumericValue } from './mightBeNumericValue.js';

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	const next = scanTokens[i + 1];
	if (!mightBeNumericValue(next.s))
		return false;
	const comma = scanTokens[i + 2];
	if (comma !== undefined && comma.s !== ',')
		return false;
	const third = scanTokens[i + 3];
	if (!mightBeNumericValue(third.s))
		return false;
	const nextLineToken = scanTokens[i + 4];
	if (nextLineToken === undefined) {
		if (third !== undefined &&
		third.lineIndex === token.lineIndex)
			return true;
	}
	else if (nextLineToken.lineIndex === token.lineIndex)
		return false;

	return true;
}

export function processHPlotToPSET(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'hplot' &&
		isOfInterest(scanTokens, i)) {
			token.s = 'pset';
		}
	}
};