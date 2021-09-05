import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodConditionTypes = new Set([
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.BOOLEAN_LITERAL,
	ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
	ParseTreeTokenType.NUMBER_LITERAL,
	ParseTreeTokenType.PARAMETERIZED_GROUP,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.UNARY_OPERATOR
]);

export function validateIf(token, parseLogger) {
	if (token.children.length < 2)
		parseLogger.error(`Expected at least 2 children for IF but found ${token.children.length}`, token);
	else {
		const conditionToken = token.children[0];
		const codeBlock1 = token.children[1];
		if (!goodConditionTypes.has(conditionToken.type))
			parseLogger.error(`Did not expect if condition to have type ${ParseTreeTokenType.getNameFor(conditionToken.type)}`, token);
		if (codeBlock1.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second child of IF to be a CODE_BLOCK but got ${ParseTreeTokenType.getNameFor(codeBlock1.type)}`, token);
		if (token.children.length > 2) {
			const elseToken = token.children[2];
			if (elseToken.type !== ParseTreeTokenType.ELSE)
				parseLogger.error(`Expected ELSE to be third child of IF but got ${ParseTreeTokenType.getNameFor(elseToken.type)}`, token);
		}
	}
};