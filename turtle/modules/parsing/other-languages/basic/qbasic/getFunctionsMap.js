import { isComment } from
'./scanning/isComment.js';
import { isIdentifier } from
'./scanning/isIdentifier.js';
import { QBasicFunction } from
'./parsing/parse-tree-analysis/QBasicFunction.js';

function getParameters(scanTokens, startIndex) {
	const result = [];
	let name;
	for (let i = startIndex; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === ')') {
			if (name !== undefined)
				result.push({'name': name});
			break;
		}
		else if (token.s === ',') {
			if (name === undefined)
				return;
			result.push({'name': name});
			name = undefined;
		}
		else if (name === undefined) {
			name = token.s.toLowerCase();
		}
	}
	return result;
}

function isExit(token) {
	if (token === undefined)
		return false;
	return token.s.toLowerCase() === 'exit';
}

function isEnd(token) {
	if (token === undefined)
		return false;
	return token.s.toLowerCase() === 'end';
}

export function getFunctionsMap(scanTokens) {
	scanTokens = scanTokens.filter(t => !isComment(t.s));
	const result = new Map();
	for (let i = 0; i < scanTokens.length - 2; i++) {
		const token = scanTokens[i];
		const s = token.s.toLowerCase();
		const prev = scanTokens[i - 1]
		if ((s === 'function' || s === 'sub') &&
		!isExit(prev) && !isEnd(prev)) {
			const name = scanTokens[i + 1].s.toLowerCase();
			if (isIdentifier(name)) {
				const parameters = getParameters(scanTokens, i + 3);
				if (parameters !== undefined) {
					const f = new QBasicFunction(name, parameters);
					if (s === 'sub')
						f.returnTypes = null; // indicate the "function" doesn't return any value.
					result.set(name, f);
				}
			}
		}
	}
	return result;
};