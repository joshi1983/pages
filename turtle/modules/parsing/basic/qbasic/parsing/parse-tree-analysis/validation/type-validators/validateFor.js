import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

function findMatchingNext(token, varName) {
	varName = varName.toLowerCase();
	while (true) {
		const children = token.children;
		if (children.length === 0)
			return;
		const last = children[children.length - 1];
		if (token.type === ParseTreeTokenType.NEXT) {
			for (const child of children) {
				if (child.type === ParseTreeTokenType.IDENTIFIER &&
				child.val.toLowerCase() === varName)
					return token;
			}
			return;
		}
		token = last;
	}
}

export function validateFor(token, parseLogger) {
	const parent = token.parentNode;
	const children = token.children;
	if (parent !== null && parent.type === ParseTreeTokenType.EXIT) {
		if (children.length !== 0)
			parseLogger.error(`Expected for which is a child of an EXIT to have no children but found ${children.length}`, token);
		return;
	}
	if (children.length < 2) {
		parseLogger.error(`Expected a FOR to have at least 2 children but found ${children.length}`, token);
	}
	else {
		const first = children[0];
		const last = children[children.length - 1];
		let codeBlock = children[children.length - 2];
		if (last.type === ParseTreeTokenType.CODE_BLOCK)
			codeBlock = last;
		if (first.type !== ParseTreeTokenType.BINARY_OPERATOR || first.val.toLowerCase() !== 'to')
			parseLogger.error(`Expected first child of for to be a BINARY_OPERATOR with val of to but found ${ParseTreeTokenType.getNameFor(first.type)} with a val ${first.val}`, first);
		else if (last.type !== ParseTreeTokenType.NEXT) {
			if (last.type === ParseTreeTokenType.CODE_BLOCK) {
				const assignToken = first.children[0];
				if (assignToken === undefined)
					parseLogger.error(`Expected initialization in a FOR-loop but could not find one`, token);
				else if (assignToken.val !== '=')
					parseLogger.error(`Expected initialization in a FOR-loop to have a val of = but found ${assignToken.val}`, assignToken);
				else if (assignToken.children.length === 2) {
					const varName = assignToken.children[0].val;
					if (typeof varName !== 'string')
						parseLogger.error(`In a for-loop, expected to find a variable name of type string but found ${varName}`, assignToken);
					else {
						// there a NEXT that could apply to this for-loop?
						const matchingNext = findMatchingNext(codeBlock, varName);
						if (matchingNext === undefined)
							parseLogger.error(`Every for-loop should be closed with a next statement but none found for variable with name ${varName}`, token);
					}
				}
			}
			else
				parseLogger.error(`Expected last child of for to be a NEXT or a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(last.type)}`, last);
		}
		else if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
			parseLogger.error(`Expected second last child of for to be a CODE_BLOCK but found ${ParseTreeTokenType.getNameFor(codeBlock.type)}`, codeBlock);
	}
};