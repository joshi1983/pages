import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateFor(token, parseLogger) {
	const parent = token.parentNode;
	const children = token.children;
	if (parent !== null && parent.type === ParseTreeTokenType.EXIT) {
		if (children.length !== 0)
			parseLogger.error(`Expected for which is a child of an EXIT to have no children but found ${children.length}`, token);
		return;
	}
	if (children.length < 3) {
		parseLogger.error(`Expected a FOR to generally have at least 3 children but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[children.length - 1];
		const codeBlock = children[children.length - 2];
		if (first.type !== ParseTreeTokenType.BINARY_OPERATOR || first.val.toLowerCase() !== 'to')
			parseLogger.error(`Expected first child of for to be a BINARY_OPERATOR with val of to but found ${ParseTreeTokenType.getNameFor(first.type)} with a val ${first.val}`, first);
		if (last.type !== ParseTreeTokenType.NEXT)
			parseLogger.error(`Expected last child of for to be a NEXT but found ${ParseTreeTokenType.getNameFor(last.type)}`, last);
		else if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second last child of for to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, codeBlock);
	}
};