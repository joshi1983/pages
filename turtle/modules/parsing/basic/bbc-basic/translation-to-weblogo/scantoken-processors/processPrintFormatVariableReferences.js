import { isIdentifier } from
'../../../qbasic/scanning/isIdentifier.js';

function getGoodVariableName(scanTokens) {
	const identifiersUsed = new Set();
	for (const token of scanTokens) {
		if (isIdentifier(token.s))
			identifiersUsed.add(token.s.toLowerCase());
	}
	const names = ['numberFormat', 'numberFormat_', '_numberFormat_'];
	for (const name of names) {
		if (!identifiersUsed.has(name.toLowerCase()))
			return name;
	}
	for (let i = 2; true; i++) {
		for (const name of names) {
			const name2 = name + i;
			if (!identifiersUsed.has(name2.toLowerCase()))
				return name;
		}
	}
}

export function processPrintFormatVariableReferences(scanTokens) {
	const newName = getGoodVariableName(scanTokens);
	for (let token of scanTokens) {
		if (token.s === '@%')
			token.s = newName;
	}
};