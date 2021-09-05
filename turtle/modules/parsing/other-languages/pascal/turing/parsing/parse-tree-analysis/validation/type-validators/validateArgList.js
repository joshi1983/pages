import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateArgList(token, parseLogger) {
	const children = token.children;
	if (children.length !== 0) {
		const first = children[0];
		const last = children[children.length - 1];
		if (first.type === ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			if (last.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET)
				parseLogger.error(`Expected last child to be ) or CURVED_RIGHT_BRACKET but got type ${ParseTreeTokenType.getNameFor(last.type)}`, token);
		}
	}
};