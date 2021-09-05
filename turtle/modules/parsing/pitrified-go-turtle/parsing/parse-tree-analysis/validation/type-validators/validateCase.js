import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const caseParentTypes = new Set([
	ParseTreeTokenType.SELECT_BODY,
	ParseTreeTokenType.SWITCH_BODY
]);

export function validateCase(token, parseLogger) {
	const parent = token.parentNode;
	if (!caseParentTypes.has(parent.type))
		parseLogger.error(`Expected CASE to not have a parent type ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	if (token.children.length === 0)
		parseLogger.error(`Expected at least 1 child for CASE but found ${token.children.length}`, token);
	else {
		const lastChildToken = token.children[token.children.length - 1];
		if (lastChildToken.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected last child of CASE to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(lastChildToken.type)}`, token);
	}
};