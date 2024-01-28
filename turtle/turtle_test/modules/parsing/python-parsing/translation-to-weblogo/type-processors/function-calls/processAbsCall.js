import { DataTypes } from '../../../data-types/DataTypes.js';
import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { printChildren } from '../helpers/printChildren.js';
const typesNeedingHypot = new Set(['list', 'tuple', 'list|tuple']);
const typesNotNeedingHypot = new Set(['int', 'num']);
function isNeedingHypotString(typeString) {
	if (typesNeedingHypot.has(typeString))
		return true;
	if (typesNotNeedingHypot.has(typeString))
		return false;
	return typeString.indexOf('int') === -1 &&
	typeString.indexOf('num') === -1 &&
	(typeString.indexOf('list') !== -1 || typeString.indexOf('tuple') !== -1);
}

export function processAbsCall(token, result, cachedParseTree) {
	const parameterValueTokens = filterBracketsAndCommas(token.children);
	let weblogoName = 'abs';
	if (parameterValueTokens.length === 1) {
		const types = cachedParseTree.getTokensToDataTypes().get(parameterValueTokens[0]);
		if (types !== undefined) {
			/*
			The abs command in WebLogo does not work with lists.
			The hypot command in WebLogo is good for lists, though.
			*/
			const tokenTypeString = DataTypes.stringify(types);
			if (isNeedingHypotString(tokenTypeString))
				weblogoName = 'hypot';
		}
	}
	result.append(`${weblogoName} `);
	printChildren(token, result, cachedParseTree);
};