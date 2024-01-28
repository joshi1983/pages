import { addToken } from './addToken.js';
import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { getTopCompleteExpressionToken } from './getTopCompleteExpressionToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function processQuestionMark(previousToken, nextToken) {
	previousToken = getTopCompleteExpressionToken(previousToken);
	let previousParent = previousToken.parentNode;
	if (previousParent === null) {
		addToken(previousToken, nextToken);
	}
	else {
		const ternaryToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.CONDITIONAL_TERNARY);
		if (previousToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION &&
		previousToken.children.length === 2 && !endsWithClosingCurvedBracket(previousToken)) {
			previousParent = previousToken;
			previousToken = previousToken.children[1];
		}
		previousToken.remove();
		ternaryToken.appendChild(previousToken);
		ternaryToken.appendChild(nextToken);
		previousParent.appendChild(ternaryToken);
	}
};