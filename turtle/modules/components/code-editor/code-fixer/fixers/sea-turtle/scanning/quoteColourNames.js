import { SeaTurtleColours } from '../SeaTurtleColours.js';

const nextValsOfNoInterest = new Set(['-', '+', '*', '/', '^',
	'=', '<', '>', '>=', '<=']);
const previousValsOfInterest = new Set(['setpencolor', 'setscreencolor']);

function isOfInterest(tokens, i) {
	const tokenS = tokens[i].s.toLowerCase();
	const info = SeaTurtleColours.getColourInfo(tokenS);
	if (info === undefined)
		return false;

	if (tokenS === info.name)
		return true;

	const prev = tokens[i - 1];
	if (prev === undefined)
		return false;

	const next = tokens[i + 1];
	if (next !== undefined && nextValsOfNoInterest.has(next.s))
		return false;

	if (previousValsOfInterest.has(prev.s.toLowerCase()))
		return true;

	return false;
}

export function quoteColourNames(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		if (isOfInterest(tokens, i)) {
			const token = tokens[i];
			const tokenS = token.s.toLowerCase();
			const info = SeaTurtleColours.getColourInfo(tokenS);
			token.s = '"' + info.name;
		}
	}
};