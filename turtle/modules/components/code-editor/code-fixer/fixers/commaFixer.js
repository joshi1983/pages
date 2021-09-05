import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function valToType(newVal) {
	let newType = ParseTreeTokenType.LEAF;
	if (!isNaN(newVal)) {
		newType = ParseTreeTokenType.NUMBER_LITERAL;
		newVal = parseFloat(newVal);
	}
	else if (newVal.charAt(0) === ':' && newVal.length > 1) {
		newType = ParseTreeTokenType.VARIABLE_READ;
		newVal = newVal.substring(1);
	}
	return {
		'type': newType,
		'val': newVal
	};
}

function sanitizeOriginalStringAndVal(token) {
	if (token.type === ParseTreeTokenType.NUMBER_LITERAL) {
		if (typeof token.val === 'string') {
			if (token.originalString === undefined)
				token.originalString = token.val;

			if (isNaN(token.val))
				return; // nothing we can do.
				// It will be easier to troubleshoot the problem by not setting token.val to parseFloat(token.val).
			token.val = parseFloat(token.val);
		}
		if (token.originalString === undefined || parseFloat(token.originalString) !== token.val)
			token.originalString = '' + token.val;
	}
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
		sanitizeOriginalStringAndVal(token);
		cachedParseTree.tokenValueChanged(token, oldVal);
	}
	if (newVal !== '') {
		const typeValInfo = valToType(newVal);
		if (token.type !== typeValInfo.type) {
			const previousType = token.type;
			token.type = typeValInfo.type;
			cachedParseTree.tokenTypeChanged(token, previousType);
		}
		// preserve the original string for a NUMBER_LITERAL token.
		// We don't want something like '2.00' to become '2' and forget the original decimals.
		// There are many string representations for the number 2.
		if (token.type === ParseTreeTokenType.NUMBER_LITERAL && typeof token.val === 'string')
			token.originalString = token.val;
		token.val = typeValInfo.val;
		sanitizeOriginalStringAndVal(token);
	}
	else {
		// Removing the token keeps the parse tree closer to valid and normal.
		// This will help other code fixer functions deal by giving them a more normal tree.
		token.remove();
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
			if (typeValInfo1.type === ParseTreeTokenType.NUMBER_LITERAL)
				token.originalString = newValues[0]; // preserve any trailing 0's.
			token.val = typeValInfo1.val;
			sanitizeOriginalStringAndVal(token);
			cachedParseTree.tokenValueChanged(token, oldVal);
		}
		if (token.type !== typeValInfo1.type) {
			const previousType = token.type;
			token.type = typeValInfo1.type;
			cachedParseTree.tokenTypeChanged(token, previousType);
		}
		for (let i = newValues.length - 1; i >= 1; i--) {
			let newVal = newValues[i];
			const typeValInfo = valToType(newVal);
			let type = typeValInfo.type;
			newVal = typeValInfo.val;
			let originalString;
			if (type === ParseTreeTokenType.NUMBER_LITERAL)
				originalString = newValues[i];
			const newToken = new ParseTreeToken(newVal, null, token.lineIndex, token.colIndex, type, originalString);
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
		if (typeof token.val === 'string' && token.val.indexOf(',') !== -1)
			splitTokensByComma(token, fixLogger, cachedParseTree);
	});
};