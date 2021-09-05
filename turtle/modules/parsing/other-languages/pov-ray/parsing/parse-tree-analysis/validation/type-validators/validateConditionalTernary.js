import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';

export function validateConditionalTernary(token, parseLogger) {
	const children = token.children;
	if (children.length !== 5)
		parseLogger.error(`Expected 5 children of CONDITIONAL_TERNARY but found ${children.length}`, token);
	else {
		const questionMark = children[1];
		const colon = children[3];
		if (questionMark.type !== ParseTreeTokenType.QUESTION_MARK)
			parseLogger.error(`Expected second child of CONDITIONAL_TERNARY to be ? but got ${questionMark}`, token);
		if (colon.type !== ParseTreeTokenType.COLON)
			parseLogger.error(`Expected second last child of CONDITIONAL_TERNARY to be : but got ${colon}`, token);
	}
};