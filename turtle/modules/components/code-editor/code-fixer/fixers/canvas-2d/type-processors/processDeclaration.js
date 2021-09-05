import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'../../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/helpers/processTokens.js';
import { shouldDeclarationBeRemoved } from './assignments/shouldDeclarationBeRemoved.js';

function isNotComma(token) {
	return token.type !== ParseTreeTokenType.COMMA;
}

export function processDeclaration(token, result, settings) {
	if (shouldDeclarationBeRemoved(token))
		return;
	const filteredChildren = token.children.filter(isNotComma);
	processTokens(processToken, filteredChildren, result, settings);
};