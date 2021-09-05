import { isIdentifier } from './isIdentifier.js';

const typesMap = new Map([
	['double', 'double'],
	['float', 'single'],
	['int', 'integer'],
	['string', 'string']
]);

function isOfInterest(scanTokens, index) {
	const token = scanTokens[index];
	if (token.s.toLowerCase() !== 'var')
		return false;

	const identifierName = scanTokens[index + 1];
	if (identifierName === undefined || !isIdentifier(identifierName.s))
		return false;

	const colon = scanTokens[index + 2];
	if (colon === undefined || colon.s !== ':')
		return false;

	return true;
}

function translateDataType(type) {
	const result = typesMap.get(type.toLowerCase());
	if (result === undefined)
		return type;
	return result;
}

export function processVarDeclarations(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (isOfInterest(scanTokens, i)) {
			const afterToken = scanTokens[i + 4];
			if (afterToken !== undefined && afterToken.s === '=') {
				scanTokens.splice(i, 1); // remove the var token.
				scanTokens.splice(i + 1, 2); // remove the colon token and data type.
			}
			else {
				token.s = 'DIM';
				const colon = scanTokens[i + 2];
				colon.s = 'as';
				const dataType = scanTokens[i + 3];
				dataType.s = translateDataType(dataType.s);
			}
		}
	}
};