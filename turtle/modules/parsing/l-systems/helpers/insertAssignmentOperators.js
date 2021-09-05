import { Token } from '../../generic-parsing-utilities/Token.js';

function isOfInterest(scanTokens, i, mightBeProperty) {
	const propertyNameToken = scanTokens[i - 1];
	const propertyValueToken = scanTokens[i];
	if (!mightBeProperty(propertyNameToken.s))
		return false;
	if (propertyNameToken.lineIndex !== propertyValueToken.lineIndex)
		return false;
	if (propertyValueToken.s === '=')
		return false;
	return true;
}

export function insertAssignmentOperators(mightBeProperty) {
	return function(scanTokens) {
		for (let i = 1; i < scanTokens.length; i++) {
			if (isOfInterest(scanTokens, i, mightBeProperty)) {
				const token = scanTokens[i];
				scanTokens.splice(i, 0, new Token('=', token.colIndex, token.lineIndex));
				i++;
			}
		}
	};
};