import { CommodoreInternalFunctions } from
'../../CommodoreInternalFunctions.js';
import { Token } from '../../../../Token.js';
const startNames = ['draw'];
const nextValsOfInterest = new Set([
	'-', '+', '*', ',', '/'
]);

function isIntegerString(s) {
	return /^\d+$/.test(s);
}

CommodoreInternalFunctions.getAllData().functions.forEach(function(functionInfo) {
	const lowerName = functionInfo.name.toLowerCase();
	if (startNames.length !== 0) {
		const last = startNames[startNames.length - 1];
		if (lowerName.startsWith(last)) {
			const after = lowerName.substring(last.length);
			if (isIntegerString(after))
				startNames.pop(); // remove the last name.
		}
	}
	if (functionInfo.args !== undefined && functionInfo.args.length !== 0) {
		const firstArg = functionInfo.args[0];
		if (firstArg.types === 'int' || firstArg.types === 'num') {
			startNames.push(lowerName);
		}
	}
});

export function sToStartName(s) {
	if (typeof s !== 'string')
		throw new Error(`s must be a string but found ${s}`);
	s = s.toLowerCase();
	let result;
	for (const name of startNames) {
		if (s.startsWith(name) && (result === undefined || result.length < name.length)) {
			result = name;
		}
	}
	return result;
};

function isOfInterest(scanTokens, i) {
	const token = scanTokens[i];
	const startName = sToStartName(token.s);
	if (startName === undefined || startName.length === token.s.length)
		return false;

	const after = token.s.substring(startName.length);
	if (!isIntegerString(after))
		return false;
	const next = scanTokens[i + 1];
	if (next !== undefined && next.lineIndex === token.lineIndex) {
		if (!nextValsOfInterest.has(next.s))
			return false;
	}
	
	return true;
}

export function splitTokensEndingWithNumbers(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		if (isOfInterest(scanTokens, i)) {
			const token = scanTokens[i];
			const startName = sToStartName(token.s);
			const after = token.s.substring(startName.length);
			token.s = startName;
			scanTokens.splice(i + 1, 0, new Token(after, token.colIndex, token.lineIndex));
			token.colIndex -= after.length;
		}
	}
};