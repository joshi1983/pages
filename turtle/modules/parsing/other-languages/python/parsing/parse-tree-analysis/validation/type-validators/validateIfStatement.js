import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateIfStatement(token, parseLogger) {
	const children = token.children;
	if (children.length < 3)
		parseLogger.error(`An IF_STATEMENT must have at least 3 children but found ${children.length}`, token);
	else {
		const colon = children[1];
		const codeBlock = children[2];
		if (colon.val !== ':')
			parseLogger.error(`Second child of a IF_STATEMENT must be a colon but found ${colon.val} which has a type of ${ParseTreeTokenType.getNameFor(colon.type)}`, token);
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Third child of IF_STATEMENT should be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, token);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (i !== children.length - 1 && child.type === ParseTreeTokenType.ELSE)
				parseLogger.error(`An ELSE token should be the last child of an IF but found an ELSE at index ${i} and last index is ${children.length - 1}.`, token);
			if (i !== 2 && child.type === ParseTreeTokenType.CODE_BLOCK)
				parseLogger.error(`The only CODE_BLOCK in an IF should be at index 2 but found one at index ${i}.`, token);
		}
	}
};