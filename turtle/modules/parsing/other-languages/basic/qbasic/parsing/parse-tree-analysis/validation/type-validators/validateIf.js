import { badValueTokenTypes } from './badValueTokenTypes.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

const goodParentTypes = new Set([
	ParseTreeTokenType.CODE_BLOCK,
	ParseTreeTokenType.END_IF,
	ParseTreeTokenType.TREE_ROOT
]);

export function validateIf(token, parseLogger) {
	const parent = token.parentNode;
	if (parent !== null && !goodParentTypes.has(parent.type))
		parseLogger.error(`Expected parent type not to be ${ParseTreeTokenType.getNameFor(parent.type)}`, token);
	const children = token.children;
	if (parent.type === ParseTreeTokenType.END_IF) {
		if (children.length !== 0)
			parseLogger.error(`An IF within END_IF should have 0 children but found ${children.length}`, token);
		return;
	}
	if (children.length < 3) {
		parseLogger.error(`Expected at least 3 children of an IF token but found ${children.length}`, token);
	}
	else {
		const conditionToken = children[0];
		const thenToken = children[1];
		const codeBlockToken = children[2];
		if (badValueTokenTypes.has(conditionToken.type))
			parseLogger.error(`Did not expect IF condition token to be of type ${ParseTreeTokenType.getNameFor(conditionToken.type)}`, conditionToken);
		if (thenToken.type !== ParseTreeTokenType.THEN)
			parseLogger.error(`Expected THEN as second child of IF but found ${ParseTreeTokenType.getNameFor(thenToken.type)}`, thenToken);
		if (codeBlockToken.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected CODE_BLOCK as third child of IF but found ${ParseTreeTokenType.getNameFor(codeBlockToken.type)}`, codeBlockToken);

		if (children.length >= 4) {
			const lastToken = children[children.length - 1];
			if (lastToken.type !== ParseTreeTokenType.END_IF &&
			lastToken.type !== ParseTreeTokenType.ELSEIF &&
			lastToken.type !== ParseTreeTokenType.ELSE)
				parseLogger.error(`Expected IF token with at least 4 children to have a last token of ELSEIF, ELSE, ENDIF but found ${ParseTreeTokenType.getNameFor(lastToken.type)}`, lastToken);
		}
	}
};