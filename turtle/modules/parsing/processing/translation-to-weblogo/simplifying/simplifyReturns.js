import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function simplifyReturns(root) {
	const returns = getDescendentsOfType(root, ParseTreeTokenType.RETURN);
	for (const returnToken of returns) {
		let next = returnToken.getNextSibling();
		if (next !== null && next.type === ParseTreeTokenType.SEMICOLON)
			next = next.getNextSibling();
		// remove some unreachable code after the return statement.
		while (next !== null && next.type !== ParseTreeTokenType.CURLY_RIGHT_BRACKET) {
			const nextNext = next.getNextSibling();
			next.remove();
			next = nextNext;
		}

		// if there is no return value and the return statement is directly(not nested) in a method's main code block, 
		// remove the return statement.
		const parent = returnToken.parentNode;
		if (returnToken.children.length === 0 && parent.type === ParseTreeTokenType.CODE_BLOCK) {
			const grandParent = parent.parentNode;
			if (grandParent.type === ParseTreeTokenType.METHOD) {
				const next = returnToken.getNextSibling();
				if (next !== null && next.type === ParseTreeTokenType.SEMICOLON)
					next.remove();
				returnToken.remove();
			}
		}
	}
};