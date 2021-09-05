import { Operators } from '../../Operators.js';

const starts = new Map();
const whitespace = /\s/;

for (const info of Operators.getAll()) {
	const symbol = info.symbol;
	const index = symbol.search(whitespace);
	if (index !== -1) {
		const start = symbol.substring(0, index);
		let keys = starts.get(start);
		if (keys === undefined) {
			keys = [];
			starts.set(start, keys);
		}
		keys.push(symbol.split(whitespace));
	}
}

function getKeyOfInterest(tokens, i) {
	const token = tokens[i];
	const info = starts.get(token.s.toLowerCase());
	if (info !== undefined) {
		for (const key of info) {
			let found = true;
			for (let j = 1; j < key.length; j++) {
				const token = tokens[i + j];
				if (token === undefined ||
				token.s.toLowerCase() !== key[j]) {
					found = false;
					break;
				}
			}
			if (found)
				return key;
		}
	}
}

export function joinOperatorsContainingWhitespace(tokens) {
	for (let i = 0; i < tokens.length - 1; i++) {
		const key = getKeyOfInterest(tokens, i);
		if (key !== undefined) {
			let joined = '';
			for (let offset = 0; offset < key.length; offset++) {
				if (offset !== 0)
					joined += ' ';
				joined += tokens[i + offset].s;
			}
			tokens[i].s = joined;
			tokens.splice(i + 1, key.length - 1);
		}
	}
};