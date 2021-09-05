import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function valToType(newVal) {
	let newType = ParseTreeTokenType.LEAF;
	if (!isNaN(newVal))
		newType = ParseTreeTokenType.NUMBER_LITERAL;
	else if (newVal.charAt(0) === ':' && newVal.length > 1) {
		newType = ParseTreeTokenType.VARIABLE_READ;
		newVal = newVal.substring(1);
	}
	return {
		'type': newType,
		'val': newVal
	};
}

function trimCommas(token, fixLogger, cachedParseTree) {
	let newVal = token.val;
	while (newVal.charAt(0) === ',')
		newVal = newVal.substring(1);
	while (newVal.charAt(newVal.length - 1) === ',') {
		token.colIndex--; // column index must be updated to reflect moving the token's ending.
		newVal = newVal.substring(0, newVal.length - 1);
	}
	if (token.val !== newVal) {
		const oldVal = token.val;
		token.val = newVal;
		cachedParseTree.tokenValueChanged(token, oldVal);
	}
	if (newVal !== '') {
		const typeValInfo = valToType(newVal);
		if (token.type !== typeValInfo.type) {
			const previousType = token.type;
			token.type = typeValInfo.type;
			cachedParseTree.tokenTypeChanged(token, previousType);
		}
		token.val = typeValInfo.val;
	}
	else {
		// Removing the token keeps the parse tree closer to valid and normal.
		// This will help other code fixer functions deal by giving them a more normal tree.
		token.parentNode.removeChild(token);
		cachedParseTree.tokenRemoved(token);
	}
	fixLogger.log('Replaced comma with space since spaces are how Logo separates values', token);
}

function splitTokensByComma(token, fixLogger, cachedParseTree) {
	if (cachedParseTree === undefined)
		throw new Error('cachedParseTree must not be undefined');
	let newValues = token.val.split(',').filter(v => v !== '');
	if (newValues.length > 1) {
		const typeValInfo1 = valToType(newValues[0]);
		if (token.val !== typeValInfo1.val) {
			const oldVal = token.val;
			token.val = typeValInfo1.val;
			cachedParseTree.tokenValueChanged(token, oldVal);
		}
		if (token.type !== typeValInfo1.type) {
			const previousType = token.type;
			token.type = typeValInfo1.type;
			cachedParseTree.tokenTypeChanged(token, previousType);
		}
		for (let i = 1; i < newValues.length; i++) {
			let newVal = newValues[i];
			const typeValInfo = valToType(newVal);
			let type = typeValInfo.type;
			newVal = typeValInfo.val;
			const newToken = new ParseTreeToken(newVal, null, token.lineIndex, token.colIndex, type);
			token.appendSibling(newToken);
			cachedParseTree.tokenAdded(newToken);
		}
	}
}

export function commaFixer(cachedParseTree, fixLogger) {
	if (cachedParseTree === undefined)
		throw new Error('cachedParseTree must not be undefined');
	const commaTokens = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(function(token) {
		return token.val.charAt(0) === ',' || token.val.charAt(token.val.length - 1) === ',';
	});
	commaTokens.forEach(function(token) {
		if (token.val.startsWith(',') || token.val.endsWith(','))
			trimCommas(token, fixLogger, cachedParseTree);
		if (token.val.indexOf(',') !== -1)
			splitTokensByComma(token, fixLogger, cachedParseTree);
	});
};