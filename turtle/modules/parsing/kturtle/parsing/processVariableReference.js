import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processVariableReference(previousToken, nextToken) {
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER &&
	previousToken.parentNode.type === ParseTreeTokenType.LEARN) {
		const paramsList = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.PARAMETERS_PARENT);
		paramsList.appendChild(nextToken);
		previousToken.parentNode.appendChild(paramsList);
		return paramsList;
	}
	else if (previousToken.type === ParseTreeTokenType.COMMA) {
		previousToken.appendSibling(nextToken);
	}
	else if (previousToken.type === ParseTreeTokenType.PARAMETERS_PARENT) {
		previousToken.appendChild(nextToken);
		return previousToken;
	}
	else {
		previousToken.appendChild(nextToken);
	}
	return nextToken;
};