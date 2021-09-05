import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFor(token, parseLogger) {
	const children = token.children;
	if (children.length < 1 || children.length > 2)
		parseLogger.error(`Expected a FOR token to have 1 or 2 children but found ${children.length}`, token);
	else {
		const firstChild = children[0];
		if (firstChild.type !== ParseTreeTokenType.FOR_LOOP_SETTINGS)
			parseLogger.error(`Expected first child of a FOR to be a FOR_LOOP_SETTINGS but found ${ParseTreeTokenType.getNameFor(firstChild.type)}`, firstChild);
		if (children.length === 2) {
			const secondChild = children[1];
			if (secondChild.type !== ParseTreeTokenType.CODE_BLOCK)
				parseLogger.error(`Expected second child of a FOR to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(secondChild.type)}`, secondChild);
		}
	}
};