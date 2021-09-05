import { processToken } from './processToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { evaluateStringLiteral } from '../../../js-parsing/evaluateStringLiteral.js';

function getDictionaryName(dictionaryToken) {
	const parent = dictionaryToken.parentNode;
	if (parent === null || parent.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	parent.val !== '=')
		return;
	if (parent.children.indexOf(dictionaryToken) !== 1)
		return;
	const grandParent = parent.parentNode;
	if (grandParent === null || (grandParent.type !== ParseTreeTokenType.LOCAL &&
	grandParent.type !== ParseTreeTokenType.DECLARE))
		return;
	const assignedToToken = parent.children[0];
	if (assignedToToken.type === ParseTreeTokenType.IDENTIFIER)
		return assignedToToken.val;
}

function getKeyStringFromPair(pairToken) {
	const firstChild = pairToken.children[0];
	if (firstChild.type === ParseTreeTokenType.DOT_PROPERTY &&
	firstChild.children.length === 2) {
		const propToken = firstChild.children[1];
		if (propToken.type === ParseTreeTokenType.IDENTIFIER)
			return propToken.val;
	}
	else if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
		return firstChild.val;
	else if (firstChild.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION &&
	firstChild.children.length >= 2) {
		const stringLiteral = firstChild.children[1];
		if (stringLiteral.type === ParseTreeTokenType.STRING_LITERAL)
			return evaluateStringLiteral(stringLiteral.val);
	}
}

function getKeyValuePairs(dictionaryToken) {
	if (dictionaryToken.children.length === 0)
		return [];
	const result = [];
	for (const child of dictionaryToken.children[0].children) {
		if (child.type === ParseTreeTokenType.KEY_VALUE_PAIR &&
		child.children.length === 3) {
			const key = getKeyStringFromPair(child);
			if (key !== undefined) {
				result.push({'key': key, 'valueToken': child.children[2]});
			}
		}
	}
	return result;
}

export function processDictionary(token, result) {
	result.append('\ncreatePList\n');
	const dictionaryName = getDictionaryName(token);
	if (dictionaryName !== undefined) {
		const pairs = getKeyValuePairs(token);
		if (pairs.length !== 0) {
			for (const pair of pairs) {
				result.append(`\nsetProperty "${dictionaryName} "${pair.key} `);
				processToken(pair.valueToken, result);
			}
			result.append('\n');
		}
	}
};