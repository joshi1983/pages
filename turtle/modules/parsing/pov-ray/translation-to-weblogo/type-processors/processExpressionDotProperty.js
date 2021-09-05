import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isTranslatable(valueToken) {
	if (valueToken.type !== ParseTreeTokenType.EXPRESSION_DOT_PROPERTY ||
	valueToken.children.length !== 3)
		return false;
	const firstChild = valueToken.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const lastChild = valueToken.children[valueToken.children.length - 1];
	if (lastChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
}

export function processExpressionDotProperty(token, result) {
	if (isTranslatable(token)) {
		const dictionaryName = token.children[0].val;
		const propertyName = token.children[2].val;
		result.append(` getProperty "${dictionaryName} "${propertyName} `);
	}
	else {
		result.append(`; failed to translate EXPRESSION_DOT_PROPERTY token\n`);
	}
};