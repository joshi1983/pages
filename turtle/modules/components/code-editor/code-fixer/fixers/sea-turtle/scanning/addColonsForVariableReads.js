import { isValidIdentifier } from './isValidIdentifier.js';

function trimVariableName(s) {
	if (s[0] === '"')
		s = s.substring(1);
	return s;
}

function getLikelyVariableNames(tokens) {
	const result = new Set();
	for (let i = 1; i < tokens.length; i++) {
		const prev = tokens[i - 1];
		const prevS = prev.s.toLowerCase();
		if (prevS !== 'make' && prevS !== 'set')
			continue;

		const token = tokens[i];
		const variableName = trimVariableName(token.s.toLowerCase());
		if (isValidIdentifier(variableName)) {
			result.add(variableName);
		}
	}
	return result;
}

export function addColonsForVariableReads(tokens) {
	const variableNames = getLikelyVariableNames(tokens);
	for (let i = 0; i < tokens.length; i++) {
		const prev = tokens[i - 1];
		if (prev !== undefined) {
			const prevS = prev.s.toLowerCase();
			if (prevS === 'make' || prevS === 'set')
				continue; // avoid converting something like set x 3 to set :x 3.
				// ultimately, a case like that should become set "x 3 and the 
				// : will get us farther from that goal.
		}
		const token = tokens[i];
		const tokenS = token.s.toLowerCase();
		if (variableNames.has(tokenS)) {
			token.s = ':' + token.s;
		}
	}
}