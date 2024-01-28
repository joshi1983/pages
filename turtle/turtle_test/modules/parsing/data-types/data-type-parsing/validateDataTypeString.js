import { isName } from './isName.js';
import { scanDataTypeString } from './scanDataTypeString.js';

function areTemplateBracketsBalanced(scanTokens) {
	let balanceFactor = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '<')
			balanceFactor++;
		else if (token.s === '>')
			balanceFactor--;
		if (balanceFactor < 0)
			return false;
	}
	return balanceFactor === 0;
}

function nameAlwaysBeforeOpenBracket(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '<') {
			if (i === 0 || !isName(scanTokens[i - 1].s))
				return false;
		}
	}
	return true;
}

function improperPipeFound(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '|') {
			if (i === 0 || i === scanTokens.length - 1)
				return true;
			const prev = scanTokens[i - 1];
			if (prev.s !== '>' && !isName(prev.s))
				return true;
		}
	}
	return false;
}

export function validateDataTypeString(s) {
	if (typeof s === 'string')
		s = scanDataTypeString(s);
	if (!areTemplateBracketsBalanced(s))
		return 'Template brackets(<>) are out of balance';
	if (!nameAlwaysBeforeOpenBracket(s))
		return '< found without preceding name';
	if (improperPipeFound(s))
		return 'A | was found in an unexpected place';
};