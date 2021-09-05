import { getExpectedChildrenLengthForToken } from '../../getExpectedChildrenLengthForToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';

export function validateTokenChildrenLength(tokens, parseLogger) {
	tokens.forEach(function(token) {
		const numChildrenExpected = getExpectedChildrenLengthForToken(token);
		if (numChildrenExpected !== undefined && numChildrenExpected !== token.children.length)
			parseLogger.error(`Expected ${numChildrenExpected} children for a token of type ${ParseTreeTokenType.getNameFor(token.type)} but found ${token.children.length}`, token);
	});
};