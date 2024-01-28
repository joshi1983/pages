import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateConditionalTernaryOperator(token, parseLogger) {
	const children = token.children;
	if (children.length === 5) {
		const question = children[1];
		const colon = children[3];
		if (question.type !== ParseTreeTokenType.QUESTION_MARK)
			parseLogger.error(`Expected second child of CONDITIONAL_TERNARY to be a QUESTION_MARK but got type ${ParseTreeTokenType.getNameFor(question.type)}`, token);
		if (colon.type !== ParseTreeTokenType.COLON)
			parseLogger.error(`Expected second last child of CONDITIONAL_TERNARY to be a COLON but got type ${ParseTreeTokenType.getNameFor(question.type)}`, token);
	}
};