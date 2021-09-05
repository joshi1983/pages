import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processImportIfNeeded(previousToken, nextToken) {
	if (previousToken.val === 'import') {
		previousToken.type = ParseTreeTokenType.IMPORT;
		if (nextToken.type === ParseTreeTokenType.CURLY_LEFT_BRACKET) {
			const objToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CURLY_BRACKET_EXPRESSION);
			objToken.appendChild(nextToken);
			previousToken.appendChild(objToken);
			return objToken;
		}
		else {
			previousToken.appendChild(nextToken);
			return previousToken;
		}
	}
};