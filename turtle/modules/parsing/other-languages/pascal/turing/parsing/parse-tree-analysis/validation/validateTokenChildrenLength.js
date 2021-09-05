import { noChildTypes, oneChildTypes, twoChildTypes } from
'../../isCompleteWithNext.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

function getExpectedChildrenLengthForToken(token) {
	const parent = token.parentNode;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		if (parent.type === ParseTreeTokenType.CONST ||
		parent.type === ParseTreeTokenType.VAR) {
			const prev = token.getPreviousSibling();
			if (prev !== null &&
			prev.type === ParseTreeTokenType.DATA_TYPE_EXPRESSION)
				return 1;
		}
		return 2;
	}
	if (noChildTypes.has(token.type))
		return 0;
	if (oneChildTypes.has(token.type))
		return 1;
	if (twoChildTypes.has(token.type))
		return 2;
}

export function validateTokenChildrenLength(tokens, parseLogger) {
	tokens.forEach(function(token) {
		const numChildrenExpected = getExpectedChildrenLengthForToken(token);
		if (numChildrenExpected !== undefined && numChildrenExpected !== token.children.length)
			parseLogger.error(`Expected ${numChildrenExpected} children for a token of type ${ParseTreeTokenType.getNameFor(token.type)} but found ${token.children.length}`, token);
	});
};